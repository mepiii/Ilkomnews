# Plan: Ilkom UI/UX Overhaul v2

**Complexity**: Large
**Branch**: feature/ui-rag-overhaul
**Supersedes**: `ilkom-bugfix-overhaul.plan.md` (Phase 3 B&W admin done, Phase 4-7 partially done)

## Summary

Fix accent color enforcement, dark/light mode contrast, semantic status badges, card sizing, data table images, wire orphaned SettingsPage, fix rate limiting, and add loading/error states. Admin B&W redesign (Phase 3) and admin seeder are already done.

---

## Phase 0 — Accent Color Audit + Dark Mode Border Cleanup

### 0.1 Enforce `rgb(48, 11, 85)` everywhere

**File:** `frontend/src/index.css`
- Light `--accent` is already `rgb(48, 11, 85)` ✓
- Dark `--accent` is `rgb(122, 71, 166)` — user wants same purple in both modes. Change dark to `rgb(48, 11, 85)` (same value, slightly lighter for dark bg: `rgb(80, 30, 130)`)
- Update `--accent-hover` accordingly

### 0.2 Remove light borders in dark mode

**File:** `frontend/src/index.css`
- `--border-color: rgba(255, 255, 255, 0.1)` → `rgba(255, 255, 255, 0.04)`
- `--border-glass: rgba(255, 255, 255, 0.08)` → `rgba(255, 255, 255, 0.04)`
- `--glass-border: rgba(255, 255, 255, 0.08)` → `rgba(255, 255, 255, 0.04)`

**File:** `frontend/src/components/layout/Navbar.jsx`
- Replace `dark:border-white/[0.1]` → `dark:border-white/[0.04]` across all instances

### 0.3 Light mode text contrast

**File:** `frontend/src/index.css`
- `--text-muted: #6b7280` → `#4b5563` (darker for readability)
- `--text-secondary: #374151` — fine as-is

**File:** `frontend/src/components/cards/NewsExpandableCard.jsx`, `ProjectExpandableCard.jsx`
- Techstack badges: ensure `text-xs` badges use `text-[var(--text-primary)]` not `text-[var(--text-muted)]`
- Description text: ensure minimum `text-[var(--text-secondary)]`

---

## Phase 1 — Semantic Status Badges

### 1.1 Admin panel CSS variables (already exist)

**File:** `frontend/src/index.css` lines 113-116
- `--admin-success: #059669` ✓ (light), `#34d399` ✓ (dark)
- `--admin-danger: #dc2626` ✓ (light), `#f87171` ✓ (dark)
- `--admin-warning: #d97706` ✓ (light), `#fbbf24` ✓ (dark)

### 1.2 Status badge component

**New file:** `frontend/src/components/admin/ui/StatusBadge.jsx`

```jsx
// ponytail: inline badge, no abstraction needed
const STATUS_MAP = {
  diterima:    { label: 'Diterima',    bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  published:   { label: 'Diterima',    bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  ditolak:     { label: 'Ditolak',     bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  rejected:    { label: 'Ditolak',     bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  menunggu:    { label: 'Menunggu',    bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  pending:     { label: 'Menunggu',    bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  draft:       { label: 'Draft',       bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
}
```

### 1.3 Replace hardcoded badges in admin pages

**Files:** `NewsListPage.jsx`, `ProjectsListPage.jsx`, `ProjectDetailPage.jsx`
- Replace inline badge JSX with `<StatusBadge status={item.status} />`
- Keep existing status logic, just swap rendering

---

## Phase 2 — Card Sizing + News/Gallery Standardization

### 2.1 Card base height

