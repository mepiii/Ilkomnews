import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
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

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="text-center">
          {/* Title - Variative styling */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
              <span className="text-white block mb-2">
                Selamat Datang Di
              </span>
              <span className="block whitespace-nowrap">
                <span
                  className="mr-3 inline-block"
                  style={{ fontFamily: 'CustomFont, sans-serif', color: 'rgb(160,130,210)', letterSpacing: '-0.02em' }}
                >
                  ILKOM
                </span>
                <span
                  className="inline-block"
                  style={{ fontFamily: 'CustomFont, sans-serif', color: 'rgb(120,90,180)', letterSpacing: '0.05em', fontSize: '0.85em', fontWeight: 500 }}
                >
                  NEWS
                </span>
              </span>
            </h1>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/news"
                className="px-8 py-3 rounded-full text-sm font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-[rgb(48,11,85)] hover:border-[rgb(48,11,85)] transition-all duration-300"
              >
                Jelajahi Berita
              </Link>
              <Link
                to="/ilkomgallery"
                className="px-8 py-3 rounded-full text-sm font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-[rgb(122,71,166)] hover:border-[rgb(122,71,166)] transition-all duration-300"
              >
                Ilkom Gallery
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
