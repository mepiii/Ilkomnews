import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/**
 * AnimatedThemeToggle — public/navbar variant.
 * Toggles the `dark` class on <html> via ThemeContext and persists to
 * localStorage. Smooth icon swap with a subtle rotation on toggle.
 */
export function AnimatedThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative p-2 rounded-full transition-colors theme-toggle bg-black/[0.04] hover:bg-black/[0.08] text-black dark:bg-white/[0.1] dark:hover:bg-white/[0.18] dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
    >
      <span className="block transition-transform duration-500 ease-in-out">
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </span>
    </button>
  )
}

export default AnimatedThemeToggle
