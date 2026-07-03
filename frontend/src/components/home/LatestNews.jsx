import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadingSpinner from '../common/LoadingSpinner'
import ArticleCard from '../articles/ArticleCard'
import { FlowButton } from '../ui/FlowButton'
import { AnimatedText } from '../ui/AnimatedText'
import { newsService } from '../../services/api'
import { generateSlug } from '../../utils/formatters'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const LatestNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await newsService.getLatest(4)
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

  if (loading) return <LoadingSpinner />
  if (error || news.length === 0) {
    return (
      <section className="py-20 bg-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 glass-card rounded-3xl">
            <p className="text-theme-muted text-lg">{error || 'Belum ada berita'}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-24 bg-theme relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary mb-6">
            <div className="bg-card border border-theme rounded-2xl px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Berita Terkini</span>
            </div>
            <p className="pr-3 text-xs text-theme-muted">Terbaru</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <AnimatedText>Berita </AnimatedText>
            <AnimatedText className="text-accent" delay={0.1}>Terkini</AnimatedText>
          </h2>
          <div className="w-12 h-[2px] bg-gray-300 dark:bg-gray-700 mx-auto mb-5" />
          <p className="text-theme-muted text-base max-w-xl mx-auto">
            Informasi terbaru seputar kegiatan mahasiswa dan kampus
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {news.map((item) => (
            <motion.div key={item.id} variants={item}>
              <ArticleCard article={item} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <div className="text-center">
          <Link to="/news" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
            <FlowButton text="Lihat Semua Berita" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LatestNews
