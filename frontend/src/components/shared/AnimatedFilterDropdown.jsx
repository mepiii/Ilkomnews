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
          <Icon size={15} className="text-[var(--accent)] shrink-0" />
        )}
        <span className="truncate max-w-[120px] font-medium">{value}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={15} className="text-[var(--accent)] shrink-0" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute left-0 top-full mt-2 z-[60] min-w-[220px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden p-1.5 origin-top"
            role="listbox"
          >
            <div className="max-h-[300px] overflow-y-auto py-1 space-y-0.5">
              {options.map((option) => {
                const isSelected = value === option
                return (
                  <button
                    key={option}
                    onClick={() => { onChange(option); setIsOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl text-left transition-colors duration-100 ${
                      isSelected
                        ? 'bg-[var(--accent)]/10 font-semibold text-[var(--accent)]'
                        : 'text-theme-primary hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]'
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
                  </button>
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
