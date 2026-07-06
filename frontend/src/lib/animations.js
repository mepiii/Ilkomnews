// Shared Framer Motion variants for staggered grid animations
export const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
export const itemVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } }
