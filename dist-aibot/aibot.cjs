"use strict";

// aibot/config.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var DEFAULTS = {
  serverUrl: "http://127.0.0.1:8787",
  wsUrlTemplate: "",
  ai: void 0,
  tickInterval: 50,
  reconnect: {
    maxAttempts: 10,
    baseDelayMs: 1e3,
    maxDelayMs: 3e4
  },
  logLevel: "info"
};
function computeWsUrl(serverUrl) {
  const wsProtocol = serverUrl.startsWith("https") ? "wss" : "ws";
  const wsHost = serverUrl.replace(/^https?:\/\//, "");
  return `${wsProtocol}://${wsHost}/ws`;
}
function loadConfigFile(path) {
  if (!(0, import_node_fs.existsSync)(path)) {
    throw new Error(`Config file not found: ${path}`);
  }
  const raw = (0, import_node_fs.readFileSync)(path, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.accounts || !Array.isArray(parsed.accounts) || parsed.accounts.length === 0) {
      throw new Error('Config file must contain a non-empty "accounts" array');
    }
    return parsed;
  } catch (e) {
    throw new Error(`Failed to parse config file ${path}: ${e}`);
  }
}
function validateAccount(acc, index) {
  if (!acc || typeof acc !== "object") {
    throw new Error(`Account ${index} is not an object`);
  }
  const a = acc;
  const username = a.username;
  const password = a.password;
  if (typeof username !== "string" || username.length === 0) {
    throw new Error(`Account ${index}: missing or invalid "username"`);
  }
  if (typeof password !== "string" || password.length === 0) {
    throw new Error(`Account ${index}: missing or invalid "password"`);
  }
  const behavior = a.behavior || "grinder";
  if (!["grinder", "quester", "social", "custom"].includes(behavior)) {
    throw new Error(`Account ${index}: invalid "behavior", must be grinder/quester/social/custom`);
  }
  return {
    name: typeof a.name === "string" && a.name.length > 0 ? a.name : `bot${index + 1}`,
    username,
    password,
    characterId: typeof a.characterId === "number" ? a.characterId : void 0,
    realmUrl: typeof a.realmUrl === "string" ? a.realmUrl : void 0,
    behavior,
    enableAIChat: a.enableAIChat === true,
    customScript: typeof a.customScript === "string" ? a.customScript : void 0
  };
}
function parseCliArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--") && i + 1 < argv.length) {
      const key = arg.slice(2);
      args[key] = argv[i + 1];
      i++;
    }
  }
  return args;
}
function loadFromEnv() {
  const serverUrl = process.env.AIBOT_SERVER_URL || DEFAULTS.serverUrl;
  return {
    serverUrl,
    wsUrlTemplate: process.env.AIBOT_WS_URL || computeWsUrl(serverUrl),
    accounts: parseEnvAccounts(),
    ai: process.env.AIBOT_AI_API_KEY ? {
      apiEndpoint: process.env.AIBOT_AI_API_ENDPOINT || "https://api.openai.com/v1",
      apiKey: process.env.AIBOT_AI_API_KEY,
      model: process.env.AIBOT_AI_MODEL || "gpt-4o-mini",
      systemPrompt: process.env.AIBOT_AI_SYSTEM_PROMPT || "You are a helpful MMO game player. Respond naturally and briefly to chat messages."
    } : void 0,
    tickInterval: parseInt(process.env.AIBOT_TICK_INTERVAL || String(DEFAULTS.tickInterval), 10),
    reconnect: {
      maxAttempts: parseInt(process.env.AIBOT_RECONNECT_MAX_ATTEMPTS || String(DEFAULTS.reconnect.maxAttempts), 10),
      baseDelayMs: parseInt(process.env.AIBOT_RECONNECT_BASE_DELAY_MS || String(DEFAULTS.reconnect.baseDelayMs), 10),
      maxDelayMs: parseInt(process.env.AIBOT_RECONNECT_MAX_DELAY_MS || String(DEFAULTS.reconnect.maxDelayMs), 10)
    },
    logLevel: process.env.AIBOT_LOG_LEVEL || DEFAULTS.logLevel
  };
}
function parseEnvAccounts() {
  const accountsEnv = process.env.AIBOT_ACCOUNTS;
  if (accountsEnv) {
    try {
      const parsed = JSON.parse(accountsEnv);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("AIBOT_ACCOUNTS must be a non-empty JSON array");
      }
      return parsed.map((acc, i) => validateAccount(acc, i));
    } catch (e) {
      throw new Error(`Failed to parse AIBOT_ACCOUNTS: ${e}`);
    }
  }
  const username = process.env.AIBOT_USERNAME;
  const password = process.env.AIBOT_PASSWORD;
  if (!username || !password) {
    throw new Error("Missing account config: set AIBOT_ACCOUNTS or AIBOT_USERNAME+AIBOT_PASSWORD");
  }
  return [validateAccount({
    name: process.env.AIBOT_NAME,
    username,
    password,
    characterId: process.env.AIBOT_CHARACTER_ID ? parseInt(process.env.AIBOT_CHARACTER_ID, 10) : void 0,
    realmUrl: process.env.AIBOT_REALM_URL,
    behavior: process.env.AIBOT_BEHAVIOR,
    enableAIChat: process.env.AIBOT_ENABLE_AI_CHAT === "true"
  }, 0)];
}
function loadConfig() {
  const args = parseCliArgs();
  const configPath = args.config ? (0, import_node_path.resolve)(args.config) : (0, import_node_path.resolve)("aibot", "config.json");
  if (args.config) {
    return finalizeConfig(loadConfigFile(configPath));
  }
  const hasEnvConfig = process.env.AIBOT_USERNAME || process.env.AIBOT_ACCOUNTS;
  if (hasEnvConfig) {
    return loadFromEnv();
  }
  if ((0, import_node_fs.existsSync)(configPath)) {
    return finalizeConfig(loadConfigFile(configPath));
  }
  throw new Error(
    "No configuration found. Create aibot/config.json, or set AIBOT_USERNAME+AIBOT_PASSWORD, or set AIBOT_ACCOUNTS. See aibot/README.md for examples."
  );
}
function finalizeConfig(file) {
  const serverUrl = file.serverUrl || DEFAULTS.serverUrl;
  return {
    serverUrl,
    wsUrlTemplate: file.wsUrlTemplate || computeWsUrl(serverUrl),
    accounts: file.accounts.map((acc, i) => validateAccount(acc, i)),
    ai: file.ai && file.ai.apiKey ? {
      apiEndpoint: file.ai.apiEndpoint || "https://api.openai.com/v1",
      apiKey: file.ai.apiKey,
      model: file.ai.model || "gpt-4o-mini",
      systemPrompt: file.ai.systemPrompt || "You are a helpful MMO game player. Respond naturally and briefly to chat messages."
    } : void 0,
    tickInterval: file.tickInterval || DEFAULTS.tickInterval,
    reconnect: {
      maxAttempts: file.reconnect?.maxAttempts ?? DEFAULTS.reconnect.maxAttempts,
      baseDelayMs: file.reconnect?.baseDelayMs ?? DEFAULTS.reconnect.baseDelayMs,
      maxDelayMs: file.reconnect?.maxDelayMs ?? DEFAULTS.reconnect.maxDelayMs
    },
    logLevel: file.logLevel || DEFAULTS.logLevel
  };
}

