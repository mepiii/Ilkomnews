import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Eye, Trash2, FolderOpen, RefreshCw } from 'lucide-react'
import { adminProjects } from '../../services/adminApi'
import StatusBadge from '../../components/admin/ui/StatusBadge'
import ErrorState from '../../components/admin/ui/ErrorState'

const STATUS_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'accepted', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'Semua Kategori' },
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'game', label: 'Game' },
  { value: 'ai', label: 'AI/ML' },
  { value: 'uiux', label: 'UI/UX' },
]

const CATEGORY_LABELS = Object.fromEntries(CATEGORY_OPTIONS.filter(o => o.value).map(o => [o.value, o.label]))

const PAGE_SIZE = 10

export default function ProjectsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [backgroundLoading, setBackgroundLoading] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef(null)
  const isFirstLoad = useRef(true)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const category = searchParams.get('category') || ''
  const [searchInput, setSearchInput] = useState(search)

  // Debounce: sync searchInput → URL param after 500ms
  const debounceRef = useRef(null)
  const handleSearchInputChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam('search', val)
    }, 500)
  }

  const fetchProjects = useCallback(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (isFirstLoad.current) {
      setLoading(true)
    } else {
      setBackgroundLoading(true)
    }
    setError('')

    const timeout = setTimeout(() => controller.abort(), 10000)
    const params = { page, limit: PAGE_SIZE }
    if (search) params.search = search
    if (status) params.status = status
    if (category) params.category = category

    adminProjects.getAll(params, { signal: controller.signal })
      .then(res => {
        const data = res.data || res.projects || res || []
        setItems(Array.isArray(data) ? data : [])
        setTotal(res.total || (Array.isArray(data) ? data.length : 0))
        isFirstLoad.current = false
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Gagal memuat data')
      })
      .finally(() => {
        clearTimeout(timeout)
        setLoading(false)
        setBackgroundLoading(false)
      })
  }, [page, search, status, category])

  useEffect(() => {
    fetchProjects()
    return () => abortRef.current?.abort()
  }, [fetchProjects])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus proyek "${title}"?`)) return
    try {
      await adminProjects.delete(id)
      fetchProjects()
    } catch (err) {
      alert('Gagal menghapus: ' + err.message)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  if (error && isFirstLoad.current) {
    return <ErrorState message={error} onRetry={fetchProjects} />
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ilkom Gallery</h1>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <div className="w-full relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Cari proyek..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-1 bg-gray-100 dark:bg-[#141414] rounded-lg p-1 overflow-x-auto">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParam('status', opt.value)}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  status === opt.value
                    ? 'bg-white dark:bg-[#262626] text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <select
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
            className="px-2 sm:px-3 py-2 border border-gray-200 dark:border-[#262626] bg-white dark:bg-[#0a0a0a] text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors"
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error banner (non-fatal) */}
      {error && !isFirstLoad.current && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between gap-2">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchProjects}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-200 transition-colors"
          >
            <RefreshCw size={12} /> Muat ulang
          </button>
        </div>
      )}

      {/* Background loading */}
      {backgroundLoading && (
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <div className="w-3 h-3 border border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin" />
          Memperbarui...
        </div>
      )}

      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#262626] overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
            <FolderOpen size={32} className="mx-auto mb-2 opacity-40" />
            Tidak ada proyek ditemukan
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-gray-200 dark:border-[#262626] text-gray-400 dark:text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Proyek</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Pembuat</th>
                    <th className="px-5 py-3 font-medium hidden sm:table-cell">Kategori</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Tanggal</th>
                    <th className="px-5 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-5 py-3 max-w-[250px]">
                        <div className="flex items-center gap-2">
                          {item.thumbnail_url || item.thumbnail ? (
                            <img
                              src={item.thumbnail_url || item.thumbnail}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.style && (e.target.nextSibling.style.display = 'flex') }}
                            />
                          ) : null}
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] shrink-0 hidden sm:flex items-center justify-center" style={{ display: (item.thumbnail_url || item.thumbnail) ? 'none' : undefined }}>
                            <FolderOpen size={16} className="text-gray-400 dark:text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {item.creator_avatar_url || item.creator_avatar ? (
                            <img
                              src={item.creator_avatar_url || item.creator_avatar}
                              alt={item.creator_name || ''}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#262626] flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400 shrink-0">
                              {(item.creator_name || item.creator || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{item.creator_name || item.creator || '-'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell text-gray-500 dark:text-gray-400 text-sm">{CATEGORY_LABELS[item.category] || item.category || '-'}</td>
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3 hidden lg:table-cell text-gray-500 dark:text-gray-400 text-sm">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/projects/${item.id}`}
                            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                            aria-label={`Lihat detail ${item.title}`}
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            aria-label={`Hapus ${item.title}`}
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-[#262626]">
                <p className="text-xs text-gray-400 dark:text-gray-500">Halaman {page} dari {totalPages}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 text-xs border border-gray-200 dark:border-[#262626] text-gray-500 dark:text-gray-400 rounded-md disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1 text-xs border border-gray-200 dark:border-[#262626] text-gray-500 dark:text-gray-400 rounded-md disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
