import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const StatItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-theme-primary">{value}</span>
    <span className="text-xs text-theme-muted">{label}</span>
  </div>
)

const TrailCard = React.forwardRef(({
  className,
  imageUrl,
  title,
  subtitle,
  badge,
  badgeIcon: BadgeIcon,
  description,
  stats = [],
  actionLabel,
  actionIcon: ActionIcon,
  onActionClick,
  footerContent,
  children,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg',
        className
      )}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Top section with background image */}
      {imageUrl && (
        <div className="relative h-52 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-4">
            <div className="text-white">
              <h3 className="text-xl font-bold">{title}</h3>
              {subtitle && <p className="text-sm text-white/90">{subtitle}</p>}
            </div>
            {actionLabel && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                whileHover={{ opacity: 1, x: 0 }}
                animate={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onClick={onActionClick}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors cursor-pointer"
              >
                {actionLabel}
                {ActionIcon && <ActionIcon className="ml-1 h-4 w-4" />}
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Bottom section with details */}
      <div className="p-5">
        {(badge || description) && (
          <div className="flex items-center justify-between mb-3">
            <div>
              {badge && (
                <p className="font-bold text-theme-primary">{badge}</p>
              )}
              {description && (
                <p className="text-xs text-theme-muted">{description}</p>
              )}
            </div>
          </div>
        )}

        {stats.length > 0 && (
          <>
            <div className="my-3 h-px w-full bg-border" />
            <div className="flex justify-between">
              {stats.map((stat, i) => (
                <StatItem key={i} label={stat.label} value={stat.value} />
              ))}
            </div>
          </>
        )}

        {footerContent && (
          <>
            {stats.length === 0 && <div className="my-3 h-px w-full bg-border" />}
            {footerContent}
          </>
        )}

        {children}
      </div>
    </motion.div>
  )
})

TrailCard.displayName = 'TrailCard'

export { TrailCard }