**File:** `frontend/src/components/cards/ProjectExpandableCard.jsx`
- Add `min-h-[320px]` to card container (up from ~250px)
- Image thumbnail: keep `aspect-video` (don't stretch)
- Description area: add `flex-1` + `min-h-[80px]` to text container

**File:** `frontend/src/components/cards/NewsExpandableCard.jsx`
- Match same dimensions: `min-h-[320px]`, same image ratio, same text spacing
- Ensure card uses same `rounded-xl`, `border`, `shadow-sm` classes as ProjectExpandableCard

### 2.2 Expandable card vertical space

**File:** Both `NewsExpandableCard.jsx`, `ProjectExpandableCard.jsx`
- Expanded content: add `pb-6` padding
- Body text: `leading-relaxed` for readability

---

## Phase 3 — Layout + Hero Fixes

### 3.1 Page structure spacing

**File:** `frontend/src/App.jsx`
- Public pages wrapped in `<main>` — verify no extra padding from Tiles background or wrapper divs
- Ensure `min-h-screen` on main, `pt-0` (content starts at top)

### 3.2 Hero section

**File:** `frontend/src/components/home/HeroSection.jsx`
- Already has `pt-40` ✓ — verify image fits without gap
- Check `overflow-hidden` doesn't clip hero at certain viewports
- Ensure `min-h-screen` + `flex items-center` centers content properly

### 3.3 Data table images

**File:** `frontend/src/pages/admin/NewsListPage.jsx`
- Thumbnail column: wrap in `<img>` with `className="w-12 h-12 rounded object-cover"` and `onError` fallback
- Add `src` fallback to placeholder div

**File:** `frontend/src/pages/admin/ProjectsListPage.jsx`
- Same treatment for project thumbnails
- Profile pic column: circular avatar with `w-8 h-8 rounded-full object-cover`

---

## Phase 4 — SettingsPage Wiring + Password Prompt

### 4.1 Fix route

**File:** `frontend/src/routes/AdminRoutes.jsx` line 51
- Change: `<Route path="settings" element={<ChatbotApiPage />} />`
- To: `<Route path="settings" element={<SettingsPage />} />`
- Add lazy import: `const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'))`

### 4.2 Password change prompt

**File:** `frontend/src/pages/admin/SettingsPage.jsx`
- After successful profile fetch, check if password was recently changed (add `must_change_password` flag to user model, or use `created_at` vs `password_changed_at`)
- Simple approach: show banner at top of SettingsPage: "Disarankan mengubah password setelah login pertama"
- Backend: `AuthController@getProfile` returns `must_change_password: true` if user hasn't changed password since creation

### 4.3 Backend profile update endpoint

**File:** `backend/app/Http/Controllers/Admin/AuthController.php`
- Verify `updateProfile()` exists and handles name/email update
- Verify `changePassword()` exists and handles password change
- If missing: add minimal methods

---

## Phase 5 — Rate Limiting Fix

### 5.1 Increase limits for admin navigation

**File:** `backend/app/Http/Controllers/Admin/AuthController.php`
- Current: `MAX_FAILED_ATTEMPTS = 5`, `LOCKOUT_MINUTES = 15`
- The "Too Many Attempts" is likely from login throttling, not navigation
- Login throttle: keep as-is (security)
- API navigation: check if any API routes have throttles — most likely none

### 5.2 Check for global throttle middleware

**File:** `backend/routes/web.php` — check for `->middleware('throttle:')` on API routes
**File:** `backend/routes/api.php` — check for global throttle

If global throttle is too aggressive:
- Increase from default to `60,1` (60 requests per minute)
- Or use `throttle:api` with custom config in `RouteServiceProvider`

---

## Phase 6 — Loading States + Error Handling

### 6.1 Enhanced skeleton components

**File:** `frontend/src/components/admin/ui/SkeletonCard.jsx`
- Expand to support multiple variants: `skeleton-table`, `skeleton-card`, `skeleton-stat`

**New file:** `frontend/src/components/admin/ui/SkeletonTable.jsx`
- Row skeleton matching table layout (avatar + 3 text lines)
- 5-8 rows default

### 6.2 Error state + reload button

**New file:** `frontend/src/components/admin/ui/ErrorState.jsx`
- Shows error icon, message, and "Muat ulang" button
- `onRetry` prop to re-fetch

### 6.3 Apply to admin pages

**Files:** `DashboardPage.jsx`, `NewsListPage.jsx`, `ProjectsListPage.jsx`, `AdminManagementPage.jsx`
- Replace bare `<div>Loading...</div>` with skeleton
- Wrap fetch in try-catch, show `<ErrorState>` on failure
- Add "Muat ulang" button that calls the fetch function again

---

## Files to Change

| File | Action | Phase |
|---|---|---|
| `frontend/src/index.css` | UPDATE | 0, 1 |
| `frontend/src/components/layout/Navbar.jsx` | UPDATE | 0 |
| `frontend/src/components/cards/NewsExpandableCard.jsx` | UPDATE | 1, 2 |
| `frontend/src/components/cards/ProjectExpandableCard.jsx` | UPDATE | 2 |
| `frontend/src/components/admin/ui/StatusBadge.jsx` | CREATE | 1 |
| `frontend/src/components/admin/ui/SkeletonTable.jsx` | CREATE | 6 |
| `frontend/src/components/admin/ui/ErrorState.jsx` | CREATE | 6 |
| `frontend/src/routes/AdminRoutes.jsx` | UPDATE | 4 |
| `frontend/src/pages/admin/SettingsPage.jsx` | UPDATE | 4 |
| `frontend/src/pages/admin/NewsListPage.jsx` | UPDATE | 1, 3, 6 |
| `frontend/src/pages/admin/ProjectsListPage.jsx` | UPDATE | 1, 3, 6 |
| `frontend/src/pages/admin/ProjectDetailPage.jsx` | UPDATE | 1 |
| `frontend/src/pages/admin/DashboardPage.jsx` | UPDATE | 6 |
| `frontend/src/pages/admin/AdminManagementPage.jsx` | UPDATE | 6 |
| `backend/app/Http/Controllers/Admin/AuthController.php` | UPDATE | 4, 5 |
| `backend/routes/web.php` | CHECK | 5 |

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Dark accent too dim | LOW | Test at multiple viewports |
| Status badge colors clash with B&W theme | LOW | Use muted pastels, not bright |
| Rate limit fix opens abuse | LOW | Login throttle stays strict |
| Skeleton timing off | LOW | Match real API latency |

---

## Validation

```bash
cd frontend && npm run lint
cd frontend && npm run build
cd backend && php artisan test
```

Manual checks:
- Light mode: text readable on all cards, badges visible
- Dark mode: no visible white borders, accent purple consistent
- Status badges: green/red/yellow across admin pages
- Settings page: reachable at /admin/settings, profile update works
- Reload button: works on dashboard, news list, projects list
- Card heights: consistent between news and gallery

---

## Acceptance

- [ ] Accent `rgb(48, 11, 85)` enforced everywhere
- [ ] Dark mode: no light borders
- [ ] Light mode: text contrast fixed
- [ ] Status badges: semantic colors
- [ ] Cards: consistent height + expandable space
- [ ] News matches Gallery aesthetic
- [ ] Data tables: images render correctly
- [ ] SettingsPage wired and functional
- [ ] Password change prompt shown
- [ ] Rate limiting doesn't block normal nav
- [ ] Loading skeletons on all admin list pages
- [ ] Error state + "Muat ulang" button works
