/**
 * Shared types for the ILKOM chatbot service.
 */

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type ChatbotProvider = 'gemini' | 'gemini_native';

export interface ChatbotConfig {
  provider: ChatbotProvider;
  apiKey?: string;
  model: string;
  temperature?: number;
  systemInstruction?: string;
  maxTokens?: number;
}

export interface ChatbotResult {
  text: string;
  provider: ChatbotProvider;
}

/**
 * Custom error type used throughout the chatbot service so callers can
 * reliably distinguish service-level failures from arbitrary runtime errors.
 */
export class ChatbotError extends Error {
  public readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'ChatbotError';
    this.cause = cause;

    // Restore prototype chain (needed when targeting ES2022 with transpilation).
    Object.setPrototypeOf(this, ChatbotError.prototype);
  }
}
