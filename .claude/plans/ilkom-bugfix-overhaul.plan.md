# Plan: IlkomNews Bug-Fix + Feature Overhaul

**Complexity**: Large
**Branch**: feature/ui-rag-overhaul
**Overlaps**: Extends `ilkomnews-audit-admin-wolfy.plan.md` tasks 5-6, 10 with concrete implementation

## Summary

Fix infrastructure (ECONNREFUSED), two frontend UI bugs (hero crop, dark mode border), redesign admin to minimalistic B&W, add per-article Berita hide toggle, add gallery delete, implement per-user 5MB/day upload limit, and add storage optimization (compression, deduplication, auto-cleanup, monitoring).

---

## Phase 0 — Diagnose (No Edits)

**Goal:** Confirm infrastructure before touching code.

| # | Check | Command | Expected |
|---|---|---|---|
| 0.1 | Backend process | `ps aux \| grep artisan` | Running |
| 0.2 | Port 8000 | `ss -tlnp \| grep 8000` | Listening |
| 0.3 | MariaDB | `mysqladmin ping -u root` | Alive (MariaDB) |
| 0.4 | MariaDB version | `mysql -u root -e "SELECT VERSION();"` | MariaDB 10.x+ |
| 0.5 | Migrations | `cd backend && php artisan migrate:status` | All run |
| 0.6 | `.env` | Read `backend/.env` | `APP_URL=http://localhost:8000` |
| 0.7 | Vite proxy | Read `frontend/vite.config.js` | `/api` → `http://localhost:8000` |

### Database: MySQL → MariaDB

MariaDB is a drop-in replacement. Laravel uses the same `mysql` driver. Changes:

