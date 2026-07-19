import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useThemeMode } from '../../hooks/useThemeMode'

const GLOW_COLORS = {
  purple: 'rgba(124,58,237,0.1)',
  green: 'rgba(34,197,94,0.1)',
  red: 'rgba(239,68,68,0.1)',
  blue: 'rgba(59,130,246,0.1)',
}

// Stronger variant used for the pointer-tracked sheen overlay.
const SHEEN_COLORS = {
  purple: 'rgba(124,58,237,0.22)',
  green: 'rgba(34,197,94,0.22)',
  red: 'rgba(239,68,68,0.22)',
  blue: 'rgba(59,130,246,0.22)',
}

const GlowCard = ({
  children,
  className = '',
  glowColor = 'purple',
  glow = true,
  width,
  height,
}) => {
  const cardRef = useRef(null)
  const isDark = useThemeMode()
  const glowTint = GLOW_COLORS[glowColor] || GLOW_COLORS.purple
  const sheen = SHEEN_COLORS[glowColor] || SHEEN_COLORS.purple

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    cardRef.current.style.setProperty('--glow-x', `${x}px`)
    cardRef.current.style.setProperty('--glow-y', `${y}px`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty('--glow-x', '50%')
    cardRef.current.style.setProperty('--glow-y', '50%')
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    el.addEventListener('pointermove', handleMouseMove)
    el.addEventListener('pointerleave', handleMouseLeave)
    return () => {
      el.removeEventListener('pointermove', handleMouseMove)
      el.removeEventListener('pointerleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  const hoverShadow = !glow
    ? (isDark ? '0 20px 48px rgba(0,0,0,0.55)' : '0 16px 36px rgba(0,0,0,0.14)')
    : (isDark
      ? '0 20px 48px rgba(0,0,0,0.55)'
      : `0 16px 36px rgba(0,0,0,0.14), 0 0 18px ${glowTint}`)

  return (
    <motion.div
      ref={cardRef}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.45)' : '0 8px 24px rgba(0,0,0,0.12)',
        willChange: 'transform',
        overflow: 'hidden',
      }}
      className={`group min-w-0 ${className}`}
      whileHover={{ y: -4, scale: 1.01, boxShadow: hoverShadow }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, mass: 0.6 }}
    >
      {/* Glassmorphic top highlight — subtle gradient border treatment (light only) */}
      {!isDark && (
      <div
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 32%)',
          zIndex: 1,
        }}
      />
      )}

      {/* Pointer-tracked sheen — appears softly on hover (glow mode, both themes) */}
      {glow && (
      <div
        aria-hidden="true"
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          // ponytail: lighter sheen in dark mode; same pointer-tracked glow.
          background: `radial-gradient(420px circle at var(--glow-x) var(--glow-y), ${isDark ? sheen.replace(/0\.\d+\)/, '0.18)') : sheen}, transparent 45%)`,
          zIndex: 1,
        }}
      />
      )}

      {/* Content sits above the decorative overlays */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </motion.div>
  )
}

export { GlowCard }
