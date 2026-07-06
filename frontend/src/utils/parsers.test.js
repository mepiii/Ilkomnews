import { describe, it, expect } from 'vitest'
import { parseTags } from './parsers'

describe('parseTags', () => {
  it('returns empty array for null/undefined', () => {
    expect(parseTags(null)).toEqual([])
    expect(parseTags(undefined)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(parseTags('')).toEqual([])
  })

  it('handles array of strings', () => {
    expect(parseTags(['React', 'Node.js'])).toEqual(['React', 'Node.js'])
  })

  it('trims whitespace from array items', () => {
    expect(parseTags(['  React  ', ' Node.js '])).toEqual(['React', 'Node.js'])
  })

  it('filters empty strings from array', () => {
    expect(parseTags(['React', '', 'Node.js'])).toEqual(['React', 'Node.js'])
  })

  it('parses JSON string array', () => {
    expect(parseTags('["React","Node.js"]')).toEqual(['React', 'Node.js'])
  })

  it('parses JSON with whitespace', () => {
    expect(parseTags('["  React  ", " Node.js "]')).toEqual(['React', 'Node.js'])
  })

  it('parses comma-separated string', () => {
    expect(parseTags('React, Node.js')).toEqual(['React', 'Node.js'])
  })

  it('parses comma-separated with multiple spaces', () => {
    expect(parseTags('React,   Node.js,  Express')).toEqual(['React', 'Node.js', 'Express'])
  })

  it('filters empty entries from comma-separated', () => {
    expect(parseTags('React,, Node.js,')).toEqual(['React', 'Node.js'])
  })

  it('handles single tag string (no comma)', () => {
    expect(parseTags('React')).toEqual(['React'])
  })

  it('handles non-array JSON gracefully', () => {
    // Not valid JSON array — falls through to comma split
    expect(parseTags('{"key":"value"}')).toEqual(['{"key":"value"}'])
  })

  it('converts non-string array items to strings', () => {
    expect(parseTags([1, 2, 3])).toEqual(['1', '2', '3'])
  })

  it('filters empty string items from numeric array', () => {
    expect(parseTags([0, '', false])).toEqual(['0', 'false'])
  })
})
