// AI enhancement module for chat responses and intelligent interactions.
// Integrates with LLM APIs for natural language responses.

import type { AIBotConfig } from './config';

export interface AIResponse {
  message: string;
  shouldRespond: boolean;
}

/**
 * AI module for enhanced bot interactions.
 *
 * Uses LLM APIs to generate natural chat responses.
 * Only active when AI configuration is provided.
 */
export class AIModule {
  private config: NonNullable<AIBotConfig['ai']>;
  private botName: string;

  constructor(config: NonNullable<AIBotConfig['ai']>, botName: string) {
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
  async generateChatResponse(
    senderName: string,
    channel: string,
    message: string,
    context?: {
      nearbyEntities?: string[];
      currentActivity?: string;
      level?: number;
    },
  ): Promise<AIResponse | null> {
    try {
      const prompt = this.buildPrompt(senderName, channel, message, context);

      const response = await this.callLLM(prompt);

      if (!response || response.toLowerCase().includes('[no response]')) {
        return null;
      }

      return {
        message: response,
        shouldRespond: true,
      };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (errMsg.includes('404')) {
        console.warn(
          `[${this.botName}] AI chat skipped: LLM endpoint returned 404. ` +
            `Check your ai.apiEndpoint in config (current: ${this.config.apiEndpoint}). ` +
            `Using fallback response.`,
        );
      } else {
        console.warn(`[${this.botName}] AI chat skipped: ${errMsg}. Using fallback response.`);
      }
      return this.fallbackResponse(senderName, message);
    }
  }

  private buildPrompt(
    senderName: string,
    channel: string,
    message: string,
    context?: {
      nearbyEntities?: string[];
      currentActivity?: string;
      level?: number;
    },
  ): string {
    const contextStr = context
      ? `\nContext: You are a level ${context.level || 1} player. ` +
        `Nearby: ${context.nearbyEntities?.join(', ') || 'no one'}. ` +
        `Current activity: ${context.currentActivity || 'nothing specific'}.`
      : '';

    return `${this.config.systemPrompt}
${contextStr}
Player ${senderName} says in ${channel}: "${message}"
Respond briefly and naturally as if you're a real player. Keep responses under 2 sentences.
If the message doesn't require a response, reply with [no response].`;
  }

  private resolveChatEndpoint(): string {
    const base = this.config.apiEndpoint.replace(/\/$/, '');
    if (base.endsWith('/chat/completions')) return base;
    if (base.endsWith('/v1')) return `${base}/chat/completions`;
    return `${base}/chat/completions`;
  }

  private fallbackResponse(senderName: string, message: string): AIResponse | null {
    const lower = message.toLowerCase();
    const greetings = ['hi', 'hello', 'hey', 'sup', 'yo'];
    const questions = ['how', 'what', 'where', 'why', 'can', 'do you'];

    let reply: string | null = null;
    if (greetings.some(g => lower.includes(g))) {
      reply = `hey ${senderName}!`;
    } else if (questions.some(q => lower.startsWith(q))) {
      reply = `not sure, ${senderName}.`;
    } else if (lower.includes('bot')) {
      reply = `I'm just here to play, ${senderName}.`;
    }

    if (!reply) return null;
    return { message: reply, shouldRespond: true };
  }

  private async callLLM(prompt: string): Promise<string | null> {
    const endpoint = this.resolveChatEndpoint();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content.trim() : null;
  }
}

/**
 * Fallback chat responses when AI is not available.
 */
const FALLBACK_RESPONSES = [
  'hey!',
  'what\'s up?',
  'sup',
  'hello',
  'hi there',
  'yo',
  'hey, need help?',
  'sure thing',
  'ok',
  'nice',
];

/**
 * Simple response generator without LLM.
 * Used when AI is not configured or for basic interactions.
 */
export function generateSimpleResponse(
  message: string,
  _senderName: string,
): AIResponse | null {
  const lowerMessage = message.toLowerCase();

  // Greeting responses
  if (/\b(hi|hello|hey|sup|yo)\b/i.test(lowerMessage)) {
    const response = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return { message: response, shouldRespond: true };
  }

  // Question responses
  if (lowerMessage.includes('?')) {
    if (/level/i.test(lowerMessage)) {
      return { message: 'leveling up :)', shouldRespond: true };
    }
    if (/help/i.test(lowerMessage)) {
      return { message: 'sure, what do you need?', shouldRespond: true };
    }
    if (/group|party|invite/i.test(lowerMessage)) {
      return { message: 'sure, invite me', shouldRespond: true };
    }
  }

  // Don't respond to most messages
  return null;
}