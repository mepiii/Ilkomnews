import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Sparkles, X, BookOpen, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

const FAQS = [
  { id: 1, question: "Apa itu ILKOM NEWS?", answer: "ILKOM NEWS adalah platform berita dan informasi resmi Fakultas Ilmu Komputer Universitas Sriwijaya (FASILKOM Unsri)." },
  { id: 2, question: "Bagaimana cara menavigasi website ini?", answer: "Gunakan menu navigasi di bagian atas untuk mengakses Beranda, Berita, Ilkom Gallery, dan halaman lainnya." },
  { id: 3, question: "Bagaimana cara submit proyek?", answer: "Klik tombol 'Submit Project' di bagian galeri atau halaman proyek. Isi formulir lengkap dan unggah thumbnail." },
  { id: 4, question: "Apa saja kategori proyek?", answer: "Terdapat 5 kategori: Pengembangan Web, Aplikasi Mobile, Desain UI/UX, Pengembangan Game, dan AI/Lainnya." },
  { id: 5, question: "Bagaimana cara menyimpan artikel favorit?", answer: "Klik ikon bookmark pada artikel atau proyek yang ingin Anda simpan." },
  { id: 6, question: "Apakah website ini mobile-friendly?", answer: "Ya! ILKOM NEWS dirancang responsif dan dapat diakses dari perangkat mobile, tablet, maupun desktop." },
  { id: 7, question: "Bagaimana cara mengubah tema?", answer: "Klik ikon tema (bulan/matahari) di pojok kanan atas navbar untuk beralih mode." },
  { id: 8, question: "Bagaimana menghubungi tim?", answer: "Hubungi kami melalui halaman Kontak di footer, atau gunakan fitur chat ini." },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300, staggerChildren: 0.05 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), [])
  const toggleFaq = useCallback((id) => { setExpandedFaq(prev => prev === id ? null : id) }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="faq-window"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[340px] max-w-[calc(100vw-2rem)] max-h-[480px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="relative border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50/30 dark:bg-neutral-800/30 p-4 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/20 opacity-50" />
              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm overflow-hidden bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <img src="/assets/wolfy-avatar.png" alt="Wolfy" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-neutral-900 bg-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Wolfy (Arka Wolf)</h3>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">ILKOM NEWS Assistant</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 flex items-center justify-center transition-colors" aria-label="Close">
                  <X className="h-4 w-4 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* Scrollable FAQ */}
            <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y p-4 space-y-2 bg-gradient-to-b from-white/20 to-white/40 dark:from-neutral-900/20 dark:to-neutral-900/40">
              {FAQS.map((faq) => (
                <div key={faq.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white/30 dark:bg-neutral-800/30">
                  <button onClick={() => toggleFaq(faq.id)} className="w-full p-3 text-left flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors">
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 pr-2">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-3 text-sm text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}

              {/* Ask Wolfy */}
              <div className="mt-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 text-center">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">Ada pertanyaan lain?</p>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Tanyakan ke Wolfy
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={cn(
          'cursor-pointer group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 overflow-hidden',
          isOpen
            ? 'bg-red-500 text-white rotate-90'
            : 'bg-purple-600 text-white hover:shadow-purple-600/25'
        )}
        aria-label={isOpen ? 'Close' : 'Chat with Wolfy'}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-inherit opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <img src="/assets/wolfy-icon.png" alt="Wolfy" className="h-10 w-10 object-contain" />
        )}
      </motion.button>
    </div>
  )
}
