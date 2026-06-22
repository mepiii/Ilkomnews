/**
 * Badge component for status indicators
 * Variants: success, warning, error, info, neutral
 * Sizes: sm, md, lg
 * Supports icons and dot indicators
 * Uses semantic colors for accessibility
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  dot = false,
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors'

  const variantClasses = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    neutral: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`${dotSizes[size]} rounded-full bg-current opacity-60`}
          aria-hidden="true"
        />
      )}
      {Icon && <Icon size={iconSizes[size]} aria-hidden="true" />}
      {children}
    </span>
  )
}

/**
 * StatusBadge component with predefined status types
 * Maps common status values to appropriate badge variants
 */
export function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    active: { variant: 'success', label: 'Aktif' },
    inactive: { variant: 'neutral', label: 'Tidak Aktif' },
    pending: { variant: 'warning', label: 'Menunggu' },
    approved: { variant: 'success', label: 'Disetujui' },
    rejected: { variant: 'error', label: 'Ditolak' },
    draft: { variant: 'neutral', label: 'Draft' },
    published: { variant: 'success', label: 'Dipublikasi' },
    archived: { variant: 'neutral', label: 'Diarsipkan' },
  }

  const config = statusConfig[status] || { variant: 'neutral', label: status }

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  )
}
