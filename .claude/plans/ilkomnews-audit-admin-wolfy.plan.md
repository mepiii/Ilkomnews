# Plan: IlkomNews Audit + Admin + Wolfy

**Source PRD**: `PLAN.md`
**Complexity**: Large

## Summary
Run PLAN.md as gated phases, but reuse existing Laravel/React pieces already present. No graphify/BRAIN/memory. If a tool hangs, stop and switch to narrower targeted command/test/browser check.

## Patterns to Mirror
| Category | Source | Pattern |
|---|---|---|
| API routes | `backend/routes/api.php:59` | Admin APIs under `/api/admin`, guarded by `auth:sanctum`, `admin`, `throttle:admin`. |
| Encrypted keys | `backend/app/Models/LlmProvider.php:21` | `api_key` uses Laravel `encrypted` cast. Extend, do not replace. |
| Admin controllers | `backend/app/Http/Controllers/Admin/ChatbotApiController.php:22` | Validate request, mutate model, return JSON `{data: ...}`. |
| Admin client | `frontend/src/services/adminApi.js:3` | Central `fetchAdmin()`, `credentials: include`, normalized errors. |
| Admin routing | `frontend/src/routes/AdminRoutes.jsx:23` | Lazy pages inside auth provider + protected layout. |
| Backend tests | `backend/tests/Feature/Api/ChatApiTest.php:12` | PHPUnit feature tests + RefreshDatabase. |
| E2E | `frontend/playwright.config.js:2` | Specs under `frontend/e2e`, base URL `http://localhost:5173`. |

## Tasks
1. Discovery → create `ARCHITECTURE.md`; confirm stack, admin routes, features, key locations. Validate with targeted grep for key names.
2. Audit → create `AUDIT.md` + `DEADCODE.md`; bug/security/visual/perf/SEO/dead-code passes.
3. Triage → create `TASKLIST.md`; every High/Critical finding gets acceptance + verification.
4. Design system → create `DESIGN_SYSTEM.md`; preserve font-family/brand, avoid banned AI-template defaults.
5. Public pages → fix Home → Project List → Project Detail → News List → News Detail, one page at a time. Verify each via Playwright screenshot/console/responsive/light-dark before next.
6. Admin control center → improve existing admin IA/pages; document `ADMIN.md`; verify login/dashboard/nav/workflows.
7. Integrations/secrets → harden existing `llm_providers`; mask keys in JSON/UI; add test/reorder/audit/last-tested if missing; document `INTEGRATIONS.md`.
8. Wolfy RAG → verify/extend existing `ChatController` + RAG; test allowed/no-context/injection/fallback/logging; document `CHATBOT.md`.
9. Security/perf/SEO fixes → implement remaining tasklist items with category-specific tests.
10. Dead-code removal → delete only re-confirmed safe items; uncertain → `REMAINING_ISSUES.md`.
11. Final verification → actual one-by-one tests, not crosscheck only; write `CHANGELOG.md`.

## Validation
```bash
composer --working-dir=backend run test
npm --prefix frontend run lint
npm --prefix frontend run test -- --run
npm --prefix frontend run build
npm --prefix frontend run test:e2e -- e2e/home.spec.js
npm --prefix frontend run test:e2e -- e2e/projects.spec.js
npm --prefix frontend run test:e2e -- e2e/news.spec.js
npm --prefix frontend run test:e2e -- e2e/admin.spec.js
npm --prefix frontend run test:e2e -- e2e/chatbot.spec.js
```

Manual/MCP Playwright: Home, Project List/Detail, News List/Detail, Admin login/dashboard/content/chatbot/logs/settings, Wolfy allowed/no-context/injection/rate-limit. Test 375/768/1440 + light/dark + console clean.

## Risks
| Risk | Likelihood | Mitigation |
|---|---:|---|
| PLAN scope huge | High | Phase-gated; stop/fix first failed gate. |
| Features partly exist | High | Reuse/patch; no duplicate tables/pages. |
| API key leak | High | Hide raw attr; tests assert absence. |
| E2E/dev server hang | Medium | Single spec; manual server with timeout; MCP fallback. |
| Dead-code false positive | Medium | Recheck static/dynamic/DB refs; defer uncertain. |

## Acceptance
- Phase docs exist.
- Critical/High fixed or deferred with reason.
- LLM keys encrypted, masked, audit-logged, not exposed.
- Public/admin/chat verified one-by-one in browser.
- Backend/frontend tests/lint/build/e2e pass or exact failures recorded.
