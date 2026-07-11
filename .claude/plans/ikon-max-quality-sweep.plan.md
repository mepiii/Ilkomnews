# Plan: IKON Max-Quality Sweep (All Surfaces × All Quality Dimensions)

**Source**: `/ecc:plan Ultimate max do the most to this website on all feature use skills`
**Confirmed scope**: Intent = ALL (polish + finish + new where it earns its place) · Surfaces = Public + Admin + Chatbot(Wolfy) + Backend API · Dimensions = Frontend design, Accessibility, Performance, Security+Tests
**Complexity**: Very Large (multi-workstream program, executed in waves)
**Mode**: Ponytail-full inside each task — fix with the minimum correct change, never gold-plate a fix.

## Grounding — Strengths Already Present (verify, don't rebuild)

| Area | Status | Evidence |
|---|---|---|
| Security headers (CSP/HSTS/XFO/nosniff/Referrer/Permissions) | DONE | `backend/app/Http/Middleware/SecurityHeaders.php` — full CSP, HSTS preload |
| Admin route obfuscation (`/portal`) | DONE | `frontend/src/config/admin.js`, `App.jsx` |
| Cookie-session auth (no localStorage token) | DONE | `frontend/src/services/api.js`, `adminApi.js` |
| RAG pipeline (off-topic + jailbreak guard, rerank, compress, groundedness) | DONE | `backend/app/Services/RAGPipeline.php` |
| Build chunking (react-vendor/motion/icons split, dedupe) | DONE | `frontend/vite.config.js` |
| Dark-mode border override | DONE | `frontend/src/index.css` |
| Engagement signals persisted (views/likes/saves/shares) | DONE | `backend/app/Models/Interaction.php`, `frontend/src/services/interactions.js` |

## Known Gaps (root-caused from prior sessions + this audit)

1. **CSP uses `script-src 'self' 'unsafe-inline'`** — weakens XSS protection. Upgrade to nonce-based.
2. **`admin.spec.js` + `visual-regression.spec.js` hardcode stale `/portal` base + old creds** — pre-existing broken e2e (from memory log). Fix or quarantine.
3. **Admin "smooth animations" left mid-build** (interrupted per `today-2026-07-11.md`). Finish.
4. **No SEO surface**: likely no `sitemap.xml`, `robots.txt`, per-route OG/meta, or JSON-LD structured data.
5. **No explicit image perf discipline**: need to confirm `width/height`, `loading`, AVIF/WebP across public cards/gallery.
6. **Accessibility**: unverified keyboard nav, focus-visible, skip link, 44px touch targets, form labels/alt across 100 frontend files.

---

## Workstreams (each applies its named skill)

### WS1 — Accessibility (skill: `ecc:accessibility`)
- **A11Y-1** Audit public + admin with axe/Playwright a11y: contrast, names, roles, focus order. Produce finding list.
- **A11Y-2** Add skip-to-content link + `:focus-visible` ring token in `index.css`; apply to all interactive elements.
- **A11Y-3** Ensure all form inputs (admin forms, submit, search) have associated `<label>`/aria-label; fix missing ones in `SubmitProjectPage`, `NewsFormPage`, `GlobalSearch`.
- **A11Y-4** Touch targets ≥44px on mobile nav/filter pills/tabs (`KoleksiPage`, `ProjectsListPage`, `SmoothTabs`); verify no clip ≤375px.
- **A11Y-5** `prefers-reduced-motion` respected — gate framer-motion/`animations.js` timelines (already started in `useReducedMotion`? confirm + extend).
- **A11Y-6** Alt text + captions for gallery/news/article media via `ImageWithFallback`/`PlaceholderImage`.
- **Validate**: `npx playwright test e2e/` + manual axe scan 0 violations; keyboard-only walk of public + admin.

