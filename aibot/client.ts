// Game client for AI bot.
// Handles REST API authentication and WebSocket world connection.

import type { BotAccountConfig, AIBotConfig } from './config';
import type {
  AuthMessage,
  InputMessage,
  CommandMessage,
  ServerMessage,
  EntityWire,
  SelfWire,
  SimEventWire,
} from './protocol';

export interface ApiTokenResponse {
  token: string;
  username: string;
}

export interface CharacterSummary {
  id: number;
  name: string;
  class: string;
  level: number;
}

export interface WorldState {
  connected: boolean;
  playerId: number;
  realm: string;
  entities: Map<number, EntityWire>;
  self: SelfWire | null;
  events: SimEventWire[];
}

export type BotClientEvent =
  | { type: 'connected' }
  | { type: 'disconnected'; reason: string }
  | { type: 'authenticated'; playerId: number }
  | { type: 'snapshot'; state: WorldState }
  | { type: 'event'; event: SimEventWire }
  | { type: 'error'; error: string };

export interface BotClientOptions {
  account: BotAccountConfig;
  config: AIBotConfig;
  onEvent?: (event: BotClientEvent) => void;
}

const DEFAULT_TIMEOUT_MS = 15000;
const LOGIN_RETRY_DELAY_MS = 3000;
const WS_RETRY_DELAY_MS = 5000;
const MAX_RECONNECT_ATTEMPTS = 10;

/**
 * BotClient - A minimal game client for AI bots.
 *
 * Handles:
 * - REST API authentication (login, character selection)
 * - WebSocket connection and message parsing
 * - World state tracking (entities, self, events)
 * - Input sending (movement, commands)
 */
export class BotClient {
  readonly account: BotAccountConfig;
  readonly config: AIBotConfig;

  private token: string | null = null;
  private ws: WebSocket | null = null;
  private state: WorldState;
  private onEvent: (event: BotClientEvent) => void;

  private inputSeq = 0;
  private moveInput = { f: 0, b: 0, tl: 0, tr: 0, sl: 0, sr: 0, j: 0 };
  private facing: number | null = null;
  private sendTimer: ReturnType<typeof setInterval> | null = null;

  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private log: (...args: unknown[]) => void;

