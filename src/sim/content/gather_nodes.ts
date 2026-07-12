// Gatherable world nodes: ore veins, wood stands, herb patches. Placed as
// permanent, unowned world fixtures; visibility only (see G3 for harvesting).
// Adding a new node type or placement should touch only this file plus the
// render prop lookup that draws it (src/render/gather_nodes.ts).

import type { GatherNodeDef, GatherNodeType } from '../types';

export const GATHER_NODE_TYPES: readonly GatherNodeType[] = ['ore', 'wood', 'herb'];

// `level` (issue: profession XP) is a one-time snapshot of each node's zone
// levelRange midpoint (eastbrook_vale [1,7] -> 4; mirefen_marsh, zone2's
// levelRange [6,13] -> 10), not a live lookup: see types.ts GatherNodeDef.
export const GATHER_NODES: GatherNodeDef[] = [
  // Eastbrook Vale (eastbrook_vale), ore near Boar Meadow's rocky outcrops
  { id: 'ore_eastbrook_1', zoneId: 'eastbrook_vale', type: 'ore', pos: { x: 72, z: 8 }, level: 4 },
  {
    id: 'ore_eastbrook_2',
    zoneId: 'eastbrook_vale',
    type: 'ore',
    pos: { x: 78, z: -6 },
    level: 4,
  },
  {
    id: 'ore_eastbrook_3',
    zoneId: 'eastbrook_vale',
    type: 'ore',
    pos: { x: 66, z: 22 },
    level: 4,
  },

  // Eastbrook Vale, wood stands around Webwood
  {
    id: 'wood_eastbrook_1',
    zoneId: 'eastbrook_vale',
    type: 'wood',
    pos: { x: -62, z: 8 },
    level: 4,
  },
  {
    id: 'wood_eastbrook_2',
    zoneId: 'eastbrook_vale',
    type: 'wood',
    pos: { x: -57, z: -6 },
    level: 4,
  },
  {
    id: 'wood_eastbrook_3',
    zoneId: 'eastbrook_vale',
    type: 'wood',
    pos: { x: -68, z: 18 },
    level: 4,
  },

  // Eastbrook Vale, herb patches near Mirror Lake
  {
    id: 'herb_eastbrook_1',
    zoneId: 'eastbrook_vale',
    type: 'herb',
    pos: { x: -86, z: 90 },
    level: 4,
  },
  {
    id: 'herb_eastbrook_2',
    zoneId: 'eastbrook_vale',
    type: 'herb',
    pos: { x: -92, z: 80 },
    level: 4,
  },
  {
    id: 'herb_eastbrook_3',
    zoneId: 'eastbrook_vale',
    type: 'herb',
    pos: { x: -80, z: 95 },
    level: 4,
  },

  // Mirefen Marsh (mirefen_marsh)
  { id: 'ore_mirefen_1', zoneId: 'mirefen_marsh', type: 'ore', pos: { x: 40, z: 340 }, level: 10 },
  {
    id: 'ore_mirefen_2',
    zoneId: 'mirefen_marsh',
    type: 'ore',
    pos: { x: -30, z: 360 },
    level: 10,
  },

  {
    id: 'wood_mirefen_1',
    zoneId: 'mirefen_marsh',
    type: 'wood',
    pos: { x: 10, z: 330 },
    level: 10,
  },
  {
    id: 'wood_mirefen_2',
    zoneId: 'mirefen_marsh',
    type: 'wood',
    pos: { x: -15, z: 355 },
    level: 10,
  },

  {
    id: 'herb_mirefen_1',
    zoneId: 'mirefen_marsh',
    type: 'herb',
    pos: { x: 60, z: 385 },
    level: 10,
  },
  {
    id: 'herb_mirefen_2',
    zoneId: 'mirefen_marsh',
    type: 'herb',
    pos: { x: -45, z: 452 },
    level: 10,
  },
];
