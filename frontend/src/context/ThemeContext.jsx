/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const THEME_STORAGE_KEY = 'ilkom-theme'

/**
 * ThemeProvider
 *
 * Applies the theme by toggling the `dark` class directly on the
 * <html> element (document.documentElement) and persists the choice in
 * localStorage under `ilkom-theme`.
 *
 * The initial paint is handled by the inline FOUC-prevention script in
 * index.html so there is no flash on load; this context keeps React state in
 * sync with the DOM thereafter.
 */
const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

function readInitialTheme() {
  if (typeof document !== 'undefined') {
    // Trust whatever the inline FOUC script already applied — single source of truth.
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }
  return 'light'
}

function applyThemeToDom(nextTheme) {
  const root = document.documentElement
  if (nextTheme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  } catch {
    /* localStorage may be unavailable (private mode) — ignore */
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    applyThemeToDom(theme)
  }, [theme])

  // Keep in sync if the user changes theme in another tab/window.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTheme(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