  constructor(options: BotClientOptions) {
    this.account = options.account;
    this.config = options.config;
    this.onEvent = options.onEvent || (() => {});

    this.state = {
      connected: false,
      playerId: -1,
      realm: '',
      entities: new Map(),
      self: null,
      events: [],
    };

    this.log = (...args: unknown[]) =>
      console.log(`[${this.account.name}]`, ...args);
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** Current world state (read-only). */
  getState(): Readonly<WorldState> {
    return this.state;
  }

  /** Connect to the game server. Retries on transient failures. */
  async connect(): Promise<void> {
    this.log('connecting...');

    // 1. Login via REST API (with retries)
    const token = await this.withRetry(
      () => this.login(),
      MAX_RECONNECT_ATTEMPTS,
      LOGIN_RETRY_DELAY_MS,
      'login',
    );
    this.token = token;

    // 2. Get characters
    const characters = await this.withRetry(
      () => this.getCharacters(),
      3,
      LOGIN_RETRY_DELAY_MS,
      'getCharacters',
    );
    if (characters.length === 0) {
      throw new Error('No characters available');
    }

    // 3. Select character
    const charId = this.account.characterId || characters[0].id;
    this.log(`using character ${charId}`);

    // 4. Open WebSocket (with retries)
    await this.withRetry(
      () => this.openWebSocket(charId),
      MAX_RECONNECT_ATTEMPTS,
      WS_RETRY_DELAY_MS,
      'WebSocket',
    );
  }

  /** Disconnect from the game server. */
  disconnect(): void {
    this.log('disconnecting...');
    this.clearTimers();
    if (this.ws) {
      this.ws.close(1000, 'client disconnect');
      this.ws = null;
    }
    this.state.connected = false;
    this.emit({ type: 'disconnected', reason: 'client disconnect' });
  }

  /** Clear processed events. */
  clearEvents(): void {
    this.state.events = [];
  }

  /** Set movement input. */
  setMoveInput(input: Partial<typeof this.moveInput>): void {
    Object.assign(this.moveInput, input);
  }

  /** Reset movement input (stop moving). */
  stopMoving(): void {
    this.moveInput = { f: 0, b: 0, tl: 0, tr: 0, sl: 0, sr: 0, j: 0 };
  }

  /** Set facing direction (radians). */
  setFacing(facing: number | null): void {
    this.facing = facing;
  }

  /** Send a command to the server. */
  sendCommand(cmd: string, payload: Record<string, unknown> = {}): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log(`cannot send command ${cmd}: WebSocket not open`);
      return;
    }
    const msg: CommandMessage = { t: 'cmd', cmd, ...payload };
    this.log(`sending command: ${cmd}`);
    this.ws.send(JSON.stringify(msg));
  }

  /** Send a chat message or slash command (e.g. /follow, /assist). */
  sendChat(text: string): void {
    this.sendCommand('chat', { text });
  }

  // -------------------------------------------------------------------------
  // REST API
  // -------------------------------------------------------------------------

  private async login(): Promise<string> {
    // Send an Origin whose host matches the request Host so the web-login guard accepts us.
    const origin = this.config.serverUrl;
    const res = await this.fetchWithTimeout(`${this.config.serverUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
      },
      body: JSON.stringify({
        username: this.account.username,
        password: this.account.password,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(`login failed: ${data.error || res.status}`);
    }

    const data: ApiTokenResponse = await res.json();
    this.log(`logged in as ${data.username}`);
    return data.token;
  }

  private async getCharacters(): Promise<CharacterSummary[]> {
    if (!this.token) throw new Error('not logged in');

    const res = await this.fetchWithTimeout(`${this.config.serverUrl}/api/characters`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (!res.ok) {
      throw new Error(`failed to get characters: ${res.status}`);
    }

    const data = await res.json();
    return data.characters || [];
  }

  private fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(id));
  }

  private async withRetry<T>(
    fn: () => Promise<T>,
    maxAttempts: number,
    delayMs: number,
    operation: string,
  ): Promise<T> {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxAttempts) {
          this.log(`${operation} failed (attempt ${attempt}/${maxAttempts}): ${lastError.message}. Retrying in ${delayMs}ms...`);
          await this.sleep(delayMs);
        }
      }
    }
    throw new Error(`${operation} failed after ${maxAttempts} attempts: ${lastError?.message}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // -------------------------------------------------------------------------
  // WebSocket
  // -------------------------------------------------------------------------

  private async openWebSocket(characterId: number): Promise<void> {
    const wsUrl = this.config.wsUrlTemplate;

    this.log(`connecting to ${wsUrl}`);
    this.ws = new WebSocket(wsUrl);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.ws?.close();
        reject(new Error('WebSocket connection timeout'));
      }, DEFAULT_TIMEOUT_MS);

      this.ws!.onopen = () => {
        clearTimeout(timeout);
        this.log('WebSocket connected, authenticating...');

        // Send auth message
        const auth: AuthMessage = {
          t: 'auth',
          token: this.token!,
          character: characterId,
        };
        this.ws!.send(JSON.stringify(auth));
        resolve();
      };

      this.ws!.onmessage = (event) => {
        this.handleMessage(event.data as string);
      };

      this.ws!.onclose = (event) => {
        clearTimeout(timeout);
        this.handleClose(event.code, event.reason, characterId);
      };

      this.ws!.onerror = (error) => {
        clearTimeout(timeout);
        this.log('WebSocket error:', error);
        reject(new Error('WebSocket error'));
      };
    });
  }

  private handleMessage(raw: string): void {
    let msg: ServerMessage;
    try {
      msg = JSON.parse(raw);
    } catch {
      this.log('failed to parse message:', raw);
      return;
    }

    switch (msg.t) {
      case 'hello':
        this.handleHello(msg);
        break;
      case 'snap':
        this.handleSnapshot(msg);
        break;
      case 'events':
        this.handleEvents(msg);
        break;
      case 'social':
        // Handle social info (friends, guild)
        break;
      case 'censor':
        // Update profanity list
        break;
      case 'error':
        this.log('server error:', msg.error);
        this.emit({ type: 'error', error: msg.error });
        break;
    }
  }

  private handleHello(msg: ServerMessage & { t: 'hello' }): void {
    this.state.playerId = msg.pid;
    this.state.realm = msg.realm || '';
    this.state.connected = true;
    this.reconnectAttempts = 0;

    this.log(`authenticated as player ${msg.pid} in realm ${msg.realm}`);
    this.emit({ type: 'authenticated', playerId: msg.pid });

    // Start input loop
    this.startInputLoop();
  }

  private handleSnapshot(msg: ServerMessage & { t: 'snap' }): void {
    const { ents, self, keep } = msg;

    // Build new entity map
    const newEntities = new Map<number, EntityWire>();

    // Keep existing entities that are still alive
    if (keep) {
      for (const id of keep) {
        const existing = this.state.entities.get(id);
        if (existing) newEntities.set(id, existing);
      }
    }

    // Update/add entities from this snapshot
    for (const ent of ents) {
      if (ent.id === undefined) continue;

      const existing = newEntities.get(ent.id);
      if (existing) {
        // Merge with existing (delta update)
        newEntities.set(ent.id, { ...existing, ...ent });
      } else {
        newEntities.set(ent.id, ent);
      }
    }

    this.state.entities = newEntities;

    // Update self
    if (self) {
      if (this.state.self) {
        this.state.self = { ...this.state.self, ...self };
      } else {
        this.state.self = self;
      }
    }

    // Note: events are NOT cleared here. The brain reads them during its tick
    // and then calls clearEvents() after processing, so transient events like
    // party invites are not lost between snapshots.
    const events = [...this.state.events];

    this.emit({ type: 'snapshot', state: { ...this.state, events } });
  }

  private handleEvents(msg: ServerMessage & { t: 'events' }): void {
    const list = msg.list ?? [];
    for (const event of list) {
      this.state.events.push(event);
      this.emit({ type: 'event', event });
    }
  }

  private characterIdForReconnect: number | null = null;

  private handleClose(code: number, reason: string, characterId: number): void {
    this.clearTimers();
    this.state.connected = false;
    this.characterIdForReconnect = characterId;

    this.log(`WebSocket closed: ${code} ${reason || '(no reason)'}`);

    // Check if we should reconnect
    if (this.reconnectAttempts < this.config.reconnect.maxAttempts) {
      this.scheduleReconnect(characterId);
    } else {
      this.emit({ type: 'disconnected', reason: reason || 'connection lost' });
    }
  }

  private scheduleReconnect(characterId: number): void {
    this.reconnectAttempts++;
    const delay = Math.min(
      this.config.reconnect.baseDelayMs * Math.pow(2, this.reconnectAttempts - 1),
      this.config.reconnect.maxDelayMs,
    );

    this.log(`reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.reconnect.maxAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.openWebSocket(characterId).catch((err) => {
        this.log('reconnect failed:', err instanceof Error ? err.message : err);
        this.scheduleReconnect(characterId);
      });
    }, delay);
  }

  // -------------------------------------------------------------------------
  // Input sending
  // -------------------------------------------------------------------------

  private startInputLoop(): void {
    if (this.sendTimer) clearInterval(this.sendTimer);
    this.sendTimer = setInterval(() => this.sendInput(), this.config.tickInterval);
  }

  private sendInput(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (!this.state.connected) return;

    const msg: InputMessage = {
      t: 'input',
      seq: ++this.inputSeq,
      mi: { ...this.moveInput },
    };
    if (this.facing !== null) msg.facing = this.facing;

    this.ws.send(JSON.stringify(msg));
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private clearTimers(): void {
    if (this.sendTimer) {
      clearInterval(this.sendTimer);
      this.sendTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private emit(event: BotClientEvent): void {
    try {
      this.onEvent(event);
    } catch (err) {
      this.log('event handler error:', err);
    }
  }
}