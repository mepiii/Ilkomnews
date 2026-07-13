import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { springPreset, useReducedMotionSafe } from '../lib/animations'
import { WordBounce } from '../components/ui/WordBounce'

export default function NotFoundPage() {
  const reduce = useReducedMotionSafe()
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-transparent relative z-0 px-4 py-20"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : springPreset}
    >
      <div className="max-w-md w-full text-center">
        <div className="glass-card rounded-2xl p-8 border-red-300/30">
          <h1 className="text-6xl font-bold text-[var(--accent)] mb-2"><WordBounce text="404" gradient /></h1>
          <p className="text-lg font-semibold mb-1"><WordBounce text="Halaman tidak ditemukan" gradient /></p>
          <p className="text-sm text-theme-muted mb-6">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
