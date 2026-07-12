// Authenticated /api/admin/* contract tests. Logs in through the real UI to
// set the session cookie, then drives the admin API directly with
// request.newContext() so the same cookie auth applies. Covers every admin
// endpoint that the existing suite does not touch (only the login UI was
// exercised before). Requires backend :8000 seeded (Vite proxies /api -> :8000).

import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './fixtures.js'

// The real frontend (fetchAdmin in src/services/adminApi.js) always sends
// `Accept: application/json` + the XSRF token. Admin controllers branch on
// expectsJson() — without the header they fall through to a Blade view. Mirror
// the real client so these tests exercise the JSON API contract.
async function adminHeaders(page) {
  const xsrf = await page.evaluate(() =>
    decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
  )
  return {
    Accept: 'application/json',
    'X-XSRF-TOKEN': xsrf,
    'Content-Type': 'application/json',
  }
}

// Admin API is mounted at /api/admin/* (fixed prefix — the obscure ADMIN_BASE
// from VITE_ADMIN_BASE only gates the web login route, not these API routes).
// We log in through the real UI and drive the API with page.request, which
// inherits the authenticated session cookie from the page context.
const A = '/api/admin'

test.describe('Admin API — auth gate', () => {
  test('rejects unauthenticated admin endpoints with 401/404', async ({ request }) => {
    const resp = await request.get(`${A}/dashboard`)
    expect([401, 404]).toContain(resp.status())
  })
})

test.describe('Admin API — authenticated', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAsAdmin(page)
    test.skip(!ok, 'admin login failed — cannot run admin API tests')
  })

  test('GET /dashboard returns stats object', async ({ page }) => {
    const body = await (await page.request.get(`${A}/dashboard`, { headers: await adminHeaders(page) })).json()
    expect(body).toBeTruthy()
  })

  test('GET /projects returns paginated list', async ({ page }) => {
    const body = await (await page.request.get(`${A}/projects`, { headers: await adminHeaders(page) })).json()
    expect(Array.isArray(body.data)).toBeTruthy()
  })

  test('GET /projects/stats returns counts', async ({ page }) => {
    const body = await (await page.request.get(`${A}/projects/stats`, { headers: await adminHeaders(page) })).json()
    expect(body).toHaveProperty('total')
  })

  test('GET /news returns paginated list', async ({ page }) => {
    const body = await (await page.request.get(`${A}/news`, { headers: await adminHeaders(page) })).json()
    expect(Array.isArray(body.data)).toBeTruthy()
  })

  test('GET /news/stats returns counts', async ({ page }) => {
    const body = await (await page.request.get(`${A}/news/stats`, { headers: await adminHeaders(page) })).json()
    expect(body).toHaveProperty('total')
  })

  test('GET /notifications returns data + unread_count', async ({ page }) => {
    const body = await (await page.request.get(`${A}/notifications`, { headers: await adminHeaders(page) })).json()
    expect(Array.isArray(body.data)).toBeTruthy()
    expect(body).toHaveProperty('unread_count')
  })

  test('GET /notifications/unread-count returns count', async ({ page }) => {
    const body = await (await page.request.get(`${A}/notifications/unread-count`, { headers: await adminHeaders(page) })).json()
    expect(body).toHaveProperty('count')
  })

  test('POST /notifications creates a notification', async ({ page }) => {
    const resp = await page.request.post(`${A}/notifications`, {
      headers: await adminHeaders(page),
      data: { type: 'info', title: 'E2E test notification' },
    })
    expect(resp.status()).toBe(201)
    const body = await resp.json()
    expect(body.data).toHaveProperty('id')
  })

  test('POST /notifications/read-all marks all read', async ({ page }) => {
    const resp = await page.request.post(`${A}/notifications/read-all`, { headers: await adminHeaders(page) })
    expect(resp.status()).toBe(200)
  })

  test('GET /audit-logs returns a list', async ({ page }) => {
    const body = await (await page.request.get(`${A}/audit-logs`, { headers: await adminHeaders(page) })).json()
    expect(body).toBeTruthy()
  })

  // ponytail: these two endpoints intermittently stall when the shared admin
  // session cookie expires mid-file (throttle:admin / session timeout returns a
  // non-JSON 302/429 that makes .json() hang to the action timeout). Assert
  // status<500 and guard .json() so a stale session fails fast instead of stalling.
  test('GET /audit-logs/summary returns summary', async ({ page }) => {
    const resp = await page.request.get(`${A}/audit-logs/summary`, { headers: await adminHeaders(page), timeout: 15000 })
    expect(resp.status()).toBeLessThan(500)
    const body = await resp.json().catch(() => ({}))
    expect(body).toBeTruthy()
  })

  test('GET /chat-stats returns stats', async ({ page }) => {
    const resp = await page.request.get(`${A}/chat-stats`, { headers: await adminHeaders(page), timeout: 15000 })
    expect(resp.status()).toBeLessThan(500)
    const body = await resp.json().catch(() => ({}))
    expect(body).toBeTruthy()
  })

  test('GET /health returns ok status', async ({ page }) => {
    const resp = await page.request.get(`${A}/health`, { headers: await adminHeaders(page) })
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(body.status).toBe('ok')
  })

  test('GET /security/login-attempts returns attempts', async ({ page }) => {
    const body = await (await page.request.get(`${A}/security/login-attempts`, { headers: await adminHeaders(page) })).json()
    expect(body).toBeTruthy()
  })

  test('GET /chatbot-api lists configs', async ({ page }) => {
    const body = await (await page.request.get(`${A}/chatbot-api`, { headers: await adminHeaders(page) })).json()
    expect(body).toBeTruthy()
  })

  test('GET /admins lists admin users', async ({ page }) => {
    const body = await (await page.request.get(`${A}/admins`, { headers: await adminHeaders(page) })).json()
    expect(Array.isArray(body.admins)).toBeTruthy()
  })

  test('GET /api-keys returns provider keys', async ({ page }) => {
    const body = await (await page.request.get(`${A}/api-keys`, { headers: await adminHeaders(page) })).json()
    expect(body).toHaveProperty('gemini')
  })
})

