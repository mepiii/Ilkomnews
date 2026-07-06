import { motion } from 'framer-motion'
import { useMemo } from 'react'

// Idle float duration — computed once at module load, stable across renders
const IDLE_DURATION = 4 + Math.random() * 2

// Letter-by-letter stagger reveal with idle float + hover glow
const AnimatedText = ({
  children,
  className = '',
  idle = true,
  hover = true,
  delay = 0,
  staggerDelay = 0.03,
  duration = 0.5,
  ...props
}) => {
  const text = typeof children === 'string' ? children : ''

  const revealFinishDelay = delay + text.length * staggerDelay + duration + 0.3

  const idleAnimation = idle
    ? {
        y: [0, -2, 0],
        transition: {
          duration: IDLE_DURATION,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: revealFinishDelay,
        },
      }
    : {}

  // Pre-compute word delays — all hooks must be called unconditionally
  const wordsWithDelay = useMemo(() => {
    if (!text) return []
    let charIdx = 0
    return text.split(' ').map((word) => {
      const wordDelay = delay + charIdx * staggerDelay
      charIdx += word.length
      return { word, wordDelay }
    })
  }, [text, delay, staggerDelay])

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
                textShadow: '0 0 12px rgba(122, 71, 166, 0.1)',
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

  return (
    <motion.span
      className={`inline-block cursor-default ${className}`}
      initial={{ opacity: 1 }}
      animate={idleAnimation}
      {...props}
    >
      {wordsWithDelay.map(({ word, wordDelay }, wi) => {
        const letters = word.split('')

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
                        textShadow: '0 0 10px rgba(122, 71, 166, 0.08)',
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
