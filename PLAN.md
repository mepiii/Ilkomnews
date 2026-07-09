# Orchestrator Prompt — IlkomNews Full Codebase Audit, Cleanup, Admin Control Center & RAG Chatbot Build

Paste this whole file into a Claude Code session (or save as `ORCHESTRATOR.md` in the repo root and tell Claude Code to read it). Fill in **Section 0** first — everything downstream depends on it.

**What's new in this version:**
- Added a dedicated dead code / orphaned file cleanup phase and subagent.
- LLM API keys (Gemini/Azure) are no longer `.env`-only — they now live encrypted in the database and are fully manageable from the Admin panel (add, edit, rotate, test, switch provider) without a code deploy.
- Admin Control Center promoted to its own major phase/spec: monitor and operate the entire site from admin, not just CRUD content.
- Added an explicit "evolve, don't replace" identity constraint so the minimal redesign stays recognizable.
- Section 0 prefilled with what's already known about IlkomNews; genuine unknowns (repo path, exact admin structure, hosting provider) are flagged for Phase 0 to discover rather than guessed.
- Expanded to a full 14-phase pipeline (Phase 0 → Phase 13) covering discovery through final cleanup — this is meant to run as one continuous pipeline, not a one-off pass.

---

## 0. Project Context

```
Project name          : IlkomNews
Repo root path         : ___________ (fill in)
Backend stack          : Laravel + MariaDB — confirm exact versions in Phase 0
Frontend stack (now)   : Blade + React/Vue components + Tailwind — confirm exact split in Phase 0
Hosting                : shared hosting (cPanel-style) — confirm exact provider in Phase 0
Node available on host?: assume NO unless confirmed in Phase 0
Cron granularity       : confirm in Phase 0 (assume 5–15 min if cPanel)
Admin panel path       : unknown — Phase 0 must map current admin routes, roles, and permissions from scratch
Pages in scope         : Home/Beranda, Project List, Project Detail, News List, News Detail, Admin Dashboard
Existing design tokens : confirm tailwind.config / css vars path in Phase 0
Known existing features to preserve: dark mode, PWA support, Ctrl+K command search, bilingual content (ID/EN)
Chatbot working name   : Wolfy (site-scoped RAG assistant) — if a prior spec for this already exists in the repo or docs, extend it, don't redesign from scratch
Community size         : 2,000+ FASILKOM community members
Current LLM key storage: unknown — Phase 0 must locate every place a Gemini/Azure/OpenAI-style key currently lives (`.env`, config files, hardcoded strings) before Phase 7 migrates them to the database
```

If any field is still unknown after Phase 0, that's a Phase 0 failure — do not proceed to Phase 1 on a guess.

---

## 1. Role & Operating Principles

You are acting as a lead engineering + design orchestrator working autonomously across a full codebase, coordinating specialized subagents. You are not writing a report for a human to action later — **you find problems and you fix them**, phase by phase, with evidence at every step.

Non-negotiable working principles:

1. **Verification-first.** No task is "done" until you've actually run the build/lint/tests and confirmed the page renders with no new console/PHP errors. Claiming success without running anything is not acceptable.
2. **Fix, don't just report.** Every audit finding gets a task, every task gets attempted, every attempt gets verified. Findings you deliberately defer must be logged with a reason, not silently dropped.
3. **Subagent-driven.** Dispatch scoped subagents per domain (roster in Section 4). Each subagent gets a narrow mandate and a single deliverable file. Do not let one generalist pass try to do everything at once — that's how regressions slip through.
4. **Gated phases.** Do not start Phase N+1 until Phase N's deliverable exists and has been verified. If a phase reveals something that invalidates an earlier assumption, stop and re-run the affected earlier phase.
5. **Self-critique loop.** After implementing any batch of fixes, re-audit the same surface area before marking it verified. Assume you missed something the first time.
6. **Deletions are recoverable, not reckless.** Everything lives in git — deleting confirmed-dead code is fine and encouraged, but only after the verification steps in Section 11, never as a first guess.
7. **No silent scope creep.** If a fix requires breaking a hard constraint (Section 2), stop and flag it for a decision instead of proceeding.

---

## 2. Hard Constraints — Never Violate These

