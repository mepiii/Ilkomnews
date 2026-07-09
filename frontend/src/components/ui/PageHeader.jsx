import { motion } from 'framer-motion'
import { AnimatedText } from './AnimatedText'
import { Text_03 } from './Text03'

/**
 * PageHeader — animated page title matching the Hero section's visual energy.
 *
 * Wraps the h1 + optional badge/description in staggered reveal animations
 * (fadeUp, duration 0.8, ease-in-out) identical to the HeroSection pattern.
 * The title text uses AnimatedText for per-letter hover scale (1.1) + glow.
 *
 * Props:
 *   badge     — optional badge element (e.g. the pill with category name)
 *   title     — the h1 text (supports mixed JSX — AnimatedText is applied only
 *               to direct string children for simplicity)
 *   subtitle  — optional description paragraph below the title
 *   divider   — show a gradient divider line (default true)
 *   className — additional classes on the outer wrapper
 */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
})

const PageHeader = ({ badge, title, subtitle, divider = true, textStyle = 'gradient', className = '' }) => (
  <motion.div
    className={`text-center mb-8 ${className}`}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.12 } },
    }}
  >
    {badge && (
      <motion.div variants={fadeUp(0)} className="mb-5">
        {badge}
      </motion.div>
    )}

    <motion.div variants={fadeUp(0.12)}>
      <h1 className="text-4xl md:text-5xl font-black text-theme-primary mb-4 font-header">
        {title.split('\n').map((line, i) => (
          <span key={i} className="block">
            {textStyle === 'animated' ? (
              <AnimatedText idle={false} hover={true}>{line}</AnimatedText>
            ) : (
              <Text_03 text={line} className="section-gradient-text" />
            )}
          </span>
        ))}
      </h1>
    </motion.div>

    {divider && (
      <motion.div
        variants={fadeUp(0.2)}
        className="w-20 h-0.5 mx-auto rounded-full mb-5" style={{ background: 'linear-gradient(to right, rgb(48,11,85), rgb(122,71,166))' }}
      />
    )}

    {subtitle && (
      <motion.div variants={fadeUp(0.24)}>
        <p className="text-theme-muted text-base max-w-2xl mx-auto">{subtitle}</p>
      </motion.div>
    )}
  </motion.div>
)

export { PageHeader }
