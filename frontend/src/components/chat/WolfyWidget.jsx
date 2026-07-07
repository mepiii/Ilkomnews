import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, Sparkles, MessageCircle, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useVisitorId } from '@/hooks/useVisitorId'
import { useThemeMode } from '@/hooks/useThemeMode'
import { API_BASE } from '@/services/api'

const FAQ_ITEMS = [
  { q: 'Apa itu ILKOM NEWS?', a: 'ILKOM NEWS adalah portal berita dan galeri proyek mahasiswa FASILKOM Sriwijaya University.' },
  { q: 'Bagaimana cara submit proyek?', a: 'Klik menu "Submit Proyek" di navbar, isi form lengkap, lalu tunggu review dari admin.' },
  { q: 'Apa saja kategori berita?', a: 'Berita kampus, artikel ilmiah, pengumuman event, dan info karir.' },
  { q: 'Bagaimana cara melacak proyek?', a: 'Gunakan halaman "Track Proyek" dengan tracking ID yang Anda dapat saat submit.' },
  { q: 'Siapa yang bisa submit proyek?', a: 'Mahasiswa aktif FASILKOM Sriwijaya University dari semua angkatan.' },
  { q: 'Berapa lama review proyek?', a: 'Proses review biasanya 3-7 hari kerja tergantung jumlah submission.' },
]

