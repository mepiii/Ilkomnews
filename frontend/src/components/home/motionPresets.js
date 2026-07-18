export const springFlow = {
  type: 'spring',
  stiffness: 260,
  damping: 22,
  mass: 0.7,
}

export const sectionIntro = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
}

export const staggerGrid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.06,
    },
  },
}

export const gridItem = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const ctaPress = {
  whileHover: { y: -3, scale: 1.02 },
  whileTap: { y: 0, scale: 0.97 },
  transition: springFlow,
}
