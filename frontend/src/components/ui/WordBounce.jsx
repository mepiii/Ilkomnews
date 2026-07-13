import { motion, useReducedMotion } from 'framer-motion'
import { headingHover } from '../../lib/animations'

/**
 * WordBounce — title/heading hover animation, per-letter bounce on hover
 * (matches the hero "Selamat Datang Di" effect).
 *
 * Gradient is nested on the INNER glyph span (not the parent). If it lived on
 * the parent, bg-clip:text would clip to the parent's text box and a hovered
 * letter translated out of that box would vanish. Putting the clip on the
 * glyph span moves it with the bounce transform.
 */
const WordBounce = ({ text, className = '', gradient = false }) => {
  const reduce = useReducedMotion()
  // Split into words; each word stays whole (whitespace-nowrap) so titles
  // never break mid-word on mobile — only ever wrap between words.
  const words = String(text).split(' ')

  return (
    <span className={`inline-block cursor-default ${className}`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" style={{ marginRight: '0.25em' }}>
          {word.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              whileHover={reduce ? undefined : headingHover}
            >
              <span className={`inline-block ${gradient ? 'section-gradient-text' : ''}`}>
                {ch}
              </span>
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

export { WordBounce }
