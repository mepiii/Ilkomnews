import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const DEBOUNCE_MS = 500

const ExpandingSearchDock = ({ value, onChange, placeholder = 'Cari...' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  // Local buffer keeps typing responsive while emitting onChange after a 500ms pause
  const [inputValue, setInputValue] = useState(value || '')
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const emitChange = (next) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onChange(next), DEBOUNCE_MS)
  }

  const handleInputChange = (next) => {
    setInputValue(next)
    emitChange(next)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    setInputValue('')
    clearTimeout(timerRef.current)
    onChange('')
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="icon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700/30 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
            aria-label="Buka pencarian"
          >
            <Search className="h-4 w-4 text-[var(--accent)]" />
          </motion.button>
        ) : (
          <motion.form
            key="input"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onSubmit={(e) => e.preventDefault()}
            className="relative"
          >
            <div className="relative flex items-center gap-2 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700/30 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-sm">
              <div className="ml-3.5">
                <Search className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder}
                autoFocus
                className="h-10 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-neutral-400 dark:placeholder-neutral-500 text-neutral-900 dark:text-white"
              />
              <motion.button
                type="button"
                onClick={handleCollapse}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="mr-1.5 flex h-7 w-7 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpandingSearchDock
