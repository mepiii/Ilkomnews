import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { adminNews } from '../../services/adminApi'

const INITIAL_STATE = {
  title: '',
  summary: '',
  content: '',
  category: '',
  date: '',
  author: '',
  image: '',
  tags: '',
  status: 'draft',
}

const CATEGORIES = ['Workshop', 'Kompetisi', 'Pelatihan', 'Seminar', 'Berita', 'Tutorial', 'Pembelajaran', 'Event']

export default function NewsFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_STATE)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    adminNews.getById(id)
      .then((data) => {
        const item = data.news || data
        setForm({
          title: item.title || '',
          summary: item.summary || '',
          content: item.content || '',
          category: item.category || '',
          date: item.date ? item.date.split('T')[0] : '',
          author: item.author || '',
          image: item.image || '',
          tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
          status: item.status || 'draft',
        })
      })
      .catch((err) => setServerError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Judul wajib diisi'
    if (!form.content.trim()) errs.content = 'Konten wajib diisi'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [] }
      if (isEdit) { await adminNews.update(id, payload) } else { await adminNews.create(payload) }
      navigate('/admin/news')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-[var(--text-muted)] ${
      errors[field]
        ? 'border-red-400 bg-red-50 dark:bg-red-950/30'
        : 'border-[var(--border-color)]'
    }`

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/news')}
          className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
          aria-label="Kembali ke daftar berita"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {isEdit ? 'Edit Berita' : 'Tambah Berita'}
        </h1>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm">{serverError}</div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Judul *</label>
          <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)}
            className={inputClass('title')} placeholder="Judul berita" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Ringkasan</label>
          <textarea value={form.summary} onChange={(e) => updateField('summary', e.target.value)}
            rows={3} className={inputClass('summary')} placeholder="Ringkasan singkat berita" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Konten *</label>
          <textarea value={form.content} onChange={(e) => updateField('content', e.target.value)}
            rows={10} className={inputClass('content')} placeholder="Konten lengkap berita" />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Kategori</label>
            <select value={form.category} onChange={(e) => updateField('category', e.target.value)}
              className={inputClass('category')}>
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Tanggal</label>
            <input type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)}
              className={inputClass('date')} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Penulis</label>
            <input type="text" value={form.author} onChange={(e) => updateField('author', e.target.value)}
              className={inputClass('author')} placeholder="Nama penulis" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">URL Gambar</label>
            <input type="url" value={form.image} onChange={(e) => updateField('image', e.target.value)}
              className={inputClass('image')} placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Tags</label>
          <input type="text" value={form.tags} onChange={(e) => updateField('tags', e.target.value)}
            className={inputClass('tags')} placeholder="AI, Machine Learning, Workshop" />
          <p className="text-xs text-[var(--text-muted)] mt-1">Pisahkan dengan koma</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.status === 'published'}
              onChange={(e) => updateField('status', e.target.checked ? 'published' : 'draft')}
              className="sr-only peer" />
            <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
          <span className="text-sm text-[var(--text-primary)]">
            {form.status === 'published' ? 'Tayang' : 'Draft'}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            <Save size={16} />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => navigate('/admin/news')}
            className="px-5 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
            Batal
          </button>
        </div>
      </motion.form>
    </div>
  )
}
