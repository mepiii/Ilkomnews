import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Breadcrumb from '../components/common/Breadcrumb'
import NewsExpandableCard from '../components/cards/NewsExpandableCard'
import { GlowCard } from '../components/ui/GlowCard'
import { PageHeader } from '../components/ui/PageHeader'
import EmptyResults from '../components/ui/EmptyResults'
import { SmoothTabs } from '../components/ui/SmoothTabs'
import ExpandingSearchDock from '../components/shared/ExpandingSearchDock'
import AnimatedFilterDropdown from '../components/shared/AnimatedFilterDropdown'
import { PageBackground } from '../components/ui/PageBackground'
import { api } from '../services/api'
import { parseTags } from '../utils/parsers'
import { Newspaper, Filter, Tag } from 'lucide-react'

const TABS = [
  { id: 'all', label: 'Semua Berita', icon: Newspaper },
  { id: 'Workshop', label: 'Workshop', icon: Newspaper },
  { id: 'Kompetisi', label: 'Kompetisi', icon: Newspaper },
  { id: 'Pelatihan', label: 'Pelatihan', icon: Newspaper },
  { id: 'Seminar', label: 'Seminar', icon: Newspaper },
]

const SORT_OPTIONS = ['Terbaru', 'Terlama', 'Terpopuler']

import { container, itemVariant } from '../lib/animations'

const NewsPage = () => {
  const [allNews, setAllNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terbaru')
  const [selectedTag, setSelectedTag] = useState('Semua')

  useEffect(() => {
    api.news.getAll()
      .then(res => setAllNews(Array.isArray(res) ? res : (res.data || [])))
      .catch(() => setAllNews([]))
      .finally(() => setLoading(false))
  }, [])

  const uniqueTags = useMemo(() => [...new Set(allNews.flatMap(item => parseTags(item.tags)))], [allNews])

  const TAG_OPTIONS = useMemo(() => ['Semua', ...uniqueTags], [uniqueTags])

  const filtered = useMemo(() => allNews
    .filter(n => activeTab === 'all' || n.category === activeTab)
    .filter(n => selectedTag === 'Semua' || parseTags(n.tags).includes(selectedTag))
    .filter(n => {
      if (!searchQuery) return true
      const s = searchQuery.toLowerCase()
      return n.title?.toLowerCase().includes(s) || n.author?.toLowerCase().includes(s) || n.summary?.toLowerCase().includes(s)
    })
    .sort((a, b) => {
      if (sortBy === 'Terlama') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'Terpopuler') return (b.views || 0) - (a.views || 0)
      return new Date(b.date) - new Date(a.date)
    }), [allNews, activeTab, selectedTag, searchQuery, sortBy])

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-24 pb-12">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          {/* Section Header */}
          <PageHeader
            badge={
              <>
                <span className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">Berita Terkini</span>
                </span>
                <p className="pr-3 text-xs text-neutral-500 dark:text-neutral-400">Terbaru</p>
              </>
            }
            title="Berita Terkini"
            subtitle="Informasi terbaru seputar kegiatan mahasiswa, event, dan perkembangan teknologi di Fakultas Ilmu Komputer"
            textStyle="gradient"
          />

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-3 flex-wrap justify-center mb-6">
            <ExpandingSearchDock value={searchQuery} onChange={setSearchQuery} placeholder="Cari berita, penulis..." />
            <AnimatedFilterDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} icon={Filter} />
            {uniqueTags.length > 0 && (
              <AnimatedFilterDropdown options={TAG_OPTIONS} value={selectedTag} onChange={setSelectedTag} icon={Tag} />
            )}
          </div>

          {/* Count */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              <span className="font-semibold text-[var(--accent)]">{filtered.length}</span> berita ditemukan
            </p>
          </div>

          {/* News Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedTag + sortBy}
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariant}>
                    <div className="h-64 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                  </motion.div>
                ))
              ) : filtered.length === 0 ? (
                <EmptyResults
                  icon={<Newspaper size={40} className="text-[var(--accent)]" />}
                  title="Tidak ada berita yang ditemukan"
                  description="Coba ubah filter atau cari dengan kata kunci lain"
                  onReset={() => { setActiveTab('all'); setSearchQuery(''); setSortBy('Terbaru'); setSelectedTag('Semua') }}
                />
              ) : (
                filtered.map((article, i) => (
                  <motion.div key={article.id || i} variants={itemVariant}>
                    <GlowCard glowColor="purple" className="rounded-2xl">
                      <NewsExpandableCard article={article} />
                    </GlowCard>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageBackground>
  )
}

export default NewsPage
