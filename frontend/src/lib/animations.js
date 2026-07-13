// Shared Framer Motion variants for staggered grid animations
import { useState, useEffect } from 'react'

export const container = { 
  hidden: {}, 
  show: { 
    transition: { 
      staggerChildren: 0.06,
      delayChildren: 0.1
    } 
  } 
}

export const itemVariant = { 
  hidden: { opacity: 0, y: 24, scale: 0.98 }, 
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  } 
}

// Hover animations for interactive elements
export const hoverScale = {
  scale: 1.02,
  y: -2,
  transition: { type: 'spring', stiffness: 400, damping: 15 },
}

// Spring preset for buttons / micro-interactions
export const springPreset = { type: 'spring', stiffness: 300, damping: 24 }

// Page-level staggered container (mount entrance)
export const pageContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

// Page-level staggered item (mount entrance)
export const pageItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// Spring used for modal surface transitions
export const modalSpring = { type: 'spring', stiffness: 300, damping: 28 }

// Bouncy per-letter/word hover for headings & titles.
// Spring (single targets) so it ALWAYS returns to base on hover-out,
// and overshoots for the springy feel. Keyframe arrays here strand the
// element at the last keyframe when the pointer leaves mid-animation.
export const headingHover = {
  y: -12,
  scale: 1.12,
  transition: { type: 'spring', stiffness: 450, damping: 11 },
}

// Tiny, safe hook for prefers-reduced-motion.
// Returns true when the user has requested reduced motion.
// Guarded for SSR / non-browser environments.
export function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}
