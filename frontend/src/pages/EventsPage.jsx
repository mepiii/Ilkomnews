import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Breadcrumb from '../components/common/Breadcrumb'
import EventExpandableCard from '../components/cards/EventExpandableCard'
import { GlowCard } from '../components/ui/GlowCard'
import { PageHeader } from '../components/ui/PageHeader'
import EmptyResults from '../components/ui/EmptyResults'
import { SmoothTabs } from '../components/ui/SmoothTabs'
import ExpandingSearchDock from '../components/shared/ExpandingSearchDock'
import AnimatedFilterDropdown from '../components/shared/AnimatedFilterDropdown'
import { PageBackground } from '../components/ui/PageBackground'
import { api } from '../services/api'
import { Calendar, Filter } from 'lucide-react'

const TABS = [
  { id: 'all', label: 'Semua Event', icon: Calendar },
  { id: 'Konferensi', label: 'Konferensi', icon: Calendar },
  { id: 'Workshop', label: 'Workshop', icon: Calendar },
  { id: 'Hackathon', label: 'Hackathon', icon: Calendar },
  { id: 'Seminar', label: 'Seminar', icon: Calendar },
  { id: 'Webinar', label: 'Webinar', icon: Calendar },
]

const SORT_OPTIONS = ['Terbaru', 'Terlama']

import { container, itemVariant } from '../lib/animations'

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terbaru')

  useEffect(() => {
    api.events.getAll()
      .then(res => setEvents(Array.isArray(res) ? res : (res.data || [])))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => events
    .filter(e => activeTab === 'all' || e.category === activeTab)
    .filter(e => {
      if (!searchQuery) return true
      const s = searchQuery.toLowerCase()
      return e.title?.toLowerCase().includes(s) || e.summary?.toLowerCase().includes(s) || e.location?.toLowerCase().includes(s)
    })
    .sort((a, b) => {
      if (sortBy === 'Terlama') return new Date(a.date) - new Date(b.date)
      return new Date(b.date) - new Date(a.date)
    }), [events, activeTab, searchQuery, sortBy])

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <Breadcrumb />

          <PageHeader
            badge={
              <>
                <div className="bg-theme-card border border-theme rounded-2xl px-3 py-1"><span className="text-xs font-semibold uppercase tracking-wider">Event & Kegiatan</span></div>
                <p className="pr-3 text-xs text-theme-muted">Aktivitas</p>
              </>
            }
            title="Event & Kegiatan"
            subtitle="Ikuti berbagai event menarik untuk mengembangkan diri"
            textStyle="gradient"
          />

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
            <ExpandingSearchDock value={searchQuery} onChange={setSearchQuery} placeholder="Cari event, lokasi..." />
            <AnimatedFilterDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} icon={Filter} />
          </div>

          {/* Count */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-theme-muted text-sm">
              <span className="font-semibold text-accent">{filtered.length}</span> event ditemukan
            </p>
          </div>

          {/* Events Grid — same layout as IlkomGallery */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + sortBy} variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -12 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariant}>
                    <div className="h-64 rounded-xl bg-theme-secondary animate-pulse" />
                  </motion.div>
                ))
              ) : filtered.length === 0 ? (
                <EmptyResults
                  icon={<Calendar size={40} className="text-accent" />}
                  title="Tidak ada event yang ditemukan"
                  description="Coba ubah filter atau cari dengan kata kunci lain"
                  onReset={() => { setActiveTab('all'); setSearchQuery(''); setSortBy('Terbaru') }}
                />
              ) : (
                filtered.map((event, i) => (
                  <motion.div key={event.id || i} variants={itemVariant}>
                    <GlowCard glowColor="purple" className="rounded-2xl">
                      <EventExpandableCard event={event} />
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

export default EventsPage
