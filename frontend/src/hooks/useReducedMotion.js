import { useState, useEffect } from 'react'

/**
 * Hook to detect user's prefers-reduced-motion setting
 * Respects user's OS-level accessibility preference
 * @returns {boolean} True if user prefers reduced motion
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event) => setPrefersReducedMotion(event.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook for optimized scroll handling with throttling
 * @param {Function} callback - Scroll event handler
 * @param {number} delay - Throttle delay in ms
 */
export function useThrottledScroll(callback, delay = 100) {
  useEffect(() => {
    let lastTime = 0
    const handler = (event) => {
      const now = Date.now()
      if (now - lastTime >= delay) {
        lastTime = now
        callback(event)
      }
    }

    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [callback, delay])
}

/**
 * Hook for lazy loading images with IntersectionObserver
 * @param {string} src - Image source URL
 * @returns {string|null} Image source or null if not loaded
 */
export function useLazyImage(src) {
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
    img.onerror = () => {
      setImageSrc(null)
      setIsLoaded(false)
    }
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { imageSrc, isLoaded }
}
