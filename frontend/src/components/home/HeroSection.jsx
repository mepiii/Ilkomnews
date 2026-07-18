import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { headingHover } from '../../lib/animations'
import heroImage from '../../assets/gedungfasilkom.jpg'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] } },
})

const letterAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const HeroSection = () => {
  const ilkomLetters = 'ILKOM'.split('')
  const newsLetters = 'NEWS'.split('')

  return (
    <div className="relative -mt-20 min-h-[calc(100vh-2.5rem)] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})`, filter: 'blur(8px) scale(1.05)' }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 sm:pt-36 pb-24 sm:pb-32 text-center">
        <div className="text-center">
          {/* Title - RePo font with letter-by-letter animation */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 sm:mb-12 leading-[1.1] tracking-tight break-words text-balance">
              <span className="block mb-2 text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                {'Selamat Datang Di'.split('').map((ch, i) =>
                  ch === ' ' ? ' ' : (
                    <motion.span
                      key={i}
                      className="inline-block hero-text"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.03 }}
                      whileHover={headingHover}
                    >
                      {ch}
                    </motion.span>
                  )
                )}
              </span>
              <span className="block">
               <span className="mr-3 inline-block font-heading break-words" style={{ letterSpacing: '-0.02em' }}>
                 {ilkomLetters.map((letter, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={letterAnimation}
                      initial="hidden"
                      animate="visible"
                      whileHover={headingHover}
                      className="inline-block"
                    >
                      {/* gradient on inner glyph → moves with bounce, no clip-vanish */}
                      <span className="inline-block hero-gradient-text">{letter}</span>
                    </motion.span>
                 ))}
               </span>
               <span className="inline-block font-heading" style={{ letterSpacing: '0.05em', fontWeight: 600 }}>
                 {newsLetters.map((letter, i) => (
                    <motion.span
                      key={i}
                      custom={i + 5}
                      variants={letterAnimation}
                      initial="hidden"
                      animate="visible"
                      whileHover={headingHover}
                      className="inline-block"
                    >
                      <span className="inline-block hero-gradient-text">{letter}</span>
                    </motion.span>
                 ))}
               </span>
              </span>
            </h1>
          </motion.div>

          {/* CTA Buttons with hover animations */}
          <motion.div
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/news"
                className="group relative px-8 py-3 rounded-full text-sm font-semibold hero-text bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden transition-all duration-300 hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5"
              >
                <span className="relative z-10 transition-transform duration-200 group-hover:scale-105">Jelajahi Berita</span>
              </Link>
              <Link
                to="/ilkomgallery"
                className="group relative px-8 py-3 rounded-full text-sm font-semibold hero-text bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden transition-all duration-300 hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5"
              >
                <span className="relative z-10 transition-transform duration-200 group-hover:scale-105">Ilkom Gallery</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-white/40 text-[10px] tracking-widest uppercase">Gulir</span>
          <ChevronDown size={16} className="text-white/40" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroSection
