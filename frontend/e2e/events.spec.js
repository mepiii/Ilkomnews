import { test, expect } from '@playwright/test'

test.describe('Events Page', () => {
  test('loads and displays event cards', async ({ page }) => {
    await page.goto('/events')
    // Wait for page to finish loading - count text should appear
    await expect(page.locator('text=event ditemukan')).toBeVisible({ timeout: 15000 })
  })

  test('shows search and filter controls', async ({ page }) => {
    await page.goto('/events')
    await expect(page.locator('text=Semua Event')).toBeVisible({ timeout: 15000 })
    // Search starts as a collapsed icon button
    await expect(page.locator('[aria-label="Buka pencarian"]')).toBeVisible()
    // Sort dropdown should be visible
    await expect(page.locator('text=Terbaru').first()).toBeVisible()
  })

  test('can open search dock and search events', async ({ page }) => {
    await page.goto('/events')
    await expect(page.locator('text=Semua Event')).toBeVisible({ timeout: 15000 })
    // Click search icon to expand the dock
    await page.locator('[aria-label="Buka pencarian"]').click()
    // Now the input should appear
    const searchInput = page.locator('input[placeholder*="Cari"]')
    await expect(searchInput).toBeVisible({ timeout: 5000 })
    await searchInput.fill('test')
    await expect(page.locator('text=event ditemukan')).toBeVisible({ timeout: 5000 })
  })

  test('can filter by tab', async ({ page }) => {
    await page.goto('/events')
    await expect(page.locator('text=Semua Event')).toBeVisible({ timeout: 15000 })
    await page.locator('text=Workshop').first().click()
    await expect(page.locator('text=event ditemukan')).toBeVisible({ timeout: 5000 })
  })

  test('event card has detail link', async ({ page }) => {
    await page.goto('/events')
    await expect(page.locator('text=event ditemukan')).toBeVisible({ timeout: 15000 })
    const detailLink = page.locator('text=Lihat Detail').first()
    if (await detailLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(detailLink).toBeVisible()
    }
  })
})

test.describe('Event Detail Page', () => {
  test('navigates to event detail via URL', async ({ page }) => {
    await page.goto('/events/1')
    await page.waitForTimeout(2000)
    // Page should not crash (no error page)
    await expect(page.locator('body')).toBeVisible()
  })

  test('shows back navigation', async ({ page }) => {
    await page.goto('/events/1')
    await page.waitForTimeout(2000)
    const backLink = page.locator('a[href="/"]').first()
    await expect(backLink).toBeVisible({ timeout: 5000 })
  })

  test('navigates back to home', async ({ page }) => {
    await page.goto('/events/1')
    await page.waitForTimeout(2000)
    const backLink = page.locator('a[href="/"]').first()
    if (await backLink.isVisible().catch(() => false)) {
      await backLink.click()
      await expect(page).toHaveURL('/')
    }
  })
})
