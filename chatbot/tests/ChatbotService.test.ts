import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  class MockGoogleGenAI {
    models = { generateContent: mockGenerateContent };
    constructor() {}
  }
  return { GoogleGenAI: MockGoogleGenAI as any, mockGenerateContent };
});

import { ChatbotService } from '../src/ChatbotService.js';
import { ChatbotError, type ChatMessage } from '../src/types.js';

const { mockGenerateContent } = await import('@google/genai') as any;

const baseMessages: ChatMessage[] = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Halo!' },
];

beforeEach(() => vi.clearAllMocks());

describe('ChatbotService.sendMessage', () => {
  it('gemini returns extracted text', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Halo dari Gemini' });
    const result = await ChatbotService.sendMessage(baseMessages, {
      provider: 'gemini', model: 'gemini-2.5-flash', apiKey: 'test-key',
    });
    expect(result).toEqual({ text: 'Halo dari Gemini', provider: 'gemini' });
  });

  it('gemini_native returns extracted text', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Halo dari Gemini Native' });
    const result = await ChatbotService.sendMessage(baseMessages, {
      provider: 'gemini_native', model: 'gemini-2.5-flash', apiKey: 'test-key',
    });
    expect(result).toEqual({ text: 'Halo dari Gemini Native', provider: 'gemini_native' });
  });

  it('gemini returns empty string when no text', async () => {
    mockGenerateContent.mockResolvedValue({ text: undefined });
    const result = await ChatbotService.sendMessage(baseMessages, {
      provider: 'gemini', model: 'gemini-2.5-flash', apiKey: 'test-key',
    });
    expect(result.text).toBe('');
  });

  it('unsupported provider throws ChatbotError', async () => {
    await expect(ChatbotService.sendMessage(baseMessages, {
      // @ts-expect-error intentionally invalid
      provider: 'openai_compatible', model: 'x',
    })).rejects.toBeInstanceOf(ChatbotError);
  });

  it('bogus provider throws ChatbotError', async () => {
    await expect(ChatbotService.sendMessage(baseMessages, {
      // @ts-expect-error intentionally invalid
      provider: 'does_not_exist', model: 'x',
    })).rejects.toBeInstanceOf(ChatbotError);
  });

  it('wraps SDK errors as ChatbotError', async () => {
    mockGenerateContent.mockRejectedValue(new Error('network boom'));
    await expect(ChatbotService.sendMessage(baseMessages, {
      provider: 'gemini', model: 'gemini-2.5-flash', apiKey: 'test-key',
    })).rejects.toBeInstanceOf(ChatbotError);
  });
});
