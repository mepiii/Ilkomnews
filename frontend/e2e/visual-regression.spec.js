import { test, expect } from '@playwright/test'
import { ADMIN_LOGIN_PATH } from './fixtures.js'

test.describe('Visual Regression', () => {
  test('homepage hero section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    await expect(page).toHaveScreenshot('homepage-hero.png', {
      maxDiffPixelRatio: 0.05,
    })
  })

  test('admin login page', async ({ page }) => {
    await page.goto(ADMIN_LOGIN_PATH)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot('admin-login.png', {
      maxDiffPixelRatio: 0.05,
    })
  })

  test('news page layout', async ({ page }) => {
    await page.goto('/news')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
    await expect(page).toHaveScreenshot('news-page.png', {
      maxDiffPixelRatio: 0.1,
    })
  })

  test('gallery page layout', async ({ page }) => {
    await page.goto('/ilkomgallery')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
    await expect(page).toHaveScreenshot('gallery-page.png', {
      maxDiffPixelRatio: 0.1,
    })
  })

  test('submit project page', async ({ page }) => {
    await page.goto('/submit')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    await expect(page).toHaveScreenshot('submit-page.png', {
      maxDiffPixelRatio: 0.05,
    })
  })
})
