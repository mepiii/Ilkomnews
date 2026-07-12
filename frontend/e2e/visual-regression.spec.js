import { test, expect } from '@playwright/test'
import { ADMIN_LOGIN_PATH } from './fixtures.js'

// ponytail: freeze framer-motion animations (reducedMotion) so staggered
// entrances don't race the screenshot; pages also lazy-load :8000 images,
// wait for them to settle.
test.use({ reducedMotion: 'reduce' })

// pages lazy-load :8000 images; wait for them to settle before snapshotting.
async function settleImages(page) {
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)
  const imgs = page.locator('img')
  const n = await imgs.count()
  for (let i = 0; i < n; i++) {
    try {
      await imgs.nth(i).evaluate((el) => el.complete || el.decode().catch(() => {}))
    } catch {
      // ignore decode failures on broken/optional images
    }
  }
}

test.describe('Visual Regression', () => {
  test('homepage hero section', async ({ page }) => {
    await page.goto('/')
    await settleImages(page)
    await expect(page).toHaveScreenshot('homepage-hero.png', {
      maxDiffPixelRatio: 0.05,
    })
  })

  test('admin login page', async ({ page }) => {
    await page.goto(ADMIN_LOGIN_PATH)
    await settleImages(page)
    await expect(page).toHaveScreenshot('admin-login.png', {
      maxDiffPixelRatio: 0.05,
    })
  })

  test('news page layout', async ({ page }) => {
    // NewsPage polls every 30s (setInterval) and re-renders; allow a little
    // diff tolerance for the live feed rather than chasing a moving target.
    await page.goto('/news')
    await settleImages(page)
    await expect(page).toHaveScreenshot('news-page.png', {
      maxDiffPixelRatio: 0.15,
      fullPage: true,
    })
  })

  test('gallery page layout', async ({ page }) => {
    await page.goto('/ilkomgallery')
    // Wait for real project cards (lazy grid) before snapshotting.
    await page.getByText(/ILKOM Gallery|Proyek|project/i).first().waitFor({ timeout: 10000 })
    await settleImages(page)
    await expect(page).toHaveScreenshot('gallery-page.png', {
      maxDiffPixelRatio: 0.15,
      fullPage: true,
    })
  })

  test('submit project page', async ({ page }) => {
    await page.goto('/submit')
    await settleImages(page)
    await expect(page).toHaveScreenshot('submit-page.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
