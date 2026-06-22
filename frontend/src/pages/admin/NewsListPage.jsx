import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Edit, Trash2, Newspaper } from 'lucide-react'
import { adminNews } from '../../services/adminApi'

const STATUS_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'published', label: 'Published' },
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
        <h1 className="text-2xl font-bold text-gray-900">Berita</h1>
        <Link
          to="/admin/news/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Tambah Berita
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari berita..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
          />
        </form>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                status === opt.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Memuat...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Tidak ada berita ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Judul</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Kategori</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Tanggal</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell text-right">Views</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 max-w-[250px]">
                        <span className="font-medium text-gray-900 truncate block">{item.title}</span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell text-gray-500">{item.category || '-'}</td>
                      <td className="px-5 py-3 hidden lg:table-cell text-gray-500">
                        {item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-gray-500 text-right">{item.views ?? 0}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/news/${item.id}/edit`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-purple-50 transition-colors"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Halaman {page} dari {totalPages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
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