**Backend is frozen.**
- Do not change the backend language, framework, ORM, or database engine.
- Do not introduce anything that needs a persistent process, a queue worker, WebSockets, Redis/Memcached, or containerization — unless Section 0 confirms the host already supports it.
- Do not assume Node is available server-side. Frontend build tooling (Vite, esbuild, etc.) runs at build time only and ships static assets; nothing runs a Node process in production unless explicitly confirmed in Section 0.
- Cron-dependent features must fit the host's actual cron granularity, not an assumed one.
- Outbound HTTPS calls from the backend to third-party APIs (Gemini, Azure) are fine — that's just an HTTP client call, not a new backend service.

**No feature removal.** Simplification means clearer code and clearer UI, never a smaller feature set. Dark mode, PWA support, Ctrl+K search, and bilingual content are existing features — they get preserved and polished, not dropped. Before Phase 4, produce a feature inventory (Phase 0) and check every item off again at the end (Phase 13).

**Evolve the identity, don't replace it.** The redesign should read as a more disciplined, refined version of the current IlkomNews — not a generic template that happens to run on the same backend. Keep the existing brand colors, logo, and voice; tighten spacing, hierarchy, and consistency rather than swapping the identity out for something unrecognizable.

**Typography: size and weight only.** Never change the font-family. Font size, weight, line-height, letter-spacing, and type scale are all fair game.

**Aesthetic direction: minimal, clean, quiet — not "AI slop."** Right now, AI-generated interfaces cluster around three defaults. Actively avoid landing on any of them unless the existing brand already committed to it on purpose:
1. Warm cream background with a high-contrast serif and a terracotta/clay accent.
2. Near-black background with a single neon/acid-green or vermilion accent and heavy glow.
3. Broadsheet layout — hairline rules, zero border-radius, dense newspaper columns.

Concretely banned unless there's a specific reason tied to this brand: oversized blurred gradient "orb" backgrounds, glassmorphism piled on every card, box-shadow/glow stacked on top of glow, rounded-full applied to everything, decorative animation with no purpose, mixed icon styles, generic purple-blue "AI product" gradients.

Dark mode specifically: darken surface tokens (avoid pure `#000000` and avoid overly bright greys that fight the background), and where glow/shadow effects already exist, reduce their opacity rather than removing the depth cue entirely.

