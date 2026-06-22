import { motion } from 'framer-motion'

/**
 * Card component with multiple variants
 * Variants: flat, elevated, interactive, glass
 * Supports header, body, and footer sections
 * Uses CSS variables for theming
 */
export default function Card({
  children,
  variant = 'flat',
  className = '',
  header,
  footer,
  hoverable = false,
  onClick,
  ...props
}) {
  const baseClasses = 'rounded-lg transition-all duration-200'

  const variantClasses = {
    flat: 'bg-[var(--bg-secondary)] border border-[var(--border-color)]',
    elevated: 'bg-[var(--bg-primary)] shadow-lg border border-[var(--border-color)]',
    interactive: 'bg-[var(--bg-secondary)] border border-[var(--border-color)] cursor-pointer hover:shadow-md hover:border-[var(--accent)]/30',
    glass: 'glass-card',
  }

  const hoverClasses = hoverable && !onClick ? 'hover:shadow-md hover:-translate-y-0.5' : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''

  const CardWrapper = onClick ? motion.div : 'div'
  const motionProps = onClick
    ? {
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.99 },
        onClick,
      }
    : {}

  return (
    <CardWrapper
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickableClasses} ${className}`}
      {...motionProps}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          {header}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
          {footer}
        </div>
      )}
    </CardWrapper>
  )
}

/**
 * CardHeader component for consistent card headers
 */
export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  )
}

/**
 * CardBody component for card content
 */
export function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

/**
 * CardFooter component for card footer actions
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {children}
    </div>
  )
}
