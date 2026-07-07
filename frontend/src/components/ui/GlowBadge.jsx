import { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

/**
 * GlowBadge - Badge with mouse-following radial gradient glow
 * Creates a subtle moving glow effect that follows the cursor
 * Uses CSS custom properties for the glow position
 */
export default function GlowBadge({ children, className = '' }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      const el = hostRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={hostRef}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full',
        'px-2 py-2 isolate select-none',
        className
      )}
      style={{
        '--mx': '50%',
        '--my': '50%',
      }}
    >
      {/* Subtle moving glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full">
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-[radial-gradient(160px_80px_at_var(--mx)_var(--my),rgba(255,140,0,0.24),transparent_70%)]',
            'blur-2xl'
          )}
        />
      </div>

      {/* Glass pill */}
      <div
        className={cn(
          'relative z-10 rounded-full px-4 py-2',
          'backdrop-blur-xl',
          'bg-white/15',
          'ring-1 ring-black/5 dark:ring-white/10',
          'shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
        )}
      >
        <div className="flex items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  )
}
