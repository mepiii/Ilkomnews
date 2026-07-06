import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Edit, Trash2, Newspaper, GripVertical } from 'lucide-react'
import { adminNews } from '../../services/adminApi'

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
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return
    const reordered = [...items]
    const [removed] = reordered.splice(draggedIndex, 1)
    reordered.splice(dropIndex, 0, removed)
    setItems(reordered)
    setDraggedIndex(null)
    try {
      await adminNews.reorder(reordered.map((item) => item.id))
    } catch {
      fetchNews()
    }
  }

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit: PAGE_SIZE }
      if (search) params.search = search
      if (status) params.status = status
      const res = await adminNews.getAll(params)
      setItems(res.data || res.news || res || [])
      setTotal(res.total || (res.data || res.news || res || []).length)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

   
  useEffect(() => { fetchNews() }, [fetchNews])

  const handleSearch = (e) => {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    next.set('search', searchInput)
    next.set('page', '1')
    setSearchParams(next)
  }

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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Berita</h1>
        <Link
          to="/admin/news/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-colors"        >
          <Plus size={16} />
          Tambah Berita
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari berita..."
            className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </form>
        <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-lg p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                status === opt.value
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center text-[var(--text-muted)] text-sm">Memuat...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper size={48} className="mx-auto text-[var(--text-muted)] mb-3 opacity-40" />
            <p className="text-[var(--text-secondary)] text-sm">Tidak ada berita ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-[var(--border-color)] text-left text-[var(--text-secondary)]">
                    <th className="px-2 py-3 w-10"></th>
                    <th className="px-5 py-3 font-medium">Judul</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Kategori</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Tanggal</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell text-right">Views</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {items.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-[var(--bg-secondary)] transition-colors ${draggedIndex === index ? 'opacity-50' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <td className="px-2 py-3 text-[var(--text-muted)] cursor-grab">
                        <GripVertical size={16} />
                      </td>
                      <td className="px-5 py-3 max-w-[250px]">
                        <span className="font-medium text-[var(--text-primary)] truncate block">{item.title}</span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell text-[var(--text-secondary)]">{item.category || '-'}</td>
                      <td className="px-5 py-3 hidden lg:table-cell text-[var(--text-secondary)]">
                        {item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-[var(--text-secondary)] text-right">{item.views ?? 0}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                        }`}>
                          {item.status === 'published' ? 'Tayang' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/news/${item.id}/edit`}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
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
              <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)]">
                  Halaman {page} dari {totalPages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 text-xs border border-[var(--border-color)] text-[var(--text-secondary)] rounded-md disabled:opacity-40 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1 text-xs border border-[var(--border-color)] text-[var(--text-secondary)] rounded-md disabled:opacity-40 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
