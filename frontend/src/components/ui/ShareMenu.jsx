import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Check, Link2, MessageCircle, Send, X, Mail } from 'lucide-react'
import { buildShareLinks, safeCopy, nativeShare } from '../../lib/share'

// ponytail: static target list, no config. Add more networks here only when needed.
const TARGETS = [
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { key: 'telegram', label: 'Telegram', icon: Send, color: '#229ED9' },
  { key: 'twitter', label: 'Twitter / X', icon: X, color: '#1DA1F2' },
  { key: 'facebook', label: 'Facebook', icon: Link2, color: '#1877F2' },
  { key: 'linkedin', label: 'LinkedIn', icon: Mail, color: '#0A66C2' },
]

export function ShareMenu({ title, text, url, onShared, compact = false }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const place = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const menuW = 208
    let left = r.left + r.width / 2 - menuW / 2
    left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8))
    // Open upward; if not enough room above, open below.
    const menuH = 280
    let top = r.top - menuH - 8
    if (top < 8) top = r.bottom + 8
    setPos({ top, left })
  }

  useEffect(() => {
    if (!open) return
    place()
    const onScrollResize = () => place()
    const handler = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false)
    }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', esc)
    window.addEventListener('resize', onScrollResize)
    window.addEventListener('scroll', onScrollResize, true)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', esc)
      window.removeEventListener('resize', onScrollResize)
      window.removeEventListener('scroll', onScrollResize, true)
    }
  }, [open])

  const links = buildShareLinks({ title, text, url })

  const openTarget = (key) => {
    const href = links[key]
    if (!href) return
    window.open(href, '_blank', 'noopener,noreferrer')
    setOpen(false)
    onShared?.()
  }

  const handleCopy = async () => {
    await safeCopy(url)
    setCopied(true)
    setOpen(false)
    onShared?.()
    setTimeout(() => setCopied(false), 1500)
  }

  const handleShareClick = async () => {
    if (await nativeShare({ title, text, url })) { onShared?.(); return }
    setOpen((v) => !v)
  }

  const trigger = (
    <motion.button
      ref={triggerRef}
      onClick={(e) => { e.stopPropagation(); handleShareClick() }}
      aria-label="Share"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex items-center gap-1 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-green-500 transition-colors duration-150"
    >
      <Share2 size={compact ? 14 : 18} />
    </motion.button>
  )

  const menu = createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: 208, zIndex: 80 }}
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/30 p-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Bagikan ke
          </p>
          {TARGETS.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => openTarget(key)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left transition-colors duration-100 text-[var(--text-primary)] hover:bg-[var(--accent)]/10"
            >
              <Icon size={16} style={{ color }} className="shrink-0" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-left transition-colors duration-100 text-[var(--text-primary)] hover:bg-[var(--accent)]/10"
          >
            {copied ? <Check size={16} className="text-green-500 shrink-0" /> : <Link2 size={16} className="shrink-0" />}
            <span className="font-medium">{copied ? 'Tersalin!' : 'Salin tautan'}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )

  return (
    <>
      {trigger}
      {menu}
    </>
  )
}