// aibot/client.ts
var BotClient = class {
  account;
  config;
  token = null;
  ws = null;
  state;
  onEvent;
  inputSeq = 0;
  moveInput = { f: 0, b: 0, tl: 0, tr: 0, sl: 0, sr: 0, j: 0 };
  facing = null;
  sendTimer = null;
  reconnectAttempts = 0;
  reconnectTimer = null;
  log;
  constructor(options) {
    this.account = options.account;
    this.config = options.config;
    this.onEvent = options.onEvent || (() => {
    });
    this.state = {
      connected: false,
      playerId: -1,
      realm: "",
      entities: /* @__PURE__ */ new Map(),
      self: null,
      events: []
    };
    this.log = (...args) => console.log(`[${this.account.name}]`, ...args);
  }
  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------
  /** Current world state (read-only). */
  getState() {
    return this.state;
  }
  /** Connect to the game server. */
  async connect() {
    this.log("connecting...");
    const token = await this.login();
    this.token = token;
    const characters = await this.getCharacters();
    if (characters.length === 0) {
      throw new Error("No characters available");
    }
    const charId = this.account.characterId || characters[0].id;
    this.log(`using character ${charId}`);
    await this.openWebSocket(charId);
  }
  /** Disconnect from the game server. */
  disconnect() {
    this.log("disconnecting...");
    this.clearTimers();
    if (this.ws) {
      this.ws.close(1e3, "client disconnect");
      this.ws = null;
    }
    this.state.connected = false;
    this.emit({ type: "disconnected", reason: "client disconnect" });
  }
  /** Set movement input. */
  setMoveInput(input) {
    Object.assign(this.moveInput, input);
  }
  /** Reset movement input (stop moving). */
  stopMoving() {
    this.moveInput = { f: 0, b: 0, tl: 0, tr: 0, sl: 0, sr: 0, j: 0 };
  }
  /** Set facing direction (radians). */
  setFacing(facing) {
    this.facing = facing;
  }
  /** Send a command to the server. */
  sendCommand(cmd, payload = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const msg = { t: "cmd", cmd, ...payload };
    this.ws.send(JSON.stringify(msg));
  }
  // -------------------------------------------------------------------------
  // REST API
  // -------------------------------------------------------------------------
  async login() {
    const res = await fetch(`${this.config.serverUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.account.username,
        password: this.account.password
      })
    });
    if (!res.ok) {
      const data2 = await res.json().catch(() => ({}));
      throw new Error(`login failed: ${data2.error || res.status}`);
    }
    const data = await res.json();
    this.log(`logged in as ${data.username}`);
    return data.token;
  }
  async getCharacters() {
    if (!this.token) throw new Error("not logged in");
    const res = await fetch(`${this.config.serverUrl}/api/characters`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    if (!res.ok) {
      throw new Error(`failed to get characters: ${res.status}`);
    }
    const data = await res.json();
    return data.characters || [];
  }
  // -------------------------------------------------------------------------
  // WebSocket
  // -------------------------------------------------------------------------
  async openWebSocket(characterId) {
    const wsUrl = this.config.wsUrlTemplate;
    this.log(`connecting to ${wsUrl}`);
    this.ws = new WebSocket(wsUrl);
    return new Promise((resolve2, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, 1e4);
      this.ws.onopen = () => {
        clearTimeout(timeout);
        this.log("WebSocket connected, authenticating...");
        const auth = {
          t: "auth",
          token: this.token,
          character: characterId
        };
        this.ws.send(JSON.stringify(auth));
        resolve2();
      };
      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };
      this.ws.onclose = (event) => {
        clearTimeout(timeout);
        this.handleClose(event.code, event.reason);
      };
      this.ws.onerror = (error) => {
        clearTimeout(timeout);
        this.log("WebSocket error:", error);
        reject(new Error("WebSocket error"));
      };
    });
  }
  handleMessage(raw) {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      this.log("failed to parse message:", raw);
      return;
    }
    switch (msg.t) {
      case "hello":
        this.handleHello(msg);
        break;
      case "snap":
        this.handleSnapshot(msg);
        break;
      case "events":
        this.handleEvents(msg);
        break;
      case "social":
        break;
      case "censor":
        break;
      case "error":
        this.log("server error:", msg.error);
        this.emit({ type: "error", error: msg.error });
        break;
    }
  }
  handleHello(msg) {
    this.state.playerId = msg.pid;
    this.state.realm = msg.realm || "";
    this.state.connected = true;
    this.reconnectAttempts = 0;
    this.log(`authenticated as player ${msg.pid} in realm ${msg.realm}`);
    this.emit({ type: "authenticated", playerId: msg.pid });
    this.startInputLoop();
  }
  handleSnapshot(msg) {
    const { ents, self, keep } = msg;
    const newEntities = /* @__PURE__ */ new Map();
    if (keep) {
      for (const id of keep) {
        const existing = this.state.entities.get(id);
        if (existing) newEntities.set(id, existing);
      }
    }
    for (const ent of ents) {
      if (ent.id === void 0) continue;
      const existing = newEntities.get(ent.id);
      if (existing) {
        newEntities.set(ent.id, { ...existing, ...ent });
      } else {
        newEntities.set(ent.id, ent);
      }
    }
    this.state.entities = newEntities;
    if (self) {
      if (this.state.self) {
        this.state.self = { ...this.state.self, ...self };
      } else {
        this.state.self = self;
      }
    }
    const events = [...this.state.events];
    this.state.events = [];
    this.emit({ type: "snapshot", state: { ...this.state, events } });
  }
  handleEvents(msg) {
    for (const event of msg.events) {
      this.state.events.push(event);
      this.emit({ type: "event", event });
    }
  }
  handleClose(code, reason) {
    this.clearTimers();
    this.state.connected = false;
    this.log(`WebSocket closed: ${code} ${reason}`);
    if (this.reconnectAttempts < this.config.reconnect.maxAttempts) {
      this.scheduleReconnect();
    } else {
      this.emit({ type: "disconnected", reason: reason || "connection lost" });
    }
  }
  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(
      this.config.reconnect.baseDelayMs * Math.pow(2, this.reconnectAttempts - 1),
      this.config.reconnect.maxDelayMs
    );
    this.log(`reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((err) => {
        this.log("reconnect failed:", err);
      });
    }, delay);
  }
  // -------------------------------------------------------------------------
  // Input sending
  // -------------------------------------------------------------------------
  startInputLoop() {
    if (this.sendTimer) clearInterval(this.sendTimer);
    this.sendTimer = setInterval(() => this.sendInput(), this.config.tickInterval);
  }
  sendInput() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (!this.state.connected) return;
    const msg = {
      t: "input",
      seq: ++this.inputSeq,
      mi: { ...this.moveInput }
    };
    if (this.facing !== null) msg.facing = this.facing;
    this.ws.send(JSON.stringify(msg));
  }
  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  clearTimers() {
    if (this.sendTimer) {
      clearInterval(this.sendTimer);
      this.sendTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  emit(event) {
    try {
      this.onEvent(event);
    } catch (err) {
      this.log("event handler error:", err);
    }
  }
};

// aibot/roles.ts
var ROLE_TABLE = {
  // Warrior
  "warrior/arms": "dps",
  "warrior/fury": "dps",
  "warrior/prot": "tank",
  // Paladin
  "paladin/holy": "healer",
  "paladin/protection": "tank",
  "paladin/retribution": "dps",
  // Hunter
  "hunter/beast_mastery": "dps",
  "hunter/marksmanship": "dps",
  "hunter/survival": "dps",
  // Rogue
  "rogue/assassination": "dps",
  "rogue/combat": "dps",
  "rogue/subtlety": "dps",
  // Priest
  "priest/discipline": "healer",
  "priest/holy": "healer",
  "priest/shadow": "dps",
  // Shaman
  "shaman/elemental": "dps",
  "shaman/enhancement": "dps",
  "shaman/restoration": "healer",
  // Mage
  "mage/arcane": "dps",
  "mage/fire": "dps",
  "mage/frost": "dps",
  // Warlock
  "warlock/affliction": "dps",
  "warlock/demonology": "dps",
  "warlock/destruction": "dps",
  // Druid
  "druid/balance": "dps",
  "druid/feral": "tank",
  "druid/restoration": "healer"
};
function getRole(classType, spec) {
  if (!spec) {
    switch (classType) {
      case "warrior":
      case "paladin":
      case "druid":
        return "dps";
      // ambiguous without spec; default to dps to avoid false tanking
      case "priest":
      case "shaman":
        return "healer";
      // ambiguous without spec; default to healer
      default:
        return "dps";
    }
  }
  const key = `${classType}/${spec}`;
  return ROLE_TABLE[key] || "dps";
}
function getRotation(classType, spec) {
  const role = getRole(classType, spec);
  const key = spec ? `${classType}/${spec}` : classType;
  if (role === "tank") {
    if (classType === "warrior") {
      return {
        taunt: ["taunt"],
        builder: ["sunder_armor"],
        spender: ["shield_slam", "revenge"],
        defensive: ["defensive_stance", "ironhold"],
        filler: ["heroic_strike", "attack"]
      };
    }
    if (classType === "paladin") {
      return {
        taunt: ["holy_taunt"],
        builder: ["righteous_fury"],
        spender: ["shield_slam", "crusader_strike"],
        defensive: ["devotion_aura"],
        filler: ["attack"]
      };
    }
    if (classType === "druid") {
      return {
        opening: ["bear_form"],
        taunt: ["growl"],
        builder: ["maul"],
        spender: ["swipe"],
        defensive: ["barkskin"],
        filler: ["attack"]
      };
    }
  }
  if (role === "healer") {
    if (classType === "priest") {
      return {
        singleTargetHeal: ["flash_heal", "heal", "greater_heal"],
        hot: ["renew"],
        partyBuff: ["power_word_fortitude"],
        selfBuff: ["inner_fire"],
        filler: ["smite"]
      };
    }
    if (classType === "paladin") {
      return {
        singleTargetHeal: ["holy_light", "flash_of_light", "holy_shock"],
        partyBuff: ["blessing_of_might", "devotion_aura"],
        filler: ["crusader_strike"]
      };
    }
    if (classType === "druid") {
      return {
        singleTargetHeal: ["healing_touch", "swiftmend"],
        hot: ["rejuvenation", "regrowth", "lifebloom"],
        partyBuff: ["mark_of_the_wild"],
        filler: ["wrath"]
      };
    }
    if (classType === "shaman") {
      return {
        singleTargetHeal: ["healing_wave", "chain_heal", "lesser_healing_wave"],
        hot: ["riptide"],
        selfBuff: ["lightning_shield", "water_shield"],
        filler: ["lightning_bolt"]
      };
    }
  }
  switch (key) {
    case "warrior/arms":
      return {
        opening: ["charge"],
        builder: ["sunder_armor"],
        spender: ["mortal_strike", "overpower"],
        filler: ["heroic_strike", "attack"]
      };
    case "warrior/fury":
      return {
        opening: ["charge"],
        spender: ["bloodthirst", "whirlwind"],
        filler: ["heroic_strike", "attack"]
      };
    case "paladin/retribution":
      return {
        builder: ["seal_of_command"],
        spender: ["crusader_strike", "judgement_of_command"],
        filler: ["attack"]
      };
    case "hunter/beast_mastery":
      return {
        summonPet: ["pet_revive"],
        opening: ["hunters_mark", "bestial_wrath"],
        builder: ["serpent_sting"],
        spender: ["kill_command", "arcane_shot"],
        filler: ["steady_shot"]
      };
    case "hunter/marksmanship":
      return {
        summonPet: ["pet_revive"],
        opening: ["hunters_mark", "trueshot_aura"],
        builder: ["serpent_sting", "aimed_shot"],
        spender: ["chimera_shot", "arcane_shot"],
        filler: ["steady_shot"]
      };
    case "hunter/survival":
      return {
        summonPet: ["pet_revive"],
        opening: ["hunters_mark"],
        builder: ["serpent_sting", "explosive_shot"],
        spender: ["black_arrow", "aimed_shot"],
        filler: ["steady_shot"]
      };
    case "rogue/assassination":
      return {
        opening: ["garrote", "slice_and_dice"],
        builder: ["mutilate"],
        spender: ["envenom", "rupture"],
        filler: ["attack"]
      };
    case "rogue/combat":
      return {
        opening: ["slice_and_dice"],
        builder: ["sinister_strike"],
        spender: ["eviscerate", "blade_flurry"],
        filler: ["attack"]
      };
    case "rogue/subtlety":
      return {
        opening: ["premeditation", "ambush", "slice_and_dice"],
        builder: ["backstab", "hemorrhage"],
        spender: ["eviscerate", "rupture"],
        filler: ["attack"]
      };
    case "priest/shadow":
      return {
        opening: ["shadowform"],
        builder: ["vampiric_touch", "shadow_word_pain", "devouring_plague"],
        spender: ["mind_blast", "mind_flay"],
        filler: ["smite"]
      };
    case "shaman/elemental":
      return {
        builder: ["flame_shock"],
        spender: ["lightning_bolt", "chain_lightning", "lava_burst"],
        selfBuff: ["lightning_shield"],
        filler: ["earth_shock"]
      };
    case "shaman/enhancement":
      return {
        opening: ["ghost_wolf"],
        selfBuff: ["rockbiter_weapon", "flametongue_weapon"],
        spender: ["stormstrike", "lava_lash", "shock"],
        filler: ["attack"]
      };
    case "mage/arcane":
      return {
        opening: ["arcane_intellect"],
        builder: ["arcane_missiles"],
        spender: ["arcane_barrage", "arcane_power"],
        filler: ["fireball"]
      };
    case "mage/fire":
      return {
        builder: ["pyroblast", "living_bomb"],
        spender: ["fireball", "fire_blast", "combustion"],
        filler: ["scorch"]
      };
    case "mage/frost":
      return {
        builder: ["frostbolt"],
        spender: ["ice_lance", "frostfire_bolt", "icy_veins"],
        filler: ["fireball"]
      };
    case "warlock/affliction":
      return {
        summonPet: ["summon_felguard"],
        builder: ["curse_of_agony", "corruption", "unstable_affliction"],
        spender: ["shadow_bolt", "haunt", "drain_soul"],
        filler: ["shadow_bolt"]
      };
    case "warlock/demonology":
      return {
        summonPet: ["summon_felguard"],
        opening: ["metamorphosis"],
        builder: ["curse_of_agony", "corruption"],
        spender: ["shadow_bolt", "soul_fire"],
        filler: ["shadow_bolt"]
      };
    case "warlock/destruction":
      return {
        summonPet: ["summon_imp"],
        builder: ["immolate", "curse_of_elements"],
        spender: ["chaos_bolt", "conflagrate", "incinerate"],
        filler: ["shadow_bolt"]
      };
    case "druid/balance":
      return {
        opening: ["moonkin_form"],
        builder: ["moonfire", "insect_swarm"],
        spender: ["starfire", "wrath", "starsurge"],
        filler: ["wrath"]
      };
    case "druid/feral":
      return {
        opening: ["cat_form"],
        builder: ["rake", "shred"],
        spender: ["ferocious_bite", "rip", "savage_roar"],
        filler: ["attack"]
      };
    default:
      return {
        filler: ["attack"]
      };
  }
}
function isHealer(classType, spec) {
  return getRole(classType, spec) === "healer";
}

// aibot/perception.ts
function parsePerception(state) {
  const self = state.self ? parseSelf(state.self, state.playerId) : null;
  const entities = [];
  for (const [id, wire] of state.entities) {
    if (id === state.playerId) continue;
    entities.push(parseEntity(wire, self?.position));
  }
  const nearbyHostiles = entities.filter((e) => e.isHostile && !e.isDead);
  const nearbyFriendlies = entities.filter((e) => !e.isHostile && !e.isDead);
  const nearbyPlayers = entities.filter((e) => e.isPlayer && !e.isDead);
  const nearbyNpcs = entities.filter((e) => e.isNpc && !e.isDead);
  const currentTarget = self?.targetId ? entities.find((e) => e.id === self.targetId) || null : null;
  const events = state.events;
  const pendingInvites = [];
  const chatMessages = [];
  for (const event of events) {
    if (event.kind === "partyInvite") {
      pendingInvites.push({ type: "party", from: event.inviter, name: event.inviterName });
    } else if (event.kind === "tradeRequest") {
      pendingInvites.push({ type: "trade", from: event.requester, name: event.requesterName });
    } else if (event.kind === "duelRequest") {
      pendingInvites.push({ type: "duel", from: event.requester, name: event.requesterName });
    } else if (event.kind === "chat") {
      chatMessages.push({
        sender: event.sender,
        senderName: event.senderName,
        channel: event.channel,
        message: event.message
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
    chatMessages
  };
}
function parseEntity(wire, selfPos) {
  const kind = wire.k === "player" ? "player" : wire.k === "npc" ? "npc" : wire.k === "pet" ? "pet" : "unknown";
  const position = {
    x: wire.x ?? 0,
    y: wire.y ?? 0,
    z: wire.z ?? 0
  };
  const distance = selfPos ? distance3D(selfPos, position) : 0;
  const isPet = kind === "pet";
  const ownerId = wire.own ?? null;
  return {
    id: wire.id,
    kind,
    typeId: wire.tid ?? "",
    name: wire.nm ?? "",
    level: wire.lv ?? 1,
    ownerId,
    isPet,
    position,
    facing: wire.f ?? 0,
    hp: wire.hp ?? 0,
    maxHp: wire.mhp ?? 0,
    isDead: wire.dead ?? false,
    isPlayer: kind === "player",
    isNpc: kind === "npc",
    isHostile: kind === "npc" && !wire.dead,
    // Simplified: all NPCs are potentially hostile
    targetId: wire.target ?? null,
    distance
  };
}
function parseSelf(wire, playerId) {
  const position = {
    x: wire.x ?? 0,
    y: wire.y ?? 0,
    z: wire.z ?? 0
  };
  const resources = {};
  if (wire.res) {
    for (const [key, value] of Object.entries(wire.res)) {
      resources[key] = { current: value, max: value };
    }
  }
  const questLog = /* @__PURE__ */ new Map();
  if (wire.qlog) {
    for (const q of wire.qlog) {
      questLog.set(q.id, { stage: q.stage, progress: q.progress });
    }
  }
  const classType = wire.tid ?? "";
  const spec = wire.tspec ?? null;
  return {
    id: playerId,
    name: wire.nm ?? "",
    level: wire.lv ?? 1,
    class: classType,
    spec,
    role: wire.trole ? wire.trole : getRole(classType, spec),
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
    inCombat: wire.target !== void 0 && wire.target !== null,
    partyInfo: wire.party ? parsePartyInfo(wire.party) : null
  };
}
function parsePartyInfo(wire) {
  const memberIds = [];
  const members = [];
  for (const m of wire.members) {
    if (typeof m === "number") {
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
      auras: (m.auras ?? []).map((a) => ({
        id: a.id,
        kind: a.kind,
        neg: a.neg
      }))
    });
  }
  return {
    leader: wire.leader,
    members,
    memberIds,
    lootMode: wire.lootMode
  };
}
function distance3D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function findNearestHostile(perception) {
  if (perception.nearbyHostiles.length === 0) return null;
  return perception.nearbyHostiles.reduce(
    (nearest, e) => e.distance < nearest.distance ? e : nearest
  );
}
function isInRange(self, target, range) {
  return target.distance <= range;
}
function isLowHealth(target, threshold = 0.3) {
  return target.hp / target.maxHp < threshold;
}

// aibot/brain.ts
var Brain = class {
  state = "idle";
  target = null;
  healTarget = null;
  buffTarget = null;
  pendingBuff = null;
  lastBuffCheck = 0;
  lastStateChange = Date.now();
  stateData = {};
  client;
  handlers = /* @__PURE__ */ new Map();
  constructor(client) {
    this.client = client;
    this.handlers.set("idle", this.handleIdle.bind(this));
    this.handlers.set("moving_to_target", this.handleMovingToTarget.bind(this));
    this.handlers.set("engaging", this.handleEngaging.bind(this));
    this.handlers.set("fighting", this.handleFighting.bind(this));
    this.handlers.set("looting", this.handleLooting.bind(this));
    this.handlers.set("returning_to_town", this.handleReturningToTown.bind(this));
    this.handlers.set("resting", this.handleResting.bind(this));
    this.handlers.set("socializing", this.handleSocializing.bind(this));
    this.handlers.set("healing_ally", this.handleHealingAlly.bind(this));
    this.handlers.set("buffing_ally", this.handleBuffingAlly.bind(this));
    this.handlers.set("following_leader", this.handleFollowingLeader.bind(this));
  }
  /** Get current state. */
  getState() {
    return this.state;
  }
  /** Main tick - called every game tick to update behavior. */
  tick(perception) {
    const ctx = {
      client: this.client,
      perception,
      state: this.state,
      target: this.target,
      lastStateChange: this.lastStateChange,
      stateData: this.stateData
    };
    const handler = this.handlers.get(this.state);
    if (!handler) return;
    const transition = handler(ctx);
    if (transition) {
      this.transition(transition);
    }
  }
  transition(transition) {
    const oldState = this.state;
    this.state = transition.nextState;
    this.lastStateChange = Date.now();
    if (oldState !== transition.nextState) {
      console.log(`[${this.client.account.name}] state: ${oldState} -> ${transition.nextState}`);
    }
    if (transition.action) {
      transition.action();
    }
  }
  // -------------------------------------------------------------------------
  // State handlers
  // -------------------------------------------------------------------------
  handleIdle(ctx) {
    const { perception } = ctx;
    if (!perception.self) return null;
    const self = perception.self;
    const role = self.role ?? "dps";
    if (perception.pendingInvites.length > 0) {
      return { nextState: "socializing" };
    }
    if (role === "healer") {
      const woundedAlly = this.findWoundedPartyMember(perception);
      if (woundedAlly) {
        this.healTarget = woundedAlly;
        return { nextState: "healing_ally" };
      }
    }
    const buffNeed = this.findBuffNeed(perception);
    if (buffNeed) {
      this.buffTarget = buffNeed.member;
      this.pendingBuff = buffNeed.buff;
      this.stateData["buffSelfOnly"] = buffNeed.selfOnly;
      return { nextState: "buffing_ally" };
    }
    if (isLowHealth(self, 0.2)) {
      return { nextState: "resting" };
    }
    if (!this.hasPet(perception)) {
      if (this.trySummonPet(self)) {
        return null;
      }
    }
    const nearestHostile = findNearestHostile(perception);
    if (nearestHostile) {
      if (role === "tank") {
        this.target = nearestHostile;
        return {
          nextState: "engaging",
          action: () => this.client.sendCommand("target", { target: nearestHostile.id })
        };
      }
      if (nearestHostile.targetId === self.id || nearestHostile.distance < 8) {
        this.target = nearestHostile;
        return {
          nextState: "engaging",
          action: () => this.client.sendCommand("target", { target: nearestHostile.id })
        };
      }
    }
    const leader = this.findPartyLeader(perception);
    if (leader && this.getLeaderId(leader) !== self.id) {
      const distance = this.distanceToLeader(self, leader);
      if (distance > 25) {
        return { nextState: "following_leader" };
      }
    }
    return null;
  }
  handleEngaging(ctx) {
    const { perception } = ctx;
    const target = this.target;
    if (!perception.self) return { nextState: "idle" };
    const self = perception.self;
    const role = self.role ?? "dps";
    if (!target || target.isDead) {
      this.target = null;
      return { nextState: "idle" };
    }
    if (role === "healer") {
      const woundedAlly = this.findWoundedPartyMember(perception);
      if (woundedAlly) {
        this.healTarget = woundedAlly;
        return { nextState: "healing_ally", action: () => this.client.stopMoving() };
      }
    }
    const meleeRange = role === "tank" ? 5 : 3;
    if (isInRange(self, target, meleeRange)) {
      return { nextState: "fighting" };
    }
    this.moveTowardsEntity(ctx, target);
    const updatedTarget = perception.entities.find((e) => e.id === target.id);
    if (updatedTarget) {
      this.target = updatedTarget;
    }
    return null;
  }
  handleFighting(ctx) {
    const { perception } = ctx;
    const target = this.target;
    if (!perception.self) return { nextState: "idle" };
    const self = perception.self;
    const role = self.role ?? "dps";
    if (role === "healer") {
      const woundedAlly = this.findWoundedPartyMember(perception);
      if (woundedAlly) {
        this.healTarget = woundedAlly;
        return { nextState: "healing_ally" };
      }
    }
    if (role !== "tank" && isLowHealth(self, 0.15)) {
      return { nextState: "resting", action: () => this.client.stopMoving() };
    }
    if (!target || target.isDead) {
      this.target = null;
      return { nextState: "looting" };
    }
    if (target.distance > 40) {
      this.target = null;
      return { nextState: "idle" };
    }
    if (role === "dps" && this.isRangedRole(self)) {
      if (target.distance < 8) {
        this.moveAwayFromEntity(ctx, target);
        return null;
      }
      this.client.stopMoving();
    }
    if (role === "tank") {
      this.performTankRotation(ctx, self, target);
    } else if (role === "healer") {
      this.performCombatRotation(ctx, self, target);
    } else {
      this.performCombatRotation(ctx, self, target);
    }
    return null;
  }
  handleHealingAlly(ctx) {
    const { perception } = ctx;
    if (!perception.self) return { nextState: "idle" };
    const target = this.healTarget;
    if (!target) return { nextState: "idle" };
    const updatedTarget = perception.entities.find((e) => e.id === target.id);
    this.healTarget = updatedTarget || target;
    if (!this.healTarget || this.healTarget.isDead) {
      this.healTarget = null;
      return { nextState: "idle" };
    }
    if (!isLowHealth(this.healTarget, 0.6)) {
      this.healTarget = null;
      return { nextState: "idle" };
    }
    if (this.healTarget.distance > 30) {
      this.moveTowardsEntity(ctx, this.healTarget);
      return null;
    }
    this.client.stopMoving();
    this.client.sendCommand("target", { target: this.healTarget.id });
    this.performHealingRotation(perception.self, this.healTarget);
    return null;
  }
  handleBuffingAlly(ctx) {
    const { perception } = ctx;
    if (!perception.self) return { nextState: "idle" };
    const target = this.buffTarget;
    const buff = this.pendingBuff;
    if (!target || !buff) return { nextState: "idle" };
    const updatedMember = perception.self.partyInfo?.members.find((m) => m.pid === target.pid);
    this.buffTarget = updatedMember || target;
    if (!this.buffTarget || this.buffTarget.dead) {
      this.buffTarget = null;
      this.pendingBuff = null;
      return { nextState: "idle" };
    }
    if (this.hasAura(this.buffTarget, buff)) {
      this.buffTarget = null;
      this.pendingBuff = null;
      return { nextState: "idle" };
    }
    const selfOnly = this.stateData["buffSelfOnly"] === true;
    const self = perception.self;
    const distance2D = Math.sqrt(
      Math.pow(this.buffTarget.x - self.position.x, 2) + Math.pow(this.buffTarget.z - self.position.z, 2)
    );
    if (distance2D > 30 && !selfOnly) {
      this.moveTowardsPartyMember(ctx, this.buffTarget);
      return null;
    }
    this.client.stopMoving();
    if (selfOnly) {
      this.client.sendCommand("useAbility", { ability: buff, target: this.buffTarget.pid });
    } else {
      this.client.sendCommand("target", { target: this.buffTarget.pid });
      this.client.sendCommand("useAbility", { ability: buff, target: this.buffTarget.pid });
    }
    this.buffTarget = null;
    this.pendingBuff = null;
    return { nextState: "idle" };
  }
  handleFollowingLeader(ctx) {
    const { perception } = ctx;
    if (!perception.self) return { nextState: "idle" };
    const self = perception.self;
    const role = self.role ?? "dps";
    if (perception.pendingInvites.length > 0) {
      return { nextState: "socializing" };
    }
    if (role === "healer") {
      const woundedAlly = this.findWoundedPartyMember(perception);
      if (woundedAlly) {
        this.healTarget = woundedAlly;
        return { nextState: "healing_ally" };
      }
    }
    const buffNeed = this.findBuffNeed(perception);
    if (buffNeed) {
      this.buffTarget = buffNeed.member;
      this.pendingBuff = buffNeed.buff;
      this.stateData["buffSelfOnly"] = buffNeed.selfOnly;
      return { nextState: "buffing_ally" };
    }
    if (isLowHealth(self, 0.2)) {
      return { nextState: "resting" };
    }
    if (!this.hasPet(perception)) {
      if (this.trySummonPet(self)) {
        return null;
      }
    }
    const nearestHostile = findNearestHostile(perception);
    if (nearestHostile) {
      if (role === "tank") {
        this.target = nearestHostile;
        return {
          nextState: "engaging",
          action: () => this.client.sendCommand("target", { target: nearestHostile.id })
        };
      }
      if (nearestHostile.targetId === self.id || nearestHostile.distance < 8) {
        this.target = nearestHostile;
        return {
          nextState: "engaging",
          action: () => this.client.sendCommand("target", { target: nearestHostile.id })
        };
      }
    }
    const leader = this.findPartyLeader(perception);
    if (!leader || this.getLeaderId(leader) === self.id) {
      return { nextState: "idle" };
    }
    const distance = this.distanceToLeader(self, leader);
    if (distance <= 10) {
      this.client.stopMoving();
      return { nextState: "idle" };
    }
    this.moveTowardsLeader(ctx, leader);
    return null;
  }
  handleLooting(ctx) {
    const { perception } = ctx;
    this.stateData["petModeSet"] = false;
    const lootEvents = perception.events.filter((e) => e.kind === "loot");
    if (lootEvents.length === 0) {
      return { nextState: "idle" };
    }
    const timeInState = Date.now() - this.lastStateChange;
    if (timeInState > 500) {
      return { nextState: "idle" };
    }
    return null;
  }
  handleResting(ctx) {
    const { perception } = ctx;
    if (!perception.self) return { nextState: "idle" };
    if (!isLowHealth(perception.self, 0.8)) {
      return { nextState: "idle" };
    }
    const nearestHostile = findNearestHostile(perception);
    if (nearestHostile && nearestHostile.distance < 10) {
      this.target = nearestHostile;
      return { nextState: "engaging" };
    }
    this.client.stopMoving();
    return null;
  }
  handleReturningToTown(ctx) {
    return { nextState: "idle" };
  }
  handleMovingToTarget(ctx) {
    return { nextState: "idle" };
  }
  handleSocializing(ctx) {
    const { perception } = ctx;
    if (perception.pendingInvites.length > 0) {
      const invite = perception.pendingInvites[0];
      if (invite.type === "party") {
        this.client.sendCommand("paccept");
      } else if (invite.type === "duel") {
        this.client.sendCommand("pdecline");
      }
    }
    if (perception.chatMessages.length > 0) {
    }
    return { nextState: "idle" };
  }
  // -------------------------------------------------------------------------
  // Party / healing helpers
  // -------------------------------------------------------------------------
  findWoundedPartyMember(perception) {
    if (!perception.self) return null;
    if (!isHealer(perception.self.class, perception.self.spec)) return null;
    const partyMembers = perception.nearbyFriendlies.filter((e) => this.isPartyMember(perception, e));
    const wounded = partyMembers.filter((e) => isLowHealth(e, 0.5));
    if (wounded.length === 0) return null;
    return wounded.reduce(
      (mostWounded, e) => e.hp / e.maxHp < mostWounded.hp / mostWounded.maxHp ? e : mostWounded
    );
  }
  isPartyMember(perception, entity) {
    if (!perception.self || !perception.self.partyInfo) return false;
    return perception.self.partyInfo.memberIds.includes(entity.id);
  }
  findPartyLeader(perception) {
    if (!perception.self || !perception.self.partyInfo) return null;
    const leaderId = perception.self.partyInfo.leader;
    if (leaderId === perception.self.id) return null;
    const member = perception.self.partyInfo.members.find((m) => m.pid === leaderId);
    if (member) return member;
    return perception.nearbyFriendlies.find((e) => e.id === leaderId) ?? null;
  }
  getLeaderId(leader) {
    return "pid" in leader ? leader.pid : leader.id;
  }
  distanceToLeader(self, leader) {
    if ("position" in leader) {
      const dx2 = leader.position.x - self.position.x;
      const dz2 = leader.position.z - self.position.z;
      return Math.sqrt(dx2 * dx2 + dz2 * dz2);
    }
    const dx = leader.x - self.position.x;
    const dz = leader.z - self.position.z;
    return Math.sqrt(dx * dx + dz * dz);
  }
  moveTowardsLeader(ctx, leader) {
    const self = ctx.perception.self;
    if (!self) return;
    const targetX = "position" in leader ? leader.position.x : leader.x;
    const targetZ = "position" in leader ? leader.position.z : leader.z;
    const dx = targetX - self.position.x;
    const dz = targetZ - self.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance > 1) {
      const facing = Math.atan2(dx, dz);
      this.client.setFacing(facing);
      this.client.setMoveInput({ f: 1 });
    } else {
      this.client.stopMoving();
    }
  }
  findBuffNeed(perception) {
    if (!perception.self) return null;
    const partyInfo = perception.self.partyInfo;
    if (!partyInfo || partyInfo.members.length === 0) return null;
    const now = Date.now();
    if (now - this.lastBuffCheck < 5e3) return null;
    this.lastBuffCheck = now;
    const rotation = getRotation(perception.self.class, perception.self.spec);
    const selfBuffs = rotation.selfBuff ?? [];
    const partyBuffs = rotation.partyBuff ?? [];
    const selfMember = partyInfo.members.find((m) => m.pid === perception.self.id);
    if (selfMember && !selfMember.dead) {
      for (const buff of selfBuffs) {
        if (!this.hasAura(selfMember, buff)) {
          return { member: selfMember, buff, selfOnly: true };
        }
      }
    }
    for (const buff of partyBuffs) {
      if (selfMember && !selfMember.dead && !this.hasAura(selfMember, buff)) {
        return { member: selfMember, buff, selfOnly: false };
      }
      for (const member of partyInfo.members) {
        if (member.pid === perception.self.id) continue;
        if (member.dead) continue;
        if (!this.hasAura(member, buff)) {
          return { member, buff, selfOnly: false };
        }
      }
    }
    return null;
  }
  hasAura(member, auraId) {
    return member.auras.some((a) => a.id === auraId);
  }
  hasPet(perception) {
    if (!perception.self) return true;
    return perception.entities.some(
      (e) => e.isPet && e.ownerId === perception.self.id && !e.isDead
    );
  }
  trySummonPet(self) {
    const rotation = getRotation(self.class, self.spec);
    const summonActions = rotation.summonPet ?? [];
    for (const action of summonActions) {
      if (action === "pet_revive") {
        const now = Date.now();
        const last = this.stateData["lastPetReviveAttempt"] ?? 0;
        if (now - last < 1e4) continue;
        this.stateData["lastPetReviveAttempt"] = now;
        this.client.sendCommand("pet_revive");
        console.log(`[${this.client.account.name}] reviving pet`);
        return true;
      }
      if (this.useAbilityIfReady(self, action, self.id)) {
        console.log(`[${this.client.account.name}] summoning pet: ${action}`);
        return true;
      }
    }
    return false;
  }
  sendPetAttack(targetId) {
    this.client.sendCommand("target", { target: targetId });
    this.client.sendCommand("pet_attack");
  }
  sendPetTaunt() {
    this.client.sendCommand("pet_taunt");
  }
  setPetMode(mode) {
    this.client.sendCommand("pet_mode", { mode });
  }
  setPetAutoTaunt(enabled) {
    this.client.sendCommand("pet_auto_taunt", { enabled });
  }
  isTankPet(petTypeId) {
    const tankPetIds = ["voidwalker", "gloomshade", "felguard", "warfiend", "pyre_colossus", "bear"];
    return tankPetIds.some((id) => petTypeId.toLowerCase().includes(id));
  }
  controlPet(ctx, self, target) {
    const pet = ctx.perception.entities.find(
      (e) => e.isPet && e.ownerId === self.id && !e.isDead
    );
    if (!pet) return;
    if (!this.stateData["petModeSet"]) {
      this.setPetMode("defensive");
      this.stateData["petModeSet"] = true;
    }
    const now = Date.now();
    const lastAttack = this.stateData["lastPetAttack"] ?? 0;
    if (now - lastAttack > 2e3) {
      this.stateData["lastPetAttack"] = now;
      this.sendPetAttack(target.id);
    }
    if (this.isTankPet(pet.typeId) && target.targetId && target.targetId !== pet.id) {
      const lastTaunt = this.stateData["lastPetTaunt"] ?? 0;
      if (now - lastTaunt > 6e3) {
        this.stateData["lastPetTaunt"] = now;
        this.sendPetTaunt();
      }
    }
  }
  isRangedRole(self) {
    const cls = self.class;
    const spec = self.spec;
    return cls === "mage" || cls === "warlock" || cls === "hunter" || cls === "priest" && spec === "shadow" || cls === "shaman" && spec === "elemental" || cls === "druid" && spec === "balance";
  }
  // -------------------------------------------------------------------------
  // Action helpers
  // -------------------------------------------------------------------------
  moveTowardsEntity(ctx, target) {
    const self = ctx.perception.self;
    if (!self) return;
    const dx = target.position.x - self.position.x;
    const dz = target.position.z - self.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance > 1) {
      const facing = Math.atan2(dx, dz);
      this.client.setFacing(facing);
      this.client.setMoveInput({ f: 1 });
    } else {
      this.client.stopMoving();
    }
  }
  moveAwayFromEntity(ctx, target) {
    const self = ctx.perception.self;
    if (!self) return;
    const dx = self.position.x - target.position.x;
    const dz = self.position.z - target.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance < 20) {
      const facing = Math.atan2(dx, dz);
      this.client.setFacing(facing);
      this.client.setMoveInput({ f: 1 });
    } else {
      this.client.stopMoving();
    }
  }
  moveTowardsPartyMember(ctx, target) {
    const self = ctx.perception.self;
    if (!self) return;
    const dx = target.x - self.position.x;
    const dz = target.z - self.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance > 1) {
      const facing = Math.atan2(dx, dz);
      this.client.setFacing(facing);
      this.client.setMoveInput({ f: 1 });
    } else {
      this.client.stopMoving();
    }
  }
  useAbilityIfReady(self, ability, targetId) {
    if (!ability) return false;
    if (self.cooldowns[ability]) return false;
    this.client.sendCommand("useAbility", { ability, target: targetId });
    return true;
  }
  // -------------------------------------------------------------------------
  // Combat rotations
  // -------------------------------------------------------------------------
  performTankRotation(ctx, self, target) {
    const rotation = getRotation(self.class, self.spec);
    this.client.sendCommand("target", { target: target.id });
    if (rotation.opening) {
      for (const ability of rotation.opening) {
        if (this.useAbilityIfReady(self, ability, self.id)) return;
      }
    }
    if (target.targetId && target.targetId !== self.id) {
      for (const ability of rotation.taunt ?? []) {
        if (this.useAbilityIfReady(self, ability, target.id)) return;
      }
    }
    for (const ability of rotation.builder ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
    for (const ability of rotation.spender ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
    if (isLowHealth(self, 0.5)) {
      for (const ability of rotation.defensive ?? []) {
        if (this.useAbilityIfReady(self, ability, self.id)) return;
      }
    }
    for (const ability of rotation.filler ?? ["attack"]) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
  }
  performCombatRotation(ctx, self, target) {
    const rotation = getRotation(self.class, self.spec);
    this.client.sendCommand("target", { target: target.id });
    if (rotation.summonPet && !this.hasPet(ctx.perception)) {
      if (this.trySummonPet(self)) return;
    }
    if (rotation.summonPet) {
      this.controlPet(ctx, self, target);
    }
    if (target.targetId && target.targetId !== self.id) {
    } else {
      for (const ability of rotation.opening ?? []) {
        if (this.useAbilityIfReady(self, ability, target.id)) return;
      }
    }
    for (const ability of rotation.selfBuff ?? []) {
      if (this.useAbilityIfReady(self, ability, self.id)) return;
    }
    for (const ability of rotation.builder ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
    for (const ability of rotation.spender ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
    for (const ability of rotation.filler ?? ["attack"]) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
  }
  performHealingRotation(self, target) {
    const rotation = getRotation(self.class, self.spec);
    if (!isLowHealth(target, 0.35)) {
      for (const ability of rotation.hot ?? []) {
        if (this.useAbilityIfReady(self, ability, target.id)) return;
      }
    }
    for (const ability of rotation.singleTargetHeal ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
    for (const ability of rotation.filler ?? []) {
      if (this.useAbilityIfReady(self, ability, target.id)) return;
    }
  }
};

// aibot/ai.ts
var AIModule = class {
  config;
  botName;
  constructor(config, botName) {
    this.config = config;
    this.botName = botName;
  }
  /**
   * Generate a response to a chat message.
   *
   * @param senderName - Name of the message sender
   * @param channel - Chat channel (say, party, guild, whisper)
   * @param message - The message content
   * @param context - Additional context (nearby entities, current activity)
   * @returns AI response or null if no response needed
   */
  async generateChatResponse(senderName, channel, message, context) {
    try {
      const prompt = this.buildPrompt(senderName, channel, message, context);
      const response = await this.callLLM(prompt);
      if (!response || response.toLowerCase().includes("[no response]")) {
        return null;
      }
      return {
        message: response,
        shouldRespond: true
      };
    } catch (error) {
      console.error(`[${this.botName}] AI error:`, error);
      return null;
    }
  }
  buildPrompt(senderName, channel, message, context) {
    const contextStr = context ? `
Context: You are a level ${context.level || 1} player. Nearby: ${context.nearbyEntities?.join(", ") || "no one"}. Current activity: ${context.currentActivity || "nothing specific"}.` : "";
    return `${this.config.systemPrompt}
${contextStr}
Player ${senderName} says in ${channel}: "${message}"
Respond briefly and naturally as if you're a real player. Keep responses under 2 sentences.
If the message doesn't require a response, reply with [no response].`;
  }
  async callLLM(prompt) {
    const response = await fetch(`${this.config.apiEndpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return typeof content === "string" ? content.trim() : null;
  }
};
var FALLBACK_RESPONSES = [
  "hey!",
  "what's up?",
  "sup",
  "hello",
  "hi there",
  "yo",
  "hey, need help?",
  "sure thing",
  "ok",
  "nice"
];
function generateSimpleResponse(message, _senderName) {
  const lowerMessage = message.toLowerCase();
  if (/\b(hi|hello|hey|sup|yo)\b/i.test(lowerMessage)) {
    const response = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return { message: response, shouldRespond: true };
  }
  if (lowerMessage.includes("?")) {
    if (/level/i.test(lowerMessage)) {
      return { message: "leveling up :)", shouldRespond: true };
    }
    if (/help/i.test(lowerMessage)) {
      return { message: "sure, what do you need?", shouldRespond: true };
    }
    if (/group|party|invite/i.test(lowerMessage)) {
      return { message: "sure, invite me", shouldRespond: true };
    }
  }
  return null;
}

// aibot/manager.ts
var BotManager = class {
  config;
  bots = /* @__PURE__ */ new Map();
  log;
  constructor(config) {
    this.config = config || loadConfig();
    this.log = (...args) => console.log("[BotManager]", ...args);
  }
  /** Get all bot instances. */
  getBots() {
    return Array.from(this.bots.values());
  }
  /** Get a specific bot instance by name. */
  getBot(name) {
    return this.bots.get(name);
  }
  /** Initialize and start all configured bots. */
  async startAll() {
    this.log(`starting ${this.config.accounts.length} bots...`);
    for (const account of this.config.accounts) {
      await this.startBot(account);
    }
    this.log("all bots started");
  }
  /** Stop all bots. */
  async stopAll() {
    this.log("stopping all bots...");
    for (const [name, bot] of this.bots) {
      if (bot.running) {
        bot.client.disconnect();
        bot.running = false;
        this.log(`stopped ${name}`);
      }
    }
    this.bots.clear();
  }
  /** Start a single bot. */
  async startBot(account) {
    this.log(`starting bot: ${account.name}`);
    const client = new BotClient({
      account,
      config: this.config,
      onEvent: (event) => this.handleBotEvent(account.name, event)
    });
    const brain = new Brain(client);
    const ai = this.config.ai && account.enableAIChat ? new AIModule(this.config.ai, account.name) : null;
    const instance = {
      account,
      client,
      brain,
      ai,
      running: false
    };
    this.bots.set(account.name, instance);
    try {
      await client.connect();
      instance.running = true;
      this.startTickLoop(instance);
    } catch (error) {
      this.log(`failed to start ${account.name}:`, error);
    }
  }
  /** Handle events from a bot client. */
  handleBotEvent(name, event) {
    const instance = this.bots.get(name);
    if (!instance) return;
    switch (event.type) {
      case "disconnected":
        this.log(`${name} disconnected: ${event.reason}`);
        instance.running = false;
        break;
      case "error":
        this.log(`${name} error: ${event.error}`);
        break;
      case "event":
        this.handleGameEvent(instance, event.event);
        break;
    }
  }
  /** Handle game events for AI responses. */
  handleGameEvent(instance, event) {
    if (!instance.ai) return;
    if (event.kind === "chat") {
      const { senderName, channel, message } = event;
      if (senderName === instance.account.name) return;
      this.generateAndSendChatResponse(instance, senderName, channel, message);
    }
  }
  /** Generate and send a chat response. */
  async generateAndSendChatResponse(instance, senderName, channel, message) {
    try {
      let response;
      if (instance.ai) {
        response = await instance.ai.generateChatResponse(senderName, channel, message);
      } else {
        response = generateSimpleResponse(message, senderName);
      }
      if (response?.shouldRespond) {
        instance.client.sendCommand("chat", {
          channel,
          message: response.message
        });
      }
    } catch (error) {
      console.error(`[${instance.account.name}] chat response error:`, error);
    }
  }
  /** Start the tick loop for a bot. */
  startTickLoop(instance) {
    const tick = () => {
      if (!instance.running) return;
      const state = instance.client.getState();
      if (state.connected) {
        const perception = parsePerception(state);
        instance.brain.tick(perception);
      }
      setTimeout(tick, this.config.tickInterval);
    };
    tick();
  }
};

// aibot/main.ts
async function main() {
  console.log("=== World of ClaudeCraft AI Bot ===\n");
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    console.error("Configuration error:", error);
    console.error("\nConfiguration options (highest priority first):");
    console.error("\n1. Config file (recommended):");
    console.error("   Copy aibot/config.example.json to aibot/config.json");
    console.error("   Or: npm run aibot -- --config /path/to/config.json");
    console.error("\n2. Environment variables:");
    console.error("   AIBOT_USERNAME - Bot account username");
    console.error("   AIBOT_PASSWORD - Bot account password");
    console.error("   AIBOT_SERVER_URL - Game server URL (default: http://127.0.0.1:8787)");
    console.error("   AIBOT_CHARACTER_ID - Character ID to use");
    console.error("   AIBOT_BEHAVIOR - Behavior profile: grinder|quester|social|custom");
    console.error("   AIBOT_ENABLE_AI_CHAT - Enable AI chat (true/false)");
    console.error("   AIBOT_AI_API_KEY - LLM API key for chat");
    console.error("   AIBOT_AI_MODEL - LLM model name (default: gpt-4o-mini)");
    console.error("   AIBOT_ACCOUNTS - JSON array for multiple accounts");
    console.error("\nSee aibot/README.md for detailed examples.");
    process.exit(1);
  }
  console.log(`Server: ${config.serverUrl}`);
  console.log(`Accounts: ${config.accounts.length}`);
  for (const acc of config.accounts) {
    console.log(`  - ${acc.name}: ${acc.behavior}, AI chat: ${acc.enableAIChat}`);
  }
  console.log("");
  const manager = new BotManager(config);
  const shutdown = async (signal) => {
    console.log(`
Received ${signal}, shutting down...`);
    await manager.stopAll();
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  try {
    await manager.startAll();
    console.log("Bots running. Press Ctrl+C to stop.\n");
    process.stdin.resume();
  } catch (error) {
    console.error("Failed to start bots:", error);
    process.exit(1);
  }
}
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
//# sourceMappingURL=aibot.cjs.map
