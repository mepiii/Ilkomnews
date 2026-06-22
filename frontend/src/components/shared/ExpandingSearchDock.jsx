import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

const ExpandingSearchDock = ({ value, onChange, placeholder = 'Search...' }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCollapse = () => {
    setIsExpanded(false)
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
            onClick={() => setIsExpanded(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-card transition-colors hover:bg-theme-secondary"
            aria-label="Open search"
          >
            <Search className="h-4 w-4 text-theme-muted" />
          </motion.button>
        ) : (
          <motion.form
            key="input"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onSubmit={(e) => e.preventDefault()}
            className="relative"
          >
            <div className="relative flex items-center gap-2 overflow-hidden rounded-full border border-theme bg-card/80 backdrop-blur-md">
              <div className="ml-3">
                <Search className="h-4 w-4 text-theme-muted" />
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoFocus
                className="h-10 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-theme-muted text-theme-primary"
              />
              <motion.button
                type="button"
                onClick={handleCollapse}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mr-1.5 flex h-7 w-7 items-center justify-center rounded-full hover:bg-theme-secondary"
              >
                <X className="h-3.5 w-3.5 text-theme-muted" />
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpandingSearchDock
