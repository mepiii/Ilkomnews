import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadingSpinner from '../common/LoadingSpinner'
import NewsExpandableCard from '../cards/NewsExpandableCard'
import { FlowButton } from '../ui/FlowButton'
import { GlowCard } from '../ui/GlowCard'
import { Text_03 } from '../ui/Text03'
import { Tiles } from '../ui/Tiles'
import { newsService } from '../../services/api'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } }

const LatestNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchNews = async () => {
      try { setLoading(true); const response = await newsService.getLatest(4); const data = response.data || response; setNews(Array.isArray(data) ? data : []) }
      catch (err) { setError(err.message || 'Gagal memuat berita') } finally { setLoading(false) }
    }
    fetchNews()
  }, [])
  if (loading) return <LoadingSpinner />
  if (error || news.length === 0) {
    return (<section className="py-20 relative z-0 bg-theme"><Tiles rows={10} cols={16} /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"><div className="text-center py-16 glass-card rounded-3xl"><p className="text-theme-muted text-lg">{error || 'Belum ada berita'}</p></div></div></section>)
  }
  return (
    <section className="py-20 md:py-24 relative z-0 bg-theme">
      <Tiles rows={10} cols={16} />
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
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {news.slice(0, 4).map((article) => (<motion.div key={article.id} variants={item}><GlowCard glowColor="purple" className="rounded-2xl"><NewsExpandableCard article={article} /></GlowCard></motion.div>))}
        </motion.div>
        <div className="text-center"><Link to="/news" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}><FlowButton text="Lihat Semua Berita" /></Link></div>
      </div>
    </section>
  )
}
export default LatestNews
