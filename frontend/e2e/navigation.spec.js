import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1, [class*="hero"]')).toBeVisible({ timeout: 10000 })
  })

  test('can navigate to news page', async ({ page }) => {
    await page.goto('/')
    // Navbar links use role=link with the item name text
    await page.getByRole('link', { name: /^berita$/i }).first().click()
    await expect(page).toHaveURL(/\/news/)
  })

  test('can navigate to gallery page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /ilkom gallery/i }).first().click()
    await expect(page).toHaveURL(/\/ilkomgallery/)
  })
})
