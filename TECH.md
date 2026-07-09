# TECH.md — ILKOM NEWS

## Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | React 18 + Vite 6 + Tailwind 3.4 | JSX, no TS |
| Backend | Laravel + **MariaDB** (not MySQL) | shared hosting cPanel |
| Build | Vite → `../backend/public` | static assets only |
| E2E | Playwright (Vitest unit) | `test:e2e` + `test` scripts |
| Auth | httpOnly cookie (Laravel Sanctum) | no localStorage tokens |
| Font | Inter (Google, wght 300-800) | preloaded in `index.html` |
| Icons | lucide-react + react-icons | manualChunk'd |
| Motion | framer-motion 12 | AnimatePresence routing |
| Search | Ctrl+K dock (`ExpandingSearchDock`) | client-side filter |

**Routes entry:** `frontend/src/App.jsx` (public) + `frontend/src/routes/AdminRoutes.jsx` (admin, nested)

---

## File Map (frontend/src/)

### Entry & Config — where to edit

| File | Configures | Edit when |
|------|-----------|-----------|
| `index.html` | Title, OG, lang, theme-color, Inter font | SEO / branding change |
| `vite.config.js` | Build outDir, proxy :8000, manualChunks, dedupe | API URL / chunk strategy |
| `tailwind.config.js` | Brand colors (primary/secondary/accent), spacing, keyframes | Brand palette change |
| `package.json` | Deps + scripts (dev/build/test/e2e) | Add/remove library |
| `.env` | `VITE_API_BASE_URL`, `VITE_ADMIN_BASE` | API URL, admin route prefix |
| `index.css` | CSS vars, Tailwind directives, global styles | Theme tokens |
| `main.jsx` | React root, BrowserRouter, SW register | Router / PWA init |

### App Shell

| File | Job |
|------|-----|
| `App.jsx` | Route table: `/` `/news` `/events` `/ilkomgallery/*` `/submit` `/koleksi` `/track` `/{ADMIN_BASE}/*` |
| `index.css` | Global CSS, tailwind directives, CSS custom properties |

### Context

| File | Job |
|------|-----|
| `context/ThemeContext.jsx` | Dark/light state + localStorage + prefers-color-scheme |
| `context/AdminAuthContext.jsx` | Auth state, ProtectedRoute wrapper, login/logout |

### Layout

| File | Job |
|------|-----|
| `components/layout/Navbar.jsx` | Top nav, dark toggle, mobile menu |
| `components/layout/Footer.jsx` | Site footer with links |

### Public Pages

| Route | File | Renders |
|-------|------|---------|
| `/` | `pages/HomePage.jsx` | HeroSection + LatestNews + IlkomGallery |
| `/news` | `pages/NewsPage.jsx` | News list with filters |
| `/news/:slug` | `pages/DetailPage.jsx` (type=news) | Article detail |
| `/events` | `pages/EventsPage.jsx` | Events list |
| `/events/:slug` | `pages/DetailPage.jsx` (type=events) | Event detail |
| `/ilkomgallery` | `pages/IlkomGalleryPage.jsx` | Gallery landing + category cards |
| `/ilkomgallery/project/:slug` | `pages/ilkomgallery/ProjectDetailPage.jsx` | Full project detail |
| `/ilkomgallery/game/:slug` | `pages/ilkomgallery/GameDetailPage.jsx` | Game project detail |
| `/ilkomgallery/mobile/:slug` | `pages/ilkomgallery/MobileDetailPage.jsx` | Mobile app detail |
| `/ilkomgallery/uiux/:slug` | `pages/ilkomgallery/UiUxDetailPage.jsx` | UI/UX case detail |
| `/ilkomgallery/web/:slug` | `pages/ilkomgallery/WebDetailPage.jsx` | Web project detail |
| `/submit` | `pages/SubmitProjectPage.jsx` | Project submission form |
| `/koleksi` | `pages/KoleksiPage.jsx` | Saved/bookmarked items |
| `/track` | `pages/TrackPage.jsx` | Visitor tracking |

### Admin Pages (under `/{VITE_ADMIN_BASE}/*`)

| Route | File | Job |
|-------|------|-----|
| `login` | `pages/admin/LoginPage.jsx` | Login form (unprotected by auth, hidden by obscure path) |
| `dashboard` | `pages/admin/DashboardPage.jsx` | Stats overview |
| `news` | `pages/admin/NewsListPage.jsx` | CRUD list |
| `news/create` | `pages/admin/NewsFormPage.jsx` | Create article |
| `news/:id/edit` | `pages/admin/NewsFormPage.jsx` | Edit article |
| `projects` | `pages/admin/ProjectsListPage.jsx` | CRUD list |
| `projects/:id` | `pages/admin/ProjectDetailPage.jsx` | Project detail |
| `chatbot-api` | `pages/admin/ChatbotApiPage.jsx` | LLM key management |
| `settings` | `pages/admin/SettingsPage.jsx` | Profile/password change |
| `admins` | `pages/admin/AdminManagementPage.jsx` | Manage admin accounts |
| `security` | `pages/admin/SecurityCenterPage.jsx` | Security settings |
| `chat-stats` | `pages/admin/ChatStatsPage.jsx` | Chat usage analytics |
| `audit-logs` | `pages/admin/AuditLogsPage.jsx` | Security audit log |

