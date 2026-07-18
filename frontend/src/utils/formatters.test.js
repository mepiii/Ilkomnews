import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatReadTime,
  generateSlug,
  getIdFromSlug,
  getTitleFromSlug,
  hasIdInSlug,
  isNumericId,
  formatDateTime,
} from './formatters'

describe('formatDate', () => {
  it('returns dash for null/undefined', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate('')).toBe('-')
  })

  it('returns dash for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('-')
  })

  it('formats valid date string to Indonesian locale', () => {
    const result = formatDate('2025-03-15')
    expect(result).toContain('2025')
    expect(result).toContain('15')
    expect(result).not.toBe('-')
  })

  it('formats Date object', () => {
    const result = formatDate(new Date('2025-06-01'))
    expect(result).toContain('2025')
  })
})

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns dash for null/undefined', () => {
    expect(formatRelativeTime(null)).toBe('-')
    expect(formatRelativeTime(undefined)).toBe('-')
  })

  it('returns "Baru saja" for very recent times', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-05T12:00:00'))
    expect(formatRelativeTime('2025-07-05T11:59:30')).toBe('30 detik yang lalu')
  })

  it('returns minutes for recent times', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-05T12:00:00'))
    expect(formatRelativeTime('2025-07-05T11:55:00')).toBe('5 menit yang lalu')
  })

  it('returns hours', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-05T12:00:00'))
    expect(formatRelativeTime('2025-07-05T09:00:00')).toBe('3 jam yang lalu')
  })

  it('returns days', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-05T12:00:00'))
    expect(formatRelativeTime('2025-07-03T12:00:00')).toBe('2 hari yang lalu')
  })

  it('returns weeks', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-05T12:00:00'))
    expect(formatRelativeTime('2025-06-21T12:00:00')).toBe('2 minggu yang lalu')
  })

  it('returns months', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-05T12:00:00'))
    expect(formatRelativeTime('2025-05-05T12:00:00')).toBe('2 bulan yang lalu')
  })

  it('returns years', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-05T12:00:00'))
    expect(formatRelativeTime('2023-07-05T12:00:00')).toBe('2 tahun yang lalu')
  })
})

describe('formatNumber', () => {
  it('returns 0 for null/undefined', () => {
    expect(formatNumber(null)).toBe('0')
    expect(formatNumber(undefined)).toBe('0')
  })

  it('formats small numbers without separators', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(1)).toBe('1')
    expect(formatNumber(999)).toBe('999')
  })

  it('formats large numbers with dot separators', () => {
    expect(formatNumber(1000)).toBe('1.000')
    expect(formatNumber(1000000)).toBe('1.000.000')
    expect(formatNumber(1234567890)).toBe('1.234.567.890')
  })
})

describe('formatReadTime', () => {
  it('returns default for null/undefined/empty', () => {
    expect(formatReadTime(null)).toBe('1 menit baca')
    expect(formatReadTime(undefined)).toBe('1 menit baca')
    expect(formatReadTime('')).toBe('1 menit baca')
  })

  it('calculates read time based on word count', () => {
    const shortText = 'word '.repeat(100)
    expect(formatReadTime(shortText)).toBe('1 menit baca')

    const mediumText = 'word '.repeat(400)
    expect(formatReadTime(mediumText)).toBe('2 menit baca')

    const longText = 'word '.repeat(1000)
    expect(formatReadTime(longText)).toBe('5 menit baca')
  })
})

describe('generateSlug', () => {
  it('returns empty string for null/undefined', () => {
    expect(generateSlug(null)).toBe('')
    expect(generateSlug(undefined)).toBe('')
    expect(generateSlug('')).toBe('')
  })

  it('lowercases and hyphenates', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(generateSlug('Hello! @World#')).toBe('hello-world')
  })

  it('collapses multiple hyphens', () => {
    expect(generateSlug('a   b')).toBe('a-b')
  })

  it('trims leading/trailing hyphens', () => {
    expect(generateSlug(' Hello ')).toBe('hello')
  })
})

describe('getIdFromSlug', () => {
  it('returns null for null/undefined', () => {
    expect(getIdFromSlug(null)).toBeNull()
    expect(getIdFromSlug(undefined)).toBeNull()
    expect(getIdFromSlug('')).toBeNull()
  })

  it('extracts numeric ID from end of slug', () => {
    expect(getIdFromSlug('hello-world-42')).toBe(42)
  })

  it('returns null if no numeric ID', () => {
    expect(getIdFromSlug('hello-world')).toBeNull()
  })

  it('returns null for IDs > 999', () => {
    expect(getIdFromSlug('hello-world-1000')).toBeNull()
  })

  it('returns null for ID 0', () => {
    expect(getIdFromSlug('hello-world-0')).toBeNull()
  })

  it('accepts IDs 1-999', () => {
    expect(getIdFromSlug('post-1')).toBe(1)
    expect(getIdFromSlug('post-999')).toBe(999)
  })
})

describe('getTitleFromSlug', () => {
  it('returns empty for null/undefined', () => {
    expect(getTitleFromSlug(null)).toBe('')
    expect(getTitleFromSlug(undefined)).toBe('')
  })

  it('replaces hyphens with spaces', () => {
    expect(getTitleFromSlug('hello-world')).toBe('hello world')
  })
})

describe('hasIdInSlug', () => {
  it('returns false for null/undefined', () => {
    expect(hasIdInSlug(null)).toBe(false)
    expect(hasIdInSlug(undefined)).toBe(false)
    expect(hasIdInSlug('')).toBe(false)
  })

  it('returns true when slug ends with valid ID', () => {
    expect(hasIdInSlug('hello-42')).toBe(true)
    expect(hasIdInSlug('hello-1')).toBe(true)
    expect(hasIdInSlug('hello-999')).toBe(true)
  })

  it('returns false when slug has no numeric ID', () => {
    expect(hasIdInSlug('hello-world')).toBe(false)
  })

  it('returns false for IDs > 999 (years)', () => {
    expect(hasIdInSlug('post-2025')).toBe(false)
  })
})

describe('isNumericId', () => {
  it('returns true for numeric strings', () => {
    expect(isNumericId('1')).toBe(true)
    expect(isNumericId('42')).toBe(true)
    expect(isNumericId('999')).toBe(true)
  })

  it('returns false for non-numeric strings', () => {
    expect(isNumericId('abc')).toBe(false)
    expect(isNumericId('1a')).toBe(false)
    expect(isNumericId('hello')).toBe(false)
    expect(isNumericId('')).toBe(false)
  })
})

describe('formatDateTime', () => {
  it('returns dash for null/undefined', () => {
    expect(formatDateTime(null)).toBe('-')
    expect(formatDateTime(undefined)).toBe('-')
    expect(formatDateTime('')).toBe('-')
  })

  it('returns dash for invalid date', () => {
    expect(formatDateTime('not-a-date')).toBe('-')
  })

  it('formats valid date with time', () => {
    const result = formatDateTime('2025-03-15T14:30:00')
    expect(result).toContain('2025')
    expect(result).toContain('15')
    expect(result).not.toBe('-')
  })

  it('formats Date object', () => {
    const result = formatDateTime(new Date('2025-06-01T10:00:00'))
    expect(result).toContain('2025')
  })
})
