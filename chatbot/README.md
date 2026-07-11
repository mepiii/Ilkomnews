# ILKOM Chatbot Service

A standalone, production-ready **Node.js / TypeScript** multi-provider chatbot
service for the **ILKOM NEWS** project. It talks **directly** to LLM providers
via their official SDKs / direct REST — no third-party orchestration/abstraction
layer.

This module is intentionally self-contained and framework-agnostic. The main
ILKOM backend is Laravel/PHP; this service runs as a separate native TypeScript
component.

## Routing modes

`ChatbotService.sendMessage(messages, config)` routes based on `config.provider`:

| Provider                | Transport                        | Default model            | Key source (fallback)   |
| ----------------------- | -------------------------------- | ------------------------ | ----------------------- |
| `gemini_native`         | `@google/genai` SDK              | `gemini-2.5-flash`       | `GEMINI_API_KEY`        |
| `openai_compatible`     | `axios` → OpenAI-compatible REST | (from `config.model`)    | `GEMINI_API_KEY`        |
| `anthropic_compatible`  | `@anthropic-ai/sdk`              | `claude-3-5-sonnet`      | `ANTHROPIC_API_KEY`     |
| `custom`                | `axios` → your endpoint          | (from `config.model`)    | `config.apiKey`         |

- `openai_compatible` defaults its base URL to the Gemini OpenAI-compat endpoint
  (`https://generativelanguage.googleapis.com/v1beta/openai/`) and keeps the
  system message inside the messages array.
- `custom` **requires** `config.baseUrl` (throws `ChatbotError` if missing) and
  posts `{ model, messages, temperature }` to that URL.
- Unknown providers throw a `ChatbotError`.

All provider/SDK/network errors are rethrown as `ChatbotError` with a clear,
provider-tagged message (original error preserved on `.cause`).

## Environment variables

- `GEMINI_API_KEY` — used by `gemini_native` and `openai_compatible` when
  `config.apiKey` is not provided.
- `ANTHROPIC_API_KEY` — used by `anthropic_compatible` when `config.apiKey` is
  not provided.

## Build & test

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest run
npm run build       # tsc -> dist/
```

## Usage

```ts
import { ChatbotService } from 'ilkom-chatbot-service';
// or, before publishing/building: from './src/index.js'

const result = await ChatbotService.sendMessage(
  [
    { role: 'system', content: 'Kamu asisten berita ILKOM.' },
    { role: 'user', content: 'Ringkas berita hari ini.' },
  ],
  {
    provider: 'gemini_native',
    model: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.7,
    maxTokens: 2048,
  },
);

console.log(result.provider, '->', result.text);
```

### Anthropic example

```ts
const result = await ChatbotService.sendMessage(
  [{ role: 'user', content: 'Halo!' }],
  {
    provider: 'anthropic_compatible',
    model: 'claude-3-5-sonnet',
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
);
```

### Custom endpoint example

```ts
const result = await ChatbotService.sendMessage(
  [{ role: 'user', content: 'Halo!' }],
  {
    provider: 'custom',
    model: 'my-model',
    baseUrl: 'https://my-llm.example.com/v1/chat/completions',
    apiKey: 'sk-...',
  },
);
```
