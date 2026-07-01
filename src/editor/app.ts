// The map-editor application coordinator. Thin by design: layout assembly,
// tool state, the undo stack, and event routing live here; everything with a
// nameable responsibility is a sibling module (topbar, toolbar, inspector,
// asset_browser, map_drawer, map_io, net, toasts, undo_core, stamp_core,
// user_assets, the 3D viewport, and the 2D canvas/view/model trio).
//
// Ownership of the ACTIVE world content: the app builds ONE WorldContent whose
// terrainEdits / biomePaint / zones / camps tables SHARE references with the
// working document, registers it via setActiveWorldContent, and every terrain
// sample (renderer chunks, procgen, smooth/flatten sampling) reads through it.

import { invalidateStaticColliders } from '../sim/colliders';
import { BUILTIN_WORLD, MOBS, PLAYER_START, setActiveWorldContent } from '../sim/data';
import { MAX_TERRAIN_EDITS } from '../sim/map_doc';
import type { CampDef, HeightStamp, WorldContent } from '../sim/types';
import { terrainHeight, WATER_LEVEL, waterLevel } from '../sim/world';
import { tEntity } from '../ui/entity_i18n';
import { t } from '../ui/i18n';
import { Editor3DViewport } from './3d/viewport';
import { AssetBrowser } from './asset_browser';
import { ASSET_CATALOG, assetById } from './asset_catalog.generated';
import { draw } from './canvas';
import {
  type AssetPlacement,
  CUSTOM_MAP_VERSION,
  type CustomMap,
  customMapToWorldContent,
  newCustomMap,
} from './custom_map';
import { el } from './dom';
import { downloadMap, pickMapFile } from './file_io';
import { BIOME_OPTIONS, Inspector, type PlacementSelection } from './inspector';
import { MapDrawer } from './map_drawer';
import { MapIO } from './map_io';
import {
  buildEntities,
  type EditorEntity,
  type EntityKind,
  snapshot,
  type ZoneContent,
} from './model';
import { EditorApiError, forkMap, type MapFullWire, signedIn, uploadAsset } from './net';
import { parseMap } from './persist';
import { DEFAULT_PLAYTEST_SEED, launchPlaytest } from './playtest';
import { type Bounds, scatterHills, scatterPlacements } from './procgen';
import { editorErrorKey } from './server_errors_core';
import {
  erasePlacementIndex,
  eraseStampIndex,
  flattenStamp,
  smoothStamp,
  stampRegion,
  unionRegion,
} from './stamp_core';
import { confirmDialog, promptDialog, Toasts } from './toasts';
import { type EditorTool, TOOL_BY_KEY, Toolbar } from './toolbar';
import { Topbar } from './topbar';
import { UndoStack } from './undo_core';
import { isUserAssetId, registerUserAssets, userAssetIdFor, userAssetLabel } from './user_assets';
import { Camera, pickHandle, type ScreenPoint, type Vec2, type Viewport } from './view';

const KINDS: EntityKind[] = ['hub', 'graveyard', 'lake', 'poi', 'camp', 'npc', 'object'];
const AUTOSAVE_MS = 30_000;
const WATER_DEBOUNCE_MS = 100;

interface RegionBox {
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}
interface Clipboard {
  placements: AssetPlacement[]; // relative to center
  edits: HeightStamp[]; // relative to center
}

const LAYER_KEYS: Record<EntityKind, string> = {
  hub: 'editor.layers.hub',
  graveyard: 'editor.layers.graveyard',
  lake: 'editor.layers.lake',
  poi: 'editor.layers.poi',
  camp: 'editor.layers.camp',
  npc: 'editor.layers.npc',
  object: 'editor.layers.object',
};

const BRUSH_COLOR: Partial<Record<EditorTool, number>> = {
  raise: 0xffd100,
  lower: 0x5aa0ff,
  smooth: 0x9fdc7f,
  flatten: 0xd8c27a,
  erase: 0xe0503c,
  place: 0x3fd0ff,
  camp: 0xd9534f,
  spawn: 0x3fd0ff,
};

export class EditorApp {
  // ---- document + active world ------------------------------------------------
  private map: CustomMap;
  private activeWorld!: WorldContent;
  private content: ZoneContent;
  private entities: EditorEntity[];
  private base: Map<string, Vec2>;

  // ---- chrome -------------------------------------------------------------------
  private readonly topbar: Topbar;
  private readonly toolbar: Toolbar;
  private readonly inspector: Inspector;
  private readonly assets: AssetBrowser;
  private readonly drawer: MapDrawer;
  private readonly toasts: Toasts;

  // ---- stage -----------------------------------------------------------------
  private readonly stage2d: HTMLElement;
  private readonly stage3dEl: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly cam = new Camera({ x: 0, z: 0 }, 2);
  private viewMode: '3d' | '2d' = '3d';
  private viewport3d: Editor3DViewport | null = null;
  private markerMovedWhile2d = false;

  // ---- editing state -----------------------------------------------------------
  private tool: EditorTool = 'select';
  private brushRadius = 18;
  private brushStrength = 6;
  private paintBiome = 1;
  private flattenHardEdge = false;
  private placeAssetId: string | null = null;
  private placeAssetLabel: string | null = null;
  private placeScale = 1;
  private placeCollide = false;
  private placeRandomRot = true;
  private scatterCount = 80;
  private campMobId: string = Object.keys(MOBS)[0] ?? 'boar';
  private footprintsOn = false;
  private readonly biomeCell = 8;

  private readonly undo = new UndoStack();
  private dirty = false;
  private saving = false;

  // selection
  private selectedPlacement: number | null = null;
  private selectedCamp: number | null = null;
  private selectedKey: string | null = null; // 2D marker
  private hoverKey: string | null = null;

  // stroke state
  private strokeStamps: HeightStamp[] = [];
  private strokeRegion: RegionBox | null = null;
  private paintChanges = new Map<number, { prev: number; next: number }>();
  private paintCreatedGrid = false;
  private lastStamp: Vec2 | null = null;
  private flattenTarget = 0;
  private eraseLast: Vec2 | null = null;

  // water
  private waterBase = WATER_LEVEL;
  private waterTimer = 0;

  // region clipboard
  private regionBox: RegionBox | null = null;
  private regionStart: Vec2 | null = null;
  private selectingRegion = false;
  private regionDownScreen: ScreenPoint = { sx: 0, sy: 0 };
  private clipboard: Clipboard | null = null;

  // 2D pointer state
  private panning = false;
  private dragKey: string | null = null;
  private grab: Vec2 = { x: 0, z: 0 };
  private lastPointer: ScreenPoint = { sx: 0, sy: 0 };
  private painting2d = false;
  private cursorWorld: Vec2 | null = null;
  private canvasDirty = true;

  private readonly io = new MapIO();
  private readonly visible = new Set<EntityKind>(KINDS);

  constructor(
    private readonly root: HTMLElement,
    content: ZoneContent,
  ) {
    this.content = content;
    this.map = {
      version: CUSTOM_MAP_VERSION,
      meta: {
        id: mintId(),
        name: t('editor.untitledMap'),
        description: '',
        createdAt: now(),
        updatedAt: now(),
        seed: DEFAULT_PLAYTEST_SEED,
        parentId: '',
      },
      content,
      terrainEdits: [],
      placements: [],
    };
    this.entities = buildEntities(content);
    this.base = snapshot(this.entities);
    this.rebuildActiveWorld();

    // ---- layout ------------------------------------------------------------------
    this.root.innerHTML = '';
    this.root.classList.add('ed-root');

    this.topbar = new Topbar(this.root, {
      onNameChange: (name) => {
        this.map.meta.name = name;
        this.markDirty();
      },
      onNew: () => void this.newMap(),
      onOpen: () => this.drawer.open(),
      onSave: () => void this.save(),
      onSaveAs: () => void this.saveAs(),
      onFork: () => void this.forkCurrent(),
      onImport: () => void this.importFile(),
      onExport: () => this.exportFile(),
      onUploadAsset: () => void this.uploadAsset(),
      onPlaytest: () => this.playtest(),
      onViewMode: (mode) => this.setViewMode(mode),
    });

    const main = el('div', 'ed-main');
    this.root.appendChild(main);
    this.toolbar = new Toolbar(main, (tool) => this.setTool(tool));

    const stageWrap = el('div', 'ed-stage');
    stageWrap.setAttribute('aria-label', t('editor.a11y.stage'));
    this.stage3dEl = el('div', 'editor-3d-host');
    this.stage2d = el('div', 'editor-2d-host');
    this.canvas = document.createElement('canvas');
    this.stage2d.appendChild(this.canvas);
    stageWrap.append(this.stage3dEl, this.stage2d);
    main.appendChild(stageWrap);

    this.inspector = new Inspector(main, this.inspectorDeps());

    this.assets = new AssetBrowser(stageWrap, {
      onPick: (assetId, label) => {
        this.placeAssetId = assetId;
        this.placeAssetLabel = label;
        if (this.tool !== 'place') this.setTool('place');
        else this.inspector.refresh();
      },
      confirm: (title, body) => confirmDialog(this.root, { title, body, danger: true }),
      toastError: (m) => this.toasts.error(m),
    });

    this.toasts = new Toasts(this.root);
    this.drawer = new MapDrawer(this.root, {
      listLocal: () => this.io.store.list(),
      hasDraft: () => this.io.draftLoad() !== null,
      onOpenLocal: (id) => {
        const loaded = this.io.store.load(id);
        if (loaded) this.loadMap(loaded);
      },
      onOpenDraft: () => {
        const draft = this.io.draftLoad();
        if (draft) {
          this.loadMap(draft);
          this.toasts.info(t('editor.status.draftRestored'));
        }
      },
      onDeleteLocal: async (id) => {
        this.io.store.remove(id);
        this.io.setLink(id, null);
      },
      onOpenServer: (full, mine) => this.openServerMap(full, mine),
      confirm: (title, body, confirmLabel) =>
        confirmDialog(this.root, { title, body, confirmLabel, danger: true }),
      toastError: (m) => this.toasts.error(m),
      toastSuccess: (m) => this.toasts.success(m),
    });

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2d canvas context unavailable');
    this.ctx = ctx;

    this.attach2dEvents(this.stage2d);
    window.addEventListener('keydown', this.onKeyDown);
    this.resize();
    this.frameAll();
    requestAnimationFrame(this.tick2d);
    window.setInterval(() => this.autosave(), AUTOSAVE_MS);

    this.topbar.setMapName(this.map.meta.name);
    this.topbar.setOffline(!signedIn());
    this.topbar.setForkEnabled(false);
    this.topbar.setViewMode(this.viewMode);
    this.toolbar.setActive(this.tool);

    this.applyViewMode();
    this.boot3d();
  }

  // ---- active world -------------------------------------------------------------

  /**
   * Build the ACTIVE WorldContent over SHARED references into the working
   * document (terrainEdits, biomePaint, zones/camps/roads), so every edit is
   * immediately visible to terrainHeight()/waterLevel() without cloning.
   */
  private rebuildActiveWorld(): void {
    const map = this.map;
    const world: WorldContent = {
      zones: map.content.zones as WorldContent['zones'],
      camps: map.content.camps as WorldContent['camps'],
      npcs: map.content.npcs as WorldContent['npcs'],
      groundObjects: map.content.objects as WorldContent['groundObjects'],
      roads: (map.content.roads ?? BUILTIN_WORLD.roads) as WorldContent['roads'],
      props: BUILTIN_WORLD.props,
      playerStart: map.playerStart ? { ...map.playerStart } : { ...PLAYER_START },
      terrainEdits: map.terrainEdits,
      placements: [],
      biomePaint: map.biomePaint,
    };
    if (map.waterLevel !== undefined) world.waterLevel = map.waterLevel;
    this.activeWorld = world;
    setActiveWorldContent(world);
  }

  private syncWaterToActive(): void {
    if (this.map.waterLevel !== undefined) this.activeWorld.waterLevel = this.map.waterLevel;
    else delete this.activeWorld.waterLevel;
  }

  // ---- 3D viewport ---------------------------------------------------------------

  private boot3d(): void {
    if (this.viewport3d) return;
    try {
      this.viewport3d = new Editor3DViewport(this.stage3dEl, this.map, {
        toolActive: () => this.toolWantsPointer(),
        onEditStart: (w) => this.editStart(w),
        onEditMove: (w) => this.editMove(w),
        onEditEnd: () => this.editEnd(),
        onHover: (w) => this.hover3d(w),
        onTap: (cx, cy, w) => this.tap3d(cx, cy, w),
      });
      void this.viewport3d.start().catch((e) => {
        console.error('3D viewport failed; falling back to 2D', e);
        this.viewMode = '2d';
        this.applyViewMode();
      });
    } catch (e) {
      console.error('3D viewport unavailable; using 2D', e);
      this.viewMode = '2d';
      this.applyViewMode();
    }
  }

  private setViewMode(mode: '3d' | '2d'): void {
    if (mode === this.viewMode) return;
    this.viewMode = mode;
    this.applyViewMode();
    if (mode === '3d') {
      this.boot3d();
      // 2D marker drags reshape hubs/zones: re-mesh once when returning to 3D.
      if (this.markerMovedWhile2d) {
        this.viewport3d?.rebuildTerrainFull();
        this.markerMovedWhile2d = false;
      }
    }
    this.inspector.refresh();
  }

  private applyViewMode(): void {
    const is3d = this.viewMode === '3d';
    this.stage3dEl.style.display = is3d ? '' : 'none';
    this.stage2d.style.display = is3d ? 'none' : '';
    this.topbar.setViewMode(this.viewMode);
    if (!is3d) {
      this.resize();
      this.canvasDirty = true;
    }
  }

  // ---- tool state ----------------------------------------------------------------

  private setTool(tool: EditorTool): void {
    this.tool = tool;
    this.toolbar.setActive(tool);
    this.assets.setVisible(tool === 'place');
    if (tool !== 'select') this.setSelectedPlacement(null);
    if (tool !== 'select') this.selectedKey = null;
    if (tool !== 'camp') this.selectedCamp = null;
    this.viewport3d?.clearBrush();
    this.inspector.refresh();
    this.canvasDirty = true;
  }

  /** Tools that claim the left pointer in the 3D viewport. */
  private toolWantsPointer(): boolean {
    return this.tool !== 'select' && this.tool !== 'water';
  }

  private isDragTool(): boolean {
    return (
      this.tool === 'raise' ||
      this.tool === 'lower' ||
      this.tool === 'smooth' ||
      this.tool === 'flatten' ||
      this.tool === 'paint' ||
      this.tool === 'erase'
    );
  }

  // ---- shared edit routing (3D hooks + 2D pointer both land here) -----------------

  private editStart(w: Vec2): void {
    switch (this.tool) {
      case 'raise':
      case 'lower':
      case 'smooth':
      case 'flatten':
        this.strokeBegin(w);
        break;
      case 'paint':
        this.paintBegin(w);
        break;
      case 'erase':
        this.eraseLast = null;
        this.eraseAt(w);
        break;
      case 'place':
        this.placeAt(w);
        break;
      case 'camp':
        this.campClick(w);
        break;
      case 'spawn':
        this.setSpawn(w);
        break;
      case 'region':
        this.regionStart = { ...w };
        this.regionBox = { minX: w.x, minZ: w.z, maxX: w.x, maxZ: w.z };
        this.canvasDirty = true;
        break;
      default:
        break;
    }
  }

  private editMove(w: Vec2): void {
    switch (this.tool) {
      case 'raise':
      case 'lower':
      case 'smooth':
      case 'flatten':
        this.strokeStep(w);
        this.brushRing(w);
        break;
      case 'paint':
        this.paintStep(w);
        this.brushRing(w);
        break;
      case 'erase':
        this.eraseAt(w);
        this.brushRing(w);
        break;
      case 'region':
        if (this.regionStart) {
          this.regionBox = {
            minX: Math.min(this.regionStart.x, w.x),
            minZ: Math.min(this.regionStart.z, w.z),
            maxX: Math.max(this.regionStart.x, w.x),
            maxZ: Math.max(this.regionStart.z, w.z),
          };
          this.canvasDirty = true;
        }
        break;
      default:
        break;
    }
  }

