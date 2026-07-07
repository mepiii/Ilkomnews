import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

const AnimatedFilterDropdown = ({ options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Spring physics for bouncy feel
  const springTransition = { type: 'spring', stiffness: 300, damping: 15 }

  return (
    <div className="relative" ref={ref}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md text-sm font-medium text-theme-primary hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-300 shadow-sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {Icon && (
          <motion.div
            animate={{ scale: isOpen ? 1.1 : 1 }}
            transition={springTransition}
          >
            <Icon size={15} className="text-[var(--accent)] shrink-0" />
          </motion.div>
        )}
        <span className="truncate max-w-[120px] font-medium">{value}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={springTransition}
        >
          <ChevronDown size={15} className="text-[var(--accent)] shrink-0" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={springTransition}
            className="absolute left-0 top-full mt-2 z-[60] min-w-[220px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden p-1.5"
            role="listbox"
          >
            <div className="max-h-[300px] overflow-y-auto py-1 space-y-0.5">
              {options.map((option, index) => {
                const isSelected = value === option
                return (
                  <motion.button
                    key={option}
                    onClick={() => { onChange(option); setIsOpen(false) }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, ...springTransition }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-[var(--accent)]/10 font-semibold text-[var(--accent)]'
                        : 'text-theme-primary hover:bg-[var(--accent)]/5'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--accent)]'
                        : 'border-[var(--border-color)]'
                    }`}>
                      {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="font-medium">{option}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AnimatedFilterDropdown