### WS2 — Frontend Design Quality (skill: `frontend-design`)
- **DES-1** Finish interrupted admin smooth animations (status-change pulse, page transitions, list entry) per `StatusBadge`/`AnimatePresence` already scaffolded.
- **DES-2** Anti-template sweep on Home (`HomePage`, `HeroSection`), News (`NewsPage`, `LatestNews`), Gallery (`IlkomGalleryPage`): enforce hierarchy (scale contrast), intentional rhythm, depth/layering, real type pairing — both light & dark intentional.
- **DES-3** Resolve any "default Tailwind/shadcn template" feel; add one deliberate editorial/bento moment on Home.
- **DES-4** Hover/focus/active states on all cards/buttons (`GlowCard`, `SlideButton`, `FlowButton`, expandable cards) — designed, not default.
- **Validate**: `npm run build`; visual screenshots 320/768/1440 light+dark, both themes intentional.

### WS3 — Performance / Core Web Vitals (skill: `ecc:performance-optimizer`)
- **PERF-1** Image discipline: explicit `width`/`height`, `loading="lazy"` (below fold), `fetchpriority="high"` on hero only, AVIF/WebP where source allows, across `NewsExpandableCard`, `ProjectExpandableCard`, gallery, articles.
- **PERF-2** Font loading: max 2 families, `font-display: swap`, preload critical weight only (confirm `index.css`/Google Fonts usage).
- **PERF-3** Route-level code-splitting for heavy admin pages (`React.lazy` + `Suspense`) to cut initial bundle.
- **PERF-4** Animation perf: confirm compositor-only props (transform/opacity); remove layout-bound anims.
- **PERF-5** Bundle budget check (landing <150kb JS gzip) via `vite build` report; trim oversized chunks.
- **Validate**: Lighthouse on Home/News/Admin — LCP<2.5s, INP<200ms, CLS<0.1.

### WS4 — SEO (skill: `ecc:seo-specialist`)
- **SEO-1** Per-route `<title>`/description/meta via a small `useSeo()` hook + `react-helmet`-free native `<title>`/meta (avoid new dep).
- **SEO-2** Open Graph + Twitter cards on public detail pages (news/article/event/project).
- **SEO-3** JSON-LD structured data: `NewsArticle`/`Event`/`Article`/`CollectionPage` on detail + listing routes.
- **SEO-4** `public/robots.txt` + `public/sitemap.xml` (backend route or static gen) + canonical tags.
- **Validate**: `npx playwright` fetch `/sitemap.xml`, `/robots.txt` 200; rich-result check on detail pages.

### WS5 — Security (skill: `ecc:security-reviewer` + `aikido:scan`)
- **SEC-1** CSP nonce: drop `'unsafe-inline'`, inject per-request nonce into `SecurityHeaders` + apply to inline scripts/styles (or move inline → external). Largest single hardening.
- **SEC-2** Rate limiting on public write/expensive endpoints: submissions POST, chat, interactions stats (`api.php` routes).
- **SEC-3** Secrets scan: `aikido:scan` over repo; confirm no hardcoded keys in `GeminiService`/`AzureOpenAIService`/`EmbeddingService`/`LLMRouter` (env-backed).
- **SEC-4** Input validation audit on all `store()`/`update()` admin controllers + `ChatController` query size cap.
- **SEC-5** Chatbot guard review: `isGrounded` 20% threshold + jailbreak list — keep, optionally tighten; confirm no prompt-injection exfil path.
- **Validate**: `aikido:scan` clean; CSP header has nonce, no `unsafe-inline`; rate-limit returns 429.

### WS6 — Tests (skill: `ecc:test-coverage` + `ecc:e2e-runner`)
- **TST-1** Fix/quarantine broken `admin.spec.js` + `visual-regression.spec.js` (stale `/portal` + creds) — point at real `/portal` + seed admin.
- **TST-2** Expand backend Feature tests for new SEC/PERF validations (rate limit 429, CSP nonce presence).
- **TST-3** Add frontend unit tests for new `useSeo`/a11y helpers where logic exists.
- **TST-4** E2E happy-path for Wolfy chat (already have `chat-widget.spec.js`/`chatbot.spec.js` — extend, verify green).
- **Validate**: `php artisan test` green · `vitest run` green · `playwright test` green (incl. fixed admin specs).

### WS7 — Chatbot (Wolfy) Depth
- **CHB-1** Eval harness: assert RAG `process()` returns grounded/off-topic/jailbreak correctly (backend Feature/Unit test — currently none for RAG).
- **CHB-2** Graceful fallback when `retrieveOnly` + keyword LIKE both empty (already handled) — add a "suggested topics" chip UI in `WolfyWidget`.
- **CHB-3** Streaming/loading state polish in `WolfyWidget.jsx`; honor reduced-motion.
- **Validate**: unit test RAG branches; manual chat walk with off-topic + jailbreak inputs.

---

## Execution Sequencing (waves)

- **Wave A (foundation, parallel-safe)**: WS1-A11Y-1 audit · WS5-SEC-3 scan · WS6-TST-1 fix broken specs. (Read-only/low-risk.)
- **Wave B (security + a11y fixes)**: WS5-SEC-1/2/4 · WS1-A11Y-2..6. (Highest leverage, low visual risk.)
- **Wave C (design + perf + seo)**: WS2 · WS3 · WS4. (Visual, do after stability.)
- **Wave D (chatbot + test expansion)**: WS7 · WS6-TST-2..4. (Polish + lock-in.)

Each wave ends with its Validate commands green before next wave.

## Files Likely Touched (representative, not exhaustive)
- `backend/app/Http/Middleware/SecurityHeaders.php` (SEC-1 nonce)
- `backend/routes/api.php` (SEC-2 rate limit)
- `backend/app/Http/Controllers/**` (SEC-4 validation)
- `backend/tests/**` (TST-2, CHB-1)
- `frontend/src/index.css` (A11Y-2 reduced-motion, focus)
- `frontend/src/**/*.jsx` public + admin components (WS1/WS2/WS3)
- `frontend/src/services/interactions.js`, `WolfyWidget.jsx` (WS7)
- `frontend/public/robots.txt`, `sitemap.xml`, `frontend/src/hooks/useSeo.js` (WS4)
- `frontend/e2e/admin.spec.js`, `visual-regression.spec.js` (TST-1)

## Validation (full program)
```bash
cd backend && php artisan test && vendor/bin/phpunit
cd ../frontend && npm run build && npm run test && npm run test:e2e
# Lighthouse (Home/News/Admin) + axe scan: LCP<2.5s INP<200ms CLS<0.1, 0 a11y violations
# aikido:scan clean; curl -I localhost:8000 → CSP nonce present, HSTS present
```

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| CSP nonce breaks existing inline scripts/styles | Med | Move inline → external file or inject nonce; test all pages post-change |
| Admin animations regress mobile perf | Low | Gate with reduced-motion; keep transforms compositor-only |
| SEO meta hook conflicts with SPA routing | Low | Use native title/meta per route via small hook; no heavy dep |
| Breaking 49 existing green e2e during sweep | Med | Run `playwright test` after each wave; fix before next |
| Scope too large for one pass | High | Waves are independent; confirm per-wave or trim |

## Acceptance
- [ ] 0 axe/keyboard a11y violations on public + admin (≤375px usable)
- [ ] CSP nonce-based, no `unsafe-inline`; rate-limit 429 on write/expensive endpoints
- [ ] Lighthouse CWV green on Home/News/Admin
- [ ] sitemap.xml + robots.txt + JSON-LD on detail pages; per-route meta
- [ ] Admin animations finished; design intentional in light+dark
- [ ] All e2e green (broken specs fixed); RAG unit tests present
- [ ] `php artisan test` + `vitest` + `playwright` all green

---
**WAITING FOR CONFIRATION**: Confirm to begin Wave A, or modify (e.g. "drop WS4 SEO", "only Waves A–B", "tighter budget").
