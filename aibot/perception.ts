// Perception layer for AI bot.
// Parses world state into useful information for decision-making.

import type { EntityWire, SelfWire, SimEventWire } from './protocol';
import { getRole } from './roles';
import type { WorldState } from './client';

export interface Entity {
  id: number;
  kind: 'player' | 'npc' | 'pet' | 'unknown';
  typeId: string;
  name: string;
  level: number;
  ownerId: number | null;
  isPet: boolean;
  position: { x: number; y: number; z: number };
  facing: number;
  hp: number;
  maxHp: number;
  isDead: boolean;
  isPlayer: boolean;
  isNpc: boolean;
  isHostile: boolean;
  targetId: number | null;
  distance: number; // distance from self
}

export interface PartyMemberAura {
  id: string;
  kind: string;
  neg?: 1;
}

export interface PartyMemberInfo {
  pid: number;
  name: string;
  cls: string;
  level: number;
  hp: number;
  maxHp: number;
  x: number;
  z: number;
  dead: boolean;
  inCombat: boolean;
  auras: PartyMemberAura[];
}

export interface PartyInfo {
  leader: number;
  members: PartyMemberInfo[];
  memberIds: number[];
  lootMode?: string;
}

export interface SelfInfo {
  id: number;
  name: string;
  level: number;
  class: string;
  spec: string | null;
  role: import('./roles').CombatRole | null;
  position: { x: number; y: number; z: number };
  facing: number;
  hp: number;
  maxHp: number;
  resources: Record<string, { current: number; max: number }>;
  cooldowns: Record<string, number>; // ability -> seconds remaining
  targetId: number | null;
  inventory: { item: string; count: number; quality?: number }[];
  copper: number;
  questLog: Map<string, { stage: string; progress: Record<string, number> }>;
  questsDone: Set<string>;
  inCombat: boolean;
  partyInfo: PartyInfo | null;
}

export interface Perception {
  self: SelfInfo | null;
  entities: Entity[];
  nearbyHostiles: Entity[];
  nearbyFriendlies: Entity[];
  nearbyPlayers: Entity[];
  nearbyNpcs: Entity[];
  currentTarget: Entity | null;
  events: SimEventWire[];
  pendingInvites: { type: 'party' | 'trade' | 'duel'; from: number; name: string }[];
  chatMessages: { sender: number; senderName: string; channel: string; message: string }[];
}

/**
 * Parse raw world state into structured perception.
 */
export function parsePerception(state: WorldState): Perception {
  const self = state.self ? parseSelf(state.self, state.playerId) : null;

  const entities: Entity[] = [];
  for (const [id, wire] of state.entities) {
    if (id === state.playerId) continue; // Skip self
    entities.push(parseEntity(wire, self?.position));
  }

  const nearbyHostiles = entities.filter(e => e.isHostile && !e.isDead);
  const nearbyFriendlies = entities.filter(e => !e.isHostile && !e.isDead);
  const nearbyPlayers = entities.filter(e => e.isPlayer && !e.isDead);
  const nearbyNpcs = entities.filter(e => e.isNpc && !e.isDead);

  const currentTarget = self?.targetId
    ? entities.find(e => e.id === self.targetId) || null
    : null;

  // Parse events
  const events = state.events;
  const pendingInvites: Perception['pendingInvites'] = [];
  const chatMessages: Perception['chatMessages'] = [];

  for (const event of events) {
    console.log(`[Perception] event type=${event.type} keys=${Object.keys(event).join(',')}`);
    if (event.type === 'partyInvite') {
      console.log(`[Perception] partyInvite from ${event.fromName} (pid=${event.fromPid})`);
      pendingInvites.push({ type: 'party', from: event.fromPid as number, name: event.fromName as string });
    } else if (event.type === 'tradeRequest') {
      pendingInvites.push({ type: 'trade', from: event.fromPid as number, name: event.fromName as string });
    } else if (event.type === 'duelRequest') {
      pendingInvites.push({ type: 'duel', from: event.fromPid as number, name: event.fromName as string });
    } else if (event.type === 'chat') {
      chatMessages.push({
        sender: event.fromPid as number,
        senderName: event.from as string,
        channel: event.channel as string,
        message: event.message as string,
      });
    }
  }

  return {
    self,
    entities,
    nearbyHostiles,
    nearbyFriendlies,
    nearbyPlayers,
    nearbyNpcs,
    currentTarget,
    events,
    pendingInvites,
    chatMessages,
  };
}

