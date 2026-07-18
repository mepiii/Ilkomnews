import { LazyMotion, domAnimation, m } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { ctaPress, gridItem } from './motionPresets'

export const SkeletonGrid = ({ count = 4 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <m.div key={i} variants={gridItem} style={{ willChange: 'transform, opacity' }}>
        <div className="h-64 rounded-xl bg-theme-secondary animate-pulse" />
      </m.div>
    ))}
  </>
)

export const InlineErrorState = ({ message, onRetry }) => (
  <LazyMotion features={domAnimation}>
    <div className="col-span-full text-center py-16 space-y-4">
      <p className="text-theme-muted text-sm">{message}</p>
      <m.button
        onClick={onRetry}
        whileHover={ctaPress.whileHover}
        whileTap={ctaPress.whileTap}
        transition={ctaPress.transition}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-semibold"
        style={{ willChange: 'transform' }}
      >
        <RefreshCw size={14} /> Muat ulang
      </m.button>
    </div>
  </LazyMotion>
)

export const InlineEmptyState = ({ message }) => (
  <div className="col-span-full text-center py-10">
    <p className="text-theme-muted text-sm">{message}</p>
  </div>
)
