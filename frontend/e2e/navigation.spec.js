import { test, expect, isBenign } from './fixtures.js'

test.describe('Navigation, theme and search', () => {
  test('Navbar links navigate to public sections', async ({ page, errors }) => {
    await page.goto('/')
    await page.waitForSelector('nav', { timeout: 10000 })

    for (const [label, path] of [
      ['Berita', '/news'],
      ['Ilkom Gallery', '/ilkomgallery'],
    ]) {
      await page.goto('/')
      await page.waitForSelector(`a[href="${path}"]`)
      const link = page.locator(`a[href="${path}"]`).first()
      await expect(link).toBeVisible()
      await link.click()
      await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/') + '(\\b|$)'))
      await page.waitForTimeout(400)
    }

    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('Theme toggle switches dark/light and persists', async ({ page, errors }) => {
    await page.goto('/')
    await page.waitForSelector('html')

    const initial = await page.getAttribute('html', 'class')
    // Click the theme toggle button (aria-label is in Indonesian:
    // "Aktifkan mode terang" / "Aktifkan mode gelap").
    const toggle = page.locator('button[aria-label*="mode" i]').first()
    await expect(toggle).toBeVisible({ timeout: 10000 })
    await toggle.click()
    await page.waitForTimeout(500)

    const after = await page.getAttribute('html', 'class')
    expect(after).not.toBe(initial)

    // Persists across reload via localStorage
    await page.reload()
    await page.waitForSelector('html')
    const persisted = await page.getAttribute('html', 'class')
    expect(persisted).toBe(after)

    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('Ctrl+K opens the search dock', async ({ page, errors }) => {
    await page.goto('/')
    await page.waitForTimeout(500)

    await page.keyboard.press('Control+k')
    await page.waitForTimeout(500)

    // The dock should surface an input.
    const input = page.locator('input[placeholder*="Cari" i], input[placeholder*="Search" i]').first()
    await expect(input).toBeVisible({ timeout: 5000 })

    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })
})
