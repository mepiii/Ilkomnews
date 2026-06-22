import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Globe, Smartphone, Palette, Gamepad2, Sparkles } from 'lucide-react'
import { AnimatedText } from '../ui/AnimatedText'
import { FlowButton } from '../ui/FlowButton'
import { SmoothTabs } from '../ui/SmoothTabs'

const TABS = [
  { id: 'web', label: 'Web Development', icon: Globe },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
  { id: 'uiux', label: 'Desain UI/UX', icon: Palette },
  { id: 'game', label: 'Game Development', icon: Gamepad2 },
  { id: 'ai', label: 'AI / Lainnya', icon: Sparkles },
]

const PREVIEWS = {
  web: [
    { title: 'SISTEM ABSENSI QR CODE', creator: 'Dimas Prayoga', angkatan: 2020, desc: 'Sistem absensi otomatis menggunakan QR Code untuk kantor.', badge: 'Web Project', badgeColor: '#3B82F6', thumb: 'https://placehold.co/800x500/3B82F6/white?text=Absensi' },
    { title: 'E-COMMERCE UMKM BATIK', creator: 'Siti Aisyah', angkatan: 2020, desc: 'Platform e-commerce untuk UMKM batik lokal.', badge: 'Web Project', badgeColor: '#3B82F6', thumb: 'https://placehold.co/800x500/10B981/white?text=Batik+Shop' },
    { title: 'PERPUSTAKAAN DIGITAL', creator: 'Rizki Ramadhan', angkatan: 2020, desc: 'Sistem manajemen perpustakaan digital.', badge: 'Web Project', badgeColor: '#3B82F6', thumb: 'https://placehold.co/800x500/8B5CF6/white?text=Library' },
  ],
  mobile: [
    { title: 'ILKOM EATS - FOOD DELIVERY', creator: 'Rizki Ramadhan', angkatan: 2020, desc: 'Aplikasi pemesanan makanan untuk kantin kampus dengan fitur tracking real-time.', badge: 'Mobile App', badgeColor: '#EF4444', thumb: 'https://placehold.co/800x500/EF4444/white?text=Food+App' },
    { title: 'BANK SAMPAH DIGITAL', creator: 'Putri Wulandari', angkatan: 2021, desc: 'Aplikasi manajemen bank sampah dengan sistem poin dan penjadwalan penjemputan.', badge: 'Mobile App', badgeColor: '#10B981', thumb: 'https://placehold.co/800x500/10B981/white?text=Bank+Sampah' },
    { title: 'ILKOM FIT - HEALTH TRACKER', creator: 'Budi Santoso', angkatan: 2021, desc: 'Aplikasi kesehatan untuk tracking aktivitas harian mahasiswa.', badge: 'Mobile App', badgeColor: '#8B5CF6', thumb: 'https://placehold.co/800x500/8B5CF6/white?text=Health' },
  ],
  uiux: [
    { title: 'MOBILE BANKING APP REDESIGN', creator: 'Dewi Sartika', angkatan: 2021, desc: 'Redesign aplikasi mobile banking dengan pendekatan user-centered design.', badge: 'UI/UX Design', badgeColor: '#3B82F6', thumb: 'https://placehold.co/800x500/3B82F6/white?text=Banking+UI' },
    { title: 'E-LEARNING PLATFORM DESIGN', creator: 'Andi Wijaya', angkatan: 2020, desc: 'UI/UX design untuk platform e-learning dengan interactive dashboard.', badge: 'UI/UX Design', badgeColor: '#8B5CF6', thumb: 'https://placehold.co/800x500/8B5CF6/white?text=E-Learning' },
    { title: 'HEALTHCARE APP INTERFACE', creator: 'Nadia Putri', angkatan: 2021, desc: 'Desain interface untuk aplikasi konsultasi dokter online.', badge: 'UI/UX Design', badgeColor: '#10B981', thumb: 'https://placehold.co/800x500/10B981/white?text=Healthcare' },
  ],
  game: [
    { title: 'KAMPUS ADVENTURE', creator: 'Budi Santoso', angkatan: 2021, desc: 'Game petualangan berlatar kampus UNSRI.', badge: 'Game Project', badgeColor: '#EF4444', thumb: 'https://placehold.co/800x500/EF4444/white?text=Runner' },
    { title: 'ILKOM MEMORY', creator: 'Citra Lestari', angkatan: 2021, desc: 'Game puzzle matching untuk mengasah memori.', badge: 'Game Project', badgeColor: '#8B5CF6', thumb: 'https://placehold.co/800x500/8B5CF6/white?text=Puzzle' },
    { title: 'GALAXY DEFENSE', creator: 'Rizki Pratama', angkatan: 2020, desc: 'Game strategi pertahanan galaksi.', badge: 'Game Project', badgeColor: '#F97316', thumb: 'https://placehold.co/800x500/F97316/white?text=Shooter' },
  ],
  ai: [
    { title: 'PLANT DISEASE CLASSIFIER', creator: 'Andi Wijaya', angkatan: 2019, desc: 'Sistem klasifikasi penyakit tanaman menggunakan CNN.', badge: 'AI Project', badgeColor: '#3B82F6', thumb: 'https://placehold.co/800x500/3B82F6/white?text=AI+CNN' },
    { title: 'ACADEMIC CHATBOT', creator: 'Sarah Amelia', angkatan: 2020, desc: 'Chatbot AI untuk membantu mahasiswa mendapatkan informasi akademik.', badge: 'AI Project', badgeColor: '#10B981', thumb: 'https://placehold.co/800x500/10B981/white?text=Chatbot' },
    { title: 'SENTIMENT ANALYSIS', creator: 'M. Farhan', angkatan: 2021, desc: 'Analisis sentimen untuk review produk e-commerce menggunakan NLP.', badge: 'AI Project', badgeColor: '#8B5CF6', thumb: 'https://placehold.co/800x500/8B5CF6/white?text=NLP' },
  ],
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const IlkomGallery = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const items = PREVIEWS[activeTab] || []

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Proyek Mahasiswa</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-header">
            <span style={{ color: 'var(--text-primary)' }}><AnimatedText>ILKOM </AnimatedText></span>
            <span style={{ color: 'var(--accent)' }}><AnimatedText delay={0.1}>Gallery</AnimatedText></span>
          </h2>
          <div className="w-12 h-0.5 mx-auto rounded-full mb-4" style={{ background: 'var(--accent)' }} />
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            Galeri karya dan proyek mahasiswa Fakultas Ilmu Komputer
          </p>
        </motion.div>

        {/* Tab Navigation — smooth tabs */}
        <div className="flex justify-center mb-8">
          <SmoothTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Grid — 2-col matching gallery page cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((project, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                className="group rounded-2xl overflow-hidden relative"
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                {/* Thumbnail with overlay */}
                <div className="relative h-56 overflow-hidden">
                  <img src={project.thumb} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Badge top-left */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-white text-xs font-medium rounded-full backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      {project.badge}
                    </span>
                  </div>
                  {/* Arrow button bottom-right */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <motion.div
                      className="w-8 h-8 flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white"
                      whileHover={{ scale: 1.15, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold line-clamp-1 mb-1 font-header" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    <span>{project.creator}</span>
                    <span>•</span>
                    <span>Angkatan {project.angkatan}</span>
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link to="/ilkomgallery">
            <FlowButton text="Jelajahi Semua Proyek" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default IlkomGallery
