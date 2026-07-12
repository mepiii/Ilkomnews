import { test, expect, isBenign } from './fixtures.js'

const PUBLIC_ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/news', name: 'News' },
  { path: '/ilkomgallery', name: 'Ilkom Gallery' },
  { path: '/submit', name: 'Submit Project' },
  { path: '/koleksi', name: 'Koleksi' },
  { path: '/track', name: 'Track' },
]

test.describe('Public routes load without runtime errors', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.name} (${route.path}) renders`, async ({ page, errors }) => {
      const resp = await page.goto(route.path)
      // Either a direct document load or SPA fallback (200) is acceptable.
      expect(resp.status()).toBeLessThan(400)

      // Page should have a recognizable shell.
      await expect(page.locator('body')).toBeVisible()

      // Wait for content to settle.
      await page.waitForTimeout(800)

      const real = errors.filter((e) => !isBenign(e))
      expect(real, `Unexpected errors on ${route.path}: ${real.join(' | ')}`).toEqual([])
    })
  }

  test('Home page shows hero + latest content', async ({ page, errors }) => {
    await page.goto('/')
    await expect(page.getByText(/ILKOM NEWS/i).first()).toBeVisible()
    await page.waitForTimeout(600)
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('unknown route renders the 404 NotFoundPage (not HomePage)', async ({ page, errors }) => {
    await page.goto('/this-route-does-not-exist-xyz')
    // App catch-all (*) renders NotFoundPage. Headlines use WordBounce which
    // splits text into per-character spans, so match on a stable phrase
    // ("ditemukan") that only appears on NotFoundPage.
    await expect(page.getByText(/ditemukan/i).first()).toBeVisible({ timeout: 10000 })
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })
})
