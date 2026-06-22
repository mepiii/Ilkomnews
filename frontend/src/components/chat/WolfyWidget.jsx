import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { cn } from '../../lib/utils'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const WOLFY_GREETING = {
  role: 'assistant',
  content: 'Halo! 🐺 Saya Wolfy (Arka Wolf), asisten virtual ILKOM NEWS. Ada yang bisa saya bantu seputar berita, galeri proyek, atau FASILKOM Sriwijaya?',
}

const WolfyWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WOLFY_GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `wolfy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

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
        body: JSON.stringify({ message: text, session_id: sessionId }),
      })
      const data = await res.json()

      if (res.status === 429) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || 'Terlalu banyak permintaan. Coba lagi nanti! 🐺',
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || 'Wolfy tidak bisa memproses pesan ini. 🐺',
        }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Wolfy mengalami gangguan koneksi. Coba lagi nanti! 🐺',
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, sessionId])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg shadow-purple-600/30 flex items-center justify-center transition-colors"
            aria-label="Chat with Wolfy"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-purple-600 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold">Wolfy</p>
                  <p className="text-[10px] text-white/70">Arka Wolf • ILKOM NEWS</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={14} className="text-purple-600" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-md'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-bl-md'
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={14} className="text-neutral-500" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-purple-600" />
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex gap-2 items-end">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya Wolfy..."
                  maxLength={500}
                  className="flex-1 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 text-center mt-2">
                Wolfy hanya bisa membantu seputar ILKOM NEWS & FASILKOM
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default WolfyWidget