function parseEntity(wire: EntityWire, selfPos?: { x: number; y: number; z: number }): Entity {
  const kind = wire.k === 'player' ? 'player' : wire.k === 'npc' ? 'npc' : wire.k === 'pet' ? 'pet' : 'unknown';

  const position = {
    x: wire.x ?? 0,
    y: wire.y ?? 0,
    z: wire.z ?? 0,
  };

  const distance = selfPos ? distance3D(selfPos, position) : 0;

  const isPet = kind === 'pet';
  const ownerId = wire.own ?? null;

  return {
    id: wire.id,
    kind,
    typeId: wire.tid ?? '',
    name: wire.nm ?? '',
    level: wire.lv ?? 1,
    ownerId,
    isPet,
    position,
    facing: wire.f ?? 0,
    hp: wire.hp ?? 0,
    maxHp: wire.mhp ?? 0,
    isDead: wire.dead ?? false,
    isPlayer: kind === 'player',
    isNpc: kind === 'npc',
    isHostile: kind === 'npc' && !wire.dead, // Simplified: all NPCs are potentially hostile
    targetId: wire.target ?? null,
    distance,
  };
}

function parseSelf(wire: SelfWire, playerId: number): SelfInfo {
  const position = {
    x: wire.x ?? 0,
    y: wire.y ?? 0,
    z: wire.z ?? 0,
  };

  const resources: Record<string, { current: number; max: number }> = {};
  if (wire.res) {
    for (const [key, value] of Object.entries(wire.res)) {
      // Assume max values are stored separately or derived
      resources[key] = { current: value as number, max: value as number };
    }
  }

  const questLog = new Map<string, { stage: string; progress: Record<string, number> }>();
  if (wire.qlog) {
    for (const q of wire.qlog) {
      questLog.set(q.id, { stage: q.stage, progress: q.progress });
    }
  }

  const classType = wire.tid ?? '';
  const spec = wire.tspec ?? null;

  return {
    id: playerId,
    name: wire.nm ?? '',
    level: wire.lv ?? 1,
    class: classType,
    spec,
    role: wire.trole ? (wire.trole as import('./roles').CombatRole) : getRole(classType, spec),
    position,
    facing: wire.f ?? 0,
    hp: wire.hp ?? 0,
    maxHp: wire.mhp ?? 0,
    resources,
    cooldowns: wire.cds ?? {},
    targetId: wire.target ?? null,
    inventory: wire.inv ?? [],
    copper: wire.copper ?? 0,
    questLog,
    questsDone: new Set(wire.qdone ?? []),
    inCombat: wire.target !== undefined && wire.target !== null,
    partyInfo: wire.party ? parsePartyInfo(wire.party) : null,
  };
}

function parsePartyInfo(wire: import('./protocol').PartyInfoWire): PartyInfo {
  const memberIds: number[] = [];
  const members: PartyMemberInfo[] = [];

  for (const m of wire.members) {
    if (typeof m === 'number') {
      memberIds.push(m);
      continue;
    }

    memberIds.push(m.pid);
    members.push({
      pid: m.pid,
      name: m.name,
      cls: m.cls,
      level: m.level,
      hp: m.hp,
      maxHp: m.mhp,
      x: m.x,
      z: m.z,
      dead: m.dead === 1,
      inCombat: m.inCombat === 1,
      auras: (m.auras ?? []).map(a => ({
        id: a.id,
        kind: a.kind,
        neg: a.neg,
      })),
    });
  }

  return {
    leader: wire.leader,
    members,
    memberIds,
    lootMode: wire.lootMode,
  };
}

function distance3D(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// -------------------------------------------------------------------------
// Helper functions for bot behavior
// -------------------------------------------------------------------------

/** Find the nearest hostile entity. */
export function findNearestHostile(perception: Perception): Entity | null {
  if (perception.nearbyHostiles.length === 0) return null;
  return perception.nearbyHostiles.reduce((nearest, e) =>
    e.distance < nearest.distance ? e : nearest,
  );
}

/** Check if an entity is within range. */
export function isInRange(self: SelfInfo, target: Entity, range: number): boolean {
  return target.distance <= range;
}

/** Check if self has a specific cooldown. */
export function hasCooldown(self: SelfInfo, ability: string): boolean {
  return self.cooldowns[ability] !== undefined && self.cooldowns[ability] > 0;
}

/** Check if an entity or self is low on health. */
export function isLowHealth(target: { hp: number; maxHp: number }, threshold = 0.3): boolean {
  return target.hp / target.maxHp < threshold;
}

/** Check if inventory is nearly full. */
export function isInventoryNearlyFull(perception: Perception, threshold = 0.9): boolean {
  // Simplified: check inventory slot count
  if (!perception.self) return false;
  const usedSlots = perception.self.inventory.length;
  const maxSlots = 16; // Default bag size
  return usedSlots / maxSlots >= threshold;
}