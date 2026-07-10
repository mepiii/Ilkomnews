import { test, expect } from '@playwright/test'

test.describe('Chat Widget', () => {
  test('opens and closes chat', async ({ page }) => {
    await page.goto('/')

    // Open the floating Wolfy button (img alt="Wolfy" — the FAB has no
    // aria-label, so target the image inside it, as chatbot.spec does).
    const fab = page.locator('img[alt="Wolfy"]')
    await expect(fab).toBeVisible({ timeout: 10000 })
    await fab.click()

    // The widget opens into the FAQ view (no greeting text is shown here).
    // The AI Chat entry button is a stable, visible marker of the open panel.
    const faqEntry = page.getByRole('button', { name: /Tanya ke AI Chat/i })
    await expect(faqEntry).toBeVisible({ timeout: 10000 })

    // Close the panel. The close (X) button has no aria-label, so we target
    // the first button containing a lucide "x" icon inside the panel.
    const closeBtn = page.locator('button:has(svg.lucide-x)').first()
    await expect(closeBtn).toBeVisible()
    await closeBtn.click()

    // FAQ panel should be hidden again.
    await expect(faqEntry).not.toBeVisible()
  })
})
