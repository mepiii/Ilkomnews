import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Eye, FolderOpen } from 'lucide-react'
import { adminProjects } from '../../services/adminApi'

const STATUS_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Pending' },
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

const PAGE_SIZE = 10

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const STATUS_LABELS = {
  pending: 'Pending',
  accepted: 'Diterima',
  rejected: 'Ditolak',
}

export default function ProjectsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const page = parseInt(searchParams.get('page') || '1', 10)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const category = searchParams.get('category') || ''

  const [searchInput, setSearchInput] = useState(search)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit: PAGE_SIZE }
      if (search) params.search = search
      if (status) params.status = status
      if (category) params.category = category
      const res = await adminProjects.getAll(params)
      setItems(res.data || res.projects || res || [])
      setTotal(res.total || (res.data || res.projects || res || []).length)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search, status, category])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateParam('search', searchInput)
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ilkom Gallery</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari proyek..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
          />
        </form>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('status', opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                status === opt.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

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
            <FolderOpen size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Tidak ada proyek ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Judul</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Pembuat</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Kategori</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Tanggal</th>
                    <th className="px-5 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 max-w-[250px]">
                        <span className="font-medium text-gray-900 truncate block">{item.title}</span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell text-gray-500">{item.creator_name || item.creator || '-'}</td>
                      <td className="px-5 py-3 hidden md:table-cell text-gray-500">{item.category || '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[item.status] || item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-gray-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end">
                          <Link
                            to={`/admin/projects/${item.id}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-purple-50 transition-colors"
                          >
                            <Eye size={15} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Halaman {page} dari {totalPages}</p>
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
