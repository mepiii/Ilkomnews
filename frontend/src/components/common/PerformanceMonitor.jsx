import { useEffect } from 'react'

/**
 * Performance monitoring component
 * Tracks Core Web Vitals and logs them to console in development
 * @returns {null} This component doesn't render anything
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (!('PerformanceObserver' in window)) return

    const observers = []

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log(`[Performance] LCP: ${lastEntry.startTime}ms`)
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      observers.push(lcpObserver)
    } catch { /* observer type not supported */ }

    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`[Performance] FID: ${entry.processingStart - entry.startTime}ms`)
        })
      })
      fidObserver.observe({ type: 'first-input', buffered: true })
      observers.push(fidObserver)
    } catch { /* observer type not supported */ }

    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            console.log(`[Performance] CLS: ${clsValue}`)
          }
        })
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      observers.push(clsObserver)
    } catch { /* observer type not supported */ }

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return null
}

export default PerformanceMonitor
