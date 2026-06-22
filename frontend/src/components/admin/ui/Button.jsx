import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/**
 * Button component with multiple variants
 * Variants: primary, secondary, danger, ghost
 * Supports loading state and disabled state
 * Fully accessible with ARIA attributes
 * Uses CSS variables for theming
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/80 border border-[var(--border-color)]',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
    ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      )}
      {children}
    </motion.button>
  )
}
