import { test as base, expect } from '@playwright/test'
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

export { expect }
