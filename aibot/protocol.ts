// Wire protocol types for game server communication.
// These types match the server's wire format in server/game.ts.

// ---------------------------------------------------------------------------
// Client -> Server messages
// ---------------------------------------------------------------------------

export interface AuthMessage {
  t: 'auth';
  token: string;
  character: number;
  clientSeed?: string;
}

export interface InputMessage {
  t: 'input';
  seq: number;
  mi: {
    f: number; // forward
    b: number; // back
    tl: number; // turnLeft
    tr: number; // turnRight
    sl: number; // strafeLeft
    sr: number; // strafeRight
    j: number; // jump
  };
  facing?: number;
}

export interface CommandMessage {
  t: 'cmd';
  cmd: string;
  [key: string]: unknown;
}

export type ClientMessage = AuthMessage | InputMessage | CommandMessage;

// ---------------------------------------------------------------------------
// Server -> Client messages
// ---------------------------------------------------------------------------

export interface HelloMessage {
  t: 'hello';
  pid: number; // player entity id
  seed: number;
  realm?: string;
  softWords?: string[];
}

export interface SnapshotMessage {
  t: 'snap';
  ents: EntityWire[];
  self?: SelfWire;
  keep?: number[];
}

export interface EventsMessage {
  t: 'events';
  list: SimEventWire[];
}

export interface SocialMessage {
  t: 'social';
  social: SocialInfoWire;
}

export interface ErrorMessage {
  t: 'error';
  error: string;
}

export interface CensorMessage {
  t: 'censor';
  words: string[];
}

export type ServerMessage = HelloMessage | SnapshotMessage | EventsMessage | SocialMessage | ErrorMessage | CensorMessage;

// ---------------------------------------------------------------------------
// Wire entity format (terse keys)
// ---------------------------------------------------------------------------

export interface EntityWire {
  id: number;
  // Position
  x?: number;
  y?: number;
  z?: number;
  f?: number; // facing
  // Health
  hp?: number;
  mhp?: number; // max hp
  // Identity (full records only)
  k?: string; // kind: 'player' | 'npc' | 'pet'
  tid?: string; // type id (e.g., 'warrior', 'wolf')
  nm?: string; // name
  lv?: number; // level
  own?: number; // owner id (for pets)
  // Combat state
  target?: number;
  auras?: AuraWire[];
  cast?: CastWire;
  // Equipment (players)
  equip?: Record<string, string>;
  // Death
  dead?: boolean;
}

export interface AuraWire {
  id: string;
  stacks?: number;
  expires?: number;
}

export interface CastWire {
  ability: string;
  target: number;
  started: number;
  duration: number;
  channeled?: boolean;
}

// ---------------------------------------------------------------------------
// Self wire format (extended player state)
// ---------------------------------------------------------------------------

export interface SelfWire {
  // Identity
  k?: string;
  tid?: string;
  nm?: string;
  lv?: number;
  // Position
  x?: number;
  y?: number;
  z?: number;
  f?: number;
  // Health/Resources
  hp?: number;
  mhp?: number;
  res?: Record<string, number>; // resources (mana, energy, etc.)
  // Combat
  cds?: Record<string, number>; // cooldowns
  target?: number;
  auras?: AuraWire[];
  cast?: CastWire;
  // Inventory
  inv?: InvSlotWire[];
  equip?: Record<string, string>;
  bags?: (string | null)[];
  copper?: number;
  // Talents
  tal?: Record<string, number>;
  tspec?: string;
  trole?: string;
  // Quests
  qlog?: QuestProgressWire[];
  qdone?: string[];
  // Social
  party?: PartyInfoWire;
  trade?: TradeInfoWire;
  duel?: DuelInfoWire;
  arena?: ArenaInfoWire;
  // More fields...
  [key: string]: unknown;
}

export interface InvSlotWire {
  item: string;
  count: number;
  quality?: number;
}

export interface QuestProgressWire {
  id: string;
  stage: string;
  progress: Record<string, number>;
}

export interface PartyMemberAuraWire {
  id: string;
  kind: string;
  neg?: 1;
}

export interface PartyMemberInfoWire {
  pid: number;
  name: string;
  cls: string;
  level: number;
  hp: number;
  mhp: number;
  res: number;
  mres: number;
  rtype: string | null;
  x: number;
  z: number;
  dead: number;
  inCombat: number;
  group: number;
  auras?: PartyMemberAuraWire[];
}

export interface PartyInfoWire {
  leader: number;
  raid?: boolean;
  master?: Record<string, unknown>;
  members: number[] | PartyMemberInfoWire[];
  lootMode?: string;
}

export interface TradeInfoWire {
  partner: number;
  myOffer: InvSlotWire[];
  theirOffer: InvSlotWire[];
  myAccept: boolean;
  theirAccept: boolean;
}

export interface DuelInfoWire {
  opponent: number;
  status: string;
  myScore: number;
  theirScore: number;
}

export interface ArenaInfoWire {
  match?: {
    id: string;
    status: string;
    myTeam: number[];
    enemyTeam: number[];
    myScore: number;
    enemyScore: number;
  };
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type SimEventWire =
  | { type: 'damage'; source: number; target: number; amount: number; ability?: string }
  | { type: 'heal'; source: number; target: number; amount: number; ability?: string }
  | { type: 'death'; target: number; killer?: number }
  | { type: 'loot'; item: string; count: number; quality?: number }
  | { type: 'xp'; amount: number; source?: string }
  | { type: 'levelUp'; level: number }
  | { type: 'chat'; fromPid: number; from: string; channel: string; message: string }
  | { type: 'emote'; entity: number; emote: string }
  | { type: 'abilityUsed'; source: number; ability: string; target?: number }
  | { type: 'auraApplied'; target: number; aura: string; stacks?: number }
  | { type: 'auraRemoved'; target: number; aura: string }
  | { type: 'questProgress'; quest: string; stage: string }
  | { type: 'questComplete'; quest: string }
  | { type: 'targetChanged'; entity: number; target?: number }
  | { type: 'partyInvite'; fromPid: number; fromName: string }
  | { type: 'tradeRequest'; fromPid: number; fromName: string }
  | { type: 'duelRequest'; fromPid: number; fromName: string }
  | { type: 'resourceChanged'; entity: number; resource: string; current: number; max: number }
  | { type: 'combatStart' }
  | { type: 'combatEnd' }
  | { type: 'spawn'; entity: number }
  | { type: 'despawn'; entity: number }
  | { type: string; [key: string]: unknown }; // Allow custom events

// ---------------------------------------------------------------------------
// Social
// ---------------------------------------------------------------------------

export interface SocialInfoWire {
  friends?: { id: number; name: string; online: boolean }[];
  blocked?: number[];
  guild?: {
    id: string;
    name: string;
    rank: string;
    members: { id: number; name: string; rank: string; online: boolean }[];
  };
}