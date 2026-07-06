/* global global */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock global fetch before importing the module
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock import.meta.env
vi.stubEnv('VITE_USE_REAL_API', '')
vi.stubEnv('DEV', true)

const { newsService, articlesService, eventsService, careersService, viewTracker, api } = await import('./api.js')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('newsService', () => {
  it('getAll returns mock data in dev mode', async () => {
    const result = await newsService.getAll()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('title')
    expect(result[0]).toHaveProperty('id')
  })

  it('getLatest limits results', async () => {
    const result = await newsService.getLatest(2)
    expect(result.length).toBeLessThanOrEqual(2)
  })

  it('getById returns a single item', async () => {
    const result = await newsService.getById(1)
    expect(result).toBeTruthy()
    expect(result.id).toBe(1)
  })

  it('getById returns null for missing id', async () => {
    const result = await newsService.getById(9999)
    expect(result).toBeNull()
  })

  it('search filters by query', async () => {
    const result = await newsService.search('AI')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(item =>
      item.title.toLowerCase().includes('ai') ||
      item.summary.toLowerCase().includes('ai')
    )).toBe(true)
  })

  it('getCategories returns unique categories', async () => {
    const result = await newsService.getCategories()
    expect(Array.isArray(result)).toBe(true)
    expect(new Set(result).size).toBe(result.length)
  })
})

describe('eventsService', () => {
  it('getAll returns mock events', async () => {
    const result = await eventsService.getAll()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('title')
  })

  it('getById returns a single event', async () => {
    const result = await eventsService.getById(1)
    expect(result).toBeTruthy()
    expect(result.id).toBe(1)
  })

  it('register returns success', async () => {
    const result = await eventsService.register(1, { name: 'Test User' })
    expect(result.success).toBe(true)
    expect(result).toHaveProperty('registrationId')
  })

  it('getCategories returns categories', async () => {
    const result = await eventsService.getCategories()
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('careersService', () => {
  it('getAll returns mock careers', async () => {
    const result = await careersService.getAll()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('company')
  })

  it('apply returns success', async () => {
    const result = await careersService.apply(1, { name: 'Test' })
    expect(result.success).toBe(true)
  })
})

describe('articlesService', () => {
  it('getAll returns mock articles', async () => {
    const result = await articlesService.getAll()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('readTime')
  })

  it('getById returns article', async () => {
    const result = await articlesService.getById(1)
    expect(result).toBeTruthy()
  })
})

describe('api aggregate', () => {
  it('exports all service namespaces', () => {
    expect(api).toHaveProperty('news')
    expect(api).toHaveProperty('articles')
    expect(api).toHaveProperty('events')
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
