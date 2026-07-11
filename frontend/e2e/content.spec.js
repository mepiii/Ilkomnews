import { test, expect, isBenign } from './fixtures.js'

// Helper: cards use an expand-on-click UX (ExpandableCard). The detail link
// only exists inside the expanded modal, so we click the card to open it,
// then click the link within the modal.
async function openFirstDetail(page, hrefPrefix) {
  const card = page.locator('article[role="button"]').first()
  await expect(card).toBeVisible({ timeout: 15000 })
  await card.click()
  const link = page.locator(`a[href^="${hrefPrefix}"]`).first()
  await expect(link).toBeVisible({ timeout: 15000 })
  const href = await link.getAttribute('href')
  await link.click()
  await expect(page).toHaveURL(new RegExp(hrefPrefix))
  await page.waitForSelector('h1, article', { timeout: 15000 })
  return href
}

test.describe('Content detail flows', () => {
  test('News list shows cards and opens a detail page', async ({ page, errors }) => {
    await page.goto('/news')
    const href = await openFirstDetail(page, '/news/')
    expect(href).toMatch(/\/news\/.+/)
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('Ilkom Gallery opens a project detail page', async ({ page, errors }) => {
    await page.goto('/ilkomgallery')
    const href = await openFirstDetail(page, '/ilkomgallery/')
    expect(href).toMatch(/\/ilkomgallery\/(project|game|mobile|uiux|web)\/.+/)
    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('Submit Project form validates and submits', async ({ page, errors }) => {
    await page.goto('/submit')
    await page.waitForSelector('form', { timeout: 10000 })

    // The submit control is a drag-to-submit SlideButton labelled "Kirim Proyek".
    const submitBtn = page.getByText('Kirim Proyek').first()
    await expect(submitBtn).toBeVisible({ timeout: 10000 })
    await submitBtn.click()
    await page.waitForTimeout(500)

    // Fill required-looking fields if present.
    const title = page.locator('input[name="title"], input[placeholder*="Judul" i]').first()
    if (await title.count()) {
      await title.fill('E2E Test Project')
    }
    const desc = page.locator('textarea').first()
    if (await desc.count()) {
      await desc.fill('Automated end-to-end test submission from Playwright.')
    }

    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })
})
