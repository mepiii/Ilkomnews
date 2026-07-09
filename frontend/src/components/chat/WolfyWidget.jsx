import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, MessageCircle, Sparkles, Info, Upload, Search, Newspaper, Image, Calendar, Bot, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useVisitorId } from '@/hooks/useVisitorId'
import { useThemeMode } from '@/hooks/useThemeMode'
import { API_BASE } from '@/services/api'

// Icon mapping for categories
const CATEGORY_ICONS = {
  general: Info,
  submission: Upload,
  tracking: Search,
  news: Newspaper,
  gallery: Image,
  events: Calendar,
}

// Comprehensive FAQ categories
const FAQ_CATEGORIES = [
  {
    id: 'general',
    name: 'Umum',
    questions: [
      { q: 'Apa itu ILKOM NEWS?', a: 'ILKOM NEWS adalah portal berita dan galeri proyek mahasiswa FASILKOM Sriwijaya University. Platform ini menampilkan berita kampus, artikel ilmiah, pengumuman event, dan karya proyek mahasiswa.' },
      { q: 'Siapa yang mengelola ILKOM NEWS?', a: 'ILKOM NEWS dikelola oleh tim admin FASILKOM Unsri dengan dukungan dari mahasiswa dan dosen.' },
      { q: 'Apakah ILKOM NEWS gratis?', a: 'Ya, semua konten di ILKOM NEWS dapat diakses secara gratis oleh mahasiswa, dosen, dan masyarakat umum.' },
    ]
  },
  {
    id: 'submission',
    name: 'Submit Proyek',
    questions: [
      { q: 'Bagaimana cara submit proyek?', a: 'Klik menu "Submit Proyek" di navbar, isi form lengkap dengan judul, deskripsi, kategori, tech stack, dan upload thumbnail. Setelah itu tunggu review dari admin selama 3-7 hari kerja.' },
      { q: 'Siapa yang bisa submit proyek?', a: 'Mahasiswa aktif FASILKOM Sriwijaya University dari semua angkatan dan program studi dapat submit proyek.' },
      { q: 'Apa saja kategori proyek?', a: 'Kategori proyek meliputi: Web Development, Mobile App, UI/UX Design, Game Development, dan AI/Machine Learning.' },
      { q: 'Berapa lama proses review?', a: 'Proses review biasanya membutuhkan waktu 3-7 hari kerja tergantung jumlah submission yang masuk.' },
      { q: 'Bagaimana jika proyek ditolak?', a: 'Admin akan memberikan alasan penolakan. Anda dapat memperbaiki dan mengajukan ulang proyek tersebut.' },
      { q: 'Apakah proyek kelompok bisa di-submit?', a: 'Ya, proyek kelompok bisa di-submit dengan mencantumkan nama seluruh anggota tim.' },
    ]
  },
  {
    id: 'tracking',
    name: 'Lacak Proyek',
    questions: [
      { q: 'Bagaimana cara melacak proyek?', a: 'Gunakan halaman "Track Proyek" dengan memasukkan tracking ID yang Anda dapat saat submit. Status proyek akan ditampilkan di sana.' },
      { q: 'Di mana saya mendapat tracking ID?', a: 'Tracking ID akan ditampilkan setelah Anda berhasil submit proyek. Simpan ID tersebut untuk melacak status proyek Anda.' },
      { q: 'Apa saja status proyek?', a: 'Status proyek: Pending (menunggu review), Accepted (diterima), Rejected (ditolak dengan alasan).' },
    ]
  },
  {
    id: 'news',
    name: 'Berita',
    questions: [
      { q: 'Apa saja kategori berita?', a: 'Kategori berita meliputi: Workshop, Kompetisi, Pelatihan, dan Seminar. Setiap kategori memiliki konten relevan untuk mahasiswa.' },
      { q: 'Bagaimana cara mencari berita?', a: 'Gunakan fitur pencarian di halaman Berita atau filter berdasarkan kategori untuk menemukan berita yang Anda cari.' },
      { q: 'Apakah bisa save berita?', a: 'Ya, klik ikon bookmark pada berita untuk menyimpannya. Akses berita tersimpan di menu "Koleksi".' },
    ]
  },
  {
    id: 'gallery',
    name: 'Ilkom Gallery',
    questions: [
      { q: 'Apa itu Ilkom Gallery?', a: 'Ilkom Gallery adalah galeri karya proyek mahasiswa FASILKOM yang telah disetujui oleh admin. Berisi proyek dari berbagai kategori.' },
      { q: 'Bagaimana cara melihat detail proyek?', a: 'Klik pada kartu proyek untuk melihat detail lengkap termasuk deskripsi, tech stack, dan tim pembuat.' },
      { q: 'Apakah bisa save proyek?', a: 'Ya, klik ikon bookmark pada proyek untuk menyimpannya ke koleksi pribadi Anda.' },
    ]
  },
  {
    id: 'events',
    name: 'Event',
    questions: [
      { q: 'Event apa saja yang ada di ILKOM NEWS?', a: 'Event meliputi workshop, seminar, hackathon, bootcamp, dan kegiatan akademik lainnya yang diadakan oleh FASILKOM atau partner.' },
      { q: 'Bagaimana cara mendaftar event?', a: 'Klik pada event yang diinginkan untuk melihat detail dan informasi pendaftaran. Ikuti petunjuk yang diberikan.' },
      { q: 'Apakah event gratis?', a: 'Sebagian event gratis, beberapa ada yang berbayar dengan harga terjangkau. Informasi harga tersedia di detail event.' },
    ]
  },
]

