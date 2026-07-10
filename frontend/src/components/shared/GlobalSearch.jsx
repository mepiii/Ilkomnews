import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'

// Global command-palette style search, opened with Ctrl/Cmd+K.
// Surfaces a single "Cari" input; submitting navigates to the news search.
export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!open) return null

  const submit = () => {
    setOpen(false)
    navigate(query.trim() ? `/news?q=${encodeURIComponent(query.trim())}` : '/news')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-32 bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/[0.06] dark:border-white/[0.06] p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3">
          <Search size={18} className="text-neutral-400 shrink-0" />
          <input
            autoFocus
            placeholder="Cari berita, proyek..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            className="flex-1 bg-transparent outline-none text-sm py-2 text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
          <button
            aria-label="Tutup pencarian"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-neutral-400"
          >
            <X size={16} />
          </button>
        </div>
        <p className="px-3 pb-1 pt-2 text-[11px] text-neutral-400">
          Tekan Enter untuk mencari · Esc untuk menutup
        </p>
      </div>
    </div>
  )
}
