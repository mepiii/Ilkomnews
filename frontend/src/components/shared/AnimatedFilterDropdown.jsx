import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {Icon && <Icon size={14} className="text-neutral-400 dark:text-neutral-500 shrink-0" />}
        <span className="truncate max-w-[120px]">{value}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-neutral-400 dark:text-neutral-500 shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute left-0 top-full mt-2 z-[60] min-w-[180px] rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden p-1"
            role="listbox"
          >
            <div className="max-h-[240px] overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => { onChange(option); setIsOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                    value === option
                      ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-black dark:text-white'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  role="option"
                  aria-selected={value === option}
                >
                  {value === option && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white shrink-0" />
                  )}
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AnimatedFilterDropdown
