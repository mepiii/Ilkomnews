import { useState, useEffect } from 'react'

/**
 * Returns true when the document has the 'dark' class on <html>.
 * Single MutationObserver shared via module scope — no per-component overhead.
 */
let cached = false
let listeners = new Set()

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

if (typeof document !== 'undefined') {
  const check = () => {
    const next = document.documentElement.classList.contains('dark')
    if (next !== cached) {
      cached = next
      listeners.forEach((cb) => cb())
    }
  }
  new MutationObserver(check).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  cached = document.documentElement.classList.contains('dark')
}

export function useThemeMode() {
  const [isDark, setIsDark] = useState(cached)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    check()
    return subscribe(check)
  }, [])

  return isDark
}
