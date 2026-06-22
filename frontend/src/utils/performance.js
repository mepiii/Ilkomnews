// Performance utilities for the ILKOM website

/**
 * Debounce function - delays execution until after wait period
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(fn, wait = 300) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), wait)
  }
}

/**
 * Throttle function - limits execution to once per wait period
 * @param {Function} fn - Function to throttle
 * @param {number} wait - Milliseconds between executions
 * @returns {Function} Throttled function
 */
export function throttle(fn, wait = 100) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * Intersection Observer hook for lazy loading
 * @param {Function} callback - Called when element enters viewport
 * @param {Object} options - Observer options
 * @returns {Function} Ref callback
 */
export function createIntersectionObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return (element) => {
    if (!element) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, defaultOptions)

    observer.observe(element)

    return () => observer.disconnect()
  }
}

/**
 * Prefetch route on hover for faster navigation
 * @param {string} path - Route path to prefetch
 */
export function prefetchRoute(path) {
  // Only prefetch if the user hasn't loaded the page yet
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = path
  document.head.appendChild(link)
}

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element to check
 * @returns {boolean} True if in viewport
 */
export function isInViewport(element) {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Request animation frame with fallback
 * @param {Function} callback - Animation frame callback
 * @returns {number} Animation frame ID
 */
export function raf(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame
    ? window.requestAnimationFrame(callback)
    : setTimeout(callback, 16)
}

/**
 * Cancel animation frame with fallback
 * @param {number} id - Animation frame ID
 */
export function caf(id) {
  if (window.cancelAnimationFrame || window.webkitCancelAnimationFrame) {
    window.cancelAnimationFrame(id)
  } else {
    clearTimeout(id)
  }
}
