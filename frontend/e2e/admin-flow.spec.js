import { test, expect, isBenign, ADMIN_LOGIN_PATH, ADMIN_BASE } from './fixtures.js'

// Authenticated admin panel flows. fixtures.js derives the obscure base from
// VITE_ADMIN_BASE (== k9x2m4q7w8e1r5t3y6u0i8o2p4a6s0d8). Backend must be
// running, seeded, and reachable at :8000 (Vite proxy). We login through the
// real UI so the session cookie is set, then walk the protected pages.

const BASE = `/${ADMIN_BASE}`
const ADMIN_PAGES = [
  'dashboard',
  'news',
  'news/create',
  'projects',
  'chatbot-api',
  'settings',
  'admins',
  'security',
  'chat-stats',
  'audit-logs',
]

async function loginAsAdmin(page) {
  await page.context().clearCookies()
  await page.goto(ADMIN_LOGIN_PATH)
  await page.waitForSelector('#login-email', { timeout: 10000 })
  await page.fill('#login-email', 'admin1@akademik.fasilkom.unsri.ac.id')
  await page.fill('#login-password', 'AdminAkademik01!')
  await page.locator('button[type="submit"]').first().click()
  // Wait until the URL actually leaves /login (the regex /\/dashboard|\/login/
  // would match the current /login instantly and return before navigation).
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
  return /\/dashboard/.test(page.url())
}

test.describe('Admin authenticated flows', () => {
  test('seed admin can log in and reach the dashboard', async ({ page, errors }) => {
    const ok = await loginAsAdmin(page)
    expect(ok).toBeTruthy()
    await expect(page).toHaveURL(new RegExp(`${BASE}/dashboard`))
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('protected pages load after login without crashing', async ({ page, errors }) => {
    const ok = await loginAsAdmin(page)
    test.skip(!ok, 'login failed — cannot test protected pages')

    for (const slug of ADMIN_PAGES) {
      await page.goto(`${BASE}/${slug}`)
      await page.waitForSelector('body')
      await page.waitForTimeout(800) // let lazy chunk + gated API settle
      const real = errors.filter((e) => !isBenign(e))
      expect(real, `Unexpected errors on /${slug}: ${real.join(' | ')}`).toEqual([])
    }
  })

  test('unauthenticated protected nav redirects to login', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto(`${BASE}/dashboard`)
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(new RegExp(`${BASE}/login`))
  })
})
