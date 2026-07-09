# ORCHESTRATOR — ILKOM NEWS Overhaul

## 0. Preread

Before any implementation, read:
- `TECH.md` — stack, file map, config, DB (MariaDB), admin security (VITE_ADMIN_BASE)
- `DESIGN.md` — brand tokens, design rules, features to preserve
- `PLAN.md` — existing orchestrator plan (14-phase pipeline)

## 1. Hard Constraints

- **Backend frozen.** No new backend language/framework/DB/persistent process/queue/WebSocket/Redis.
- **No feature removal.** Dark mode, PWA, Ctrl+K search, bilingual, Wolfy chatbot — polish, don't drop.
- **Typography: size/weight only.** Never change font-family (Inter).
- **Evolve identity, don't replace.** Purple + Wolfy + tiles + glass nav stay recognizable.

## 2. Admin Security

**CRITICAL:** Use `VITE_ADMIN_BASE` env var (from `TECH.md`). Admin routes mount at `/{ADMIN_BASE}` not `/admin`. Users guessing `/admin` hit catch-all → redirect home. Share the real URL (e.g. `/portal`) with admins directly.

**Implementation (App.jsx):**
```js
const ADMIN_BASE = import.meta.env.VITE_ADMIN_BASE || 'admin'
const isAdminRoute = location.pathname.startsWith('/' + ADMIN_BASE)
<Route path={`/${ADMIN_BASE}/*`} element={<AdminRoutes />} />
```

**Add to `.env`:** `VITE_ADMIN_BASE=portal`

## 3. Implementation Tasks

### 3a. Database & State

- **AbortController cleanup** on every `useEffect` fetch — cancel on unmount/dep change
- **Stale-while-revalidate** — keep old data visible while background fetching, never clear on new request start
- **Debounce search inputs** 500ms. Deduplicate identical in-flight GETs.
- **10s API timeout.** Replace infinite spinners with `<ErrorMessage>` + "Muat ulang" (Reload) button.
- **Optional chaining** (`?.`) everywhere. Fallback UI for null avatars/images.
- **MariaDB switch** — `DB_CONNECTION=mariadb` in `.env`, add `mariadb` block in `config/database.php`

### 3b. Design System

- **Dynamic accents:** Light `rgb(48,11,85)`, Dark `rgb(122,71,166)` on active states/buttons
- **Dark mode:** Remove light/white borders on cards/tables/containers (`border-gray-200 dark:border-[#262626]`)
- **Light mode:** Increase contrast on small text (techstack badges, labels)
- **Status badges:** Diterima=Green, Ditolak=Red, Menunggu=Yellow

### 3c. UI & Layout

- **Spacing:** Fix viewport top/bottom gap. Patch hero image gap. Increase card inner padding.
- **Cards:** Standardize News + Gallery. Consistent base/expandable height, no stretched thumbs. `mt-auto` on footers.
- **Avatars:** Stacked avatar groups (max 3 visible + "+X" overflow badge). Replace "2 person" text.
- **Tables:** Ensure all admin table images render with fallback.
- **Scrollbars:** Global thin themed scrollbar. Notification dropdown → `scrollbar-hide` (scrollable, no visible bar).

### 3d. Modals & Admin

- **Reject modal:** `overflow-hidden` on body + `backdrop-blur-sm`
- **Settings page:** Build profile settings (name/email/password). Prompt to change default password on first login.
- **Seed admins:** 9 accounts `admin[1-9]@sapa.fasilkom.unsri.ac.id`, password `AdminSapa[01-09]!`. Equal privilege. Already documented in `admin_credentials.md`.

## 4. Verification Checklist

- [ ] `/admin` redirects to home. Only `/{ADMIN_BASE}` shows login
- [ ] No console errors on any page
- [ ] Dark mode: no light borders visible
- [ ] Light mode: techstack badges readable
- [ ] Spinners replaced with error + reload button
- [ ] All API calls: AbortController cleanup, timeout
- [ ] Cards consistent height, footer pinned
- [ ] Avatars render with fallback, "X person" text replaced
- [ ] Scrollbar themed globally
- [ ] Reject modal: body scroll lock + backdrop blur
- [ ] Settings page works, password change prompt shows
- [ ] DB migration to MariaDB connection succeeds
