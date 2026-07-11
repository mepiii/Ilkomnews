# Plan: Local Dev, Auth Hardening, Responsive UI & News TTL Engine

**Complexity**: Medium

## Summary
Resolve local Laravel+Vite configuration mismatches, secure admin routes, fix responsive UI clippping/dark borders, and implement automated news TTL expiration mechanism.

## Patterns to Mirror
| Category | Source | Pattern |
|---|---|---|
| Admin Auth | `backend/app/Http/Middleware/AdminOnly.php` | Returns JSON 401/403 for API, handles routes dynamically. |
| News API | `backend/app/Http/Controllers/Admin/NewsController.php` | CRUD with validation, slug generation, indexing. |
| UI Forms | `frontend/src/pages/admin/NewsFormPage.jsx` | Dark-themed input components matching admin layout design. |

## Files to Change
| File | Action | Why |
|---|---|---|
| `backend/.env` | UPDATE | Set correct local URL and stateful domains. |
| `frontend/.env.local` | UPDATE | Define base API URL and dynamic obfuscated admin prefix. |
| `frontend/src/context/AdminAuthContext.jsx` | UPDATE | Safely reset local state before 401 redirect to prevent loop. |
| `frontend/src/services/adminApi.js` | UPDATE | Clear local variables on invalid session detection. |
| `backend/routes/web.php` | UPDATE | Wrap admin routes with strict roles, handle unauthorized JSON returns. |
| `frontend/src/components/home/LatestNews.jsx` | UPDATE | Swap megaphone SVG icon, apply 2-line header wrap. |
| `frontend/src/components/ui/ExpandableCard.jsx` | UPDATE | Dynamic card height overrides. |
| `frontend/src/pages/KoleksiPage.jsx` | UPDATE | Fluid grid columns definition instead of rigid layout container. |
| `frontend/src/index.css` | UPDATE | Subtle dark-mode border definitions instead of white. |
| `backend/database/migrations/*_add_expires_at_to_news.php` | CREATE | News table column migration for TTL. |
| `backend/app/Models/News.php` | UPDATE | Add expires_at attribute to mass-assignment and casts. |
| `backend/app/Http/Controllers/Admin/NewsController.php` | UPDATE | Validate and persist news expires_at field. |
| `frontend/src/pages/admin/NewsFormPage.jsx` | UPDATE | Add toggle switch and datetime-local picker for expires_at. |
| `backend/routes/console.php` | UPDATE | Schedule task to purge expired news. |

## Tasks

### Task 1: Environment & Route Hardening
- **Action**: Fix config files, configure Sanctum stateful domains, set `VITE_ADMIN_BASE`, add clear-state actions on 401 in React context. Secure `auth:sanctum` and `AdminOnly` middleware bindings in routes.
- **Validate**: API tests and route lists show secure endpoints.

### Task 2: Responsive UI & CSS Tuneup
- **Action**: Megaphone SVG integration, layout grid columns adjustments on `KoleksiPage`, clean up dark borders.
- **Validate**: Build frontend, test viewports.

### Task 3: News TTL Expiration Engine
- **Action**: Create migration adding `expires_at` column, model validation update, date-time selector on admin form, console command scheduling.
- **Validate**: Database migration executes cleanly; pruning cron logic is active.

## Validation
```bash
# Laravel Tests
cd backend && php artisan test --filter=AdminNewsCrudTest
# Frontend Lint & Build
cd frontend && npm run lint && npm run build
```

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| 401 Infinite Redirect | Medium | Force reset of auth states prior to navigations. |
| Database Seed Failure | Low | Ensure nullable fields are handled in tests/factories. |

## Acceptance
- [ ] Safe admin authentication routing without infinite login loops.
- [ ] Responsive grid items and clean dark borders on all viewports.
- [ ] Scheduled self-pruning deletes expired news entries automatically.
