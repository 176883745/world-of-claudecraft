// The serializable custom-map document: the editor's save format, the JSON a
// player exports/imports, and the JSONB the server stores for saved/forked maps.
// Lives in src/sim (DOM-free, deterministic) because BOTH sides must agree on
// what a valid document is: the editor parses untrusted local files with the
// exact sanitizer the server applies to untrusted uploads. Never throws: every
// field is validated, clamped, and def-filled; an unsalvageable input returns
// null. The wire/storage shape is CustomMap v1 plus the optional v2 fields
// (waterLevel, playerStart, meta.description/parentId, stamp mode, placement
// collide), so every v1 document parses unchanged.

import type { BiomePaint, CampDef, GroundObjectDef, HeightStamp, NpcDef, ZoneDef } from './types';
import { BIOME_BY_ID } from './world';

export const MAP_DOC_VERSION = 2;

// Hard caps applied by the sanitizer (the server stores what the sanitizer
// returns, so these bound document size and playtest cost).
export const MAX_TERRAIN_EDITS = 4000;
export const MAX_PLACEMENTS = 4000;
export const MAX_CAMPS = 600;
export const MAX_NPCS = 200;
export const MAX_OBJECTS = 400;
export const MAX_ZONES = 12;
export const MAX_ROADS = 64;
export const MAX_ROAD_POINTS = 256;
export const MAX_NAME_LENGTH = 60;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MIN_WATER_LEVEL = -40;
export const MAX_WATER_LEVEL = 40;

// A free-form GLB placement from the asset catalogue. `collide` opts the
// placement into a sim circle collider at playtest (see collideRadiusFor).
export interface MapPlacement {
  assetId: string; // catalogue id, e.g. "props/well"
  x: number;
  z: number;
  rotY: number; // radians
  scale: number;
  collide: boolean;
}

export interface MapDocMeta {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  seed: number;
  // Fork lineage (set by the server on fork; empty string = original work).
  parentId: string;
}

// The spatial content tables, mirroring the per-zone content modules. `objects`
// matches the stored-JSON key (WorldContent calls them groundObjects).
export interface MapDocContent {
  zones: ZoneDef[];
  camps: CampDef[];
  npcs: Record<string, NpcDef>;
  objects: GroundObjectDef[];
  roads: { x: number; z: number }[][];
}

export interface MapDoc {
  version: number;
  meta: MapDocMeta;
  content: MapDocContent;
  terrainEdits: HeightStamp[];
  placements: MapPlacement[];
  biomePaint?: BiomePaint;
  // v2: map-wide water surface height; absent = the built-in WATER_LEVEL.
  waterLevel?: number;
  // v2: where playtest drops the player; absent = the built-in start.
  playerStart?: { x: number; z: number };
}

// Placed assets are normalized to ~2.2yd max dimension at scale 1 by the
// renderer (src/render/placed_assets.ts TARGET_HEIGHT), so a colliding
// placement gets a footprint radius proportional to its scale. Pure data in the
// document pipeline: the sim never opens the GLB.
export function collideRadiusFor(scale: number): number {
  return Math.max(0.3, Math.min(8, 0.8 * scale));
}

export function serializeMapDoc(doc: MapDoc): string {
  return JSON.stringify(doc, null, 2);
}

const DEFAULT_SEED = 20061; // the game's fixed world seed (src/main.ts WORLD_SEED)

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
function str(v: unknown, fallback: string): string {
  return typeof v === 'string' ? v : fallback;
}
function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function sanitizeStamp(v: unknown): HeightStamp | null {
  if (!v || typeof v !== 'object') return null;
  const s = v as Record<string, unknown>;
  if (typeof s.x !== 'number' || typeof s.z !== 'number') return null;
  if (!Number.isFinite(s.x) || !Number.isFinite(s.z)) return null;
  const radius = num(s.radius, 0);
  if (radius <= 0) return null;
  const stamp: HeightStamp = {
    x: s.x,
    z: s.z,
    radius: clamp(radius, 0.1, 200),
    delta: clamp(num(s.delta, 0), -200, 200),
    falloff: s.falloff === 'flat' ? 'flat' : 'smooth',
  };
  if (s.mode === 'level') stamp.mode = 'level';
  return stamp;
}

function sanitizePlacement(v: unknown): MapPlacement | null {
  if (!v || typeof v !== 'object') return null;
  const p = v as Record<string, unknown>;
  if (typeof p.assetId !== 'string' || p.assetId.length > 128) return null;
  if (typeof p.x !== 'number' || typeof p.z !== 'number') return null;
  if (!Number.isFinite(p.x) || !Number.isFinite(p.z)) return null;
  return {
    assetId: p.assetId,
    x: p.x,
    z: p.z,
    rotY: num(p.rotY, 0),
    scale: clamp(num(p.scale, 1) || 1, 0.05, 40),
    collide: p.collide === true,
  };
}

// Validate a biome paint grid: ids length must match cols*rows and cell must be
// positive, else the grid is dropped. Unknown biome ids become 255 (unpainted),
// so a document from a future build degrades instead of breaking.
function sanitizeBiomePaint(v: unknown): BiomePaint | undefined {
  if (!v || typeof v !== 'object') return undefined;
  const b = v as Record<string, unknown>;
  const cols = num(b.cols, 0);
  const rows = num(b.rows, 0);
  const cell = num(b.cell, 0);
  if (cols <= 0 || rows <= 0 || cell <= 0) return undefined;
  if (cols * rows > 1_000_000) return undefined;
  if (!Array.isArray(b.ids) || b.ids.length !== cols * rows) return undefined;
  const idCount = BIOME_BY_ID.length;
  const ids = b.ids.map((n) =>
    typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < idCount ? n : 255,
  );
  return { cell, cols, rows, originX: num(b.originX, 0), originZ: num(b.originZ, 0), ids };
}

