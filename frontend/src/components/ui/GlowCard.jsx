import { useEffect, useRef, useCallback } from 'react'
import { useThemeMode } from '../../hooks/useThemeMode'

const GLOW_COLORS = {
  purple: 'rgba(124,58,237,0.1)',
  green: 'rgba(34,197,94,0.1)',
  red: 'rgba(239,68,68,0.1)',
  blue: 'rgba(59,130,246,0.1)',
}

const GlowCard = ({
  children,
  className = '',
  glowColor = 'purple',
  width,
  height,
}) => {
  const cardRef = useRef(null)
  const isDark = useThemeMode()
  const glow = GLOW_COLORS[glowColor] || GLOW_COLORS.purple

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

  const hoverShadow = isDark
    ? `0 12px 36px rgba(0,0,0,0.34), 0 0 22px ${glow}`
    : `0 8px 24px rgba(0,0,0,0.06), 0 0 16px ${glow}`

  return (
    <div
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
        boxShadow: 'var(--shadow-glass)',
        willChange: 'transform',
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        overflow: 'hidden',
      }}
      className={`group ${className}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = hoverShadow
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-glass)'
      }}
    >
      {children}
    </div>
  )
}

export { GlowCard }
