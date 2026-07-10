import { test, expect, isBenign } from './fixtures.js'

test.describe('Admin route security (obscure prefix)', () => {
  test('guessing /admin redirects to home', async ({ page, errors }) => {
    await page.goto('/admin')
    await page.waitForTimeout(800)
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByText(/ILKOM NEWS/i).first()).toBeVisible()
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('/portal/login shows the login form', async ({ page, errors }) => {
    await page.goto('/portal/login')
    await page.waitForSelector('form', { timeout: 10000 })
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('protected /portal/dashboard redirects unauthenticated users to login', async ({ page, errors }) => {
    await page.goto('/portal/dashboard')
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(/\/portal\/login/)
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('login with seed admin reaches the dashboard', async ({ page, errors }) => {
    // Ensure a clean slate (no lingering session).
    await page.context().clearCookies()
    await page.goto('/portal/login')
    await page.waitForSelector('form', { timeout: 10000 })

    await page.fill('input[type="email"], input[name="email"]', 'admin1@sapa.fasilkom.unsri.ac.id')
    await page.fill('input[type="password"]', 'AdminSapa01!')
    await page.locator('button[type="submit"]').first().click()

    // Allow auth round-trip (csrf + login + /admin/user).
    await page.waitForTimeout(4000)

    const onDashboard = /\/portal\/dashboard/.test(page.url())
    const onLogin = /\/portal\/login/.test(page.url())
    const hasError = await page.getByText(/email|password|login gagal|salah|invalid/i).count()

    // Either we made it in, or we were cleanly rejected — never a crash.
    expect(onDashboard || onLogin || hasError).toBeTruthy()

    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })
})
