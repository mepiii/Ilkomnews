/* global global */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock global fetch before importing the module
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock import.meta.env
vi.stubEnv('VITE_USE_REAL_API', '')
vi.stubEnv('DEV', true)

const { newsService, careersService, viewTracker, api } = await import('./api.js')

const mockNews = [
  { id: 1, title: 'AI News', summary: 'About AI', category: 'tech', date: '2026-01-01', image: '/img.jpg' },
  { id: 2, title: 'Web News', summary: 'About Web', category: 'tech', date: '2026-01-02', image: '/img2.jpg' },
]

const mockCareers = [
  { id: 1, company: 'TechCorp', title: 'Dev', location: 'Remote' },
]

function mockJsonResponse(data, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    json: () => Promise.resolve(data),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockFetch.mockImplementation(() => mockJsonResponse([]))
})

describe('newsService', () => {
  it('getAll returns news list', async () => {
    mockFetch.mockImplementationOnce(() => mockJsonResponse(mockNews))
    const result = await newsService.getAll()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0]).toHaveProperty('title')
  })

  it('getLatest limits results', async () => {
    mockFetch.mockImplementationOnce(() => mockJsonResponse(mockNews.slice(0, 2)))
    const result = await newsService.getLatest(2)
    expect(result.length).toBeLessThanOrEqual(2)
  })

  it('getById returns a single item', async () => {
    mockFetch.mockImplementationOnce(() => mockJsonResponse(mockNews[0]))
    const result = await newsService.getById(1)
    expect(result).toBeTruthy()
    expect(result.id).toBe(1)
  })

  it('getById throws on missing id', async () => {
    mockFetch.mockImplementationOnce(() => mockJsonResponse({ message: 'Not found' }, 404))
    await expect(newsService.getById(9999)).rejects.toThrow()
  })

  it('search filters by query', async () => {
    mockFetch.mockImplementationOnce(() => mockJsonResponse([mockNews[0]]))
    const result = await newsService.search('AI')
    expect(result.length).toBeGreaterThan(0)
  })

  it('getCategories returns unique categories', async () => {
    mockFetch.mockImplementationOnce(() => mockJsonResponse(['tech', 'lifestyle']))
    const result = await newsService.getCategories()
    expect(Array.isArray(result)).toBe(true)
    expect(new Set(result).size).toBe(result.length)
  })
})

describe('careersService', () => {
  it('getAll returns careers list', async () => {
    mockFetch.mockImplementationOnce(() => mockJsonResponse(mockCareers))
    const result = await careersService.getAll()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('company')
  })

  it('apply returns success', async () => {
    mockFetch.mockImplementationOnce(() => mockJsonResponse({ success: true }))
    const result = await careersService.apply(1, { name: 'Test' })
    expect(result.success).toBe(true)
  })
})

describe('api aggregate', () => {
  it('exports all service namespaces', () => {
    expect(api).toHaveProperty('news')
    expect(api).toHaveProperty('careers')
    expect(api).toHaveProperty('projects')
  })
})

describe('viewTracker', () => {
  it('increment falls back to client-side count on failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    const result = await viewTracker.increment('news', 1, 10)
    expect(result).toBe(11)
  })

  it('get falls back to baseViews on failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    const result = await viewTracker.get('news', 1, 10)
    expect(result).toBe(10)
  })
})
