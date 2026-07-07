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
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md text-sm font-medium text-neutral-900 dark:text-white hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800/50 hover:shadow-md transition-all duration-300 shadow-sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {Icon && (
          <motion.div
            animate={{ scale: isOpen ? 1.1 : 1 }}
            transition={springTransition}
          >
            <Icon size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
          </motion.div>
        )}
        <span className="truncate max-w-[120px] font-medium">{value}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={springTransition}
        >
          <ChevronDown size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={springTransition}
            className="absolute left-0 top-full mt-2 z-[60] min-w-[220px] rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden p-1.5"
            role="listbox"
          >
            <div className="max-h-[300px] overflow-y-auto py-1 space-y-1">
              {options.map((option, index) => {
                const isSelected = value === option
                return (
                  <motion.button
                    key={option}
                    onClick={() => { onChange(option); setIsOpen(false) }}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, ...springTransition }}
                    whileHover={{ scale: 1.03, x: 6 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 text-sm rounded-xl text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-900/20 font-semibold text-purple-700 dark:text-purple-300 shadow-sm'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-purple-50/70 dark:hover:bg-purple-900/20'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isSelected ? 1 : 0.5,
                        opacity: isSelected ? 1 : 0
                      }}
                      transition={springTransition}
                      className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm"
                    >
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </motion.div>
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
