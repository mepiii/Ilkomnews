/* global global */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

vi.stubEnv('VITE_USE_REAL_API', '')
vi.stubEnv('DEV', true)

const { fetchAdmin, adminNews, adminProjects, adminSecurity } = await import('./adminApi.js')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('fetchAdmin', () => {
  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Server error' }),
    })

    await expect(fetchAdmin('/admin/test')).rejects.toThrow('Server error')
  })

  it('returns null on 204', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    })

    const result = await fetchAdmin('/admin/test')
    expect(result).toBeNull()
  })

  it('passes credentials include', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ok: true }),
    })

    await fetchAdmin('/admin/test')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ credentials: 'include' })
    )
  })
})

describe('adminNews', () => {
  it('getAll builds query string', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: [] }),
    })

    await adminNews.getAll({ page: 1, status: 'published' })
    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('page=1')
    expect(url).toContain('status=published')
  })

  it('create sends POST with JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1 }),
    })

    await adminNews.create({ title: 'Test' })
    const [, options] = mockFetch.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ title: 'Test' })
  })
})

describe('adminProjects', () => {
  it('accept sends POST', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 'accepted' }),
    })

    await adminProjects.accept(1)
    const [, options] = mockFetch.mock.calls[0]
    expect(options.method).toBe('POST')
  })

  it('reject sends POST with reason', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 'rejected' }),
    })

    await adminProjects.reject(1, 'Not good enough')
    const [, options] = mockFetch.mock.calls[0]
    expect(JSON.parse(options.body)).toEqual({ rejection_reason: 'Not good enough' })
  })
})

describe('adminSecurity', () => {
  it('getLoginAttempts builds query string', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ total_attempts: 10 }),
    })

    await adminSecurity.getLoginAttempts({ days: 7 })
    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('days=7')
  })
})
