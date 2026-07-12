// Fast-fail guard: the Playwright config only starts Vite (frontend). The
// Laravel API backend (:8000) + MariaDB must be running separately. Without
// this check, a down backend produces a wall of "/api/*" timeouts with no
// clear cause. Fails fast with an actionable message instead.
import { request } from '@playwright/test'

const BACKEND = process.env.IKON_API_URL || 'http://127.0.0.1:8000'

export default async function globalSetup() {
  try {
    const ctx = await request.newContext()
    const resp = await ctx.get(`${BACKEND}/api/news`, { timeout: 8000 })
    await ctx.dispose()
    if (resp.status() >= 500) {
      throw new Error(`Backend at ${BACKEND} returned ${resp.status()}`)
    }
    // 404/4xx still means the server is up — only a connection failure blocks us.
  } catch (err) {
    if (err.message.includes('Backend at')) throw err
    throw new Error(
      `E2E aborted: Laravel backend not reachable at ${BACKEND}.\n` +
      `Start it before running e2e:\n` +
      `  cd ../backend && php artisan migrate --seed\n` +
      `  php artisan serve --host=127.0.0.1 --port=8000\n` +
      `(Original error: ${err.message})`,
    )
  }
}
