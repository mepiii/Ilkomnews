import { test, expect } from '@playwright/test'

const ENDPOINTS = [
  '/api/news',
  '/api/events',
  '/api/articles',
  '/api/careers',
  '/api/projects',
]

test.describe('Public API contract (JSON, not serialized PHP)', () => {
  for (const ep of ENDPOINTS) {
    test(`${ep} returns a JSON object with a data array`, async ({ request }) => {
      const resp = await request.get(ep)
      expect(resp.status()).toBe(200)
      const ct = resp.headers()['content-type'] || ''
      expect(ct.toLowerCase()).toContain('application/json')

      const body = await resp.json()
      expect(Array.isArray(body.data)).toBeTruthy()
      // Regression guard: the database cache store used to serialize the
      // paginator into a corrupt "__PHP_Incomplete_Class" blob.
      expect(JSON.stringify(body)).not.toContain('__PHP_Incomplete_Class')
    })
  }

  test('single news item endpoint returns a JSON object', async ({ request }) => {
    const list = await request.get('/api/news')
    const items = (await list.json()).data
    test.skip(items.length === 0, 'no news seeded')
    const id = items[0].id
    const resp = await request.get(`/api/news/${id}`)
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(body.id).toBe(id)
    expect(JSON.stringify(body)).not.toContain('__PHP_Incomplete_Class')
  })

  test('chat endpoint responds (200 or graceful 4xx), never 500', async ({ request }) => {
    const resp = await request.post('/api/chat', {
      data: { message: 'halo', session_id: 'e2e', device_id: 'e2e' },
    })
    // No LLM key configured is acceptable as long as it degrades gracefully.
    expect(resp.status()).toBeLessThan(500)
  })

  test('sanctum csrf cookie endpoint returns 204', async ({ request }) => {
    const resp = await request.get('/sanctum/csrf-cookie')
    expect([204, 200]).toContain(resp.status())
  })
})
