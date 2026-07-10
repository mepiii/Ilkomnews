# Agent Architecture Audit — IlkomNews (Wolfy RAG + Full-Stack)

Audit date: 2026-07-09
Method: 12-layer agent-architecture diagnostic (system prompt → session history → long-term memory → distillation → active recall → tool selection → tool execution → tool interpretation → answer shaping → platform rendering → hidden repair loops → persistence), applied to the Wolfy chatbot "agent" plus the React/API/Backend stack it sits on.

`schema_version`: "ecc.agent-architecture-audit.report.v1"

## Executive verdict

- **overall_health**: `high_risk` (pre-fix) → remediated to `medium_risk` after code-first fixes; **runtime verification still pending** (see blocker below).
- **primary_failure_mode**: Wrapper regression + bypassed safety gate. The live `/api/chat` serving path kept only the *retrieval* half of the RAG pipeline and discarded the *groundedness/verification* half, so the "zero-hallucination" rule was enforced only by prompt text. Retrieval also accepted any SQL-LIKE substring match as authoritative context, and a plaintext API-key leak existed in the admin API.
- **most_urgent_fix**: F1 (groundedness gate) + F5 (secret leak) + H1-backend (chatbot IDOR) — all fixed.

### BLOCKER (must read)
This sandbox **blocks all command execution** (Bash/background_process denied for the orchestrator and every sub-agent). As a result:
- `php -l`, `npm run build`, `npm run lint`, `npx vitest`, and `npx playwright test` **could not be executed**.
- Fixes were verified by **manual code review + static grep** only, not by running the app/toolchain.
- The Playwright suite was made **correct and runnable** (path mismatch fixed, selectors corrected) but **not executed** here.
- Browsers (`~/.cache/ms-playwright`) are not installed; the live backend+MariaDB cannot be started in this environment.

All code changes are syntactically reviewed and grep-verified at the call sites; they must be run through `php -l` + `npm run lint` + `npx vitest` + `npx playwright test` in a real environment before deploy (run instructions below).

## Severity-ranked findings

| ID | Sev | Title | Layer | Root cause | Status |
|----|-----|-------|-------|-----------|--------|
| F1 | critical | Groundedness gate bypassed in live path | 8/11 | `RAGPipeline::isGrounded` built but never called from `ChatController::chat` | FIXED (code-level groundedness check added) |
| F2 | critical | Unfiltered SQL-LIKE retrieval treated as ground truth | 6/7/8 | keyword fallback used with no similarity floor / rerank | MITIGATED (topic guard before fallback; similarity floor deferred) |
| F5 | high | `api_key` plaintext leaked in admin chatbot API | security | `encrypted` cast decrypts on JSON serialization; no `$hidden` | FIXED (`$hidden = ['api_key']`) |
| F3 | high | Stale embeddings never invalidated on content edit | 12/3 | reindex is manual-only; edited rows keep old embedding | FIXED (model `saved`/`deleted` events re-index) |
| F4 | high | Two divergent key sources (DB vs .env) | 6/12 | embeddings read `.env`, chat reads `LlmProvider` | PARTIAL (graceful null + warning; full reconciliation deferred) |
| C1 | critical(transport) | IlkomGalleryPage silently empties gallery | 9/10 | hard-coded `{data}` envelope assumption | FIXED (accepts both shapes) |
| H1 | high | Broken "Muat ulang" button (no-op) | 9 | `setActiveTab(t => t)` no-op | FIXED (extracted `fetchProjects`) |
| H2 | high | EventsPage swallows all fetch errors | 9 | `.catch(() => setEvents([]))` | FIXED (error UI + reload) |
| H3 | high | 401 forces full-page redirect on background polls | 10 | `window.location.href` on every 401 | FIXED (`isBackground` flag) |
| H1-backend | high(security) | Chatbot leaks pending/rejected submissions (IDOR) | 6/7 | `searchProjects` no status filter + returns `tracking_id` | FIXED (scope `accepted`, drop tracking_id) |
| H2-backend | high | `NewsController::update` 500 on image re-upload | 7 | undefined `$compressor` | FIXED (declared in `update()`) |
| H3-backend | high(security) | Open public registration | 6 | Breeze `register` route live | FIXED (routes removed, controller neutralized) |
| M1/M2 | medium | Missing AbortController on data pages | 10 | no cleanup/cancel | FIXED (DetailPage, DashboardPage) |
| M3 | medium | Inconsistent response envelope across admin pages | 9 | per-page ad-hoc unwrap | FIXED (`normalizeList` helper) |
| M4 | medium | `interactions.js` bare fetch, no creds/abort | 7/10 | raw fetch, silent swallow | FIXED (route via `fetchAPI`, `credentials:'include'`) |
| M5 | medium | Catch-all renders HomePage, not 404 | 10 | `*` → HomePage | FIXED (NotFoundPage) |
| M2-backend | medium | Raw exception messages leaked (ApiKey test) | security | `catch` returns `$e->getMessage()` | FIXED (generic msg + log) |
| M3-backend | medium | SVG upload allowed in News (stored XSS) | security | `svg` in mimes | FIXED (dropped svg) |
| M4-backend | medium | Unsafe `.env` injection / encrypted blob | security | unescaped preg_replace | FIXED (escaped, no encrypt) |
| M7-backend | medium | Arbitrary external image URLs (SSRF-ish) | security | unvalidated `thumbnail_url` | FIXED (scheme/host validation) |
| L5/L7-backend | low/med | sqlite fallback default, insecure session cookie | config | `DB_CONNECTION` default sqlite; no secure cookie | FIXED (mariadb default; secure cookie env) |
| F7 | n/a | GeminiService `candidates` typo | 7 | NOT PRESENT in current source (already correct) | VERIFIED no-op |
| F13 | low | Unescaped LIKE wildcard in hybridSearch | 6/7 | missing `addcslashes` | FIXED |
| M5/M6-backend | med | Dead middleware (IP whitelist/logger); no trusted proxies | config | never registered | PARTIAL (trusted proxies added; IP-whitelist documented dead) |

