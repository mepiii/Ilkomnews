// Shared Framer Motion variants for staggered grid animations
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

// Text animations
const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const letterReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.03,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
}

// Hover animations for interactive elements
export const hoverScale = {
  scale: 1.02,
  y: -2,
  transition: { type: 'spring', stiffness: 400, damping: 15 },
}

const hoverLift = {
  y: -4,
  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
  transition: { type: 'spring', stiffness: 400, damping: 20 }
}

// Button animations
const buttonHover = {
  scale: 1.02,
  y: -1,
  transition: { type: 'spring', stiffness: 400, damping: 17 }
}

const buttonTap = {
  scale: 0.98,
  transition: { type: 'spring', stiffness: 400, damping: 17 }
}

// Fade animations
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.4 } 
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  }
}

const fadeDown = {
  hidden: { opacity: 0, y: -16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  }
}

// Scale animations
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  }
}

// Slide animations
const slideLeft = {
  hidden: { opacity: 0, x: 24 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  }
}

const slideRight = {
  hidden: { opacity: 0, x: -24 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  }
}

// Section animations
const sectionReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
      delayChildren: 0.15
    }
  }
}

// Card hover animation
const cardHover = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  hover: { 
    scale: 1.01, 
    y: -4,
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20 
    }
  }
}
