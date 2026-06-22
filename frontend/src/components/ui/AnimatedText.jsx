import { motion } from 'framer-motion'
import { useMemo } from 'react'

// Letter-by-letter stagger reveal with idle float + hover glow
const AnimatedText = ({
  children,
  as: Tag = 'span',
  className = '',
  idle = true,
  hover = true,
  delay = 0,
  staggerDelay = 0.03,
  duration = 0.5,
  ...props
}) => {
  const text = typeof children === 'string' ? children : ''

  // Idle float — computed once per mount
  const idleDuration = useMemo(() => 4 + Math.random() * 2, [])

  const idleAnimation = idle
    ? {
        y: [0, -2, 0],
        opacity: [0.85, 1, 0.85],
        transition: {
          duration: idleDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + text.length * staggerDelay + duration,
        },
      }
    : {}

  // Non-string children — simple motion wrapper (no letter split)
  if (!text) {
    return (
      <motion.span
        className={`inline-block cursor-default ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay } }}
        whileHover={
          hover
            ? {
                scale: 1.05,
                textShadow: '0 0 20px rgba(122, 71, 166, 0.3)',
                transition: { duration: 0.3 },
              }
            : undefined
        }
        {...props}
      >
        {children}
      </motion.span>
    )
  }

  // String children — word-by-word stagger reveal (keeps words together)
  const words = text.split(' ')
  let charIndex = 0

  return (
    <motion.span
      className={`inline-block cursor-default ${className}`}
      animate={idleAnimation}
      {...props}
    >
      {words.map((word, wi) => {
        const wordDelay = delay + charIndex * staggerDelay
        const letters = word.split('')
        charIndex += word.length

        return (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
            {letters.map((char, li) => (
              <motion.span
                key={li}
                className="inline-block"
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration,
                    delay: wordDelay + li * staggerDelay,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
                whileHover={
                  hover
                    ? {
                        scale: 1.1,
                        color: 'rgba(122, 71, 166, 1)',
                        textShadow: '0 0 16px rgba(122, 71, 166, 0.4)',
                        transition: { duration: 0.2 },
                      }
                    : undefined
                }
              >
                {char}
              </motion.span>
            ))}
          </span>
        )
      })}
    </motion.span>
  )
}

export { AnimatedText }