  private editEnd(): void {
    switch (this.tool) {
      case 'raise':
      case 'lower':
      case 'smooth':
      case 'flatten':
        this.strokeCommit();
        // The stroke mutated terrainEdits in place on the ACTIVE content, so
        // the cached collider grid's ground-derived fields are stale.
        invalidateStaticColliders();
        break;
      case 'paint':
        this.paintCommit();
        break;
      case 'region': {
        // A click (no real drag) with a clipboard pastes at the click point.
        const b = this.regionBox;
        if (
          b &&
          this.clipboard &&
          Math.abs(b.maxX - b.minX) < 1.5 &&
          Math.abs(b.maxZ - b.minZ) < 1.5
        ) {
          this.pasteAt({ x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2 });
          this.regionBox = null;
        }
        this.regionStart = null;
        this.canvasDirty = true;
        break;
      }
      default:
        break;
    }
  }

  private hover3d(w: Vec2 | null): void {
    if (!w) {
      this.viewport3d?.clearBrush();
      return;
    }
    this.brushRing(w);
  }

  private brushRing(w: Vec2): void {
    if (!this.viewport3d) return;
    let radius = this.brushRadius;
    let color = BRUSH_COLOR[this.tool];
    if (this.tool === 'paint') {
      // The erase option's swatch is 'transparent'; fall back to the accent.
      const swatch = BIOME_OPTIONS.find((b) => b.id === this.paintBiome)?.swatch ?? '';
      color = /^#[0-9a-f]{6}$/i.test(swatch) ? Number.parseInt(swatch.slice(1), 16) : 0xffd100;
    } else if (this.tool === 'place') {
      radius = Math.max(0.8, this.placeScale * 0.9);
    } else if (this.tool === 'camp') {
      radius = this.selectedCampDef()?.radius ?? 10;
    } else if (this.tool === 'spawn') {
      radius = 1.6;
    } else if (this.tool === 'select' || this.tool === 'water' || this.tool === 'region') {
      this.viewport3d.clearBrush();
      return;
    }
    this.viewport3d.setBrush(w.x, w.z, radius, color);
  }

  private tap3d(clientX: number, clientY: number, w: Vec2 | null): void {
    if (this.tool !== 'select' || !this.viewport3d) return;
    const idx = this.viewport3d.pickPlacement(clientX, clientY);
    this.setSelectedPlacement(idx);
    if (idx === null && w) {
      // No placement under the cursor: nothing else is selectable in 3D.
      this.setSelectedPlacement(null);
    }
    this.inspector.refresh();
  }

  // ---- sculpt strokes --------------------------------------------------------------

  private strokeBegin(w: Vec2): void {
    this.strokeStamps = [];
    this.strokeRegion = null;
    this.lastStamp = null;
    if (this.tool === 'flatten') {
      this.flattenTarget = terrainHeight(w.x, w.z, this.map.meta.seed);
    }
    this.strokeStep(w);
  }

  private strokeStep(w: Vec2): void {
    const spacing = this.brushRadius * 0.5;
    if (this.lastStamp) {
      const dx = w.x - this.lastStamp.x;
      const dz = w.z - this.lastStamp.z;
      if (dx * dx + dz * dz < spacing * spacing) return;
    }
    if (this.map.terrainEdits.length >= MAX_TERRAIN_EDITS) return;
    const seed = this.map.meta.seed;
    let stamp: HeightStamp;
    if (this.tool === 'smooth') {
      stamp = smoothStamp(w.x, w.z, this.brushRadius, this.brushStrength, (x, z) =>
        terrainHeight(x, z, seed),
      );
    } else if (this.tool === 'flatten') {
      stamp = flattenStamp(w.x, w.z, this.brushRadius, this.flattenTarget, this.flattenHardEdge);
    } else {
      stamp = {
        x: w.x,
        z: w.z,
        radius: this.brushRadius,
        delta: this.tool === 'lower' ? -this.brushStrength : this.brushStrength,
        falloff: 'smooth',
      };
    }
    this.map.terrainEdits.push(stamp);
    this.strokeStamps.push(stamp);
    this.lastStamp = { x: w.x, z: w.z };
    const region = stampRegion(stamp);
    this.strokeRegion = unionRegion(this.strokeRegion, region);
    this.viewport3d?.rebuildTerrainRegion(region);
    this.canvasDirty = true;
  }

  private strokeCommit(): void {
    if (this.strokeStamps.length === 0) return;
    const stamps = this.strokeStamps;
    const region = this.strokeRegion;
    this.strokeStamps = [];
    this.strokeRegion = null;
    if (region) this.viewport3d?.finishTerrainStroke(region);
    this.map.meta.updatedAt = now();
    this.pushUndo({
      label: 'sculpt-stroke',
      undo: () => {
        for (const s of stamps) {
          const i = this.map.terrainEdits.indexOf(s);
          if (i >= 0) this.map.terrainEdits.splice(i, 1);
        }
        this.refreshTerrain(region);
      },
      redo: () => {
        this.map.terrainEdits.push(...stamps);
        this.refreshTerrain(region);
      },
    });
  }

  private refreshTerrain(region: RegionBox | null): void {
    if (region) {
      this.viewport3d?.rebuildTerrainRegion(region);
      this.viewport3d?.finishTerrainStroke(region);
    } else {
      this.viewport3d?.rebuildTerrainFull();
    }
    this.canvasDirty = true;
  }

  // ---- biome paint --------------------------------------------------------------

  private ensureBiomeGrid(): void {
    if (this.map.biomePaint) return;
    const b = this.worldBounds();
    const cols = Math.ceil((b.maxX - b.minX) / this.biomeCell) + 1;
    const rows = Math.ceil((b.maxZ - b.minZ) / this.biomeCell) + 1;
    this.map.biomePaint = {
      cell: this.biomeCell,
      cols,
      rows,
      originX: b.minX,
      originZ: b.minZ,
      ids: new Array(cols * rows).fill(255),
    };
    this.activeWorld.biomePaint = this.map.biomePaint;
    this.paintCreatedGrid = true;
  }

  private paintBegin(w: Vec2): void {
    this.paintChanges = new Map();
    this.paintCreatedGrid = false;
    this.strokeRegion = null;
    this.paintStep(w);
  }

