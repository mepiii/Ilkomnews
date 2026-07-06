# Full Codebase Audit, Fix & Cleanup

You are auditing this entire codebase end-to-end: bugs, security, dead code, UI/UX, visual quality, performance, and project hygiene. Then you fix everything you safely can, and reorganize the project structure. Work in phases, use subagents for parallel investigation, and do not break anything that currently works.

## Ground rules

- **Never break working functionality.** Every fix must preserve current behavior unless the "bug" is the behavior itself. If unsure whether something is dead code or just rarely used, verify with a real code search before touching it — don't guess.
- **Small, verifiable steps.** Make changes in logical batches, not one giant rewrite. After each batch: run the build/lint/tests if they exist, confirm nothing broke, then move to the next batch.
- **Evidence before deletion.** Before deleting any file, component, or code path, grep/search the whole repo for references (imports, dynamic requires, string-based references, config files, route definitions). If you can't find a reference anywhere and it's not an entry point, it's a deletion candidate — log it, don't just silently remove it.
- **Use git as a safety net.** If this is a git repo, commit (or at least note you'd commit) at the end of each phase with a clear message, so changes are reversible. If it's not a git repo, flag that at the start and suggest initializing one before proceeding.
- **Track everything in a running TODO list** so nothing gets dropped across phases.
- **No AI-sounding filler in code comments, commit messages, or the final report.** Be direct and specific about what was wrong and what changed.
- **Use whatever skills, MCP connectors, and subagents actually help.** Load relevant skills before doing skill-covered work (don't guess at conventions you can just look up). If you notice an improvement opportunity that isn't explicitly listed in this prompt but is clearly worth doing — and safe, reversible, in scope — do it, and note it in the final report as a self-initiated improvement rather than skipping it for not being asked.

## Tech stack constraints — read before making any stack changes

- **Backend: Laravel/PHP is fixed.** Do not replace or move away from Laravel on the backend. You may add an additional backend-adjacent technology alongside it (e.g. a small service, queue worker, or middleware layer) only if it's genuinely useful, compatible with standard shared hosting, and doesn't require a second server/process the current hosting can't run.
- **Frontend is flexible.** You may change, add, or mix frontend tech stacks (e.g. introduce Vue/React/Alpine/htmx alongside or instead of what's there) if it results in a clearly better outcome. If mixing two frontend approaches, make sure there's a clean integration point (shared API contract, consistent build pipeline) rather than two disconnected systems bolted together.
- **Database: MySQL is the default**, since it's what the shared hosting provides at no extra cost. You may introduce another storage mechanism (e.g. SQLite for something local/simple, file-based caching, etc.) only if it runs on the same shared hosting with zero additional cost and zero additional infrastructure (no separate hosted DB service, no paid add-on). If a genuinely better option isn't compatible with that constraint, stay on MySQL and say why you didn't switch.
- **Everything must stay deployable on the current shared hosting** — no Docker-only solutions, no requiring a dedicated server process, no paid third-party services, unless the user explicitly approves it later.
- When adding any new piece of the stack, state clearly in the final report what was added, why, and confirm it fits these constraints.

## Chatbot AI: improve retrieval, knowledge base, and security (no local models)

This project uses free-tier hosted LLM APIs (Gemini, Groq, or similar) — not a local/self-hosted model. So "training the chatbot" here does NOT mean fine-tuning model weights. It means:

- **Improve the retrieval/RAG pipeline.** Audit how documents are chunked, embedded, stored, and retrieved. If chunking is naive (fixed-size, no overlap, splitting mid-sentence/mid-table), fix it. If retrieval is pure keyword/LIKE-based instead of embedding similarity, evaluate whether a proper embedding-based retrieval step is feasible given the current hosting constraints, and implement it if so.
- **Better embeddings.** If a Hugging Face skill is available, use it to select/evaluate a suitable open embedding model (called via API, not run locally, unless the user's hosting explicitly allows it) for generating and comparing embeddings. Otherwise use whatever free embedding endpoint is already in the stack (e.g. Gemini's embedding API).
- **Better knowledge base / database schema.** Review how source documents, chunks, embeddings, and metadata are stored. Fix a flat/ad-hoc schema into something normalized: separate tables for source documents, chunks, embeddings, and query logs; proper indexing on lookup columns; versioning so re-ingesting a doc doesn't leave stale duplicate chunks.
- **Prompt & system instruction quality.** Review the chatbot's system prompt / grounding instructions for the RAG answers — check it actually constrains the model to the retrieved context, handles "no relevant context found" gracefully instead of hallucinating, and doesn't leak internal instructions if a user probes it.
- **Evaluation.** If there's no way to check retrieval quality, add a small eval set (sample questions + expected source docs) so future changes can be checked against regressions, not just vibes.
- **Do not add local model inference, local fine-tuning, or GPU-dependent steps** unless the user explicitly asks — this stack targets free hosted APIs on shared hosting.

## API & chatbot security — critical, non-negotiable

- **No API keys/secrets in client-side code, frontend bundles, public repos, or anything shipped to the browser.** Grep the entire codebase (frontend build output included) for hardcoded keys, tokens, or `.env` values that leaked into committed files or client JS bundles.
- **All LLM API calls must go through a backend proxy/route**, never called directly from the browser with an embedded key. If the current code calls Gemini/Groq directly from client-side JS, this is a critical fix — move it server-side immediately.
- **Rate limit and validate input** on any endpoint that forwards to an LLM API, so the chatbot can't be used to drain the user's free-tier quota or be turned into an open relay for arbitrary prompts.
- **Sanitize/validate what goes into prompts** (basic prompt-injection hygiene: don't blindly concatenate raw user input plus retrieved document content plus system instructions with no delimiters or escaping).
- **Check `.env` / config files aren't committed to git** and that `.gitignore` actually excludes them; if secrets were committed historically, flag it explicitly (rotating a leaked key is on the user, but you should surface it, not silently fix and move on).
- **CORS and auth on chatbot endpoints** — make sure the API route can't be freely called from any origin if that's not intended.

## Feature audit — the whole site, not just the chatbot

Beyond the chatbot, audit every feature area of the website/app end-to-end: forms actually submit and validate correctly, navigation/routing has no dead ends, auth flows (login/session/permissions) are sound, data displayed matches data stored, any admin/dashboard features work as intended, and every user-facing flow behaves consistently across pages. Treat this as its own subagent pass (see below) alongside the chatbot-specific one — fix real breakage first, then polish.

## SEO & performance

- **SEO fundamentals:** correct `<title>`/meta description per page, semantic HTML (proper heading hierarchy, not divs pretending to be headings), Open Graph/Twitter card tags where pages get shared, sitemap.xml and robots.txt present and accurate, canonical URLs where needed, alt text on meaningful images, clean/readable URLs, no duplicate-content routing traps.
- **Performance:** minimize render-blocking assets, compress/lazy-load images, remove unused CSS/JS from bundles, cache appropriately (browser cache headers, and server-side caching where Laravel/shared hosting supports it — e.g. config/route/view caching), reduce unnecessary DB queries (N+1 queries are a common Laravel trap — check for them specifically), and keep bundle sizes lean per the simplification work above.
- Treat SEO and performance as part of the Phase 2 audit (fold into the performance/simplification auditor and feature auditor) and fix them in Phase 4 alongside everything else.

## Admin panel — simplicity over polish

The admin/dashboard area is explicitly **not** a place for visual design effort. Fixed requirement:
- Simple, plain UI — no need for the same visual polish as the public-facing site.
- Prioritize clear navigation, obvious labels, and a logical layout over aesthetics: an admin user should be able to find and do what they need without hunting.
- Still fix actual bugs, broken flows, and confusing navigation in the admin — "simple" doesn't mean "left broken," it means don't spend effort making it pretty.
- If the current admin UI is already overdesigned or inconsistent, simplify it down rather than polishing it further.

## Use subagents for the audit phases

Dispatch parallel subagents (Task tool) for independent investigation work — don't do all the searching serially in one context. Suggested split:

1. **Structure mapper** — builds a full map of the project: directory tree, tech stack, entry points, routing, build config, dependency graph.
2. **Security & bug auditor** — scans for security issues (injection, auth flaws, exposed secrets/keys, unsafe deserialization, CORS/CSRF gaps, insecure dependencies, unvalidated input) and functional bugs (logic errors, unhandled errors/promises, race conditions, null/undefined issues, broken edge cases).
3. **Dead code / orphan hunter** — finds unused exports, unreferenced components, unreachable routes, unused dependencies in package manifests, commented-out code blocks, duplicate/superseded implementations.
4. **UI/UX & visual auditor** — reviews components/styles for visual bugs, layout breakage, inconsistent spacing/color/typography, accessibility issues, bad responsive behavior, inconsistent design tokens, poor visual hierarchy, and generally weak aesthetic choices on the **public-facing site** (the admin panel is exempt from aesthetic scrutiny — see the Admin panel section below). **Loading and following the frontend-design skill is mandatory, not optional, for any UI/UX or visual design work in this project** — audit and fix phases both.
5. **Performance/simplification auditor** — finds unnecessary re-renders, oversized bundles, redundant abstractions, over-engineered code that can be simplified, unneeded dependencies, slow queries/algorithms, missing memoization/lazy-loading where it clearly matters.
6. **Project hygiene auditor** — inventories every file in the repo outside of source code: stray logs, build artifacts, `.DS_Store`/OS junk, old backup files (`*.bak`, `*_old`, `*copy*`), abandoned config files, unused env examples, scratch scripts, and scattered markdown/docs.
7. **Chatbot/RAG auditor** — reviews the chatbot pipeline end-to-end: chunking, embeddings, storage schema, retrieval logic, system prompt, and where API keys are used and whether any are exposed client-side. Uses the Hugging Face skill (if available) to evaluate embedding model options callable via API. Reports concretely on retrieval quality, schema issues, and any secret exposure — secret exposure findings get flagged as critical regardless of what else is found.
8. **Feature auditor** — walks every user-facing feature (forms, auth, routing, dashboards, data flows) and checks it against what it's supposed to do, not just whether it renders.

Each subagent reports back a concrete, file-and-line-referenced list of findings — not vague impressions. No fixing during this phase, just findings.

## Phase order

**Phase 1 — Discovery.** Run the structure mapper first, alone, so later subagents have an accurate map instead of re-discovering the repo independently.

**Phase 2 — Parallel audit.** Dispatch the other five subagents with the map as context. Collect findings into one consolidated audit report (grouped by category, each item with file path, description, severity: critical/high/medium/low).

**Phase 3 — Triage.** Before touching anything, present a short summary: what's critical (security/bugs breaking things now), what's safe cleanup (dead code, junk files), what's cosmetic (UI/UX/aesthetics), what's structural (reorg). Fix in that order — correctness and security first, cosmetics last — since UI polish on top of buggy code is wasted work.

**Phase 4 — Fix.** Work through the triaged list:
- Fix bugs and security issues with minimal, targeted diffs.
- Remove verified dead code and orphaned components.
- Fix visual/UI/UX issues on the public-facing site: inconsistent spacing/colors/type scale, broken layouts, poor contrast, misaligned elements, bad component hierarchy — make the UI visually consistent and clean, not just "not broken." **Use the frontend-design skill for every one of these fixes** — this is fixed, not a suggestion. Admin panel fixes should follow the "simplicity over polish" rule instead, not the design skill's aesthetic guidance.
- Simplify: collapse unnecessary abstraction layers, remove redundant utility wrappers, cut unused dependencies, reduce bundle weight — but only where it doesn't change behavior or make the code harder to follow.
- After each meaningful batch, verify (build/lint/test/manual check) before continuing.

**Phase 5 — Project structure cleanup.**
- Delete confirmed-unused files (junk, orphans, dead scratch scripts) — list them before deleting if the list is long, so nothing unexpected disappears.
- Create a dedicated docs folder (e.g. `docs/`) and move all `.md` files, notes, specs, and other documentation there — except the root `README.md`, which stays at project root as the entry point.
- Reorganize into a **semantic, atomic folder structure**: each folder groups one clear concern (e.g. `components/`, `services/`, `models/`, `hooks/`, `admin/`, `chatbot/`) rather than mixing unrelated things; each file does one job and lives where its name and purpose predict it should. Avoid deep nesting for its own sake and avoid dumping-ground folders like `misc/`, `utils/` (unless genuinely just small shared helpers), or `stuff/`. Naming should be consistent (pick one casing/pattern and apply it everywhere) and predictable enough that a new developer could guess where something lives.
- Update any import paths, build config, or CI references broken by moved files.

**Phase 6 — Final report.** Summarize: what was fixed and why, what was deleted and why, what was reorganized, what's left as a known issue or a judgment call you're flagging for the user instead of touching (e.g. ambiguous "is this used" cases, or larger architectural decisions that need a human call). Keep it factual and specific — file names, counts, before/after — not generic praise of the cleanup.

## Now begin

Start with Phase 1. Map the codebase, then report back the map and your subagent dispatch plan before running the full parallel audit.