## Architecture diagnosis

The single most damaging structural fact is the **split-brain between the RAG service layer and the serving controller**. `ChatController::chat` keeps only `RAGPipeline::retrieveOnly()` (retrieval) and drops `process()`/`rerank()`/`isGrounded()` (verification). Consequences:

1. **Tool discipline broken (Layer 6/7/8):** any SQL-LIKE substring match becomes "ground truth" with no relevance score, no similarity floor.
2. **Interpretation unverified (Layer 8/11):** the strict zero-hallucination rule was words in the prompt; the code-level gate existed but was routed around — worse than missing because it created false assurance.
3. **Persistence stale (Layer 12):** embeddings are a manual-only artifact; edited content silently produces expired context, and the key-source split lets vector search fail *silently* into keyword mode.

Secondary: Layer 9 (hard 800-char truncation can mangle correct answers) and Layer 10 (frontend/transport corruption — gallery emptied by wrong envelope assumption; 401 redirect storm on polls).

## Ordered fix plan (applied)

1. Stop the secret leak (F5) — `LlmProvider::$hidden`. DONE
2. Gate groundedness in the live path (F1) — `isAnswerGrounded()` before persisting/sending. DONE
3. Discipline retrieval (F8/F2) — apply `topicGuard` before keyword fallback; warn on silent vector→keyword degradation (F4). DONE
4. Close the chatbot IDOR (H1-backend) and the NewsController 500 (H2-backend). DONE
5. Fix frontend transport corruption: gallery envelope (C1), dead reload (H1), error swallowing (H2), 401 storm (H3). DONE
6. Close security gaps: open registration (H3-backend), SVG XSS (M3-backend), raw exceptions (M2-backend), unsafe .env (M4-backend), SSRF-ish URLs (M7-backend), secure cookie / mariadb default (L5/L7). DONE
7. Correct and make runnable the Playwright E2E suite (path mismatch `/admin`→`/portal`, selectors, 404 test, webServer doc). DONE

## How to verify in a real environment

```bash
cd backend
php -l app/Http/Controllers/ChatController.php      # repeat per changed file
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000

cd frontend
npm install
npm run lint && npx vitest run
npx playwright install chromium
npm run dev   # :5173, proxies /api + /sanctum + /admin/* to :8000
npx playwright test
# first visual-regression run needs: npx playwright test visual-regression --update-snapshots
```

## Deferred (needs follow-up, not safe to fix blindly here)
- Full `LlmProvider`→embeddings key reconciliation (F4 deep fix).
- True similarity floor / rerank in the live retrieval path (F2).
- Wire or delete `AdminIPWhitelist` + `RequestLogger` middleware (needs migrations + UI).
- Delete neutralized `RegisteredUserController.php` (no `rm` in sandbox).
- Runtime E2E execution + visual baselines.
