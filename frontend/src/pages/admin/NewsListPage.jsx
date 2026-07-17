import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Edit, Trash2, Newspaper, RefreshCw } from 'lucide-react'
import { adminNews } from '../../services/adminApi'
import { REQUEST_TIMEOUT_MS } from '../../services/api'
import ErrorState from '../../components/admin/ui/ErrorState'
import { ADMIN_BASE } from '../../config/admin'
import { springPreset, useReducedMotionSafe } from '../../lib/animations'

const ADMIN_NEWS = `/${ADMIN_BASE}/news`

const STATUS_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'published', label: 'Tayang' },
  { value: 'draft', label: 'Draft' },
]

const PAGE_SIZE = 10

export default function NewsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const page = parseInt(searchParams.get('page') || '1', 10)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  const [searchInput, setSearchInput] = useState(search)
  const [backgroundLoading, setBackgroundLoading] = useState(false)
  const abortRef = useRef(null)
  const isFirstLoad = useRef(true)
  const debounceRef = useRef(null)
  const reduce = useReducedMotionSafe()

  const fetchNews = useCallback(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (isFirstLoad.current) {
      setLoading(true)
    } else {
      setBackgroundLoading(true)
    }
    setError('')

    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    const params = { page, limit: PAGE_SIZE }
    if (search) params.search = search
    if (status) params.status = status

    adminNews.getAll(params, { signal: controller.signal })
      .then(res => {
        const data = res.data || res.news || res || []
        setItems(Array.isArray(data) ? data : [])
        setTotal(res.total || (Array.isArray(data) ? data.length : 0))
        isFirstLoad.current = false
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Gagal memuat berita')
      })
      .finally(() => {
        clearTimeout(timeout)
        setLoading(false)
        setBackgroundLoading(false)
      })
  }, [page, search, status])

   
  useEffect(() => { fetchNews(); return () => abortRef.current?.abort() }, [fetchNews])

  const handleStatusFilter = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('status', value)
    else next.delete('status')
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus berita "${title}"?`)) return
    try {
      await adminNews.delete(id)
      fetchNews()
    } catch (err) {
      alert('Gagal menghapus: ' + err.message)
    }
  }

  const handleToggleHidden = async (id) => {
    try {
      const res = await adminNews.toggleHidden(id)
      // Use the authoritative published flag from the API, not a local flip.
      const published = res?.data?.published
      setItems((prev) => prev.map((item) =>
        item.id === id ? { ...item, published: published ?? !item.published } : item
      ))
    } catch (err) {
      alert('Gagal mengubah status: ' + err.message)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  return (
    <motion.div
      className="space-y-6"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : springPreset}
    >
      {/* Header */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : springPreset}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Berita</h1>
        <Link
          to={`${ADMIN_NEWS}/create`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors"        >
          <Plus size={16} />
          Tambah Berita
        </Link>
      </motion.div>

      {/* Background loading */}
      {backgroundLoading && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-3 h-3 border border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin" />
          Memperbarui...
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between gap-2">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchNews}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-200 transition-colors"
          >
            <RefreshCw size={12} /> Muat ulang
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              const val = e.target.value
              setSearchInput(val)
              clearTimeout(debounceRef.current)
              debounceRef.current = setTimeout(() => {
                const next = new URLSearchParams(searchParams)
                if (val) next.set('search', val); else next.delete('search')
                next.set('page', '1')
                setSearchParams(next)
              }, 500)
            }}
            placeholder="Cari berita..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-[#141414] rounded-lg p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                status === opt.value
                  ? 'bg-white dark:bg-[#262626] text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <ErrorState message={error} onRetry={() => { setError(''); setLoading(true); fetchNews() }} />
      )}

      {/* Table */}
      <div className="bg-gray-50 dark:bg-[#141414] rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">Memuat...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3 opacity-40" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Tidak ada berita ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-800 text-left text-gray-500 dark:text-gray-400">
                    <th className="px-5 py-3 font-medium">Judul</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Pembuat</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Kategori</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Tanggal</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell text-right">Views</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-5 py-3 max-w-[250px]">
                        {(() => {
                          const thumb = item.image_url || (item.image ? (item.image.startsWith('http') ? item.image : '/storage/' + item.image) : null)
                          return (
                            <div className="flex items-center gap-3">
                              {thumb ? (
                                <img src={thumb} alt={item.title} className="w-16 h-10 rounded-lg object-cover bg-gray-200 dark:bg-neutral-800 shrink-0" />
                              ) : (
                                <div className="w-16 h-10 rounded-lg bg-gray-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                  <Newspaper size={16} className="text-gray-300 dark:text-gray-600" />
                                </div>
                              )}
                              <span className="font-medium text-gray-900 dark:text-gray-100 truncate block">{item.title}</span>
                            </div>
                          )
                        })()}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        {(() => {
                          const authorAvatar = item.author_image_url || (item.author_image ? (item.author_image.startsWith('http') ? item.author_image : '/storage/' + item.author_image) : null)
                          return (
                            <div className="flex items-center gap-2">
                              {authorAvatar ? (
                                <img src={authorAvatar} alt={item.author || 'Penulis'} className="avatar-sm object-cover bg-gray-200 dark:bg-neutral-800" />
                              ) : (
                                <div className="avatar-sm bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-semibold">
                                  {(item.author || '?').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="text-gray-700 dark:text-gray-300 truncate">{item.author || '—'}</span>
                            </div>
                          )
                        })()}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell text-gray-500 dark:text-gray-400">{item.category || '-'}</td>
                      <td className="px-5 py-3 hidden lg:table-cell text-gray-500 dark:text-gray-400">
                        {item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-gray-500 dark:text-gray-400 text-right">{item.views ?? 0}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleToggleHidden(item.id)}
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${
                            item.published
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {item.published ? 'Tayang' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`${ADMIN_NEWS}/${item.id}/edit`}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-neutral-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Halaman {page} dari {totalPages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 text-xs border border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-gray-400 rounded-md disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1 text-xs border border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-gray-400 rounded-md disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