  private paintStep(w: Vec2): void {
    this.ensureBiomeGrid();
    const bp = this.map.biomePaint;
    if (!bp) return;
    const r = this.brushRadius;
    const c0 = Math.floor((w.x - r - bp.originX) / bp.cell);
    const c1 = Math.floor((w.x + r - bp.originX) / bp.cell);
    const r0 = Math.floor((w.z - r - bp.originZ) / bp.cell);
    const r1 = Math.floor((w.z + r - bp.originZ) / bp.cell);
    let touched = false;
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        if (col < 0 || col >= bp.cols || row < 0 || row >= bp.rows) continue;
        const cx = bp.originX + (col + 0.5) * bp.cell;
        const cz = bp.originZ + (row + 0.5) * bp.cell;
        const dx = cx - w.x;
        const dz = cz - w.z;
        if (dx * dx + dz * dz > r * r) continue;
        const idx = row * bp.cols + col;
        if (bp.ids[idx] === this.paintBiome) continue;
        const change = this.paintChanges.get(idx);
        if (change) change.next = this.paintBiome;
        else this.paintChanges.set(idx, { prev: bp.ids[idx], next: this.paintBiome });
        bp.ids[idx] = this.paintBiome;
        touched = true;
      }
    }
    if (touched) {
      const region = { minX: w.x - r, minZ: w.z - r, maxX: w.x + r, maxZ: w.z + r };
      this.strokeRegion = unionRegion(this.strokeRegion, region);
      this.viewport3d?.rebuildTerrainRegion(region);
      this.canvasDirty = true;
    }
  }

  private paintCommit(): void {
    if (this.paintChanges.size === 0 && !this.paintCreatedGrid) return;
    const changes = this.paintChanges;
    const createdGrid = this.paintCreatedGrid;
    const region = this.strokeRegion;
    const grid = this.map.biomePaint;
    this.paintChanges = new Map();
    this.paintCreatedGrid = false;
    this.strokeRegion = null;
    if (region) this.viewport3d?.finishTerrainStroke(region);
    this.map.meta.updatedAt = now();
    this.pushUndo({
      label: 'paint-stroke',
      undo: () => {
        if (createdGrid) {
          this.map.biomePaint = undefined;
          this.activeWorld.biomePaint = undefined;
        } else if (grid) {
          for (const [idx, ch] of changes) grid.ids[idx] = ch.prev;
        }
        this.refreshTerrain(region);
      },
      redo: () => {
        if (createdGrid && grid) {
          this.map.biomePaint = grid;
          this.activeWorld.biomePaint = grid;
        }
        if (grid) for (const [idx, ch] of changes) grid.ids[idx] = ch.next;
        this.refreshTerrain(region);
      },
    });
  }

  private clearBiomePaint(): void {
    const grid = this.map.biomePaint;
    if (!grid) return;
    this.map.biomePaint = undefined;
    this.activeWorld.biomePaint = undefined;
    this.map.meta.updatedAt = now();
    this.refreshTerrain(null);
    this.pushUndo({
      label: 'clear-biome-paint',
      undo: () => {
        this.map.biomePaint = grid;
        this.activeWorld.biomePaint = grid;
        this.refreshTerrain(null);
      },
      redo: () => {
        this.map.biomePaint = undefined;
        this.activeWorld.biomePaint = undefined;
        this.refreshTerrain(null);
      },
    });
  }

  // ---- erase -----------------------------------------------------------------------

  private eraseAt(w: Vec2): void {
    // Throttle drag erasing so one sweep does not delete a whole cluster at once.
    if (this.eraseLast) {
      const dx = w.x - this.eraseLast.x;
      const dz = w.z - this.eraseLast.z;
      if (dx * dx + dz * dz < 4) return;
    }
    this.eraseLast = { x: w.x, z: w.z };
    const pi = erasePlacementIndex(this.map.placements, w.x, w.z, this.brushRadius);
    if (pi >= 0) {
      this.removePlacementAt(pi);
      return;
    }
    const si = eraseStampIndex(this.map.terrainEdits, w.x, w.z);
    if (si >= 0) {
      const stamp = this.map.terrainEdits[si];
      this.map.terrainEdits.splice(si, 1);
      const region = stampRegion(stamp);
      this.refreshTerrain(region);
      this.map.meta.updatedAt = now();
      this.pushUndo({
        label: 'erase-stamp',
        undo: () => {
          this.map.terrainEdits.splice(si, 0, stamp);
          this.refreshTerrain(region);
        },
        redo: () => {
          this.map.terrainEdits.splice(si, 1);
          this.refreshTerrain(region);
        },
      });
    }
  }

  // ---- placements ----------------------------------------------------------------

  private placeAt(w: Vec2): void {
    if (!this.placeAssetId) {
      this.toasts.info(t('editor.status.assetPlacedFirst'));
      return;
    }
    const placement: AssetPlacement = {
      assetId: this.placeAssetId,
      x: w.x,
      z: w.z,
      rotY: this.placeRandomRot ? Math.random() * Math.PI * 2 : 0,
      scale: this.placeScale,
      collide: this.placeCollide,
    };
    this.appendPlacements([placement], 'place-asset');
  }

  private appendPlacements(placements: AssetPlacement[], label: string): void {
    const start = this.map.placements.length;
    this.map.placements.push(...placements);
    for (let i = 0; i < placements.length; i++) this.viewport3d?.placementAdded(start + i);
    this.map.meta.updatedAt = now();
    this.canvasDirty = true;
    this.pushUndo({
      label,
      undo: () => {
        for (const p of placements) {
          const i = this.map.placements.indexOf(p);
          if (i >= 0) this.map.placements.splice(i, 1);
        }
        this.setSelectedPlacement(null);
        this.viewport3d?.rebuildPlacements();
        this.canvasDirty = true;
      },
      redo: () => {
        this.map.placements.push(...placements);
        this.viewport3d?.rebuildPlacements();
        this.canvasDirty = true;
      },
    });
  }

  private removePlacementAt(index: number): void {
    const placement = this.map.placements[index];
    if (!placement) return;
    this.map.placements.splice(index, 1);
    this.setSelectedPlacement(null);
    this.viewport3d?.rebuildPlacements();
    this.map.meta.updatedAt = now();
    this.canvasDirty = true;
    this.pushUndo({
      label: 'remove-placement',
      undo: () => {
        this.map.placements.splice(index, 0, placement);
        this.viewport3d?.rebuildPlacements();
        this.canvasDirty = true;
      },
      redo: () => {
        this.map.placements.splice(index, 1);
        this.setSelectedPlacement(null);
        this.viewport3d?.rebuildPlacements();
        this.canvasDirty = true;
      },
    });
    this.inspector.refresh();
  }

  private setSelectedPlacement(index: number | null): void {
    this.selectedPlacement = index;
    this.viewport3d?.setSelectedPlacement(index);
  }

  private placementLabel(assetId: string): string {
    if (isUserAssetId(assetId)) return userAssetLabel(assetId);
    return assetById(assetId)?.label ?? assetId;
  }

  private updateSelectedPlacement(
    change: { x?: number; z?: number; rotY?: number; scale?: number; collide?: boolean },
    commit: boolean,
  ): void {
    const index = this.selectedPlacement;
    if (index === null) return;
    const p = this.map.placements[index];
    if (!p) return;
    const prev = { ...p };
    if (change.x !== undefined) p.x = change.x;
    if (change.z !== undefined) p.z = change.z;
    if (change.rotY !== undefined) p.rotY = change.rotY;
    if (change.scale !== undefined) p.scale = change.scale;
    if (change.collide !== undefined) p.collide = change.collide;
    this.viewport3d?.placementUpdated(index, change);
    if (change.collide !== undefined) this.viewport3d?.rebuildPlacements();
    this.canvasDirty = true;
    if (!commit) return;
    const next = { ...p };
    this.map.meta.updatedAt = now();
    this.pushUndo({
      label: 'edit-placement',
      undo: () => {
        Object.assign(this.map.placements[index] ?? {}, prev);
        this.viewport3d?.rebuildPlacements();
        this.canvasDirty = true;
      },
      redo: () => {
        Object.assign(this.map.placements[index] ?? {}, next);
        this.viewport3d?.rebuildPlacements();
        this.canvasDirty = true;
      },
    });
  }

  // ---- camps ----------------------------------------------------------------------

  private camps(): CampDef[] {
    return this.map.content.camps as CampDef[];
  }

  private selectedCampDef(): CampDef | null {
    return this.selectedCamp === null ? null : (this.camps()[this.selectedCamp] ?? null);
  }

  private campClick(w: Vec2): void {
    const camps = this.camps();
    // Click inside an existing camp's radius selects it (nearest wins).
    let best = -1;
    let bestD = Number.POSITIVE_INFINITY;
    for (let i = 0; i < camps.length; i++) {
      const c = camps[i];
      const dx = w.x - c.center.x;
      const dz = w.z - c.center.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d <= Math.max(4, c.radius) && d < bestD) {
        best = i;
        bestD = d;
      }
    }
    if (best >= 0) {
      this.selectedCamp = best;
      this.campMobId = camps[best].mobId;
      this.inspector.refresh();
      this.canvasDirty = true;
      return;
    }
    // New camps APPEND to content.camps (never reorder); spawns appear in playtest.
    const camp: CampDef = {
      mobId: this.campMobId,
      center: { x: w.x, z: w.z },
      radius: 10,
      count: 3,
    };
    camps.push(camp);
    this.selectedCamp = camps.length - 1;
    this.afterCampsChanged();
    this.pushUndo({
      label: 'add-camp',
      undo: () => {
        const i = this.camps().indexOf(camp);
        if (i >= 0) this.camps().splice(i, 1);
        this.selectedCamp = null;
        this.afterCampsChanged();
      },
      redo: () => {
        this.camps().push(camp);
        this.afterCampsChanged();
      },
    });
    this.inspector.refresh();
  }

  private updateSelectedCamp(change: { mobId?: string; count?: number; radius?: number }): void {
    const camp = this.selectedCampDef();
    if (!camp) return;
    const prev = { mobId: camp.mobId, count: camp.count, radius: camp.radius };
    if (change.mobId !== undefined) {
      camp.mobId = change.mobId;
      this.campMobId = change.mobId;
    }
    if (change.count !== undefined) camp.count = Math.max(1, Math.min(8, Math.round(change.count)));
    if (change.radius !== undefined) camp.radius = Math.max(4, Math.min(30, change.radius));
    const next = { mobId: camp.mobId, count: camp.count, radius: camp.radius };
    this.afterCampsChanged();
    this.pushUndo({
      label: 'edit-camp',
      undo: () => {
        Object.assign(camp, prev);
        this.afterCampsChanged();
      },
      redo: () => {
        Object.assign(camp, next);
        this.afterCampsChanged();
      },
    });
  }

  private deleteSelectedCamp(): void {
    const index = this.selectedCamp;
    if (index === null) return;
    const camp = this.camps()[index];
    if (!camp) return;
    this.camps().splice(index, 1);
    this.selectedCamp = null;
    this.afterCampsChanged();
    this.pushUndo({
      label: 'delete-camp',
      undo: () => {
        this.camps().splice(index, 0, camp);
        this.afterCampsChanged();
      },
      redo: () => {
        this.camps().splice(index, 1);
        this.selectedCamp = null;
        this.afterCampsChanged();
      },
    });
  }

  private afterCampsChanged(): void {
    this.map.meta.updatedAt = now();
    this.entities = buildEntities(this.content);
    this.base = snapshot(this.entities);
    this.canvasDirty = true;
    this.markDirty();
  }

  // ---- spawn -----------------------------------------------------------------------

  private setSpawn(w: Vec2): void {
    const prev = this.map.playerStart ? { ...this.map.playerStart } : null;
    const next = { x: Math.round(w.x * 10) / 10, z: Math.round(w.z * 10) / 10 };
    const apply = (v: { x: number; z: number } | null): void => {
      if (v) this.map.playerStart = { ...v };
      else delete this.map.playerStart;
      this.activeWorld.playerStart = v ? { ...v } : { ...PLAYER_START };
      this.viewport3d?.setSpawnMarker(v);
      this.canvasDirty = true;
    };
    apply(next);
    this.map.meta.updatedAt = now();
    this.pushUndo({
      label: 'set-spawn',
      undo: () => apply(prev),
      redo: () => apply(next),
    });
    this.inspector.refresh();
  }

  private clearSpawn(): void {
    if (!this.map.playerStart) return;
    const prev = { ...this.map.playerStart };
    const apply = (v: { x: number; z: number } | null): void => {
      if (v) this.map.playerStart = { ...v };
      else delete this.map.playerStart;
      this.activeWorld.playerStart = v ? { ...v } : { ...PLAYER_START };
      this.viewport3d?.setSpawnMarker(v);
      this.canvasDirty = true;
    };
    apply(null);
    this.pushUndo({ label: 'clear-spawn', undo: () => apply(prev), redo: () => apply(null) });
  }

  // ---- water ------------------------------------------------------------------------

  private previewWater(v: number): void {
    this.map.waterLevel = v === WATER_LEVEL ? undefined : v;
    this.syncWaterToActive();
    window.clearTimeout(this.waterTimer);
    this.waterTimer = window.setTimeout(() => this.viewport3d?.rebuildWater(), WATER_DEBOUNCE_MS);
  }

  private commitWater(v: number): void {
    const prev = this.waterBase;
    if (prev === v) return;
    this.waterBase = v;
    const apply = (level: number): void => {
      this.map.waterLevel = level === WATER_LEVEL ? undefined : level;
      this.syncWaterToActive();
      this.viewport3d?.rebuildWater();
    };
    apply(v);
    this.map.meta.updatedAt = now();
    this.pushUndo({
      label: 'water-level',
      undo: () => {
        this.waterBase = prev;
        apply(prev);
      },
      redo: () => {
        this.waterBase = v;
        apply(v);
      },
    });
  }

  // ---- region clipboard ---------------------------------------------------------------

  private copyRegion(): void {
    if (!this.regionBox) {
      this.toasts.info(t('editor.region.needBox'));
      return;
    }
    const b = this.regionBox;
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    const inBox = (x: number, z: number): boolean =>
      x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ;
    const placements = this.map.placements
      .filter((p) => inBox(p.x, p.z))
      .map((p) => ({ ...p, x: p.x - cx, z: p.z - cz }));
    const edits = this.map.terrainEdits
      .filter((e) => inBox(e.x, e.z))
      .map((e) => ({ ...e, x: e.x - cx, z: e.z - cz }));
    this.clipboard = { placements, edits };
    this.toasts.success(
      t('editor.region.copied', { assets: placements.length, edits: edits.length }),
    );
  }

  private pasteAt(world: Vec2): void {
    if (!this.clipboard) return;
    const placements = this.clipboard.placements.map((p) => ({
      ...p,
      x: p.x + world.x,
      z: p.z + world.z,
    }));
    const edits = this.clipboard.edits.map((e) => ({ ...e, x: e.x + world.x, z: e.z + world.z }));
    let region: RegionBox | null = null;
    for (const e of edits) region = unionRegion(region, stampRegion(e));
    const start = this.map.placements.length;
    this.map.placements.push(...placements);
    for (let i = 0; i < placements.length; i++) this.viewport3d?.placementAdded(start + i);
    this.map.terrainEdits.push(...edits);
    if (region) this.refreshTerrain(region);
    this.map.meta.updatedAt = now();
    this.canvasDirty = true;
    this.pushUndo({
      label: 'paste-region',
      undo: () => {
        for (const p of placements) {
          const i = this.map.placements.indexOf(p);
          if (i >= 0) this.map.placements.splice(i, 1);
        }
        for (const e of edits) {
          const i = this.map.terrainEdits.indexOf(e);
          if (i >= 0) this.map.terrainEdits.splice(i, 1);
        }
        this.setSelectedPlacement(null);
        this.viewport3d?.rebuildPlacements();
        this.refreshTerrain(region);
      },
      redo: () => {
        this.map.placements.push(...placements);
        this.map.terrainEdits.push(...edits);
        this.viewport3d?.rebuildPlacements();
        this.refreshTerrain(region);
      },
    });
    this.toasts.success(t('editor.region.pasted', { count: placements.length + edits.length }));
  }

  private pasteBeside(): void {
    if (!this.clipboard || !this.regionBox) {
      this.toasts.info(t('editor.region.needClipboard'));
      return;
    }
    const b = this.regionBox;
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    this.pasteAt({ x: cx + (b.maxX - b.minX) + 4, z: cz });
  }

  // ---- procgen ----------------------------------------------------------------------

  private worldBounds(): Bounds {
    const zones = this.map.content.zones;
    const minZ = Math.min(...zones.map((z) => z.zMin));
    const maxZ = Math.max(...zones.map((z) => z.zMax));
    return { minX: -176, maxX: 176, minZ: minZ + 8, maxZ: maxZ - 8 };
  }

  private avoidPredicate(): (x: number, z: number) => boolean {
    const seed = this.map.meta.seed;
    const zones = this.map.content.zones;
    const water = waterLevel();
    return (x: number, z: number): boolean => {
      if (terrainHeight(x, z, seed) < water + 1) return true;
      for (const zn of zones) {
        const dx = x - zn.hub.x;
        const dz = z - zn.hub.z;
        if (Math.sqrt(dx * dx + dz * dz) < zn.hub.radius + 6) return true;
      }
      return false;
    };
  }

  private runScatter(): void {
    const category =
      this.assets.selectedAssetId && isUserAssetId(this.assets.selectedAssetId)
        ? null
        : (assetById(this.assets.selectedAssetId ?? '')?.category ?? 'foliage');
    const pool = category
      ? ASSET_CATALOG.filter((a) => a.category === category).map((a) => a.id)
      : this.placeAssetId
        ? [this.placeAssetId]
        : [];
    if (pool.length === 0) {
      this.toasts.info(t('editor.procgen.noAssets'));
      return;
    }
    const seed = (this.map.meta.seed ^ (this.map.placements.length * 2654435761)) >>> 0;
    const placed = scatterPlacements({
      assetIds: pool,
      count: this.scatterCount,
      bounds: this.worldBounds(),
      seed,
      minScale: 0.7,
      maxScale: 1.6,
      avoid: this.avoidPredicate(),
    });
    if (placed.length === 0) {
      this.toasts.info(t('editor.procgen.noAssets'));
      return;
    }
    this.appendPlacements(placed, 'procgen-scatter');
    this.toasts.success(
      t('editor.procgen.scattered', { count: placed.length, category: category ?? '' }),
    );
  }

  private runHills(): void {
    const seed = (this.map.meta.seed ^ (this.map.terrainEdits.length * 40503)) >>> 0;
    const hills = scatterHills({
      count: Math.max(6, Math.round(this.scatterCount / 6)),
      bounds: this.worldBounds(),
      seed,
      minRadius: 14,
      maxRadius: 40,
      minHeight: 4,
      maxHeight: 16,
      avoid: this.avoidPredicate(),
    });
    if (hills.length === 0) return;
    let region: RegionBox | null = null;
    for (const h of hills) region = unionRegion(region, stampRegion(h));
    this.map.terrainEdits.push(...hills);
    this.refreshTerrain(region);
    this.map.meta.updatedAt = now();
    this.pushUndo({
      label: 'procgen-hills',
      undo: () => {
        for (const h of hills) {
          const i = this.map.terrainEdits.indexOf(h);
          if (i >= 0) this.map.terrainEdits.splice(i, 1);
        }
        this.refreshTerrain(region);
      },
      redo: () => {
        this.map.terrainEdits.push(...hills);
        this.refreshTerrain(region);
      },
    });
    this.toasts.success(t('editor.procgen.hillsAdded', { count: hills.length }));
  }

  // ---- undo plumbing ---------------------------------------------------------------

  private pushUndo(cmd: { label: string; undo(): void; redo(): void }): void {
    this.undo.push(cmd);
    this.markDirty();
    this.topbar.setUndoDepth(this.undo.depth);
  }

  private doUndo(): void {
    if (this.undo.undo()) {
      this.markDirty();
      this.topbar.setUndoDepth(this.undo.depth);
      this.inspector.refresh();
    }
  }

  private doRedo(): void {
    if (this.undo.redo()) {
      this.markDirty();
      this.topbar.setUndoDepth(this.undo.depth);
      this.inspector.refresh();
    }
  }

  private markDirty(): void {
    this.dirty = true;
    this.topbar.setDirty(true);
    this.canvasDirty = true;
  }

  // ---- save / open / import / export -----------------------------------------------

  private async save(): Promise<void> {
    if (this.saving) return;
    this.map.meta.updatedAt = now();
    const okLocal = this.io.saveLocal(this.map);
    if (!okLocal) {
      this.toasts.error(t('editor.status.saveFailedLocal'));
      return;
    }
    if (!signedIn()) {
      this.finishSave(t('editor.status.savedLocalOnly', { name: this.map.meta.name }), null);
      return;
    }
    this.saving = true;
    this.topbar.setSaving(true);
    try {
      const link = await this.io.saveServer(this.map);
      this.finishSave(
        t('editor.status.savedServer', { name: this.map.meta.name, version: link.version }),
        link.version,
      );
    } catch (err) {
      if (err instanceof EditorApiError && err.code === 'version_conflict') {
        await this.resolveConflict(err.serverVersion ?? 0);
      } else {
        const key =
          err instanceof EditorApiError
            ? editorErrorKey(err.code, err.status)
            : editorErrorKey(null);
        this.toasts.error(t(key));
        this.topbar.setSaveState(t('editor.topbar.savedLocal'));
      }
    } finally {
      this.saving = false;
      this.topbar.setSaving(false);
    }
  }

  private finishSave(message: string, serverVersion: number | null): void {
    this.dirty = false;
    this.topbar.setDirty(false);
    this.topbar.setSaveState(
      serverVersion === null
        ? t('editor.topbar.savedLocal')
        : t('editor.topbar.savedServer', { version: serverVersion }),
    );
    this.topbar.setForkEnabled(this.io.linkFor(this.map.meta.id) !== null);
    this.io.draftClear();
    this.toasts.success(message);
  }

  private async resolveConflict(serverVersion: number): Promise<void> {
    const copy = await confirmDialog(this.root, {
      title: t('editor.confirm.conflictTitle'),
      body: t('editor.confirm.conflictBody', { version: serverVersion }),
      confirmLabel: t('editor.confirm.conflictSaveCopy'),
    });
    if (!copy) {
      this.topbar.setSaveState(t('editor.topbar.savedLocal'));
      return;
    }
    // A copy is a new document identity: new meta.id, no server link yet.
    this.io.setLink(this.map.meta.id, null);
    this.map.meta.id = mintId();
    try {
      const link = await this.io.saveServerAsCopy(this.map);
      this.io.saveLocal(this.map);
      this.finishSave(
        t('editor.status.savedServer', { name: this.map.meta.name, version: link.version }),
        link.version,
      );
    } catch (err) {
      const key =
        err instanceof EditorApiError ? editorErrorKey(err.code, err.status) : editorErrorKey(null);
      this.toasts.error(t(key));
    }
  }

  private async saveAs(): Promise<void> {
    const name = await promptDialog(
      this.root,
      t('editor.prompt.saveAsTitle'),
      t('editor.prompt.nameLabel'),
      this.map.meta.name,
    );
    if (!name) return;
    this.map.meta.name = name;
    this.map.meta.id = mintId();
    this.map.meta.createdAt = now();
    this.topbar.setMapName(name);
    this.topbar.setForkEnabled(false);
    await this.save();
  }

  private async forkCurrent(): Promise<void> {
    const link = this.io.linkFor(this.map.meta.id);
    if (!link) return;
    try {
      const forked = await forkMap(link.serverId);
      this.toasts.success(t('editor.status.forked', { name: forked.name }));
      this.openServerMap(forked, true);
    } catch (err) {
      const key =
        err instanceof EditorApiError ? editorErrorKey(err.code, err.status) : editorErrorKey(null);
      this.toasts.error(t(key));
    }
  }

  private openServerMap(full: MapFullWire, mine: boolean): void {
    // Re-run the shared sanitizer over the wire document (defense in depth; the
    // server stores sanitizer output, but the editor never trusts a wire byte).
    const parsed = parseMap(full.doc);
    if (!parsed) {
      this.toasts.error(t('editor.serverError.invalid_map_doc'));
      return;
    }
    parsed.meta.name = full.name;
    this.loadMap(parsed);
    if (mine) {
      this.io.setLink(parsed.meta.id, { serverId: full.id, version: full.version });
      this.topbar.setForkEnabled(true);
      this.topbar.setSaveState(t('editor.topbar.savedServer', { version: full.version }));
    } else {
      this.io.setLink(parsed.meta.id, null);
      this.topbar.setForkEnabled(false);
    }
    this.toasts.success(t('editor.status.opened', { name: full.name }));
  }

  private async newMap(): Promise<void> {
    if (this.dirty) {
      const ok = await confirmDialog(this.root, {
        title: t('editor.confirm.discardTitle'),
        body: t('editor.confirm.discardBody', { name: this.map.meta.name }),
        confirmLabel: t('editor.confirm.discard'),
        danger: true,
      });
      if (!ok) return;
    }
    this.loadMap(newCustomMap(t('editor.untitledMap'), mintId(), now()));
    this.toasts.info(t('editor.status.newMap'));
  }

  private async importFile(): Promise<void> {
    const map = await pickMapFile();
    if (map) {
      this.loadMap(map);
      this.toasts.success(t('editor.status.imported', { name: map.meta.name }));
    } else {
      this.toasts.error(t('editor.status.importFailed'));
    }
  }

  private exportFile(): void {
    this.map.meta.updatedAt = now();
    downloadMap(this.map);
    this.toasts.success(t('editor.status.exported', { name: this.map.meta.name }));
  }

  private playtest(): void {
    const world = customMapToWorldContent(this.map);
    this.toasts.info(t('editor.status.playtestLaunch'));
    const ok = launchPlaytest(world, {
      seed: this.map.meta.seed,
      playerClass: 'warrior',
      playerName: t('editor.playtestPlayerName'),
    });
    if (!ok) this.toasts.error(t('editor.status.playtestFailed'));
  }

  private async uploadAsset(): Promise<void> {
    if (!signedIn()) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.glb,model/gltf-binary';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.glb')) {
        this.toasts.error(t('editor.upload.notGlb'));
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        this.toasts.error(t('editor.upload.tooLarge'));
        return;
      }
      this.toasts.info(t('editor.upload.uploading'));
      try {
        const bytes = await file.arrayBuffer();
        const name = file.name.replace(/\.glb$/i, '');
        const { asset, existing } = await uploadAsset(bytes, name);
        registerUserAssets([
          { id: asset.id, sha256: asset.sha256, name: asset.name, byteSize: asset.byteSize },
        ]);
        const assetId = userAssetIdFor(asset.sha256);
        this.placeAssetId = assetId;
        this.placeAssetLabel = asset.name ?? asset.sha256.slice(0, 8);
        this.setTool('place');
        this.assets.showUploaded(assetId);
        this.toasts.success(
          existing
            ? t('editor.upload.uploadedExisting')
            : t('editor.upload.uploaded', { name: this.placeAssetLabel }),
        );
      } catch (err) {
        const key =
          err instanceof EditorApiError
            ? editorErrorKey(err.code, err.status)
            : editorErrorKey(null);
        this.toasts.error(t(key));
      }
    };
    input.click();
  }

  private autosave(): void {
    if (!this.dirty) return;
    this.io.draftSave(this.map);
  }

  // Replace the whole working document and rebuild the editor over its content.
  private loadMap(map: CustomMap): void {
    this.map = map;
    this.content = map.content;
    this.entities = buildEntities(map.content);
    this.base = snapshot(this.entities);
    this.undo.clear();
    this.dirty = false;
    this.selectedKey = null;
    this.hoverKey = null;
    this.selectedPlacement = null;
    this.selectedCamp = null;
    this.regionBox = null;
    this.clipboard = null;
    this.waterBase = map.waterLevel ?? WATER_LEVEL;
    this.rebuildActiveWorld();
    this.topbar.setMapName(map.meta.name);
    this.topbar.setDirty(false);
    this.topbar.setUndoDepth(0);
    this.topbar.setForkEnabled(this.io.linkFor(map.meta.id) !== null);
    this.topbar.setSaveState(t('editor.topbar.neverSaved'));
    this.frameAll();
    this.canvasDirty = true;
    this.inspector.refresh();
    if (this.viewport3d) void this.viewport3d.reload(map);
  }

  // ---- keyboard -----------------------------------------------------------------------

  private onKeyDown = (ev: KeyboardEvent): void => {
    const target = ev.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')
    ) {
      return;
    }
    const mod = ev.ctrlKey || ev.metaKey;
    if (mod && ev.key.toLowerCase() === 'z') {
      ev.preventDefault();
      if (ev.shiftKey) this.doRedo();
      else this.doUndo();
      return;
    }
    if (mod && ev.key.toLowerCase() === 'y') {
      ev.preventDefault();
      this.doRedo();
      return;
    }
    if (mod && ev.key.toLowerCase() === 's') {
      ev.preventDefault();
      void this.save();
      return;
    }
    if (mod) return;
    if (ev.key === 'Escape') {
      if (this.drawer.isOpen) {
        this.drawer.close();
        return;
      }
      if (this.selectedPlacement !== null || this.selectedKey || this.selectedCamp !== null) {
        this.setSelectedPlacement(null);
        this.selectedKey = null;
        this.selectedCamp = null;
        this.inspector.refresh();
        this.canvasDirty = true;
        return;
      }
      if (this.tool !== 'select') this.setTool('select');
      return;
    }
    if (ev.key === 'Delete') {
      if (this.selectedPlacement !== null) this.removePlacementAt(this.selectedPlacement);
      else if (this.selectedCamp !== null) this.deleteSelectedCamp();
      return;
    }
    if (ev.key === '[' || ev.key === '{') {
      if (ev.shiftKey) this.brushStrength = Math.max(1, this.brushStrength - 1);
      else this.brushRadius = Math.max(4, this.brushRadius - 2);
      this.inspector.refresh();
      return;
    }
    if (ev.key === ']' || ev.key === '}') {
      if (ev.shiftKey) this.brushStrength = Math.min(30, this.brushStrength + 1);
      else this.brushRadius = Math.min(60, this.brushRadius + 2);
      this.inspector.refresh();
      return;
    }
    // Single-key tool shortcuts; suppressed while the 3D fly keys are live.
    if (this.viewport3d?.isNavigating()) return;
    const tool = TOOL_BY_KEY.get(ev.key.toLowerCase());
    if (tool && !ev.altKey) this.setTool(tool);
  };

  // ---- inspector deps -------------------------------------------------------------------

  private inspectorDeps(): ConstructorParameters<typeof Inspector>[1] {
    return {
      getTool: () => this.tool,
      getViewMode: () => this.viewMode,
      getBrushRadius: () => this.brushRadius,
      setBrushRadius: (v) => {
        this.brushRadius = v;
        this.canvasDirty = true;
      },
      getBrushStrength: () => this.brushStrength,
      setBrushStrength: (v) => {
        this.brushStrength = v;
      },
      getPaintBiome: () => this.paintBiome,
      setPaintBiome: (id) => {
        this.paintBiome = id;
      },
      clearBiomePaint: () => this.clearBiomePaint(),
      getFlattenHardEdge: () => this.flattenHardEdge,
      setFlattenHardEdge: (on) => {
        this.flattenHardEdge = on;
      },
      getWaterLevel: () => this.map.waterLevel ?? WATER_LEVEL,
      previewWaterLevel: (v) => this.previewWater(v),
      commitWaterLevel: (v) => this.commitWater(v),
      resetWaterLevel: () => this.commitWater(WATER_LEVEL),
      getPlaceScale: () => this.placeScale,
      setPlaceScale: (v) => {
        this.placeScale = v;
      },
      getPlaceCollide: () => this.placeCollide,
      setPlaceCollide: (on) => {
        this.placeCollide = on;
      },
      getPlaceRandomRot: () => this.placeRandomRot,
      setPlaceRandomRot: (on) => {
        this.placeRandomRot = on;
      },
      getPlaceAssetLabel: () => this.placeAssetLabel,
      mobOptions: () =>
        Object.keys(MOBS).map((id) => ({
          id,
          label: tEntity({ kind: 'mob', id, field: 'name' }),
        })),
      getSelectedCamp: () => {
        const camp = this.selectedCampDef();
        return camp && this.selectedCamp !== null
          ? {
              index: this.selectedCamp,
              mobId: camp.mobId,
              count: camp.count,
              radius: camp.radius,
            }
          : null;
      },
      updateCamp: (change) => this.updateSelectedCamp(change),
      deleteCamp: () => this.deleteSelectedCamp(),
      getSpawn: () => this.map.playerStart ?? null,
      clearSpawn: () => this.clearSpawn(),
      copyRegion: () => this.copyRegion(),
      pasteBeside: () => this.pasteBeside(),
      getSelection: (): PlacementSelection | null => {
        const i = this.selectedPlacement;
        const p = i === null ? undefined : this.map.placements[i];
        if (i === null || !p) return null;
        return {
          index: i,
          assetLabel: this.placementLabel(p.assetId),
          x: p.x,
          z: p.z,
          rotY: p.rotY,
          scale: p.scale,
          collide: p.collide,
        };
      },
      updateSelection: (change, commit) => this.updateSelectedPlacement(change, commit),
      duplicateSelection: () => {
        const i = this.selectedPlacement;
        const p = i === null ? undefined : this.map.placements[i];
        if (!p) return;
        this.appendPlacements([{ ...p, x: p.x + 2, z: p.z + 2 }], 'duplicate-placement');
        this.setSelectedPlacement(this.map.placements.length - 1);
        this.inspector.refresh();
      },
      deleteSelection: () => {
        if (this.selectedPlacement !== null) this.removePlacementAt(this.selectedPlacement);
      },
      getFootprints: () => this.footprintsOn,
      setFootprints: (on) => {
        this.footprintsOn = on;
        this.viewport3d?.showFootprints(on);
      },
      getMarkerSelection: () => {
        const e = this.entities.find((x) => x.key === this.selectedKey);
        return e ? { label: e.label, x: e.point.x, z: e.point.z } : null;
      },
      updateMarker: (axis, v) => {
        const e = this.entities.find((x) => x.key === this.selectedKey);
        if (e) {
          e.point[axis] = v;
          this.markerMovedWhile2d = true;
          this.markDirty();
        }
      },
      resetMarker: () => {
        const e = this.entities.find((x) => x.key === this.selectedKey);
        const o = e ? this.base.get(e.key) : undefined;
        if (e && o) {
          e.point.x = o.x;
          e.point.z = o.z;
          this.canvasDirty = true;
        }
      },
      getScatterCount: () => this.scatterCount,
      setScatterCount: (v) => {
        this.scatterCount = v;
      },
      runScatter: () => this.runScatter(),
      runHills: () => this.runHills(),
      layers: () =>
        KINDS.map((kind) => ({
          kind,
          label: t(LAYER_KEYS[kind] as Parameters<typeof t>[0]),
          visible: this.visible.has(kind),
        })),
      toggleLayer: (kind, on) => {
        if (on) this.visible.add(kind as EntityKind);
        else this.visible.delete(kind as EntityKind);
        this.canvasDirty = true;
      },
      frameAll: () => this.frameAll(),
      zones: () => this.map.content.zones.map((z) => ({ id: z.id, name: z.name })),
      frameZone: (id) => this.frameZone(id),
    };
  }

  // ---- 2D view ----------------------------------------------------------------------

  private vp(): Viewport {
    return { width: this.canvas.clientWidth, height: this.canvas.clientHeight };
  }

  private visibleEntities(): EditorEntity[] {
    return this.entities.filter((e) => this.visible.has(e.kind));
  }

  private pickEntity(s: ScreenPoint): EditorEntity | null {
    const list = this.visibleEntities();
    const handles = list.map((e) => ({ id: e.key, x: e.point.x, z: e.point.z, radius: e.radius }));
    const hit = pickHandle(handles, s, this.cam, this.vp());
    return hit ? (list.find((e) => e.key === hit.id) ?? null) : null;
  }

  private resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.canvasDirty = true;
  };

  private tick2d = (): void => {
    if (this.canvasDirty && this.viewMode === '2d') {
      draw(this.ctx, this.cam, this.vp(), {
        entities: this.visibleEntities(),
        roads: this.map.content.roads ?? [],
        selectedKey: this.selectedKey,
        hoverKey: this.hoverKey,
        terrainEdits: this.map.terrainEdits,
        placements: this.map.placements,
        biomePaint: this.map.biomePaint ?? null,
        region: this.tool === 'region' ? this.regionBox : null,
        spawn: this.map.playerStart ?? null,
        brush:
          this.isDragTool() && this.cursorWorld
            ? {
                x: this.cursorWorld.x,
                z: this.cursorWorld.z,
                radius: this.brushRadius,
                raise: this.tool !== 'lower',
              }
            : null,
      });
      this.canvasDirty = false;
    }
    requestAnimationFrame(this.tick2d);
  };

  private pointerAt(ev: { clientX: number; clientY: number }): ScreenPoint {
    const r = this.canvas.getBoundingClientRect();
    return { sx: ev.clientX - r.left, sy: ev.clientY - r.top };
  }

  private attach2dEvents(stage: HTMLElement): void {
    window.addEventListener('resize', this.resize);

    stage.addEventListener('pointerdown', (ev) => {
      const s = this.pointerAt(ev);
      this.lastPointer = s;
      const w = this.cam.screenToWorld(s, this.vp());
      if (ev.button !== 0) {
        this.panning = true;
        stage.setPointerCapture(ev.pointerId);
        return;
      }
      if (this.tool === 'region') {
        this.selectingRegion = true;
        this.regionDownScreen = s;
        this.editStart(w);
        stage.setPointerCapture(ev.pointerId);
        return;
      }
      if (this.isDragTool()) {
        this.painting2d = true;
        this.editStart(w);
        stage.setPointerCapture(ev.pointerId);
        return;
      }
      if (this.tool === 'place' || this.tool === 'camp' || this.tool === 'spawn') {
        this.editStart(w);
        this.canvasDirty = true;
        return;
      }
      // Select: markers first, then placements.
      const hit = this.pickEntity(s);
      if (hit) {
        this.dragKey = hit.key;
        this.selectedKey = hit.key;
        this.setSelectedPlacement(null);
        this.grab = { x: w.x - hit.point.x, z: w.z - hit.point.z };
        this.inspector.refresh();
      } else {
        const pi = erasePlacementIndex(this.map.placements, w.x, w.z, 2);
        if (pi >= 0) {
          this.selectedKey = null;
          this.setSelectedPlacement(pi);
          this.inspector.refresh();
        } else {
          this.panning = true;
          if (this.selectedKey || this.selectedPlacement !== null) {
            this.selectedKey = null;
            this.setSelectedPlacement(null);
            this.inspector.refresh();
          }
        }
      }
      stage.setPointerCapture(ev.pointerId);
      this.canvasDirty = true;
    });

    stage.addEventListener('pointermove', (ev) => {
      const s = this.pointerAt(ev);
      const dx = s.sx - this.lastPointer.sx;
      const dy = s.sy - this.lastPointer.sy;
      this.lastPointer = s;
      this.cursorWorld = this.cam.screenToWorld(s, this.vp());
      if (this.selectingRegion) {
        this.editMove(this.cursorWorld);
      } else if (this.painting2d) {
        this.editMove(this.cursorWorld);
      } else if (this.dragKey) {
        const e = this.entities.find((x) => x.key === this.dragKey);
        if (e) {
          e.point.x = this.cursorWorld.x - this.grab.x;
          e.point.z = this.cursorWorld.z - this.grab.z;
          this.markerMovedWhile2d = true;
          this.canvasDirty = true;
        }
      } else if (this.panning) {
        this.cam.panByPixels(dx, dy);
        this.canvasDirty = true;
      } else if (this.tool !== 'select') {
        this.canvasDirty = true; // refresh the brush cursor preview
      } else {
        const hit = this.pickEntity(s);
        const key = hit ? hit.key : null;
        if (key !== this.hoverKey) {
          this.hoverKey = key;
          stage.style.cursor = key ? 'grab' : 'default';
          this.canvasDirty = true;
        }
      }
    });

    const end = (ev: PointerEvent): void => {
      this.panning = false;
      if (this.dragKey) {
        this.dragKey = null;
        this.markDirty();
      }
      if (this.selectingRegion) {
        this.selectingRegion = false;
        this.editEnd();
      }
      if (this.painting2d) {
        this.painting2d = false;
        this.editEnd();
        this.map.meta.updatedAt = now();
      }
      try {
        stage.releasePointerCapture(ev.pointerId);
      } catch {
        // pointer capture may already be gone; ignore.
      }
      this.canvasDirty = true;
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);

    stage.addEventListener(
      'wheel',
      (ev) => {
        ev.preventDefault();
        const factor = Math.exp(-ev.deltaY * 0.0015);
        this.cam.zoomAt(this.pointerAt(ev), factor, this.vp());
        this.canvasDirty = true;
      },
      { passive: false },
    );
  }

  private frameAll(): void {
    const pts = this.entities.map((e) => e.point);
    if (pts.length === 0) return;
    const min = { x: Math.min(...pts.map((p) => p.x)), z: Math.min(...pts.map((p) => p.z)) };
    const max = { x: Math.max(...pts.map((p) => p.x)), z: Math.max(...pts.map((p) => p.z)) };
    this.cam.frame(min, max, this.vp());
    this.canvasDirty = true;
  }

  private frameZone(zoneId: string): void {
    const own = this.entities.filter((e) => e.zoneId === zoneId);
    const zone = this.map.content.zones.find((z) => z.id === zoneId);
    if (!zone || own.length === 0) return;
    const xs = own.map((e) => e.point.x);
    const min = { x: Math.min(...xs), z: zone.zMin };
    const max = { x: Math.max(...xs), z: zone.zMax };
    this.cam.frame(min, max, this.vp());
    this.canvasDirty = true;
  }
}

// Editor UI helpers (not sim code): wall-clock + ids are fine here.
function now(): number {
  return Date.now();
}
function mintId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `map-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  }
}