Layout: `components/admin/AdminLayout.jsx` — sidebar + topbar wrapper

### Components

| Group | Files | Job |
|-------|-------|-----|
| **home/** | HeroSection, LatestNews, IlkomGallery, TalkingMascot | Homepage sections |
| **cards/** | NewsExpandableCard, ProjectExpandableCard, EventExpandableCard | Expandable cards |
| **chat/** | WolfyWidget | Chatbot floating widget |
| **shared/** | ExpandingSearchDock + AnimatedFilterDropdown | Ctrl+K search, filters |
| **common/** | ErrorBoundary, ErrorMessage, LoadingSpinner, Breadcrumb, AnimatedSeparator, PerformanceMonitor | Shared utilities |
| **ui/** | Tiles, GlowCard, ExpandableCard, FlowButton, SlideButton, SlideConfirm, SmoothTabs, AnimatedText, AnimatedThemeToggle, EmptyResults, ImageWithFallback, NotificationPopover, PageBackground, PageHeader, PlaceholderImage, Text03 | Design system primitives |
| **ui/admin/** | ErrorState, SkeletonCard, SkeletonTable, StatCard, StatusBadge, ThemeToggle | Admin panel only |

### Hooks

| File | Job |
|------|-----|
| `hooks/useThemeMode.js` | Theme toggle logic |
| `hooks/useEngagement.js` | User activity tracking |
| `hooks/useVisitorId.js` | Fingerprint visitor ID |

### Lib

| File | Job |
|------|-----|
| `lib/utils.js` | Formatting, date, string utils |
| `lib/animations.js` | Framer Motion variants |
| `lib/animations.test.js` | Animation utility tests |
| `lib/scrollLock.js` | Body scroll lock (modals) |
| `lib/api.js` | API base URL config |
| `lib/adminApi.js` | Admin API fetch wrapper (credentials include, retry, timeout) |

---

## Database: MariaDB (not MySQL)

**Hosting runs MariaDB.** Switch from `mysql` driver:

```php
// config/database.php — add mariadb connection
'mariadb' => [
    'driver' => 'mariadb',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'engine' => 'InnoDB',
    // ...
],
```

`.env`: `DB_CONNECTION=mariadb`. No new deps — Laravel has built-in MariaDB driver.

---

## Admin Security: Obscure Route Prefix

**Problem:** `/admin/*` is guessable. Anyone typing `/admin` sees login.

**Solution:** `VITE_ADMIN_BASE` in `.env` changes where admin routes mount. Users guessing `/admin` hit catch-all → redirect home.

```ini
# frontend/.env
VITE_ADMIN_BASE=portal
```

```jsx
// App.jsx
const ADMIN_BASE = import.meta.env.VITE_ADMIN_BASE || 'admin'

// <Route path="/admin/*" element={<AdminRoutes />} />
<Route path={`/${ADMIN_BASE}/*`} element={<AdminRoutes />} />

// Also update isAdminRoute check:
const isAdminRoute = location.pathname.startsWith('/' + ADMIN_BASE)
```

**AdminRoutes.jsx** already uses relative paths — works under any base.

### Result

| URL | What happens |
|-----|-------------|
| `site.com/admin` | Redirect to `/` (catch-all) — looks broken |
| `site.com/portal` | Login form (only admins know this URL) |
| `site.com/portal/dashboard` | Dashboard after login |

Share the direct link `site.com/portal` with admins.

### Layered Security

| Layer | What |
|-------|------|
| 1. **Obscure path** | Not `/admin`. Set any word in `.env`. Change anytime. |
| 2. **Rate limit** | `throttle:5,60` on login endpoint |
| 3. **Session timeout** | `config/session.php`: `lifetime => 30`, `expire_on_close => true` |
| 4. **Audit log** | All admin actions logged (already exists) |

---

## Backend (Laravel)

| Path | Job |
|------|-----|
| `backend/app/Http/Controllers/` | API + web controllers |
| `backend/app/Models/` | Eloquent models |
| `backend/app/Middleware/` | Auth, throttle, admin |
| `backend/config/database.php` | DB connection config ← change to `mariadb` |
| `backend/database/migrations/` | Schema migrations |
| `backend/database/seeders/` | Seed data (admin accounts) |
| `backend/routes/api.php` | API routes (Sanctum auth) |
| `backend/routes/web.php` | Web routes (admin panel) |
| `backend/resources/views/` | Blade views |
| `backend/public/` | Build output + assets |

---

## Config Quick Reference

| What | Where |
|------|-------|
| Brand colors | `tailwind.config.js` → `theme.extend.colors` |
| Font | `index.html` → Google Fonts link |
| API base URL | `.env` → `VITE_API_BASE_URL` |
| DB connection | `.env` → `DB_CONNECTION=mariadb` |
| Admin route prefix | `.env` → `VITE_ADMIN_BASE` |
| Build output | `vite.config.js` → `build.outDir: '../backend/public'` |
| Route table | `App.jsx` + `AdminRoutes.jsx` |
| Admin sidebar nav | `AdminLayout.jsx` |
| Dark mode class | `tailwind.config.js` → `darkMode: 'class'` |
