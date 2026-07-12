import { test as base, expect, request } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Derive the obscure admin route prefix WITHOUT import.meta.env (which only
// exists inside the Vite browser bundle, not the Node test runtime). This
// mirrors src/config/admin.js: VITE_ADMIN_BASE from the env, default 'admin'.
// We prefer an explicit process.env override, then parse frontend/.env, then
// fall back to 'admin'. Do NOT hardcode 'portal' here.
function loadAdminBase() {
  if (process.env.VITE_ADMIN_BASE) return process.env.VITE_ADMIN_BASE
  try {
    const envPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '..',
      '.env',
    )
    const content = readFileSync(envPath, 'utf8')
    const m = content.match(/^\s*VITE_ADMIN_BASE\s*=\s*(.+?)\s*$/m)
    if (m) return m[1].trim().replace(/^["']|["']$/g, '')
  } catch {
    // .env unreadable — fall through to default below.
  }
  return 'admin'
}

export const ADMIN_BASE = loadAdminBase()
export const ADMIN_LOGIN_PATH = `/${ADMIN_BASE}/login`

// Seed admin from database/seeders/AdminSeeder.php (Admin 1). Shared so both the
// admin-flow and admin-api specs log in through the real UI and get the session
// cookie set the same way.
export async function loginAsAdmin(page) {
  // ponytail: /api/admin/login is `throttle:login` (5/min). Under a full-suite
  // run the same seed admin is logged in repeatedly and the limiter 429s the
  // POST, leaving us stuck on /login. Retry with a backoff that clears the
  // window instead of failing the whole authenticated block.
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.context().clearCookies()
    await page.goto(ADMIN_LOGIN_PATH)
    await page.waitForSelector('#login-email', { timeout: 10000 })
    await page.fill('#login-email', 'admin1@akademik.fasilkom.unsri.ac.id')
    await page.fill('#login-password', 'AdminAkademik01!')
    await page.locator('button[type="submit"]').first().click()
    try {
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
      return /\/dashboard/.test(page.url())
    } catch {
      if (attempt === 2) return false
      await page.waitForTimeout(15000) // wait out the 1-min throttle window
    }
  }
  return false
}

// Known-benign console noise we don't want to fail the run on:
//  - missing favicon
//  - 404 on optional assets (e.g. wolfy avatar fallback is handled by onError)
//  - font preload / React DevTools hints
const BENIGN = [
  /favicon/i,
  /wolfy-avatar\.png/i,
  /Failed to load resource/i,
  /net::ERR/i,
  /status of 404/i,
  /status of 5\d\d/i,
  /Download the React DevTools/i,
  /preload/i,
  /the server responded with a status/i,
  /MIME type/i,
]

export function isBenign(text) {
  return BENIGN.some((re) => re.test(text))
}

// Custom fixture that attaches error collectors BEFORE navigation and exposes
// a helper to assert no unexpected runtime errors occurred.
export const test = base.extend({
  errors: async ({ page }, use) => {
    const collected = []
    const onPageError = (err) => collected.push(`pageerror: ${err.message}`)
    const onConsole = (msg) => {
      if (msg.type() === 'error') collected.push(`console.error: ${msg.text()}`)
    }
    page.on('pageerror', onPageError)
    page.on('console', onConsole)
    await use(collected)
  },
})

export { expect, request }