// Text animation variants
const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: 'easeOut' }
  })
}

const WolfyWidget = () => {
  const [view, setView] = useState('closed') // 'closed' | 'faq' | 'chat'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `wolfy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const visitorId = useVisitorId()
  const isDark = useThemeMode()

  const isOpen = view !== 'closed'
  const showChat = view === 'chat'

  const accent = 'rgb(124, 58, 237)'
  const accentLight = 'rgba(124, 58, 237, 0.15)'
  const textPrimary = isDark ? '#e8e8e8' : '#111827'
  const textSecondary = isDark ? '#a0a0a0' : '#374151'

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])
  useEffect(() => { if (isOpen && showChat) setTimeout(() => inputRef.current?.focus(), 300) }, [isOpen, showChat])

  const startChat = () => {
    setView('chat')
    setMessages([{ role: 'assistant', content: 'Halo! Saya Wolfy, asisten virtual ILKOM NEWS. Ada yang bisa saya bantu? Silakan ketik pertanyaan Anda.' }])
  }

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId, device_id: visitorId }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Maaf, saya tidak bisa memproses pesan ini.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi gangguan koneksi. Coba lagi nanti!' }])
    } finally { setLoading(false) }
  }, [input, loading, sessionId, visitorId])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }, [sendMessage])

  const handleFaqClick = (item) => {
    setView('chat')
    setMessages([
      { role: 'assistant', content: 'Halo! Saya Wolfy, asisten virtual ILKOM NEWS.' },
      { role: 'user', content: item.q },
      { role: 'assistant', content: item.a }
    ])
  }

  // Glassmorphism tokens
  const glassPanel = {
    background: isDark ? 'rgba(15, 15, 15, 0.92)' : 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
  }

  const glassInput = {
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
  }

  return (
    <>
      {/* Floating Button - Circular, no square */}
      <motion.button
        onClick={() => setView('faq')}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300",
          isOpen && "opacity-0 pointer-events-none scale-90"
        )}
        style={{ background: `linear-gradient(135deg, ${accent}, #6d28d9)` }}
      >
        <img 
          src="/assets/wolfy-avatar.png" 
          alt="Wolfy" 
          className="w-11 h-11 rounded-full object-cover"
          onError={(e) => { 
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <Bot size={28} className="hidden text-white" />
      </motion.button>

      {/* FAQ/Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl"
            style={glassPanel}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-purple-500/20 flex items-center justify-center">
                  <img 
                    src="/assets/wolfy-avatar.png" 
                    alt="Wolfy" 
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <Bot size={18} className="hidden text-purple-500" />
                </div>
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-semibold text-sm font-heading"
                    style={{ color: textPrimary }}
                  >
                    Wolfy
                  </motion.h3>
                  <p className="text-[10px]" style={{ color: textSecondary }}>Asisten Virtual ILKOM</p>
                </div>
              </div>
              <button
                onClick={() => { setView('closed'); setSelectedCategory(null); }}
                className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <X size={18} style={{ color: textSecondary }} />
              </button>
            </div>

            {/* FAQ View */}
            <AnimatePresence mode="wait">
              {!showChat && (
                <motion.div
                  key="faq"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-h-[500px] overflow-y-auto"
                >
                  {!selectedCategory ? (
                    <div className="p-4">
                      <motion.p 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mb-3 font-medium"
                        style={{ color: textSecondary }}
                      >
                        Pilih kategori atau ketik pertanyaan:
                      </motion.p>
                      <div className="space-y-2">
                        {FAQ_CATEGORIES.map((cat, catIndex) => {
                          const IconComponent = CATEGORY_ICONS[cat.id]
                          return (
                            <motion.button
                              key={cat.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: catIndex * 0.05 }}
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setSelectedCategory(cat.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group"
                              style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                            >
                              <span className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ background: accentLight }}>
                                {IconComponent && <IconComponent size={14} style={{ color: accent }} />}
                              </span>
                              <span className="text-sm font-medium flex-1 text-left font-body" style={{ color: textPrimary }}>
                                {cat.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: textSecondary }}>
                                {cat.questions.length}
                              </span>
                              <ChevronRight size={14} style={{ color: textSecondary }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          )
                        })}
                      </div>
                      
                      {/* Chat with AI button */}
                      <div className="mt-4 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                        <motion.button
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          onClick={startChat}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium transition-all"
                          style={{ background: `linear-gradient(135deg, ${accent}, #6d28d9)` }}
                        >
                          <Bot size={16} />
                          Tanya ke AI Chat
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-1 text-xs mb-3 hover:underline"
                        style={{ color: accent }}
                      >
                        ← Kembali ke kategori
                      </button>
                      <div className="flex items-center gap-2 mb-3">
                        {(() => {
                          const IconComponent = CATEGORY_ICONS[selectedCategory]
                          return IconComponent ? (
                            <span className="w-5 h-5 flex items-center justify-center rounded-md" style={{ background: accentLight }}>
                              <IconComponent size={12} style={{ color: accent }} />
                            </span>
                          ) : null
                        })()}
                        <motion.h4 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="font-semibold text-sm font-heading"
                          style={{ color: textPrimary }}
                        >
                          {FAQ_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                        </motion.h4>
                      </div>
                      <div className="space-y-2">
                        {FAQ_CATEGORIES.find(c => c.id === selectedCategory)?.questions.map((item, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.01, x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleFaqClick(item)}
                            className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors"
                            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: textPrimary }}
                          >
                            {item.q}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Chat View */}
              {showChat && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col"
                  style={{ height: 440 }}
                >
                  {/* Back to FAQ */}
                  <div className="px-4 py-2 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                    <button
                      onClick={() => { setView('faq'); setSelectedCategory(null); }}
                      className="flex items-center gap-1 text-xs hover:underline"
                      style={{ color: accent }}
                    >
                      ← Kembali ke FAQ
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex gap-2", msg.role === 'user' ? "justify-end" : "justify-start")}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-purple-500/20 flex items-center justify-center">
                            <img src="/assets/wolfy-avatar.png" alt="Wolfy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                            <Bot size={14} className="hidden text-purple-500" />
                          </div>
                        )}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed"
                          style={{
                            background: msg.role === 'user'
                              ? `linear-gradient(135deg, ${accent}, #6d28d9)`
                              : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
                            color: msg.role === 'user' ? '#fff' : textPrimary,
                            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            border: msg.role === 'user' ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                          }}
                        >
                          {msg.content.split('').map((char, charIndex) => (
                            <motion.span
                              key={charIndex}
                              custom={charIndex}
                              variants={textVariants}
                              initial="hidden"
                              animate="visible"
                              style={{ display: 'inline' }}
                            >
                              {char}
                            </motion.span>
                          ))}
                        </motion.div>
                        {msg.role === 'user' && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-purple-500/10" style={{ background: accentLight }}>
                            <User size={13} style={{ color: accent }} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {loading && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 justify-start">
                        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-purple-500/20 flex items-center justify-center">
                          <img src="/assets/wolfy-avatar.png" alt="Wolfy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                          <Bot size={14} className="hidden text-purple-500" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)', borderRadius: '16px 16px 16px 4px' }}>
                          <div className="flex gap-1.5 items-center h-4">
                            {[0, 0.2, 0.4].map((delay, i) => (
                              <motion.span key={i} animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' }}
                                className="w-[6px] h-[6px] rounded-full" style={{ background: accent }} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="px-4 py-3 shrink-0" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}` }}>
                    <div className="flex gap-2 items-end">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ketik pesan..."
                        maxLength={200}
                        className="flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/30 font-body"
                        style={{ ...glassInput, color: textPrimary }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.08, boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="w-10 h-10 text-white rounded-full flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-30 disabled:scale-90"
                        style={{ background: `linear-gradient(135deg, ${accent}, #6d28d9)`, boxShadow: '0 4px 15px rgba(124,58,237,0.25)' }}
                      >
                        <Send size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default WolfyWidget
