// AI Bot configuration.
// Supports three ways to configure:
//   1. JSON config file (default: aibot/config.json)
//   2. Environment variables
//   3. Command line arguments

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface BotAccountConfig {
  /** Bot account name (for logging). */
  name: string;
  /** Login username. */
  username: string;
  /** Login password. */
  password: string;
  /** Character ID to use (optional, will use first character if not set). */
  characterId?: number;
  /** Realm URL (optional, defaults to server default). */
  realmUrl?: string;
  /** Behavior profile: determines what actions the bot takes. */
  behavior: 'grinder' | 'quester' | 'social' | 'custom';
  /** Enable AI chat responses (requires LLM API). */
  enableAIChat: boolean;
  /** Custom behavior script path (for 'custom' profile). */
  customScript?: string;
}

export interface AIBotConfig {
  /** Game server base URL. */
  serverUrl: string;
  /** WebSocket URL template. */
  wsUrlTemplate: string;
  /** Bot accounts to run. */
  accounts: BotAccountConfig[];
  /** AI/LLM configuration (optional). */
  ai?: {
    /** LLM API endpoint (e.g., OpenAI, Anthropic). */
    apiEndpoint: string;
    /** API key for LLM service. */
    apiKey: string;
    /** Model to use. */
    model: string;
    /** System prompt for chat responses. */
    systemPrompt: string;
  };
  /** Tick interval in milliseconds (default: 50ms for 20Hz). */
  tickInterval: number;
  /** Reconnect settings. */
  reconnect: {
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
  };
  /** Logging level. */
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface ConfigFile {
  serverUrl?: string;
  wsUrlTemplate?: string;
  accounts?: BotAccountConfig[];
  ai?: AIBotConfig['ai'];
  tickInterval?: number;
  reconnect?: Partial<AIBotConfig['reconnect']>;
  logLevel?: AIBotConfig['logLevel'];
}

const DEFAULTS: Omit<AIBotConfig, 'accounts'> = {
  serverUrl: 'http://127.0.0.1:8787',
  wsUrlTemplate: '',
  ai: undefined,
  tickInterval: 50,
  reconnect: {
    maxAttempts: 10,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
  },
  logLevel: 'info',
};

function computeWsUrl(serverUrl: string): string {
  const wsProtocol = serverUrl.startsWith('https') ? 'wss' : 'ws';
  const wsHost = serverUrl.replace(/^https?:\/\//, '');
  return `${wsProtocol}://${wsHost}/ws`;
}

function loadConfigFile(path: string): ConfigFile {
  if (!existsSync(path)) {
    throw new Error(`Config file not found: ${path}`);
  }

  const raw = readFileSync(path, 'utf8');
  try {
    const parsed = JSON.parse(raw) as ConfigFile;
    if (!parsed.accounts || !Array.isArray(parsed.accounts) || parsed.accounts.length === 0) {
      throw new Error('Config file must contain a non-empty "accounts" array');
    }
    return parsed;
  } catch (e) {
    throw new Error(`Failed to parse config file ${path}: ${e}`);
  }
}

function validateAccount(acc: unknown, index: number): BotAccountConfig {
  if (!acc || typeof acc !== 'object') {
    throw new Error(`Account ${index} is not an object`);
  }

  const a = acc as Record<string, unknown>;

  const username = a.username;
  const password = a.password;
  if (typeof username !== 'string' || username.length === 0) {
    throw new Error(`Account ${index}: missing or invalid "username"`);
  }
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error(`Account ${index}: missing or invalid "password"`);
  }

  const behavior = a.behavior || 'grinder';
  if (!['grinder', 'quester', 'social', 'custom'].includes(behavior as string)) {
    throw new Error(`Account ${index}: invalid "behavior", must be grinder/quester/social/custom`);
  }

  return {
    name: typeof a.name === 'string' && a.name.length > 0 ? a.name : `bot${index + 1}`,
    username,
    password,
    characterId: typeof a.characterId === 'number' ? a.characterId : undefined,
    realmUrl: typeof a.realmUrl === 'string' ? a.realmUrl : undefined,
    behavior: behavior as BotAccountConfig['behavior'],
    enableAIChat: a.enableAIChat === true,
    customScript: typeof a.customScript === 'string' ? a.customScript : undefined,
  };
}

function parseCliArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--') && i + 1 < argv.length) {
      const key = arg.slice(2);
      args[key] = argv[i + 1];
      i++;
    }
  }

  return args;
}

