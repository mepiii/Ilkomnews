import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { headingHover } from '../../lib/animations'

export function Text_03({ text, className = '', animate = true }) {
  const letters = text.split('')
  const gradient = /(section|brand)-gradient-text/.test(className)
  const outerClass = cn('inline-block', className)

  if (!animate) {
    return (
      <span className={cn('text-accent', className)}>
        {text}
      </span>
    )
  }

  return (
    <span className={outerClass}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: i * 0.03,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileHover={headingHover}
          className="inline-block"
        >
          {/* Gradient clips on the INNER glyph span so bg-clip:text moves with
              the bounce transform \u2014 a letter translated out of the parent box
              no longer vanishes on hover. */}
          <span className={cn('inline-block', gradient && 'section-gradient-text')}>
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        </motion.span>
      ))}
    </span>
  )
}