**LLM provider keys never live in code or `.env` going forward.** Gemini/Azure (and any future provider) API keys are stored encrypted in the database and managed entirely from the Admin panel — see Section 10. `.env` still holds `APP_KEY` (Laravel's own encryption key), because that's what encrypts the stored keys — it's not a way around encryption, it's what makes the encryption work.

**Admin panel: optimize for a non-technical staff user**, not for the developer, while giving them real operational control (Section 9). Fewer clicks to common actions, consistent grouping, plain-language labels ("Save changes," not "Submit"), clear empty/error states that say what happened and what to do next.

**Deletion safety.** Never remove a file, route, column, or dependency just because a single grep pass found no reference. Confirm per the checklist in Section 11 first.

---

## 3. Tooling to Use — Don't Hand-Roll What Already Exists

- **frontend-design skill** — use it to define the design token system (color/type/layout/signature) in Phase 3, and to self-critique the design plan before writing any component code. Its core rule: spend boldness in exactly one signature element, keep everything else quiet and disciplined, and justify any real risk taken rather than defaulting to a template.
- **shadcn MCP** — pull the canonical accessible primitive (button, dialog, table, form, nav, etc.) before building anything custom. Don't reinvent a component shadcn already provides cleanly.
- **Magic MCP (21st.dev)** — use for bespoke polish/variants once the shadcn primitive is in place and needs more visual craft than the primitive alone gives you. Magic is for finishing, not for skipping the primitive step.
- **Laravel's built-in `Crypt` facade / `encrypted` Eloquent cast** — this is what stores API keys safely in MySQL on shared hosting. No external KMS/vault service needed, no new infrastructure — it's already part of the framework.
- **Subagents** — per the roster below. Each subagent's output is a specific file, not a chat message.

---

## 4. Subagent Roster

| # | Agent | Mandate | Deliverable |
|---|-------|---------|-------------|
| 1 | Repo Cartographer | Map the full repo: routes, controllers/models, components, shared utilities, build pipeline, hosting constraints, current admin structure/roles, everywhere a secret/API key currently lives | `ARCHITECTURE.md` |
| 2 | Bug & Error Hunter | Static analysis + live crawl for JS errors, broken links, 404/500s, N+1 queries, PHP warnings/notices, unhandled exceptions | Findings → `AUDIT.md` |
| 3 | Visual/UX Auditor | Screenshot every in-scope page at mobile/tablet/desktop, light/dark; flag misalignment, overflow, contrast failures, inconsistent spacing/type scale, broken responsive behavior | Findings → `AUDIT.md` |
| 4 | Security Auditor | Check SQLi/XSS vectors, exposed `.env`/secrets, CSRF coverage, auth/session handling, file-upload validation, admin route protection, API endpoint auth/rate-limits, dependency CVEs | Findings → `AUDIT.md` |
| 5 | Performance Auditor | Lighthouse/PageSpeed pass, bundle size, N+1 queries, image optimization, caching headers, lazy-loading | Findings → `AUDIT.md` |
| 6 | SEO Auditor | Meta tags, OG tags, sitemap.xml, robots.txt, semantic HTML, heading hierarchy, canonical URLs, structured data for news articles | Findings → `AUDIT.md` |
| 7 | Design System Architect | Define the token system (color, type, spacing, radius, shadow/glow scale, motion) per the frontend-design skill; explicitly dial back existing glow/blur intensity while keeping brand identity | `DESIGN_SYSTEM.md` |
| 8 | Frontend Refactor Engineer | Implement approved component/layout fixes page-by-page using shadcn MCP + Magic MCP | Code changes + before/after screenshots |
| 9 | Admin Control Center Engineer | Build the expanded admin experience: content, integrations, monitoring, users, settings, all navigable and operable without touching code | Code changes + `ADMIN.md` |
| 10 | Integrations & Secrets Architect | Move LLM provider keys out of code/`.env` into an encrypted DB-backed settings table with a full admin UI (add/edit/rotate/test/switch provider, masked display, audit log) | Migration + admin UI + `INTEGRATIONS.md` |
| 11 | RAG Chatbot Engineer | Build/extend Wolfy end-to-end per Section 10, consuming keys via the Integrations layer above — never a raw `.env` read | Code changes + `CHATBOT.md` |
| 12 | Codebase Hygiene Auditor | Find unused dependencies, orphaned components/views/routes, orphaned DB tables/columns, orphaned assets, dead/commented-out code, duplicate near-identical components | `DEADCODE.md` (each item tagged safe-to-delete vs needs-confirmation) |
| 13 | QA / Verification Agent | Regression pass after every phase: build succeeds, routes 200, console clean, visual diff acceptable, feature-parity checklist intact | Sign-off entry in `CHANGELOG.md` |

---

## 5. Phased Workflow (sequential, gated)

**Phase 0 — Discovery.** Agent 1 produces `ARCHITECTURE.md`: full repo map, feature inventory, current admin routes/roles/permissions, and every location an LLM/API key currently lives. Confirm every unknown field from Section 0 before continuing.

**Phase 1 — Full Audit.** Agents 2–6 and Agent 12 run in parallel over the pages and codebase in scope. Consolidate everything into `AUDIT.md` (bugs/visual/security/performance/SEO) and `DEADCODE.md` (hygiene findings), each entry tagged with severity (Critical/High/Medium/Low) and, for dead code, a confidence tag (safe-to-delete / needs-confirmation).

**Phase 2 — Task List.** Turn `AUDIT.md` into `TASKLIST.md` using the schema in Section 13. Every item gets acceptance criteria and an estimated blast radius. Order by severity, then by shared blast radius.

**Phase 3 — Design System.** Agent 7 defines `DESIGN_SYSTEM.md` before any component is touched: named palette (4–6 hex values, keeping current brand colors), type roles (same font-family, new scale/weights only), layout concept, one signature element per major page, and a quieter glow/shadow/elevation scale than what exists now. Self-critique against the three banned defaults in Section 2.

**Phase 4 — Page-by-Page Remediation (public site).** In this order: Home/Beranda → Project List → Project Detail → News List → News Detail. Fix bugs first (from `TASKLIST.md`), then apply the design system, using shadcn MCP for primitives and Magic MCP for polish. Screenshot before/after at each breakpoint. Verify with Agent 13 before moving to the next page.

**Phase 5 — Tech Stack Adoption (frontend only).** Any new frontend dependency goes through the checklist in Section 8 before adoption. Log the decision in `ARCHITECTURE.md`.

**Phase 6 — Admin Control Center Build.** Agent 9 rebuilds the admin IA and views per Section 9, applying the same design system for consistency — the admin should feel like the same product, just built for a different job.

**Phase 7 — Integrations & Secrets Migration.** Agent 10 builds the encrypted DB-backed key storage and the admin UI to manage it, per Section 10. This must exist before Phase 8, since the chatbot consumes keys through this layer.

**Phase 8 — RAG Chatbot Build (Wolfy).** Agent 11 builds/extends the chatbot per Section 10, reading provider keys exclusively through the Integrations layer from Phase 7.

**Phase 9 — Security Hardening.** Implement fixes from the security portion of `TASKLIST.md`, plus the API/security checklist in Section 12.

**Phase 10 — Performance Optimization.** Implement fixes from the performance portion of `TASKLIST.md`.

**Phase 11 — SEO Implementation.** Implement fixes from the SEO portion of `TASKLIST.md`.

**Phase 12 — Dead Code Removal.** Only now, after every feature phase has run and been verified, execute deletions from `DEADCODE.md` that are still confirmed safe (re-check — a phase above may have started using something previously flagged dead). Anything still `needs-confirmation` gets flagged for a human decision, not deleted.

**Phase 13 — Final Verification & Self-Critique.** Agent 13 runs a full regression pass. Re-run a lightweight Phase 1 ("Delta Audit") looking for anything introduced or missed during Phases 4–12. Check the Phase 0 feature inventory item-by-item. Produce `REMAINING_ISSUES.md` for anything intentionally deferred, with the reason. Write a plain-language summary in `CHANGELOG.md` — what changed, why, and what's left.

---

## 6. Design System Rules (detail)

Follow the frontend-design skill's two-pass process: **brainstorm the token system, critique it against generic defaults, then build.**

- **Color:** 4–6 named hex values. Keep existing brand colors; adjust supporting neutrals so dark mode reads as a darkened surface, not pure black.
- **Type:** same font-family as today. Define 2–3 roles (display/body/utility) with a deliberate scale — don't just inherit whatever sizes exist ad hoc across components.
- **Layout:** one-sentence concept per page type plus an ASCII wireframe if helpful, before touching code.
- **Signature:** pick exactly one memorable element per major page (hero treatment, a distinctive card pattern, a nav detail) and spend the "boldness budget" there. Everything else stays quiet.
- **Glow/shadow/elevation scale:** define 3–4 steps, all lower-intensity than what currently exists if the current UI leans glowy. Reuse the same scale everywhere — no one-off shadows per component.
- **Quality floor, non-negotiable regardless of aesthetic direction:** responsive down to mobile, visible keyboard focus states, respects `prefers-reduced-motion`.
- **Copy in the UI:** plain verbs, active voice, name things by what the user controls ("Save changes" not "Submit"), error states say what happened and how to fix it.

---

## 7. Page-by-Page Scope — What "Improve" Means Concretely

- **Home / Beranda:** the hero should lead with the single most characteristic thing about IlkomNews, not a generic stat-block-plus-gradient template. Clear path into Projects and News from the fold.
- **Project List:** consistent card pattern, clear filter/sort if the feature already exists, obvious empty state.
- **Project Detail:** clear information hierarchy (what it is, status, who's involved, outcomes/media) — check this against the existing data model in `ARCHITECTURE.md` so no field gets silently hidden.
- **News List:** consistent card pattern distinct from Project List, pagination or infinite scroll matching whatever's already implemented, obvious empty/loading states.
- **News Detail:** readable article layout, correct heading hierarchy for SEO, share/related-articles if that feature exists today.

---

## 8. Tech Stack Change Policy (frontend only)

Before adopting any new frontend dependency, tool, or framework swap, confirm all of the following — if any answer is "no" or "unconfirmed," do not adopt it without flagging for a decision:

- [ ] Runs only at build time or client-side — no new server-side process required in production.
- [ ] Final output is still static assets (HTML/CSS/JS) deployable the same way the site is deployed today, unless Section 0 confirmed the host supports something more.
- [ ] Bundle size impact is justified by what it replaces or improves.
- [ ] Doesn't require a database engine change or new persistent storage service.
- [ ] Decision and reasoning logged in `ARCHITECTURE.md`.

A full framework swap (e.g. Blade → Vue SPA) is a major decision — propose it, show the tradeoff, and wait for explicit sign-off before executing it across the whole site.

---

## 9. Admin Control Center Spec

The goal: the admin can monitor and operate the entire site from the panel — no code, no server access, no `.env` edits for anything covered here. Still has to be easy to navigate for a non-technical daily user.

**Information architecture — group by job, not by database table:**
- **Content** — News, Projects, categories/tags, media library.
- **Chatbot & Integrations** — everything in Section 10: provider keys, primary/fallback order, rate limits, knowledge-base management (add/edit/re-index source content), chat logs and usage.
- **Monitoring & Logs** — recent errors (surface Laravel's log in a readable list, don't make them SSH in), security audit log (login attempts, key changes, admin actions), a simple uptime/health snapshot.
- **Users & Roles** — admin accounts and permission levels, if more than one admin exists.
- **Settings** — site-wide settings, SEO defaults (default meta/OG values), feature toggles for anything built as optional.

**Navigation rules:**
- Persistent grouped sidebar, not a flat list of 30 links.
- Breadcrumbs on every nested page.
- The most common actions (publish news, add project, check chatbot usage) reachable in two clicks from the dashboard home.
- Consistent confirm/success/error patterns across every module — one pattern, reused everywhere, not a different modal style per page.
- Apply the same design system from Section 6 here too — the admin should look like it belongs to the same product, just built for a different job.

**Discovery requirement:** Phase 0 must map whatever admin structure exists today before Phase 6 redesigns it — don't assume a structure, find the real one first.

---

## 10. Integrations, Secrets & RAG Chatbot Build Spec

### 10.1 Provider key storage (must exist before the chatbot is built)

- Add a `settings` or `integrations` table storing: provider name, encrypted API key (Laravel `encrypted` cast, backed by `APP_KEY`), active/inactive flag, priority order (primary/fallback), last-tested-at timestamp, last-tested-result.
- Admin UI under **Chatbot & Integrations**: add a key, edit a key, a "Test connection" button that makes a live cheap call to confirm the key works, a masked display (only ever show the last 4 characters after saving), and a way to reorder primary/fallback providers.
- Every add/edit/rotate/delete action writes to the security audit log with who and when — no silent key changes.
- Nothing here ever gets written back into `.env` or a config file — it's a DB read at request time, cached briefly in memory per-request, never logged in plaintext anywhere (including error logs/exception traces).
- Rate-limit settings (requests per IP/session per time window) also live in this same admin-managed settings table, not hardcoded — so the admin can tighten it if a free-tier quota is getting hit.

### 10.2 RAG pipeline (shared hosting, no vector DB available)

- Store embeddings in MySQL, either as a JSON/text column or a dedicated `embeddings` table keyed to source content (news articles, project entries, FAQ/knowledge-base entries the admin adds).
- Compute cosine similarity in the backend language at query time over the candidate set, or precompute nearest-neighbor batches on a schedule that fits the host's cron granularity.
- Scope retrieval to IlkomNews's own content — Wolfy is a site-scoped assistant, not an open-domain chatbot.
- Knowledge base is admin-editable from the Chatbot & Integrations screen: add/edit/remove source entries, trigger re-indexing, without a deploy.

### 10.3 Reliability

- Providers: Gemini free tier as primary, Azure free/credit tier as fallback, order configurable per 10.1.
- If the primary's quota is exhausted, fail over automatically to the next active provider in priority order; if all are exhausted, degrade gracefully to a cached FAQ response or a clear "try again shortly" message — never a raw error to the end user.
- Log every request/response pair (minus anything sensitive) for later review, visible in the admin's Chatbot & Integrations usage view.

### 10.4 Bilingual

- Support Indonesian and English queries/answers, matching whatever language the source content and the rest of the site already use.

### 10.5 Output

`INTEGRATIONS.md` covering the settings table schema, encryption approach, and audit-log format. `CHATBOT.md` covering the knowledge-base schema, retrieval config, and provider fallback behavior — plus the actual working feature wired into the site (widget or dedicated page, matching the design system from Section 6).

---

## 11. Codebase Hygiene / Dead Code Removal Spec

**What counts as a candidate:**
- Unused composer/npm dependencies (declared but never imported/called).
- Components/views/partials not referenced by any route, include, or import.
- Routes not linked from any nav, view, or known API consumer.
- DB tables/columns not read or written by any model, migration-only artifacts left over from abandoned features.
- Asset files (images, fonts, old CSS) not referenced in code, views, or DB content fields.
- Commented-out code blocks with no explanatory note attached.
- Duplicate or near-duplicate components that should be consolidated into one.

**Verification before flagging safe-to-delete — check all of these, not just a static grep:**
- No static reference anywhere in code or views.
- No dynamic reference (variable-built Blade `@include`/component names, config-array entries, seeders/factories, storage-disk paths, sitemap/feed generators that read from DB content rather than code).
- No reference from DB content itself (e.g. a CMS field storing a path to an asset).
- Not part of a rollback/previous-version path still intentionally kept.

Anything that fails any of the above is `needs-confirmation`, not `safe-to-delete`. Only items that pass every check get removed in Phase 12, and only after Phases 4–11 have run (something might start using a previously-dead file during those phases).

**Deletion mechanics:** delete via normal git operations so it's fully recoverable from history — never just comment it out and leave it in the tree, that's not cleanup, that's clutter with extra steps.

---

## 12. Security / Performance / SEO Checklists

**Security**
- [ ] No secrets in the repo or in client-visible bundles.
- [ ] LLM provider keys encrypted at rest in the DB, masked in the UI, changes audit-logged (Section 10.1).
- [ ] CSRF protection on all state-changing routes.
- [ ] Auth/session handling reviewed (timeouts, admin route protection, password/reset flows if present).
- [ ] Public and admin API endpoints have proper authentication and rate limiting.
- [ ] File uploads validated (type, size, stored outside the web root or with execution disabled).
- [ ] Dependencies checked against known CVEs.
- [ ] Input sanitized/parameterized everywhere it touches SQL or output HTML.

**Performance**
- [ ] Images optimized and lazy-loaded below the fold.
- [ ] N+1 queries eliminated on list/detail pages.
- [ ] Caching headers set for static assets.
- [ ] Bundle size checked after every frontend change, not just at the end.

**SEO**
- [ ] Unique title/meta description per page.
- [ ] Open Graph tags for news/project detail pages.
- [ ] `sitemap.xml` and `robots.txt` present and correct.
- [ ] Correct single `<h1>` per page and logical heading order.
- [ ] Structured data (Article schema) on news detail pages.

---

## 13. Deliverable File Templates

**`TASKLIST.md` row schema:**

| ID | Category | Page/Module | Severity | Description | Root Cause | Fix Plan | Files Touched | Status | Verification |
|----|----------|-------------|----------|--------------|------------|----------|----------------|--------|---------------|

Status values: `Todo` → `In Progress` → `Fixed` → `Verified`. Nothing is `Verified` without evidence.

**`DEADCODE.md` row schema:**

| Item | Type (file/route/column/dependency) | Confidence (safe-to-delete/needs-confirmation) | Reason | Verified Checks Passed |
|------|--------------------------------------|--------------------------------------------------|--------|--------------------------|

**`AUDIT.md`:** raw findings grouped by subagent, before triage into `TASKLIST.md`.

**`ARCHITECTURE.md`:** repo map, routes, models/controllers, build pipeline, confirmed hosting constraints, current admin structure, tech-stack decisions log.

**`DESIGN_SYSTEM.md`:** token system from Phase 3, kept up to date as the single source of truth.

**`ADMIN.md`:** the admin IA, module list, and role/permission model.

**`INTEGRATIONS.md`:** settings table schema, encryption approach, audit-log format.

**`CHATBOT.md`:** knowledge-base schema, retrieval config, provider fallback behavior.

**`CHANGELOG.md`:** dated entries per phase, plain-language summary at the end of Phase 13.

**`REMAINING_ISSUES.md`:** anything deliberately deferred, with the reason.

---

## 14. Stop Conditions — Escalate Instead of Proceeding

Stop and ask for a decision instead of continuing if:
- A fix requires breaking a Section 2 hard constraint.
- A tech-stack change fails the Section 8 checklist but seems necessary anyway.
- Two audit findings contradict each other about intended behavior.
- A "simplification" would remove a feature rather than clarify it.
- A `DEADCODE.md` item can't be fully verified safe but seems obviously unused — flag it, don't delete it anyway.

---

## 15. Kickoff Message

Once Section 0 is filled in, start a fresh Claude Code session in the repo root and send:

```
Read ORCHESTRATOR.md in full. Confirm your understanding of Section 0
and the hard constraints in Section 2, then begin Phase 0.
```

Do not skip ahead to Phase 4 or Phase 8 just because the UI and chatbot are the exciting parts — the audit, task list, and integrations layer in the earlier phases are what keep the later ones from breaking things silently.
