import React from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const FlowButton = React.memo(function FlowButton({ text = 'Learn More', onClick, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`group relative flex items-center gap-1 overflow-hidden rounded-full border-[1.5px] border-[var(--accent)]/40 bg-[var(--accent)]/20 text-[var(--accent)] dark:text-white px-8 py-3 text-sm font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]/60 ${className}`}
    >
      <span className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
        <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(122,71,166,0.6)_10%,transparent_20%,rgba(122,71,166,0.6)_30%,transparent_40%)] animate-[spin_2.5s_linear_infinite]" />
        <span className="absolute inset-[2px] rounded-full bg-[rgb(48,11,85)]" />
      </span>
      <ArrowRight className="absolute w-4 h-4 left-[-25%] fill-none z-[10] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" style={{ stroke: 'currentColor' }} />
      <span className="relative z-[10] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">{text}</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] z-[1]" style={{ background: 'var(--accent)' }} />
      <ArrowRight className="absolute w-4 h-4 right-4 fill-none z-[10] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" style={{ stroke: 'currentColor' }} />
    </motion.button>
  )
})
export { FlowButton }
