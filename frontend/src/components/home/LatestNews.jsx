import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import NewsExpandableCard from '../cards/NewsExpandableCard'
import { FlowButton } from '../ui/FlowButton'
import { GlowCard } from '../ui/GlowCard'
import { Text_03 } from '../ui/Text03'
import { SmoothTabs } from '../ui/SmoothTabs'
import { newsService } from '../../services/api'
import { parseTags } from '../../utils/parsers'
import { isNotExpired } from '../../utils/expiry'
import AnimatedFilterDropdown from '../shared/AnimatedFilterDropdown'
import { Newspaper, Hammer, Trophy, GraduationCap, Presentation, Tag } from 'lucide-react'
import { container, itemVariant } from '../../lib/animations'

const TABS = [
  { id: 'all', label: 'Semua Berita', icon: Newspaper },
  { id: 'Workshop', label: 'Workshop', icon: Hammer },
  { id: 'Kompetisi', label: 'Kompetisi', icon: Trophy },
  { id: 'Pelatihan', label: 'Pelatihan', icon: GraduationCap },
  { id: 'Seminar', label: 'Seminar', icon: Presentation },
]

const LatestNews = () => {
  const reduce = useReducedMotion()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [backgroundLoading, setBackgroundLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTag, setSelectedTag] = useState('Semua')
  const abortRef = useRef(null)
  const isFirstLoad = useRef(true)

  const fetchNews = () => {
    // Cancel any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (isFirstLoad.current) {
      setLoading(true)
    } else {
      setBackgroundLoading(true)
    }
    setError(null)

    const timeout = setTimeout(() => controller.abort(), 10000)

    newsService.getLatest(8, { signal: controller.signal })
      .then(response => {
        const data = response.data || response
        setNews(Array.isArray(data) ? data : [])
        isFirstLoad.current = false
      })
      .catch(err => {
        if (err.name === 'AbortError' || err.name === 'CanceledError') return
        setError(err.message || 'Gagal memuat berita')
      })
      .finally(() => {
        clearTimeout(timeout)
        setLoading(false)
        setBackgroundLoading(false)
      })
  }

  useEffect(() => {
    fetchNews()
    // Realtime: re-fetch so TTL-expired berita disappears without a manual reload.
    const id = setInterval(fetchNews, 30000)
    return () => { clearInterval(id); abortRef.current?.abort() }
  }, [])

  const uniqueTags = [...new Set(news.flatMap(n => parseTags(n.tags)))]
  const TAG_OPTIONS = ['Semua', ...uniqueTags]

  const sortedNews = [...news].sort((a, b) =>
    new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0)
  )

  const filtered = sortedNews
    .filter(isNotExpired)
    .filter(n => activeTab === 'all' || n.category === activeTab)
    .filter(n => selectedTag === 'Semua' || parseTags(n.tags).includes(selectedTag))

  const items = filtered.slice(0, 4)

  return (
    <section className="py-20 md:py-24 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16 group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary mb-5">
            <div className="bg-theme-card border border-theme rounded-2xl px-3 py-1 flex items-center gap-1.5">
              <Newspaper size={14} className="text-[var(--accent)]" />
              <span className="text-xs font-semibold uppercase tracking-wider">Berita Terkini</span>
            </div>
            <p className="pr-3 text-xs text-theme-muted">Terbaru</p>
          </div>
          <motion.h2
            className="heading-hover text-5xl md:text-6xl lg:text-7xl font-black mb-4 font-header group-hover:scale-[1.01] transition-transform duration-200"
            whileHover={reduce ? undefined : { scale: 1.02 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Text_03 text="Berita Terkini" className="section-gradient-text" />
          </motion.h2>
          <div className="w-20 h-0.5 mx-auto rounded-full mb-5" style={{ background: 'linear-gradient(to right, rgb(48,11,85), rgb(122,71,166))' }} />
          <p className="text-theme-muted text-base max-w-2xl mx-auto">Informasi terbaru seputar kegiatan mahasiswa dan kampus</p>
        </motion.div>

        <div className="flex justify-center mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {TAG_OPTIONS.length > 1 && (
          <div className="flex justify-center mb-6">
            <AnimatedFilterDropdown options={TAG_OPTIONS} value={selectedTag} onChange={setSelectedTag} icon={Tag} />
          </div>
        )}

        {/* Background loading indicator */}
        {backgroundLoading && (
          <div className="flex justify-center mb-4">
            <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + selectedTag}
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 items-stretch"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={itemVariant}>
                  <div className="h-64 rounded-xl bg-theme-secondary animate-pulse" />
                </motion.div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-16 space-y-4">
                <p className="text-theme-muted text-sm">{error}</p>
                <button
                  onClick={fetchNews}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all"
                >
                  <RefreshCw size={14} /> Muat ulang
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-theme-muted text-sm">Belum ada berita di kategori ini</p>
              </div>
            ) : (
              items.map((article, i) => (
                <motion.div key={article.id || i} variants={itemVariant} className="h-full">
                  <GlowCard glowColor="purple" className="rounded-2xl h-full">
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
