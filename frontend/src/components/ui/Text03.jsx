import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function Text_03({ text, className = '', animate = true }) {
  const letters = text.split('')
  
  if (!animate) {
    return (
      <span className={cn('bg-gradient-to-r from-[rgb(48,11,85)] to-[rgb(122,71,166)] bg-clip-text text-transparent', className)}>
        {text}
      </span>
    )
  }

  return (
    <span className={cn('inline-block', className)}>
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
          className="bg-gradient-to-r from-[rgb(48,11,85)] to-[rgb(122,71,166)] bg-clip-text text-transparent inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  )
}
