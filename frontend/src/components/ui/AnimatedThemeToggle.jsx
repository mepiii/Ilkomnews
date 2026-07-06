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
      className="relative p-2 rounded-full transition-colors bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-black dark:text-white"
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
