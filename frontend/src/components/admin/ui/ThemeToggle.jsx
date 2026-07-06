import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

/**
 * ThemeToggle — admin variant.
 * Toggles the `dark` class on <html> via ThemeContext and persists to
 * localStorage. The icon reflects the current resolved theme.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-primary)]"
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}
