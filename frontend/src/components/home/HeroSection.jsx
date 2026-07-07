import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { AnimatedText } from '../ui/AnimatedText'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import heroImage from '../../assets/gedungfasilkom.jpg'

const springConfig = { type: 'spring', stiffness: 200, damping: 20 }

const TypewriterText = ({ text, delay = 0, onComplete }) => {
  const [displayed, setDisplayed] = useState('')
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayed(text)
      onComplete?.()
      return
    }
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          onComplete?.()
        }
      }, 50)
      return () => clearInterval(interval)
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [text, delay, prefersReducedMotion, onComplete])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-purple-400 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  )
}

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] } },
})

const HeroSection = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-2.5 border border-white/15 rounded-full bg-white/5 backdrop-blur-sm p-1 text-sm text-white mb-8">
              <div className="bg-white/10 border border-white/15 rounded-2xl px-3 py-1">
                <p className="text-xs font-semibold tracking-wide uppercase">Fakultas Ilmu Komputer</p>
              </div>
              <p className="pr-3 text-xs text-white/50">Universitas Sriwijaya</p>
            </div>
          </motion.div>

          {/* Title with typewriter */}
          <motion.div
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight">
              <span className="text-white block mb-1">
                <TypewriterText text="Selamat Datang Di" delay={0.3} />
              </span>
              <span className="block">
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 mr-3"
                  style={{ fontFamily: 'CustomFont, sans-serif', backgroundSize: '200% auto' }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <AnimatedText delay={0.8} idle={false}>ILKOM</AnimatedText>
                </motion.span><motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300"
                  style={{ fontFamily: 'CustomFont, sans-serif', backgroundSize: '200% auto' }}
                  animate={{ backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <AnimatedText delay={1.0} idle={false}>NEWS</AnimatedText>
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            animate="visible"
          >
            <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              <AnimatedText delay={0.3}>Informasi terkini untuk mahasiswa FASILKOM Universitas Sriwijaya.</AnimatedText>
            </p>
          </motion.div>

          {/* CTA Buttons with spring */}
          <motion.div
            variants={fadeUp(0.45)}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/news">
                <motion.div
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white font-semibold text-sm cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(122, 71, 166, 0.3)', borderColor: 'rgba(191, 148, 255, 0.4)', boxShadow: '0 0 40px rgba(159, 111, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={springConfig}
                >
                  Jelajahi Berita
                </motion.div>
              </Link>
              <Link to="/ilkomgallery">
                <motion.div
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white font-semibold text-sm cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(122, 71, 166, 0.3)', borderColor: 'rgba(191, 148, 255, 0.4)', boxShadow: '0 0 40px rgba(159, 111, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={springConfig}
                >
                  Ilkom Gallery
                </motion.div>
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
