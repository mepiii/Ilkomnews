import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, Sparkles } from 'lucide-react'
import { AnimatedText } from '../ui/AnimatedText'
import heroImage from '../../assets/gedungfasilkom.jpg'

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

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* SVG Dot Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill="white" fillOpacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>

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

          {/* Title */}
          <motion.div
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight">
              <span className="text-white block mb-1">
                <AnimatedText>Selamat Datang Di</AnimatedText>
              </span>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 items-baseline">
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400"
                  style={{ fontFamily: 'CustomFont, sans-serif' }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <AnimatedText delay={0.1}>ILKOM</AnimatedText>
                </motion.span>
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300"
                  style={{ fontFamily: 'CustomFont, sans-serif' }}
                  animate={{ backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <AnimatedText delay={0.2}>NEWS</AnimatedText>
                </motion.span>
              </div>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            animate="visible"
          >
            <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              <AnimatedText delay={0.3}>Informasi terkini untuk mahasiswa FASILKOM Universitas Sriwijaya.</AnimatedText>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp(0.45)}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/news">
                <motion.div
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white font-semibold text-sm cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(122, 71, 166, 0.3)', borderColor: 'rgba(191, 148, 255, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Jelajahi Berita
                  <Sparkles size={16} className="text-purple-300" />
                </motion.div>
              </Link>
              <Link to="/ilkomgallery">
                <motion.div
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white font-semibold text-sm cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(122, 71, 166, 0.3)', borderColor: 'rgba(191, 148, 255, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Ilkom Gallery
                  <Sparkles size={16} className="text-amber-300" />
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
          <span className="text-white/25 text-[10px] tracking-widest uppercase">Gulir</span>
          <ChevronDown size={16} className="text-white/25" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroSection
