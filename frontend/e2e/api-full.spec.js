import { test, expect } from '@playwright/test'

// Full public API surface. api.spec.js covers news/articles/events/careers/
// projects lists + chat + sanctum. This file exercises EVERY remaining public
// endpoint so the suite truly covers "all API". Backend must be running and
// seeded (Vite proxies /api -> http://127.0.0.1:8000).

const LATEST = ['/api/news/latest', '/api/events/upcoming']
const CATS = ['/api/news/categories', '/api/events/categories']
const CAREER_FILTERS = ['/api/careers/types', '/api/careers/locations']

test.describe('Public API — content lists & latest', () => {
  for (const ep of ['/api/news', '/api/events', '/api/careers', '/api/projects']) {
    test(`${ep} returns paginated data array`, async ({ request }) => {
      const resp = await request.get(ep)
      expect(resp.status()).toBe(200)
      const body = await resp.json()
      expect(Array.isArray(body.data)).toBeTruthy()
      expect(JSON.stringify(body)).not.toContain('__PHP_Incomplete_Class')
    })
  }

  for (const ep of LATEST) {
    test(`${ep} returns a bare array (no .data wrapper)`, async ({ request }) => {
      const resp = await request.get(ep)
      expect(resp.status()).toBe(200)
      const body = await resp.json()
      expect(Array.isArray(body)).toBeTruthy()
    })
  }

  for (const ep of CATS) {
    test(`${ep} returns a categories array`, async ({ request }) => {
      const resp = await request.get(ep)
      expect(resp.status()).toBe(200)
      const body = await resp.json()
      expect(Array.isArray(body)).toBeTruthy()
      expect(body.length).toBeGreaterThan(0)
    })
  }

  for (const ep of CAREER_FILTERS) {
    test(`${ep} returns a non-empty filter array`, async ({ request }) => {
      const resp = await request.get(ep)
      expect(resp.status()).toBe(200)
      const body = await resp.json()
      expect(Array.isArray(body)).toBeTruthy()
      expect(body.length).toBeGreaterThan(0)
    })
  }

  test('single-item show endpoints return the matching id', async ({ request }) => {
    for (const base of ['/api/news', '/api/events', '/api/careers']) {
      const list = (await (await request.get(base)).json()).data
      test.skip(list.length === 0, `${base} empty`)
      const id = list[0].id
      const resp = await request.get(`${base}/${id}`)
      expect(resp.status()).toBe(200)
      const body = await resp.json()
      expect(String(body.id)).toBe(String(id))
    }
  })

  test('/api/projects/{id} returns the accepted project', async ({ request }) => {
    const list = (await (await request.get('/api/projects')).json()).data
    test.skip(list.length === 0, 'no accepted projects')
    const id = list[0].id
    const resp = await request.get(`/api/projects/${id}`)
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(String(body.id)).toBe(String(id))
    expect(body.status).toBe('accepted')
  })
})

test.describe('Public API — submissions, notifications & quota', () => {
  test('POST /api/submissions rejects empty body with 422', async ({ request }) => {
    const resp = await request.post('/api/submissions', { data: {} })
    expect(resp.status()).toBe(422)
    const body = await resp.json()
    expect(JSON.stringify(body)).toMatch(/required/i)
  })

  test('GET /api/submissions/track/{invalid} returns 404', async ({ request }) => {
    const resp = await request.get('/api/submissions/track/does-not-exist-xyz')
    expect(resp.status()).toBe(404)
  })

  test('GET /api/submissions/track/{valid} returns tracking data', async ({ request }) => {
    const list = (await (await request.get('/api/projects')).json()).data
    test.skip(list.length === 0, 'no accepted projects to derive a tracking id')
    const tid = list[0].tracking_id
    const resp = await request.get(`/api/submissions/track/${tid}`)
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(body.tracking_id).toBe(tid)
  })

  test('GET /api/upload-quota returns usage dict', async ({ request }) => {
    const resp = await request.get('/api/upload-quota')
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    for (const k of ['bytes_used', 'remaining', 'limit', 'is_exceeded']) {
      expect(body).toHaveProperty(k)
    }
  })

  test('GET /api/notifications/{tracking} returns a data envelope', async ({ request }) => {
    const resp = await request.get('/api/notifications/NOPE123')
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(body).toHaveProperty('data')
  })
})

test.describe('Public API — interaction tracking', () => {
  for (const type of ['news', 'events', 'projects']) {
    test(`${type} stats endpoint returns counters`, async ({ request }) => {
      const list = (await (await request.get(`/api/${type}`)).json()).data
      test.skip(list.length === 0, `${type} empty`)
      const id = list[0].id
      const resp = await request.get(`/api/interactions/${type}/${id}/stats`)
      expect(resp.status()).toBe(200)
      const body = await resp.json()
      for (const k of ['views', 'likes', 'saves', 'shares']) {
        expect(body).toHaveProperty(k)
      }
    })
  }

  const ACTIONS = ['view', 'like', 'save', 'share']
  for (const type of ['news', 'events', 'projects']) {
    for (const action of ACTIONS) {
      test(`POST ${type}/${action} returns <500 (idempotent toggincrement)`, async ({ request }) => {
        const list = (await (await request.get(`/api/${type}`)).json()).data
        test.skip(list.length === 0, `${type} empty`)
        const id = list[0].id
        const resp = await request.post(`/api/interactions/${type}/${id}/${action}`)
        expect(resp.status()).toBeLessThan(500)
      })
    }
  }
})
