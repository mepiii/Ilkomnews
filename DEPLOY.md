# Deploy — IKON (ILKOM NEWS)

Monorepo: Laravel backend (serves the SPA from `backend/public`) + Vite/React
frontend (builds into `backend/public`) + standalone chatbot service (Node/TS).

## Prerequisites
- PHP 8.2+ with extensions: mbstring, xml, curl, sqlite3 (tests), pdo_mysql (prod), gd, zip
- Node 20+ and npm
- MySQL/MariaDB (prod). SQLite in-memory is used only for `php artisan test`.
- Hosting that runs PHP (e.g. Hostinger). The SPA is static assets served by Laravel.

## Build (local or CI)
```bash
# 1. Frontend -> emits bundle into backend/public
cd frontend && npm install && npm run build

# 2. Backend deps
cd ../backend && composer install --no-dev --optimize-autoloader

# 3. Chatbot service (separate process)
cd ../chatbot && npm install && npm run build
```

## Server setup (one-time)
1. Upload `backend/` to the document/host root. The web root must point at `backend/public`.
2. Copy `.env.example` -> `.env`, set real values:
   - `APP_ENV=production`, `APP_DEBUG=false`
   - `APP_URL=https://your-domain`
   - `FRONTEND_URL=https://your-domain`
   - `DB_*` to the production MySQL
   - `CACHE_STORE`/`QUEUE_CONNECTION`/`SESSION_DRIVER`: `file` is fine for single node,
     switch to `redis`/`database` only when scaling to multiple nodes.
   - Admin route prefix `VITE_ADMIN_BASE` — keep obscure, share only with admins.

## Deploy steps
```bash
cd backend
php artisan key:generate          # only first time / if APP_KEY empty
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
Then start the chatbot service (e.g. `cd chatbot && node dist/index.js`) behind the same
host or as a worker. Point `CHATBOT_URL` in the frontend env at it.

## Verify
- `GET /` returns the SPA (200)
- `GET /api/news` returns JSON (200)
- Admin at `/{VITE_ADMIN_BASE}`

## Notes
- `vite build` does NOT empty `backend/public` (outDir is outside project root) — stale
  assets are fine because filenames are content-hashed, but delete `backend/public/assets`
  manually if you want a clean sweep.
- Tests: `php artisan test` (backend), `cd frontend && npm run test` (vitest) +
  `npm run test:e2e` (Playwright), `cd chatbot && npm run typecheck`.
