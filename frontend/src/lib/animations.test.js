import { describe, it, expect } from 'vitest'
import { container, itemVariant } from './animations'

describe('container animation variant', () => {
  it('has hidden and show properties', () => {
    expect(container).toHaveProperty('hidden')
    expect(container).toHaveProperty('show')
  })

  it('hidden is empty object (Framer Motion initial state)', () => {
    expect(container.hidden).toEqual({})
  })

  it('show has staggerChildren transition', () => {
    expect(container.show).toHaveProperty('transition')
    expect(container.show.transition).toHaveProperty('staggerChildren')
    expect(typeof container.show.transition.staggerChildren).toBe('number')
    expect(container.show.transition.staggerChildren).toBeGreaterThan(0)
  })

  it('staggerChildren value is reasonable (between 0.01 and 1)', () => {
    expect(container.show.transition.staggerChildren).toBeGreaterThanOrEqual(0.01)
    expect(container.show.transition.staggerChildren).toBeLessThanOrEqual(1)
  })
})

describe('itemVariant animation variant', () => {
  it('has hidden and show properties', () => {
    expect(itemVariant).toHaveProperty('hidden')
    expect(itemVariant).toHaveProperty('show')
  })

  it('hidden starts at opacity 0 and y 20', () => {
    expect(itemVariant.hidden).toEqual({ opacity: 0, y: 20 })
  })

  it('show animates to opacity 1 and y 0', () => {
    expect(itemVariant.show).toHaveProperty('opacity', 1)
    expect(itemVariant.show).toHaveProperty('y', 0)
  })

  it('show has transition with duration and ease', () => {
    expect(itemVariant.show).toHaveProperty('transition')
    expect(itemVariant.show.transition).toHaveProperty('duration', 0.5)
    expect(itemVariant.show.transition).toHaveProperty('ease')
    expect(Array.isArray(itemVariant.show.transition.ease)).toBe(true)
    expect(itemVariant.show.transition.ease).toHaveLength(4)
  })

  it('ease is a valid cubic bezier (4 values between 0 and 1)', () => {
    itemVariant.show.transition.ease.forEach((val) => {
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThanOrEqual(1)
    })
  })
})

describe('animation variants compatibility', () => {
  it('container and itemVariant work together for staggered grids', () => {
    // Verify the pattern: container triggers stagger, itemVariant is applied per child
    expect(container.show.transition.staggerChildren).toBeGreaterThan(0)
    expect(itemVariant.hidden.opacity).toBe(0)
    expect(itemVariant.show.opacity).toBe(1)
  })

  it('variants can be spread into framer-motion props', () => {
    // Both should be plain objects (not functions or class instances)
    expect(typeof container).toBe('object')
    expect(typeof itemVariant).toBe('object')
    expect(container.constructor).toBe(Object)
    expect(itemVariant.constructor).toBe(Object)
  })
})