const WolfyWidget = () => {
  // ponytail: single state machine replaces isOpen + showChat pair
  const [view, setView] = useState('closed') // 'closed' | 'faq' | 'chat'
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])
  useEffect(() => { if (isOpen && showChat) setTimeout(() => inputRef.current?.focus(), 300) }, [isOpen, showChat])

  const startChat = () => {
    setView('chat')
    setMessages([{ role: 'assistant', content: 'Halo! 🐺 Saya Wolfy, asisten virtual ILKOM NEWS. Ada yang bisa saya bantu?' }])
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Maaf, saya tidak bisa memproses pesan ini. 🐺' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi gangguan koneksi. Coba lagi nanti! 🐺' }])
    } finally { setLoading(false) }
  }, [input, loading, sessionId, visitorId])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }, [sendMessage])

  const handleFaqClick = (item) => {
    setView('chat')
    setMessages([
      { role: 'assistant', content: 'Halo! 🐺 Saya Wolfy, asisten virtual ILKOM NEWS.' },
      { role: 'user', content: item.q },
      { role: 'assistant', content: item.a }
    ])
  }

  // Glassmorphism tokens
  const glassPanel = {
    background: isDark ? 'rgba(15,15,22,0.7)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(32px) saturate(180%)',
    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)'}`,
    boxShadow: isDark
      ? '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)'
      : '0 25px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
  }
  const glassInput = {
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
  }
  const glassFaq = {
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.5)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  }
  const textPrimary = isDark ? '#f0f0f5' : '#1a1a2e'
  const textSecondary = isDark ? '#a0a0b0' : '#666680'
  const accent = '#7c3aed'
  const accentLight = isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)'

  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Scroll to Top — above chatbot */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg cursor-pointer"
            style={{ boxShadow: 'rgba(159, 111, 255, 0.3) 0px 4px 20px' }}
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setView('faq')}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full overflow-hidden cursor-pointer"
            aria-label="Chat dengan Wolfy"
          >
            <img src="/assets/wolfy-avatar.png" alt="Wolfy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
            <div className="hidden w-full h-full items-center justify-center bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20"><span className="text-xl">🐺</span></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-4rem)] rounded-3xl flex flex-col overflow-hidden"
            style={glassPanel}
          >
            {/* Header */}
            <div className="relative px-5 py-4 overflow-hidden shrink-0" style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(124,58,237,0.85), rgba(88,28,185,0.85))'
                : 'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(99,55,180,0.9))',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              {/* Decorative shimmer */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.2), transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(168,130,255,0.15), transparent 60%)',
              }} />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-10 h-10 rounded-2xl overflow-hidden relative flex-shrink-0 ring-2 ring-white/20"
                  >
                    <img src="/assets/wolfy-avatar.png" alt="Wolfy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                    <div className="hidden w-full h-full bg-white/20 items-center justify-center"><span className="text-lg">🐺</span></div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black dark:border-white">
                      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                    </span>
                  </motion.div>
                  <div>
                    <p className="font-bold text-base text-white tracking-tight">Wolfy</p>
                    <p className="text-[11px] text-white/60 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Online sekarang
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { setView('closed'); setMessages([]); }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Tutup"
                >
                  <X size={16} className="text-white" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {!showChat ? (
                <motion.div key="faq" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="flex-1 overflow-y-auto p-5">
                  <div className="text-center mb-5">
                    <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 15 }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 overflow-hidden ring-2 ring-purple-500/20"
                      style={{ background: accentLight }}>
                      <img src="/assets/wolfy-avatar.png" alt="Wolfy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                      <div className="hidden w-full h-full items-center justify-center"><span className="text-2xl">🐺</span></div>
                    </motion.div>
                    <h3 className="text-lg font-bold mb-0.5" style={{ color: textPrimary }}>Halo! 👋</h3>
                    <p className="text-xs" style={{ color: textSecondary }}>Ada yang bisa Wolfy bantu?</p>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {FAQ_ITEMS.map((item, i) => (
                      <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
                        whileHover={{ scale: 1.015, x: 3, backgroundColor: isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFaqClick(item)}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] leading-snug transition-all duration-150 group"
                        style={glassFaq}>
                        <span className="flex items-center gap-2" style={{ color: textPrimary }}>
                          <MessageCircle size={13} className="text-[var(--accent)] opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                          {item.q}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.97 }} onClick={startChat}
                    className="w-full py-3 text-white font-semibold text-sm rounded-2xl flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                    <Sparkles size={16} />
                    Mulai Chat
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key="chat" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
                    {messages.map((msg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'assistant' && (
                          <motion.div whileHover={{ scale: 1.1 }}
                            className="w-7 h-7 rounded-xl overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-purple-500/20">
                            <img src="/assets/wolfy-avatar.png" alt="Wolfy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                            <div className="hidden w-full h-full items-center justify-center" style={{ background: accentLight }}><span className="text-xs">🐺</span></div>
                          </motion.div>
                        )}
                        <motion.div whileHover={{ scale: 1.01 }}
                          className="max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed"
                          style={{
                            background: msg.role === 'user'
                              ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                              : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
                            color: msg.role === 'user' ? '#fff' : textPrimary,
                            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            border: msg.role === 'user' ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                            backdropFilter: msg.role !== 'user' ? 'blur(8px)' : undefined,
                            WebkitBackdropFilter: msg.role !== 'user' ? 'blur(8px)' : undefined,
                          }}>
                          {msg.content}
                        </motion.div>
                        {msg.role === 'user' && (
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-[var(--accent)]/10" style={{ background: accentLight }}>
                            <User size={13} className="text-[var(--accent)]" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {loading && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 justify-start">
                        <div className="w-7 h-7 rounded-xl overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-purple-500/20">
                          <img src="/assets/wolfy-avatar.png" alt="Wolfy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                          <div className="hidden w-full h-full items-center justify-center" style={{ background: accentLight }}><span className="text-xs">🐺</span></div>
                        </div>
                        <div className="px-4 py-3 rounded-2xl" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)', borderRadius: '16px 16px 16px 4px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, backdropFilter: 'blur(8px)' }}>
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
                  <div className="px-4 py-3 shrink-0" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, background: isDark ? 'rgba(15,15,22,0.5)' : 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
                    <div className="flex gap-2 items-end">
                      <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown} placeholder="Ketik pesan..." maxLength={200}
                        className="flex-1 px-4 py-2.5 rounded-2xl text-[13px] outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/30"
                        style={{ ...glassInput, color: textPrimary }} />
                      <motion.button whileHover={{ scale: 1.08, boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.9 }} onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="w-10 h-10 text-white rounded-2xl flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-30 disabled:scale-90"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 15px rgba(124,58,237,0.25)' }}
                        aria-label="Kirim">
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