function loadFromEnv(): AIBotConfig {
  const serverUrl = process.env.AIBOT_SERVER_URL || DEFAULTS.serverUrl;

  return {
    serverUrl,
    wsUrlTemplate: process.env.AIBOT_WS_URL || computeWsUrl(serverUrl),
    accounts: parseEnvAccounts(),
    ai: process.env.AIBOT_AI_API_KEY ? {
      apiEndpoint: process.env.AIBOT_AI_API_ENDPOINT || 'https://api.openai.com/v1',
      apiKey: process.env.AIBOT_AI_API_KEY,
      model: process.env.AIBOT_AI_MODEL || 'gpt-4o-mini',
      systemPrompt: process.env.AIBOT_AI_SYSTEM_PROMPT ||
        'You are a helpful MMO game player. Respond naturally and briefly to chat messages.',
    } : undefined,
    tickInterval: parseInt(process.env.AIBOT_TICK_INTERVAL || String(DEFAULTS.tickInterval), 10),
    reconnect: {
      maxAttempts: parseInt(process.env.AIBOT_RECONNECT_MAX_ATTEMPTS || String(DEFAULTS.reconnect.maxAttempts), 10),
      baseDelayMs: parseInt(process.env.AIBOT_RECONNECT_BASE_DELAY_MS || String(DEFAULTS.reconnect.baseDelayMs), 10),
      maxDelayMs: parseInt(process.env.AIBOT_RECONNECT_MAX_DELAY_MS || String(DEFAULTS.reconnect.maxDelayMs), 10),
    },
    logLevel: (process.env.AIBOT_LOG_LEVEL as AIBotConfig['logLevel']) || DEFAULTS.logLevel,
  };
}

function parseEnvAccounts(): BotAccountConfig[] {
  const accountsEnv = process.env.AIBOT_ACCOUNTS;
  if (accountsEnv) {
    try {
      const parsed = JSON.parse(accountsEnv);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('AIBOT_ACCOUNTS must be a non-empty JSON array');
      }
      return parsed.map((acc, i) => validateAccount(acc, i));
    } catch (e) {
      throw new Error(`Failed to parse AIBOT_ACCOUNTS: ${e}`);
    }
  }

  // Single account mode
  const username = process.env.AIBOT_USERNAME;
  const password = process.env.AIBOT_PASSWORD;
  if (!username || !password) {
    throw new Error('Missing account config: set AIBOT_ACCOUNTS or AIBOT_USERNAME+AIBOT_PASSWORD');
  }

  return [validateAccount({
    name: process.env.AIBOT_NAME,
    username,
    password,
    characterId: process.env.AIBOT_CHARACTER_ID ? parseInt(process.env.AIBOT_CHARACTER_ID, 10) : undefined,
    realmUrl: process.env.AIBOT_REALM_URL,
    behavior: process.env.AIBOT_BEHAVIOR,
    enableAIChat: process.env.AIBOT_ENABLE_AI_CHAT === 'true',
  }, 0)];
}

/**
 * Load configuration from config file, environment variables, or CLI args.
 *
 * Priority (highest first):
 *   1. Command line arguments (--config path)
 *   2. Environment variables (if AIBOT_USERNAME/AIBOT_ACCOUNTS present)
 *   3. Default config file (aibot/config.json)
 */
export function loadConfig(): AIBotConfig {
  const args = parseCliArgs();
  const configPath = args.config
    ? resolve(args.config)
    : resolve('aibot', 'config.json');

  // CLI --config always wins if provided
  if (args.config) {
    return finalizeConfig(loadConfigFile(configPath));
  }

  // Environment variables take precedence over default config file
  const hasEnvConfig = process.env.AIBOT_USERNAME || process.env.AIBOT_ACCOUNTS;
  if (hasEnvConfig) {
    return loadFromEnv();
  }

  // Fall back to default config file
  if (existsSync(configPath)) {
    return finalizeConfig(loadConfigFile(configPath));
  }

  throw new Error(
    'No configuration found. Create aibot/config.json, or set AIBOT_USERNAME+AIBOT_PASSWORD, ' +
    'or set AIBOT_ACCOUNTS. See aibot/README.md for examples.',
  );
}

function finalizeConfig(file: ConfigFile): AIBotConfig {
  const serverUrl = file.serverUrl || DEFAULTS.serverUrl;

  return {
    serverUrl,
    wsUrlTemplate: file.wsUrlTemplate || computeWsUrl(serverUrl),
    accounts: file.accounts!.map((acc, i) => validateAccount(acc, i)),
    ai: file.ai && file.ai.apiKey ? {
      apiEndpoint: file.ai.apiEndpoint || 'https://api.openai.com/v1',
      apiKey: file.ai.apiKey,
      model: file.ai.model || 'gpt-4o-mini',
      systemPrompt: file.ai.systemPrompt ||
        'You are a helpful MMO game player. Respond naturally and briefly to chat messages.',
    } : undefined,
    tickInterval: file.tickInterval || DEFAULTS.tickInterval,
    reconnect: {
      maxAttempts: file.reconnect?.maxAttempts ?? DEFAULTS.reconnect.maxAttempts,
      baseDelayMs: file.reconnect?.baseDelayMs ?? DEFAULTS.reconnect.baseDelayMs,
      maxDelayMs: file.reconnect?.maxDelayMs ?? DEFAULTS.reconnect.maxDelayMs,
    },
    logLevel: file.logLevel || DEFAULTS.logLevel,
  };
}