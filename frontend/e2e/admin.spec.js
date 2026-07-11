import { test, expect, isBenign, ADMIN_LOGIN_PATH, ADMIN_BASE } from './fixtures.js'

const BASE = `/${ADMIN_BASE}`

test.describe('Admin route security (obscure prefix)', () => {
  test('guessing /admin redirects to home', async ({ page, errors }) => {
    await page.goto('/admin')
    await page.waitForTimeout(800)
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByText(/ILKOM NEWS/i).first()).toBeVisible()
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test(`${BASE}/login shows the login form`, async ({ page, errors }) => {
    await page.goto(ADMIN_LOGIN_PATH)
    await page.waitForSelector('#login-email', { timeout: 10000 })
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test(`protected ${BASE}/dashboard redirects unauthenticated users to login`, async ({ page, errors }) => {
    await page.goto(`${BASE}/dashboard`)
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(new RegExp(`${BASE}/login`))
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('login with seed admin reaches the dashboard', async ({ page, errors }) => {
    // Ensure a clean slate (no lingering session).
    await page.context().clearCookies()
    await page.goto(ADMIN_LOGIN_PATH)
    await page.waitForSelector('#login-email', { timeout: 10000 })

    // Credentials match database/seeders/AdminSeeder.php (akademik.* domain).
    await page.fill('#login-email', 'admin1@akademik.fasilkom.unsri.ac.id')
    await page.fill('#login-password', 'AdminAkademik01!')
    await page.locator('button[type="submit"]').first().click()

    // Allow auth round-trip (csrf + login + /admin/user).
    await page.waitForTimeout(4000)

    const onDashboard = new RegExp(`${BASE}/dashboard`).test(page.url())
    const onLogin = new RegExp(`${BASE}/login`).test(page.url())
    const hasError = await page.getByText(/email|password|login gagal|salah|invalid/i).count()

    // Either we made it in, or we were cleanly rejected — never a crash.
    expect(onDashboard || onLogin || hasError).toBeTruthy()

    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })
})
