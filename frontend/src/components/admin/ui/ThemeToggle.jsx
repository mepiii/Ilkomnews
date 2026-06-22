import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      aria-label={isDark ? 'Ubah ke mode terang' : 'Ubah ke mode gelap'}
      title={isDark ? 'Ubah ke mode terang' : 'Ubah ke mode gelap'}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
            rotate: isDark ? -180 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun size={20} className="text-[var(--text-primary)]" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 0 : 180,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon size={20} className="text-[var(--text-primary)]" />
        </motion.div>
      </div>
    </button>
  )
}
