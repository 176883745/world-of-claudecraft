// Multi-account manager for running multiple bots simultaneously.

import { BotClient, type BotClientEvent } from './client';
import { Brain } from './brain';
import { AIModule, generateSimpleResponse } from './ai';
import { parsePerception } from './perception';
import { loadConfig, type AIBotConfig, type BotAccountConfig } from './config';

export interface BotInstance {
  account: BotAccountConfig;
  client: BotClient;
  brain: Brain;
  ai: AIModule | null;
  running: boolean;
}

/**
 * BotManager - Manages multiple bot instances.
 *
 * Handles:
 * - Starting/stopping multiple bots
 * - Monitoring health and reconnecting
 * - Coordinating group activities
 */
export class BotManager {
  private config: AIBotConfig;
  private bots: Map<string, BotInstance> = new Map();
  private log: (...args: unknown[]) => void;

  constructor(config?: AIBotConfig) {
    this.config = config || loadConfig();
    this.log = (...args: unknown[]) => console.log('[BotManager]', ...args);
  }

  /** Get all bot instances. */
  getBots(): BotInstance[] {
    return Array.from(this.bots.values());
  }

  /** Get a specific bot instance by name. */
  getBot(name: string): BotInstance | undefined {
    return this.bots.get(name);
  }

  /** Initialize and start all configured bots. */
  async startAll(): Promise<void> {
    this.log(`starting ${this.config.accounts.length} bots...`);

    for (const account of this.config.accounts) {
      await this.startBot(account);
    }

    this.log('all bots started');
  }

  /** Stop all bots. */
  async stopAll(): Promise<void> {
    this.log('stopping all bots...');

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
  private async startBot(account: BotAccountConfig): Promise<void> {
    this.log(`starting bot: ${account.name}`);

    const client = new BotClient({
      account,
      config: this.config,
      onEvent: (event) => this.handleBotEvent(account.name, event),
    });

    const brain = new Brain(client);

    const ai = this.config.ai && account.enableAIChat
      ? new AIModule(this.config.ai, account.name)
      : null;

    const instance: BotInstance = {
      account,
      client,
      brain,
      ai,
      running: false,
    };

    this.bots.set(account.name, instance);

    try {
      await client.connect();
      instance.running = true;

      // Start tick loop
      this.startTickLoop(instance);
    } catch (error) {
      this.log(`failed to start ${account.name}:`, error);
    }
  }

  /** Handle events from a bot client. */
  private handleBotEvent(name: string, event: BotClientEvent): void {
    const instance = this.bots.get(name);
    if (!instance) return;

    switch (event.type) {
      case 'disconnected':
        this.log(`${name} disconnected: ${event.reason}`);
        instance.running = false;
        break;

      case 'error':
        this.log(`${name} error: ${event.error}`);
        break;

      case 'event':
        this.handleGameEvent(instance, event.event);
        break;
    }
  }

  /** Handle game events for AI responses. */
  private handleGameEvent(instance: BotInstance, event: { type: string; [key: string]: unknown }): void {
    if (!instance.ai) return;

    if (event.type === 'chat') {
      const { from: senderName, channel, message } = event as unknown as { from: string; channel: string; message: string };

      // Don't respond to own messages
      if (senderName === instance.account.name) return;

      // Generate response asynchronously
      this.generateAndSendChatResponse(instance, senderName, channel, message);
    }
  }

  /** Generate and send a chat response. */
  private async generateAndSendChatResponse(
    instance: BotInstance,
    senderName: string,
    channel: string,
    message: string,
  ): Promise<void> {
    try {
      let response;

      if (instance.ai) {
        response = await instance.ai.generateChatResponse(senderName, channel, message);
      } else {
        response = generateSimpleResponse(message, senderName);
      }

      if (response?.shouldRespond) {
        instance.client.sendCommand('chat', {
          channel,
          message: response.message,
        });
      }
    } catch (error) {
      console.error(`[${instance.account.name}] chat response error:`, error);
    }
  }

  /** Start the tick loop for a bot. */
  private startTickLoop(instance: BotInstance): void {
    const tick = () => {
      if (!instance.running) return;

      const state = instance.client.getState();
      if (state.connected) {
        const perception = parsePerception(state);
        instance.brain.tick(perception);
        // Events are consumed after the brain has had a chance to react.
        instance.client.clearEvents();
      }

      setTimeout(tick, this.config.tickInterval);
    };

    tick();
  }
}

// Singleton instance
let manager: BotManager | null = null;

/** Get or create the global bot manager. */
export function getManager(config?: AIBotConfig): BotManager {
  if (!manager) {
    manager = new BotManager(config);
  }
  return manager;
}

/** Start all bots with the default configuration. */
export async function startBots(): Promise<void> {
  const mgr = getManager();
  await mgr.startAll();
}

/** Stop all bots. */
export async function stopBots(): Promise<void> {
  if (manager) {
    await manager.stopAll();
    manager = null;
  }
}