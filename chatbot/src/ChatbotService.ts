import { GoogleGenAI } from '@google/genai';

import {
  ChatbotError,
  type ChatMessage,
  type ChatbotConfig,
  type ChatbotProvider,
  type ChatbotResult,
} from './types.js';

/**
 * Single-provider chatbot service. Talks directly to Google Gemini through its
 * official SDK with no third-party abstraction layer.
 */
export class ChatbotService {
  static async sendMessage(
    messages: ChatMessage[],
    config: ChatbotConfig,
  ): Promise<ChatbotResult> {
    const temperature = config.temperature ?? 0.7;

    // Extract the system message content (fallback to explicit config value).
    const systemMessage =
      messages.find((m) => m.role === 'system')?.content ??
      config.systemInstruction ??
      undefined;

    // Everything that is not a system message.
    const activeMessages = messages.filter((m) => m.role !== 'system');

    // Support both `gemini` and `gemini_native` for backward compatibility.
    if (config.provider === 'gemini' || config.provider === 'gemini_native') {
      return {
        text: await ChatbotService.callGeminiNative(
          activeMessages,
          config,
          temperature,
          systemMessage,
        ),
        provider: config.provider,
      };
    }

    throw new ChatbotError(
      'Provider tidak didukung. Sistem hanya mendukung Google Gemini.',
    );
  }

  // ---------------------------------------------------------------------------
  // gemini
  // ---------------------------------------------------------------------------
  private static async callGeminiNative(
    activeMessages: ChatMessage[],
    config: ChatbotConfig,
    temperature: number,
    systemInstruction: string | undefined,
  ): Promise<string> {
    try {
      const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const model = config.model || 'gemini-2.5-flash';

      const contents = activeMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature,
          maxOutputTokens: config.maxTokens ?? 2048,
        },
      });

      return response.text ?? '';
    } catch (error) {
      throw ChatbotService.wrapError('gemini_native', error);
    }
  }

  // ---------------------------------------------------------------------------
  // helpers
  // ---------------------------------------------------------------------------
  private static wrapError(
    provider: ChatbotProvider,
    error: unknown,
  ): ChatbotError {
    // Never re-wrap our own errors.
    if (error instanceof ChatbotError) {
      return error;
    }

    const detail =
      error instanceof Error ? error.message : String(error);

    return new ChatbotError(
      `Gagal memanggil provider "${provider}": ${detail}`,
      error,
    );
  }
}
