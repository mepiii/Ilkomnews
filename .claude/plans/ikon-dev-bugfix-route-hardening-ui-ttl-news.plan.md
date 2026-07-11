# Plan: Local Dev Reset, Route Hardening, UI Refactor & TTL News Engine

**Source**: Direct task brief (no PRD)
**Complexity**: Medium
**Note**: Ponytail mode active — shortest diff, no over-engineering. Several requested items are already satisfied by existing code; marked NO-OP below.

## Grounding — What Already Exists

| Requested | Status | Evidence |
|---|---|---|
| `APP_URL`, `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN` | DONE | `backend/.env` already has all three set correctly |
| `VITE_API_BASE_URL` | DONE | `frontend/.env.local` already `http://localhost:8000/api` |
| Auth loop / token flush | DONE (cookie-based) | `src/services/api.js`, `src/services/adminApi.js` — httpOnly session cookies, no `localStorage` token. `fetchAdmin` redirects to login on 401 only when not already on login path (no loop). `AdminAuthContext`/`ProtectedRoute` use cookie session, no localStorage to clear |
| `/admin` obfuscation | DONE | `VITE_ADMIN_BASE=portal` + `src/config/admin.js` + `App.jsx` (`/admin` → redirect home; `/${ADMIN_BASE}/*` is the real route) |
| Backend admin protection | DONE | `routes/api.php` → `['auth','admin']`; `app/Http/Middleware/AdminOnly.php` returns clean JSON `401`/`403` (not HTML redirect) |
| Dark-mode bright borders | DONE | `src/index.css` `.dark [class*="border-gray-200"]` / `[class*="border-white"]` → `var(--border-color) !important` (already covers theming) |
| "Koleksi Saya" fixed width | DONE | `KoleksiPage.jsx` uses fluid `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (no `w-[450px]`) |
| News card media scale | DONE | `ExpandableCard.jsx` uses `aspect-video overflow-hidden` + `object-cover` |

The genuinely **missing** work is the TTL news engine + the cosmetic "Berita Terkini" icon. Everything else is verification.

## Required Changes

### Task 1: TTL migration (backend)
- **Action**: Create `database/migrations/2026_07_10_000000_add_expires_at_to_news_table.php`
  - `Schema::table('news', fn($t) => $t->timestamp('expires_at')->nullable());`
- **Mirror**: existing `add_author_fields_to_news_table.php` style (raw migration, no enums)
- **Validate**: `php artisan migrate` → no errors; `DESCRIBE news` shows `expires_at` nullable

### Task 2: News model + base controller (backend)
- **Action**:
  - `app/Models/News.php`: add `'expires_at'` to `$fillable`; add `'expires_at' => 'datetime'` to `$casts`
  - `app/Http/Controllers/BasePublishableController.php` `index()`/`latest()`/`categories()`: add `->whereNull('expires_at')->orWhere('expires_at','>',now())` so expired news is hidden from PUBLIC reads. **Admin** reads stay unfiltered (Admin/NewsController uses `News::query()` directly — unaffected).
- **Mirror**: keep `scopePublished` untouched; add a small local scope `scopeActive`
- **Validate**: `php artisan tinker` → `News::whereNull('expires_at')->count()` excludes rows with past `expires_at`

### Task 3: Admin store/update validation (backend)
- **Action**: In `app/Http/Controllers/Admin/NewsController.php` `store()` and `update()` validation rules, add:
  - `'expires_at' => 'nullable|date|after:now'`
  - pass `expires_at` through to `create`/`update` (already in `$fillable` after Task 2)
- **Mirror**: same rule shape as existing `'date' => 'required|date'`
- **Validate**: POST a news with `expires_at` in the past → 422; future date → saved

### Task 4: Scheduler auto-prune (backend)
- **Action**: In `routes/console.php` add:
  ```php
  use App\Models\News;
  use Illuminate\Support\Facades\Schedule;
  Schedule::call(fn () => News::whereNotNull('expires_at')
      ->where('expires_at','<=',now())->delete())->hourly();
  ```
- **Mirror**: brief says this verbatim; paste as given
- **Validate**: `php artisan schedule:work` boots; `php artisan schedule:list` shows hourly prune; unit: insert a row with `expires_at=now()->subMinute()`, run `News::whereNotNull('expires_at')->where('expires_at','<=',now())->delete()`, assert it's gone

### Task 5: Admin news form — TTL toggle + datetime picker (frontend)
- **Action**: In `src/pages/admin/NewsFormPage.jsx`:
  - `INITIAL_STATE` add `setExpiry:false`, `expires_at:''`
  - Add a toggle switch "Set Batas Waktu Tampil (Lomba / Event)" (dark-themed)
  - When on, render `<input type="datetime-local" className="... dark:[color-scheme:dark]" value={form.expires_at} onChange=...>`
  - In `handleSubmit`, append `expires_at` to `FormData` (blank when toggle off)
  - On edit load, set `setExpiry`/`expires_at` from `item.expires_at`
- **Mirror**: existing `published` checkbox + `inputClass()` + `dark:[color-scheme:dark]` pattern from the date field
- **Validate**: `npm run build`; manual: toggle on → datetime picker appears; submit → `expires_at` persisted

### Task 6: "Berita Terkini" premium icon (frontend)
- **Action**: Replace the old icon in `src/components/home/LatestNews.jsx` badge with a sleek inline SVG (signal-flare / megaphone). Use a minimal `lucide-react` icon already imported OR a small inline SVG — no new dep.
  - Title already one line "Berita Terkini" via `Text_03`; the brief's line-break `Berita <span class="block sm:inline">Terkini</span>` is optional polish — apply to `LatestNews` h2 only if clipping confirmed at `<360px`. Default: leave title as-is (it wraps naturally at 7xl on small screens).
- **Validate**: `npm run build`; visual check at 320/375px no clipping

## Files to Change
| File | Action |
|---|---|
| `backend/database/migrations/2026_07_10_000000_add_expires_at_to_news_table.php` | CREATE |
| `backend/app/Models/News.php` | UPDATE (fillable + cast) |
| `backend/app/Http/Controllers/BasePublishableController.php` | UPDATE (active scope on public reads) |
| `backend/app/Http/Controllers/Admin/NewsController.php` | UPDATE (validate expires_at) |
| `backend/routes/console.php` | UPDATE (scheduler) |
| `frontend/src/pages/admin/NewsFormPage.jsx` | UPDATE (toggle + picker) |
| `frontend/src/components/home/LatestNews.jsx` | UPDATE (icon) |

## Validation
```bash
cd backend && php artisan migrate && php artisan schedule:list && php artisan tinker
cd ../frontend && npm run build
```

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Public `scopePublished` already hides drafts; adding expiry scope must not break it | Low | Compose scopes with `where()` closures, keep `scopePublished` intact |
| `datetime-local` value format mismatch with backend `date` cast | Low | Send raw string; Laravel mutates to Carbon; validate `after:now` |
| React build breaks on form change | Low | Run `npm run build` after edit |

## Acceptance
- [ ] Migration applied, `expires_at` nullable timestamp on `news`
- [ ] Public news reads exclude expired items; admin list shows all
- [ ] Admin store/update reject past `expires_at` (422), accept future
- [ ] `php artisan schedule:work` runs hourly prune; verified via tinker
- [ ] Admin form has toggle + dark datetime picker, persists `expires_at`
- [ ] "Berita Terkini" uses premium icon; no title clipping at mobile widths
- [ ] `npm run build` passes

## Skipped (already implemented, no change)
Env values, auth loop, route obfuscation (`portal`), backend JSON 401/403, dark-border CSS override, Koleksi fluid grid, card aspect-video. These are verified present, not rebuilt.
