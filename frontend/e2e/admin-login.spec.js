import { test, expect } from '@playwright/test'
import { ADMIN_LOGIN_PATH } from './fixtures.js'

test.describe('Admin Login', () => {
  test('shows login form', async ({ page }) => {
    await page.goto(ADMIN_LOGIN_PATH)
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()
    await expect(page.getByRole('button', { name: /masuk/i })).toBeVisible()
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto(ADMIN_LOGIN_PATH)
    await page.locator('#login-email').fill('wrong@test.com')
    await page.locator('#login-password').fill('wrongpassword')
    await page.getByRole('button', { name: /masuk/i }).click()
    await expect(page.locator('[class*="text-red"], [class*="error"]')).toBeVisible({ timeout: 5000 })
  })
})
