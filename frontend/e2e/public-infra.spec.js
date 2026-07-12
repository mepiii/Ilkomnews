// Public infrastructure + full submission lifecycle E2E.
//  - ping / sitemap.xml / robots.txt hit the backend directly (Vite only
//    proxies /api + /sanctum, so these are NOT reachable via :5173).
//  - chat (FAQ fast path), SSE stream, and the submission → track → notify
//    lifecycle go through the /api proxy like the rest of the public API.
// Requires backend :8000 seeded + reachable (see globalSetup.js).

import { test, expect } from '@playwright/test'

const BACKEND = process.env.IKON_API_URL || 'http://127.0.0.1:8000'

test.describe('Public infrastructure (direct backend)', () => {
  // Vite only proxies /api + /sanctum, so ping/sitemap/robots hit the backend
  // directly via absolute URLs (the `request` fixture defaults to :5173).
  test('GET /api/ping returns liveness', async ({ request }) => {
    const resp = await request.get(`${BACKEND}/api/ping`)
    expect(resp.status()).toBe(200)
    expect((await resp.json()).status).toBe('ok')
  })

  test('GET /sitemap.xml returns xml with urlset', async ({ request }) => {
    const resp = await request.get(`${BACKEND}/sitemap.xml`)
    expect(resp.status()).toBe(200)
    expect(resp.headers()['content-type']).toContain('application/xml')
    expect((await resp.text())).toContain('<urlset')
  })

  test('GET /robots.txt disallows admin and points to sitemap', async ({ request }) => {
    const text = await (await request.get(`${BACKEND}/robots.txt`)).text()
    expect(text).toContain('Disallow: /admin')
    expect(text).toContain('Sitemap:')
  })
})

test.describe('Chatbot — FAQ fast path', () => {
  test('POST /api/chat returns FAQ answer without LLM', async ({ request }) => {
    const resp = await request.post('/api/chat', {
      data: { message: 'apa itu ilkom news' },
    })
    // Never 500/429 even if the LLM quota is exhausted — FAQ is zero-token.
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(body.error).toBeFalsy()
    expect(body.source).toBe('faq')
    expect(body.message).toMatch(/ILKOM NEWS/i)
  })

  test('POST /api/chat rejects empty message with 422', async ({ request }) => {
    const resp = await request.post('/api/chat', { data: {} })
    expect(resp.status()).toBe(422)
  })

  test('POST /api/chat/stream emits an SSE token for FAQ', async ({ request }) => {
    const resp = await request.post('/api/chat/stream', {
      data: { message: 'siapa yang mengelola ilkom news' },
    })
    expect(resp.status()).toBe(200)
    const text = await resp.text()
    // SSE frame shape: `data: {json}`; at least one token frame must arrive.
    expect(text).toMatch(/^data: /m)
    const frame = text.match(/^data: (\{.*\})/m)
    expect(frame).toBeTruthy()
    const payload = JSON.parse(frame[1])
    expect(payload).toHaveProperty('token')
  })
})

test.describe('Submission lifecycle (public)', () => {
  const payload = {
    title: 'E2E Test Project',
    category: 'web',
    description: 'A project submitted by the E2E test suite to verify the public lifecycle.',
    tech_stack: ['React', 'Laravel'],
    creator_name: 'E2E Bot',
    creator_type: 'mahasiswa',
    thumbnail_url: 'https://example.com/thumb.png',
  }

  test('POST /api/submissions with valid data returns 201 + tracking_id', async ({ request }) => {
    const resp = await request.post('/api/submissions', { data: payload })
    expect(resp.status()).toBe(201)
    const body = await resp.json()
    expect(body.tracking_id).toMatch(/^[A-Z0-9]{12}$/)
    // Backend returns the freshly created status as null (default 'pending' is
    // set by the model's DB default, not echoed in the 201 response).
    expect(body).toHaveProperty('status')
  })

  test('POST /api/submissions with empty body returns 422', async ({ request }) => {
    const resp = await request.post('/api/submissions', { data: {} })
    expect(resp.status()).toBe(422)
  })

  test('full flow: submit → track → read notification', async ({ request }) => {
    const created = await (await request.post('/api/submissions', { data: payload })).json()
    const tid = created.tracking_id

    const track = await request.get(`/api/submissions/track/${tid}`)
    expect(track.status()).toBe(200)
    const trackBody = await track.json()
    expect(trackBody.tracking_id).toBe(tid)
    expect(['pending', null]).toContain(trackBody.status)

    // A "submitted" notification is created on submit, tied to the tracking id.
    const notifs = await (await request.get(`/api/notifications/${tid}`)).json()
    expect(Array.isArray(notifs.data)).toBeTruthy()
    const first = notifs.data[0]
    expect(first).toBeTruthy()

    if (first && first.id) {
      const read = await request.post(`/api/notifications/${tid}/${first.id}/read`)
      expect(read.status()).toBe(200)
    }
  })
})
