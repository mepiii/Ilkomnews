import { test, expect, isBenign } from './fixtures.js'

test.describe('Wolfy chatbot widget', () => {
  test('opens FAQ, drills into a category, and shows an answer', async ({ page, errors }) => {
    await page.goto('/')
    await page.waitForTimeout(600)

    // Open the floating Wolfy button (img alt="Wolfy").
    const fab = page.locator('img[alt="Wolfy"]').first()
    await expect(fab).toBeVisible({ timeout: 10000 })
    await fab.click()
    await page.waitForTimeout(500)

    // FAQ category should appear.
    const umum = page.getByText('Umum', { exact: true }).first()
    await expect(umum).toBeVisible({ timeout: 5000 })
    await umum.click()
    await page.waitForTimeout(400)

    // A question from that category is visible.
    const question = page.getByText('Apa itu ILKOM NEWS?').first()
    await expect(question).toBeVisible({ timeout: 5000 })
    await question.click()
    await page.waitForTimeout(600)

    // Assistant answer should render.
    const answer = page.getByText(/portal berita dan galeri/i).first()
    await expect(answer).toBeVisible({ timeout: 5000 })

    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })

  test('sending a message reaches the chat API and renders a reply or graceful error', async ({ page, errors }) => {
    await page.goto('/')
    await page.waitForTimeout(600)

    const fab = page.locator('img[alt="Wolfy"]').first()
    await fab.click()
    await page.waitForTimeout(400)

    const startChat = page.getByRole('button', { name: /Tanya ke AI Chat/i }).first()
    await expect(startChat).toBeVisible({ timeout: 5000 })
    await startChat.click()
    await page.waitForTimeout(500)

    const input = page.locator('input[placeholder*="Ketik" i]').first()
    await expect(input).toBeVisible({ timeout: 5000 })
    await input.fill('Halo Wolfy, ini pesan uji.')
    await input.press('Enter')
    await page.waitForTimeout(4000)

    // Either a real assistant reply or the graceful connection-error message.
    const hasReply = await page.getByText(/Halo! Saya Wolfy/i).count()
    const hasError = await page.getByText(/gangguan koneksi/i).count()
    expect(hasReply + hasError).toBeGreaterThan(0)

    const real = errors.filter((e) => !isBenign(e))
    expect(real, real.join(' | ')).toEqual([])
  })
})
