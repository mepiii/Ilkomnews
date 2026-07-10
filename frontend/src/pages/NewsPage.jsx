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
import { Newspaper, Hammer, Trophy, GraduationCap, Presentation, Filter, Tag, ChevronLeft, ChevronRight } from 'lucide-react'

const TABS = [
  { id: 'all', label: 'Semua Berita', icon: Newspaper },
  { id: 'Workshop', label: 'Workshop', icon: Hammer },
  { id: 'Kompetisi', label: 'Kompetisi', icon: Trophy },
  { id: 'Pelatihan', label: 'Pelatihan', icon: GraduationCap },
  { id: 'Seminar', label: 'Seminar', icon: Presentation },
]

const SORT_OPTIONS = ['Terbaru', 'Terlama', 'Terpopuler']
const ITEMS_PER_PAGE = 8

import { container, itemVariant } from '../lib/animations'

const NewsPage = () => {
  const [allNews, setAllNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terbaru')
  const [selectedTag, setSelectedTag] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    api.news.getAll({ signal: controller.signal })
      .then(res => {
        setError('')
        setAllNews(Array.isArray(res) ? res : (res.data || []))
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Gagal memuat berita')
          setAllNews([])
        }
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, selectedTag, sortBy, searchQuery])

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-6 pb-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />

          {/* Section Header */}
          <PageHeader
            badge={
              <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary">
                <span className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">Berita Terkini</span>
                </span>
                <p className="pr-3 text-xs text-neutral-500 dark:text-neutral-400">Terbaru</p>
              </div>
            }
            title="Berita Terkini"
            subtitle="Informasi terbaru seputar kegiatan mahasiswa dan perkembangan teknologi di Fakultas Ilmu Komputer"
            textStyle="gradient"
          />

          {/* Tabs */}
          <div className="flex justify-center mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
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
              key={activeTab + selectedTag + sortBy + currentPage}
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 items-stretch"
            >
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariant}>
                    <div className="h-64 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                  </motion.div>
                ))
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-sm text-red-500 mb-3">{error}</p>
                  <button onClick={() => window.location.reload()} className="text-sm text-[var(--accent)] hover:underline">Muat ulang</button>
                </div>
              ) : paginatedItems.length === 0 ? (
                <EmptyResults
                  icon={<Newspaper size={40} className="text-[var(--accent)]" />}
                  title="Tidak ada berita yang ditemukan"
                  description="Coba ubah filter atau cari dengan kata kunci lain"
                  onReset={() => { setActiveTab('all'); setSearchQuery(''); setSortBy('Terbaru'); setSelectedTag('Semua') }}
                />
              ) : (
                paginatedItems.map((article, i) => (
                  <motion.div key={article.id || i} variants={itemVariant}>
                    <GlowCard glowColor="purple" className="rounded-2xl h-full">
                      <NewsExpandableCard article={article} />
                    </GlowCard>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-800/80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition-colors"
              >
                <ChevronLeft size={18} className="text-[var(--accent)]" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-[var(--accent)]/10'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-800/80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition-colors"
              >
                <ChevronRight size={18} className="text-[var(--accent)]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  )
}

export default NewsPage
