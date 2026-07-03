import { useCallback, useId, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Code, MessageSquare, Send, Sparkles, X, Zap, BookOpen, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const AI_AGENTS = [
  {
    id: 'wolfy',
    name: 'Wolfy (Arka Wolf)',
    role: 'ILKOM NEWS Assistant',
    avatar: '/assets/wolfy-avatar.png',
    status: 'online',
    icon: Sparkles,
    gradient: 'from-purple-500/20 to-violet-500/20',
  },
]

const FAQS = [
  { id: 1, question: "Apa itu ILKOM NEWS?", answer: "ILKOM NEWS adalah platform berita dan informasi resmi Fakultas Ilmu Komputer Universitas Sriwijaya (FASILKOM Unsri)." },
  { id: 2, question: "Bagaimana cara menavigasi website ini?", answer: "Gunakan menu navigasi di bagian atas untuk mengakses Beranda, Berita, Ilkom Gallery, dan halaman lainnya." },
  { id: 3, question: "Bagaimana cara submit proyek?", answer: "Klik tombol 'Submit Project' di bagian galeri atau halaman proyek. Isi formulir lengkap dan unggah thumbnail." },
  { id: 4, question: "Apa saja kategori proyek?", answer: "Terdapat 5 kategori: Pengembangan Web, Aplikasi Mobile, Desain UI/UX, Pengembangan Game, dan AI/Lainnya." },
  { id: 5, question: "Bagaimana cara menyimpan artikel favorit?", answer: "Klik ikon bookmark pada artikel atau proyek yang ingin Anda simpan." },
  { id: 6, question: "Apakah website ini mobile-friendly?", answer: "Ya! ILKOM NEWS dirancang responsif dan dapat diakses dari perangkat mobile, tablet, maupun desktop." },
  { id: 7, question: "Bagaimana cara mengubah tema?", answer: "Klik ikon tema (bulan/matahari) di pojok kanan atas navbar untuk beralih mode." },
  { id: 8, question: "Bagaimana menghubungi tim?", answer: "Hubungi kami melalui halaman Kontak di footer, atau gunakan fitur chat ini." },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300, staggerChildren: 0.05 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
}

const messageVariants = {
  hidden: { opacity: 0, y: 10, x: -10 },
  visible: { opacity: 1, y: 0, x: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } },
}

const GREETING = 'Halo! 🐺 Saya Wolfy (Arka Wolf), asisten virtual ILKOM NEWS. Ada yang bisa saya bantu seputar berita, galeri proyek, atau FASILKOM Sriwijaya?'

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAgent] = useState(AI_AGENTS[0].id)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `wolfy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`)
  const [activeView, setActiveView] = useState('chat')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const widgetId = useId()

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), [])
  const toggleFaq = useCallback((id) => { setExpandedFaq(prev => prev === id ? null : id) }, [])
  const currentAgent = AI_AGENTS.find((a) => a.id === selectedAgent) || AI_AGENTS[0]
  const AgentIcon = currentAgent.icon

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  const sendMessage = useCallback(async () => {
    const text = message.trim()
    if (!text || loading) return
    setMessage('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.message || 'Wolfy tidak bisa memproses pesan ini. 🐺',
      }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Wolfy mengalami gangguan koneksi. Coba lagi nanti! 🐺',
      }])
    } finally {
      setLoading(false)
    }
  }, [message, loading, sessionId])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10"
          >
            {/* Header */}
            <div className="relative border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50/30 dark:bg-neutral-800/30 p-4 overflow-hidden">
              <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', currentAgent.gradient)} />
              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm overflow-hidden bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      {currentAgent.avatar ? (
                        <img src={currentAgent.avatar} alt={currentAgent.name} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-lg">🐺</span>
                      )}
                    </div>
                    <span className={cn('absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-neutral-900', currentAgent.status === 'online' ? 'bg-emerald-500' : currentAgent.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400')} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{currentAgent.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{currentAgent.role}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 flex items-center justify-center transition-colors" aria-label="Close chat">
                  <X className="h-4 w-4 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50/30 dark:bg-neutral-800/30">
              <button onClick={() => setActiveView('chat')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeView === 'chat' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>
                <div className="flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" />Chat</div>
              </button>
              <button onClick={() => setActiveView('faq')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeView === 'faq' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>
                <div className="flex items-center justify-center gap-2"><BookOpen className="w-4 h-4" />Artikel Populer</div>
              </button>
            </div>

            {/* Chat Area */}
            {activeView === 'chat' && (
              <>
                <div className="flex h-[380px] flex-col min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-4 gap-4 bg-gradient-to-b from-white/20 to-white/40 dark:from-neutral-900/20 dark:to-neutral-900/40">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse self-end' : '')}
                    >
                      {msg.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                          {currentAgent.avatar ? (
                            <img src={currentAgent.avatar} alt={currentAgent.name} loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <AgentIcon className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                      )}
                      <div className={cn('flex flex-col gap-1', msg.role === 'user' ? 'items-end' : '')}>
                        {msg.role === 'assistant' && (
                          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{currentAgent.name}</span>
                        )}
                        <div className={cn(
                          'rounded-2xl px-4 py-2.5 text-sm shadow-sm backdrop-blur-sm border',
                          msg.role === 'user'
                            ? 'rounded-tr-none bg-purple-600 text-white border-purple-700 shadow-md'
                            : 'rounded-tl-none bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 border-neutral-200/20 dark:border-neutral-700/20'
                        )}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-neutral-500">ME</span>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                        <AgentIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="rounded-2xl rounded-tl-none bg-neutral-100/50 dark:bg-neutral-800/50 px-4 py-3 shadow-sm backdrop-blur-sm border border-neutral-200/20 dark:border-neutral-700/20 w-16 flex items-center justify-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '-0.3s' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '-0.15s' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 p-3 backdrop-blur-md">
                  <form
                    className="relative flex items-center gap-2"
                    onSubmit={(e) => { e.preventDefault(); sendMessage() }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Tanya ${currentAgent.name}...`}
                      maxLength={500}
                      className="flex-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-neutral-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/20"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || loading}
                      className="h-10 w-10 rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-purple-600/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* FAQ Area */}
            {activeView === 'faq' && (
              <div className="p-4 bg-gradient-to-b from-white/20 to-white/40 dark:from-neutral-900/20 dark:to-neutral-900/40">
                <div className="space-y-3">
                  {FAQS.map((faq) => (
                    <div key={faq.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white/30 dark:bg-neutral-800/30">
                      <button onClick={() => toggleFaq(faq.id)} className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors">
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 pr-2">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors">Lihat semua artikel</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={cn(
          'cursor-pointer group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 overflow-hidden',
          isOpen
            ? 'bg-red-500 text-white rotate-90'
            : 'bg-purple-600 text-white hover:shadow-purple-600/25'
        )}
        aria-label={isOpen ? 'Close chat' : 'Chat with Wolfy'}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-inherit opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <img src="/assets/wolfy-icon.png" alt="Wolfy" className="h-10 w-10 object-contain" />
        )}
      </motion.button>
    </div>
  )
}