**File:** `backend/.env`
- Update `DB_HOST` if MariaDB is on different host/port (default: `127.0.0.1:3306` — same as MySQL)
- `DB_CONNECTION=mysql` stays the same (Laravel's `mysql` driver works for both)

**File:** `backend/config/database.php`
- No changes needed — Laravel's `mysql` connection config works for MariaDB

**Migration compatibility:** All existing migrations are MariaDB-compatible. MariaDB supports:
- JSON columns → `json` type in migrations (works)
- Full-text indexes → `fullText()` (works)
- Foreign key constraints → `constrained()` (works)
- Soft deletes → `softDeletes()` (works)
- All Eloquent features (works)

**Post-switch verification:**
```bash
cd backend && php artisan migrate:status
cd backend && php artisan tinker --execute="echo DB::getDriverName();"
# Should print: mysql
cd backend && php artisan test
```

**STOP. Report findings. Wait for user confirmation.**

---

## Phase 1 — Backend API Verification

Only if Phase 0 finds real backend errors. Test via curl.

| Endpoint | Method | Expected |
|---|---|---|
| `/api/news/latest?limit=8` | GET | 200 + JSON |
| `/api/projects` | GET | 200 + paginated JSON |
| `/api/notifications/{trackingId}` | GET | 200 or 404 |

**STOP. Show curl output. Wait for user confirmation.**

---

## Phase 2 — Frontend UI Bugs

### Bug 1: Hero Image Cropped Near Navbar

**Root cause:** Navbar is `fixed top-2 z-50` (Navbar.jsx:72). Hero uses `min-h-screen` + `overflow-hidden` (HeroSection.jsx:25). The `absolute inset-0` background image starts at viewport top; navbar overlaps top ~56px. `scale(1.05)` CSS filter (line 29) + `overflow-hidden` clips the top edge.

**Fix:** Add top padding to hero content so text doesn't sit behind navbar. Keep background as-is (intentional glass overlap).

**File:** `frontend/src/components/home/HeroSection.jsx`
**Change:** Add `pt-20` or similar to the content `div` (line 38).

**Verify:** Screenshot at 1440px before/after.

### Bug 2: White Border in Dark Mode

**Root cause:** Navbar uses `border-black/[0.06] dark:border-white/[0.1]` (Navbar.jsx:75). On pure black (`#000`) background, `white/10` = `rgba(255,255,255,0.1)` — visible as subtle light line. Same on dropdowns (lines 140, 180) and mobile menu (line 211).

**Fix:** Reduce dark border opacity to `[0.06]` or use CSS variable `var(--glass-border)` (already `rgba(255,255,255,0.08)` in dark mode).

**File:** `frontend/src/components/layout/Navbar.jsx`
**Change:** Replace `dark:border-white/[0.1]` with `dark:border-white/[0.06]` on all border instances.

**Verify:** Dark-mode screenshot at 1440px.

---

## Phase 3 — Admin B&W Minimalistic Redesign

**Scope:** All 12 admin pages + AdminLayout sidebar.
**Direction:** Minimalistic black and white. No purple/accent. Grayscale palette. Clean typography, ample whitespace, no glassmorphism stacking.

### 3.1 CSS Custom Properties + Font Override

**File:** `frontend/src/index.css`

Add admin-specific variables inside `.admin-panel`:
- `--admin-bg`, `--admin-surface`, `--admin-border`
- `--admin-text`, `--admin-text-secondary`
- `--admin-accent` (black light / white dark)
- `--admin-success`, `--admin-danger`, `--admin-warning`

**Font override (admin only):**
```css
.admin-panel h1,
.admin-panel h2,
.admin-panel h3,
.admin-panel h4,
.admin-panel h5,
.admin-panel h6 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}
```

This overrides the global `h1`–`h6` RePo rule inside `.admin-panel` scope only. Public pages keep RePo unchanged.

### 3.2 AdminLayout Sidebar

**File:** `frontend/src/components/admin/AdminLayout.jsx`

- Replace purple active states → B&W (`bg-black text-white` light / `bg-white text-black` dark)
- Flat surfaces, no gradients, subtle borders
- Clean header, no decorative elements

### 3.3 All Admin Pages

Same treatment per page:
- Purple/accent → `--admin-accent` (black/white)
- Status badges: grayscale with subtle bg
- Tables: clean borders, no colored headers
- Forms: minimal inputs, clean borders
- Cards: flat surfaces, no glassmorphism
- Buttons: black filled (primary), white outlined (secondary), red (danger)

**Pages:** DashboardPage, NewsListPage, NewsFormPage, ProjectsListPage, ProjectDetailPage, AdminManagementPage, SettingsPage, SecurityCenterPage, AuditLogsPage, ChatStatsPage, ChatbotApiPage, LoginPage

### 3.4 Remove Unused Admin UI Components

**Dir:** `frontend/src/components/admin/ui/` — check imports, delete orphans.

---

## Phase 4 — Per-Article Hide Toggle (Berita)

**Goal:** Admin hides individual news from public site without deleting.

### Backend

**File:** `backend/routes/web.php`
- Add: `PUT /api/admin/news/{id}/toggle-hidden` → `NewsController@toggleHidden`

**File:** `backend/app/Http/Controllers/Admin/NewsController.php`
- Add `toggleHidden($id)`: flip `published`, return new state

**Note:** `adminNews.toggleHidden(id)` already exists in `adminApi.js:122-124` — just needs backend route.

### Frontend

**File:** `frontend/src/pages/admin/NewsListPage.jsx`
- Add toggle switch in Status/Actions column
- Call `adminNews.toggleHidden(id)` on toggle
- Optimistic local state update

---

## Phase 5 — Gallery Delete from Admin

**Goal:** Admin deletes gallery (project) items.

**Already exists:** `GalleryController@destroy($id)` + route `DELETE /api/admin/projects/{id}` in `web.php`.

### Frontend

**File:** `frontend/src/pages/admin/ProjectsListPage.jsx`
- Add delete button in Actions column
- Confirmation modal before delete
- Verify `adminProjects.delete(id)` exists in `adminApi.js`

**File:** `frontend/src/pages/admin/ProjectDetailPage.jsx`
- Add delete button alongside accept/reject

---

## Phase 6 — Per-User 5MB/Day Upload Limit

**Goal:** Track upload volume per user (IP for anonymous), block at 5MB/day.

### Database

**New migration:** `create_upload_quota_table`
```
upload_quotas: id, ip_address, user_id, date, bytes_used (bigint default 0), timestamps
```

### Backend

**New model:** `UploadQuota`
**New service:** `UploadQuotaService` — check/update daily quota

**File:** `backend/app/Http/Controllers/ProjectSubmissionController.php`
- Before storing: check quota
- After storing: update quota
- Reject 429 if exceeds 5MB

### Frontend

**File:** `frontend/src/pages/SubmitProjectPage.jsx`
- Show remaining quota
- Disable submit when exceeded
- Clear error message

---

## Phase 7 — Storage Optimization

### 7.1 Image Compression

**Package:** `intervention/image` (add to `composer.json`)

**New file:** `backend/app/Services/ImageCompressionService.php`
- Resize max 1920px width, convert WebP, quality 80
- Apply to: news images, project thumbnails, avatars, screenshots

**Files:** `ProjectSubmissionController.php`, `Admin/NewsController.php` — use service

### 7.2 Image Deduplication

**New migration:** `create_image_hashes_table`
```
image_hashes: id, hash (unique 64), path, reference_count, timestamps
```

**New file:** `backend/app/Services/ImageDeduplicationService.php`
- SHA256 hash on upload
- Reuse existing file if hash matches
- Track reference count

**New model:** `ImageHash`

### 7.3 Auto-Cleanup

**New file:** `backend/app/Console/Commands/CleanOldContent.php`
- Draft news > 90 days → delete
- Rejected projects > 30 days → delete
- Orphaned files → delete

**File:** `backend/routes/console.php` — schedule daily

### 7.4 Storage Monitoring

**Backend:** Add to `HealthController` or new `StorageController`
- Total disk usage in `storage/app/public/`
- Breakdown by type (news, thumbnails, avatars, screenshots)

**Frontend:** Add storage stats card to admin DashboardPage

---

## Files to Change

| File | Action | Phase |
|---|---|---|
| `frontend/src/components/home/HeroSection.jsx` | UPDATE | 2 |
| `frontend/src/components/layout/Navbar.jsx` | UPDATE | 2 |
| `frontend/src/index.css` | UPDATE | 2, 3 |
| `frontend/src/components/admin/AdminLayout.jsx` | REWRITE | 3 |
| `frontend/src/pages/admin/DashboardPage.jsx` | REWRITE | 3, 7 |
| `frontend/src/pages/admin/NewsListPage.jsx` | REWRITE | 3, 4 |
| `frontend/src/pages/admin/NewsFormPage.jsx` | REWRITE | 3 |
| `frontend/src/pages/admin/ProjectsListPage.jsx` | REWRITE | 3, 5 |
| `frontend/src/pages/admin/ProjectDetailPage.jsx` | REWRITE | 3, 5 |
| `frontend/src/pages/admin/AdminManagementPage.jsx` | REWRITE | 3 |
| `frontend/src/pages/admin/SettingsPage.jsx` | REWRITE | 3 |
| `frontend/src/pages/admin/SecurityCenterPage.jsx` | REWRITE | 3 |
| `frontend/src/pages/admin/AuditLogsPage.jsx` | REWRITE | 3 |
| `frontend/src/pages/admin/ChatStatsPage.jsx` | REWRITE | 3 |
| `frontend/src/pages/admin/ChatbotApiPage.jsx` | REWRITE | 3 |
| `frontend/src/pages/admin/LoginPage.jsx` | REWRITE | 3 |
| `backend/routes/web.php` | UPDATE | 4 |
| `backend/app/Http/Controllers/Admin/NewsController.php` | UPDATE | 4 |
| `backend/app/Http/Controllers/ProjectSubmissionController.php` | UPDATE | 6, 7 |
| `frontend/src/pages/SubmitProjectPage.jsx` | UPDATE | 6 |
| `backend/composer.json` | UPDATE | 7 |
| `backend/app/Services/ImageCompressionService.php` | CREATE | 7 |
| `backend/app/Services/ImageDeduplicationService.php` | CREATE | 7 |
| `backend/app/Services/UploadQuotaService.php` | CREATE | 6 |
| `backend/app/Models/UploadQuota.php` | CREATE | 6 |
| `backend/app/Models/ImageHash.php` | CREATE | 7 |
| `backend/app/Console/Commands/CleanOldContent.php` | CREATE | 7 |
| `database/migrations/*_create_upload_quota_table.php` | CREATE | 6 |
| `database/migrations/*_create_image_hashes_table.php` | CREATE | 7 |

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Backend not running | HIGH | Phase 0 first |
| Admin redesign breaks responsive | MEDIUM | Test mobile per page |
| Image compression adds upload latency | LOW | intervention/image is fast |
| Quota bypass via different IPs | MEDIUM | Acceptable for public use |
| Dedup hash collision | VERY LOW | SHA256 |
| Auto-cleanup deletes wanted content | LOW | Only drafts/rejected, configurable TTL |

---

## Validation

```bash
cd backend && php artisan test
cd backend && php artisan migrate:status
cd frontend && npm run lint
cd frontend && npm run build
cd frontend && npm run test
curl http://localhost:8000/api/news/latest?limit=8
curl http://localhost:8000/api/projects
```

Manual: hero screenshot, dark mode border, admin B&W pages, hide toggle, delete button, upload quota, storage monitor.

---

## Acceptance

- [ ] Phase 0: Infrastructure confirmed
- [ ] Phase 1: API endpoints respond
- [ ] Phase 2: Hero not cropped, dark border subtle
- [ ] Phase 3: All admin pages minimalistic B&W
- [ ] Phase 4: Berita hide toggle works
- [ ] Phase 5: Gallery delete works
- [ ] Phase 6: 5MB/day quota enforced
- [ ] Phase 7: Compression, dedup, cleanup, monitoring active
