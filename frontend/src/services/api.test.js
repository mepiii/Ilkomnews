/* global global */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock global fetch before importing the module
const mockFetch = vi.fn()
global.fetch = mockFetch

// These flags are ignored by the real implementation, but kept for parity with
// the sibling test files. They must not break anything.
vi.stubEnv('VITE_USE_REAL_API', '')
vi.stubEnv('DEV', true)
// Align the API base to the documented `/api` default so fetch is called with
// the relative path the assertions below expect (real .env overrides to the
// absolute backend URL; tests exercise the default contract).
vi.stubEnv('VITE_API_URL', '/api')

const { newsService, articlesService, careersService, projectsService, viewTracker, api, fetchAPI } = await import('./api.js')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('newsService', () => {
  it('getAll returns the normalized data array from a paginated response', async () => {
    const data = [{ id: 1, title: 'News One' }, { id: 2, title: 'News Two' }]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data }),
    })

    const result = await newsService.getAll()
    expect(result).toEqual(data)
    expect(mockFetch).toHaveBeenCalledWith('/api/news', expect.any(Object))
  })

  it('getById returns the raw object from the fetched json', async () => {
    const item = { id: 1, title: 'News One' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(item),
    })

    const result = await newsService.getById(1)
    expect(result).toEqual(item)
    expect(mockFetch).toHaveBeenCalledWith('/api/news/1', expect.any(Object))
  })

  it('getLatest builds a URL containing limit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: [] }),
    })

    await newsService.getLatest(2)
    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('limit=2')
  })

  it('search builds a URL containing the query', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })

    await newsService.search('AI')
    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('q=AI')
  })

  it('getCategories returns whatever the mocked json returns', async () => {
    const categories = ['Engineering', 'Design', 'Company']
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(categories),
    })

    const result = await newsService.getCategories()
    expect(Array.isArray(result)).toBe(true)
    expect(result).toEqual(categories)
    expect(mockFetch).toHaveBeenCalledWith('/api/news/categories', expect.any(Object))
  })
})

describe('careersService', () => {
  it('getAll returns the mocked array', async () => {
    const careers = [{ id: 1, company: 'Acme' }]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(careers),
    })

    const result = await careersService.getAll()
    expect(result).toEqual(careers)
  })

  it('apply sends a POST with a JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1, success: true }),
    })

    await careersService.apply(1, { name: 'X' })
    const [, options] = mockFetch.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ name: 'X' })
    expect(mockFetch).toHaveBeenCalledWith('/api/careers/1/apply', expect.any(Object))
  })
})

describe('articlesService', () => {
  it('getAll returns the mocked json', async () => {
    const articles = [{ id: 1, readTime: 5 }]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(articles),
    })

    const result = await articlesService.getAll()
    expect(result).toEqual(articles)
  })

  it('getById returns the mocked json', async () => {
    const article = { id: 1, title: 'Article One' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(article),
    })

    const result = await articlesService.getById(1)
    expect(result).toEqual(article)
    expect(mockFetch).toHaveBeenCalledWith('/api/articles/1', expect.any(Object))
  })
})

describe('projectsService', () => {
  it('getCategories resolves to the static list without fetching', async () => {
    const result = await projectsService.getCategories()
    expect(result).toEqual(['web', 'mobile', 'uiux', 'game', 'ai'])
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

describe('api aggregate', () => {
  it('exports all service namespaces', () => {
    expect(api).toHaveProperty('news')
    expect(api).toHaveProperty('articles')
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

describe('fetchAPI', () => {
  it('throws on a non-ok response with the server message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Server exploded' }),
    })

    await expect(fetchAPI('/news')).rejects.toThrow('Server exploded')
  })
})
