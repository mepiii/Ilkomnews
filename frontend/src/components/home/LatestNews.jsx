import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import NewsExpandableCard from '../cards/NewsExpandableCard'
import { FlowButton } from '../ui/FlowButton'
import { GlowCard } from '../ui/GlowCard'
import { Text_03 } from '../ui/Text03'
import { SmoothTabs } from '../ui/SmoothTabs'
import { newsService } from '../../services/api'
import { Newspaper } from 'lucide-react'

const TABS = [
  { id: 'all', label: 'Semua Berita', icon: Newspaper },
  { id: 'Workshop', label: 'Workshop', icon: Newspaper },
  { id: 'Kompetisi', label: 'Kompetisi', icon: Newspaper },
  { id: 'Pelatihan', label: 'Pelatihan', icon: Newspaper },
  { id: 'Seminar', label: 'Seminar', icon: Newspaper },
]

import { container, itemVariant } from '../../lib/animations'

const LatestNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await newsService.getLatest(8)
        const data = response.data || response
        setNews(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Gagal memuat berita')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const filtered = activeTab === 'all'
    ? news
    : news.filter(n => n.category === activeTab)

  const items = filtered.slice(0, 4)

  return (
    <section className="py-20 md:py-24 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary mb-5">
            <div className="bg-theme-card border border-theme rounded-2xl px-3 py-1"><span className="text-xs font-semibold uppercase tracking-wider">Berita Terkini</span></div>
            <p className="pr-3 text-xs text-theme-muted">Terbaru</p>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 font-header"><Text_03 text="Berita Terkini" className="section-gradient-text" /></h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mb-5" />
          <p className="text-theme-muted text-base max-w-2xl mx-auto">Informasi terbaru seputar kegiatan mahasiswa dan kampus</p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -12 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={itemVariant}>
                  <div className="h-64 rounded-xl bg-theme-secondary animate-pulse" />
                </motion.div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-10">
                <p className="text-theme-muted text-sm">{error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-theme-muted text-sm">Belum ada berita di kategori ini</p>
              </div>
            ) : (
              items.map((article, i) => (
                <motion.div key={article.id || i} variants={itemVariant}>
                  <GlowCard glowColor="purple" className="rounded-2xl">
                    <NewsExpandableCard article={article} />
                  </GlowCard>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-10">
          <Link to="/news" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
            <FlowButton text="Lihat Semua Berita" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LatestNews