function sanitizeMeta(v: unknown): MapDocMeta {
  const m = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const created = num(m.createdAt, 0);
  return {
    id: str(m.id, '').slice(0, 64),
    name: str(m.name, 'Untitled Map').slice(0, MAX_NAME_LENGTH),
    description: str(m.description, '').slice(0, MAX_DESCRIPTION_LENGTH),
    createdAt: created,
    updatedAt: num(m.updatedAt, created),
    seed: Math.floor(num(m.seed, DEFAULT_SEED)),
    parentId: str(m.parentId, '').slice(0, 64),
  };
}

// A zone must at least have a numeric z-band and a hub to shape terrain.
function zoneIsUsable(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const z = v as Record<string, unknown>;
  const hub = z.hub as Record<string, unknown> | undefined;
  return (
    typeof z.zMin === 'number' &&
    typeof z.zMax === 'number' &&
    !!hub &&
    typeof hub.x === 'number' &&
    typeof hub.z === 'number'
  );
}

// Def-fill the nested zone sub-fields the terrain function and the editor
// model iterate (lakes/pois arrays, hub radius/name, a valid biome), keeping
// the never-throws contract: a minimal-but-usable zone loads instead of
// crashing a viewer's editor tab. Mutates the zone object in place (it was
// freshly JSON.parsed; nothing else holds a reference).
function fillZoneDefaults(v: unknown): ZoneDef {
  const z = v as Record<string, unknown>;
  if (typeof z.id !== 'string') z.id = 'zone';
  if (typeof z.name !== 'string') z.name = 'Zone';
  if (!Array.isArray(z.lakes)) z.lakes = [];
  if (!Array.isArray(z.pois)) z.pois = [];
  if (typeof z.welcome !== 'string') z.welcome = '';
  if (typeof z.biome !== 'string' || !BIOME_BY_ID.includes(z.biome as ZoneDef['biome'])) {
    z.biome = 'vale';
  }
  if (!Array.isArray(z.levelRange)) z.levelRange = [1, 10];
  const hub = z.hub as Record<string, unknown>;
  if (typeof hub.radius !== 'number' || !Number.isFinite(hub.radius)) hub.radius = 20;
  if (typeof hub.name !== 'string') hub.name = '';
  const gy = z.graveyard as Record<string, unknown> | undefined;
  if (!gy || typeof gy.x !== 'number' || typeof gy.z !== 'number') {
    z.graveyard = { x: hub.x, z: hub.z };
  }
  return z as unknown as ZoneDef;
}

function sanitizeRoads(v: unknown): { x: number; z: number }[][] {
  const roads: { x: number; z: number }[][] = [];
  for (const road of arr(v).slice(0, MAX_ROADS)) {
    if (!Array.isArray(road)) continue;
    const pts: { x: number; z: number }[] = [];
    for (const p of road.slice(0, MAX_ROAD_POINTS)) {
      const pt = p as Record<string, unknown> | null;
      if (pt && typeof pt.x === 'number' && typeof pt.z === 'number') {
        pts.push({ x: pt.x, z: pt.z });
      }
    }
    if (pts.length >= 2) roads.push(pts);
  }
  return roads;
}

// Parse anything (JSON string or already-parsed object, trusted or not) into a
// MapDoc, or null if it cannot be salvaged (no usable zones). Server routes and
// the editor's import path both call THIS; there is no other validation layer.
export function sanitizeMapDoc(raw: unknown): MapDoc | null {
  let obj: unknown = raw;
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!obj || typeof obj !== 'object') return null;
  const o = obj as Record<string, unknown>;
  const content = (o.content && typeof o.content === 'object' ? o.content : {}) as Record<
    string,
    unknown
  >;
  const zones = arr(content.zones).filter(zoneIsUsable).slice(0, MAX_ZONES).map(fillZoneDefaults);
  if (zones.length === 0) return null; // nothing to render/play
  const npcsRaw = content.npcs && typeof content.npcs === 'object' ? (content.npcs as object) : {};
  const npcs = Object.fromEntries(Object.entries(npcsRaw).slice(0, MAX_NPCS));
  const doc: MapDoc = {
    version: num(o.version, MAP_DOC_VERSION),
    meta: sanitizeMeta(o.meta),
    content: {
      // Zones/camps/npcs/objects keep their full shape (the editor and engine
      // read many fields); we only gate zones on the load-bearing ones above.
      zones,
      camps: arr(content.camps).slice(0, MAX_CAMPS) as CampDef[],
      npcs: npcs as Record<string, NpcDef>,
      objects: arr(content.objects).slice(0, MAX_OBJECTS) as GroundObjectDef[],
      roads: sanitizeRoads(content.roads),
    },
    terrainEdits: arr(o.terrainEdits)
      .slice(0, MAX_TERRAIN_EDITS)
      .map(sanitizeStamp)
      .filter((s): s is HeightStamp => s !== null),
    placements: arr(o.placements)
      .slice(0, MAX_PLACEMENTS)
      .map(sanitizePlacement)
      .filter((p): p is MapPlacement => p !== null),
    biomePaint: sanitizeBiomePaint(o.biomePaint),
  };
  if (typeof o.waterLevel === 'number' && Number.isFinite(o.waterLevel)) {
    doc.waterLevel = clamp(o.waterLevel, MIN_WATER_LEVEL, MAX_WATER_LEVEL);
  }
  const ps = o.playerStart as Record<string, unknown> | undefined;
  if (ps && typeof ps === 'object' && typeof ps.x === 'number' && typeof ps.z === 'number') {
    doc.playerStart = { x: ps.x, z: ps.z };
  }
  return doc;
}
