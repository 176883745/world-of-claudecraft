// AI Bot entry point.
// Run with: npm run aibot

import { loadConfig } from './config';
import { BotManager } from './manager';

async function main(): Promise<void> {
  console.log('=== World of ClaudeCraft AI Bot ===\n');

  let config;
  try {
    config = loadConfig();
  } catch (error) {
    console.error('Configuration error:', error);
    console.error('\nConfiguration options (highest priority first):');
    console.error('\n1. Config file (recommended):');
    console.error('   Copy aibot/config.example.json to aibot/config.json');
    console.error('   Or: npm run aibot -- --config /path/to/config.json');
    console.error('\n2. Environment variables:');
    console.error('   AIBOT_USERNAME - Bot account username');
    console.error('   AIBOT_PASSWORD - Bot account password');
    console.error('   AIBOT_SERVER_URL - Game server URL (default: http://127.0.0.1:8787)');
    console.error('   AIBOT_CHARACTER_ID - Character ID to use');
    console.error('   AIBOT_BEHAVIOR - Behavior profile: grinder|quester|social|custom');
    console.error('   AIBOT_ENABLE_AI_CHAT - Enable AI chat (true/false)');
    console.error('   AIBOT_AI_API_KEY - LLM API key for chat');
    console.error('   AIBOT_AI_MODEL - LLM model name (default: gpt-4o-mini)');
    console.error('   AIBOT_ACCOUNTS - JSON array for multiple accounts');
    console.error('\nSee aibot/README.md for detailed examples.');
    process.exit(1);
  }

  console.log(`Server: ${config.serverUrl}`);
  console.log(`Accounts: ${config.accounts.length}`);
  for (const acc of config.accounts) {
    console.log(`  - ${acc.name}: ${acc.behavior}, AI chat: ${acc.enableAIChat}`);
  }
  console.log('');

  // Create and start manager
  const manager = new BotManager(config);

  // Handle shutdown
  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down...`);
    await manager.stopAll();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Start bots
  try {
    await manager.startAll();

    console.log('Bots running. Press Ctrl+C to stop.\n');

    // Keep process alive
    process.stdin.resume();
  } catch (error) {
    console.error('Failed to start bots:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
