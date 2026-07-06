import { test, expect } from '@playwright/test'

test.describe('Chat Widget', () => {
  test('opens and closes chat', async ({ page }) => {
    await page.goto('/')

    // Click the chat FAB button (has aria-label="Chat dengan Wolfy")
    const fab = page.locator('[aria-label*="Chat"]')
    await fab.click()

    // FAQ section should be visible - check for the heading instead of specific FAQ text
    await expect(page.locator('text=Halo! 👋')).toBeVisible({ timeout: 5000 })

    // Close button
    const closeBtn = page.locator('[aria-label="Tutup"]')
    await closeBtn.click()

    // FAQ should be hidden
    await expect(page.locator('text=Halo! 👋')).not.toBeVisible()
  })
})
