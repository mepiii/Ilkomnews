// Shared Framer Motion variants for staggered grid animations
export const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
export const itemVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } }

// Text animation variants
export const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] } },
})

export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay } },
})

export const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] } },
})

export const slideRight = (delay = 0) => ({
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] } },
})

// Hover animations for interactive elements
export const hoverScale = {
  scale: 1.02,
  y: -2,
  transition: { type: 'spring', stiffness: 400, damping: 15 },
}

export const hoverLift = {
  y: -4,
  transition: { type: 'spring', stiffness: 300, damping: 20 },
}
