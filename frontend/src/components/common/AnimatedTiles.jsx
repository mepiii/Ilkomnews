import { memo, useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

const AnimatedTiles = memo(() => {
  const { theme } = useTheme()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Dark mode: very subtle grid (#111 on #000)
  // Light mode: subtle grid (#f0f0f0 on #fff)
  const gridStyles = {
    dark: {
      backgroundImage: `
        linear-gradient(to right, #111 1px, transparent 1px),
        linear-gradient(to bottom, #111 1px, transparent 1px)
      `,
      backgroundColor: '#000',
      opacity: 0.3,
    },
    light: {
      backgroundImage: `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
      `,
      backgroundColor: '#fff',
      opacity: 0.5,
    },
  }

  const currentStyle = gridStyles[theme] || gridStyles.dark

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        ...currentStyle,
        backgroundSize: '50px 50px',
        transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease-in-out',
      }}
      aria-hidden="true"
    />
  )
})

AnimatedTiles.displayName = 'AnimatedTiles'

export default AnimatedTiles
