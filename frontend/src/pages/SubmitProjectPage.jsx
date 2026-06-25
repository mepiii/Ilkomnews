import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Upload, CheckCircle, Copy, ExternalLink, Plus, X, Globe, Smartphone, Palette, Gamepad2, Cpu, Image as ImageIcon } from 'lucide-react'
import { GlowCard } from '../components/ui/GlowCard'
import Breadcrumb from '../components/common/Breadcrumb'
import { PageHeader } from '../components/ui/PageHeader'
const CATEGORIES = [
  { id: 'web', label: 'Pengembangan Web', icon: Globe },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
  { id: 'uiux', label: 'Desain UI/UX', icon: Palette },
  { id: 'game', label: 'Pengembangan Game', icon: Gamepad2 },
  { id: 'ai', label: 'AI / Lainnya', icon: Cpu },
]

const MAJORS = [
  'S1 Teknik Informatika', 'S1 Sistem Informasi', 'S1 Sistem Komputer',
  'D3 Manajemen Informatika', 'D3 Komputerisasi Akuntansi', 'D3 Teknik Komputer',
]

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const baseForm = {
  title: '', category: 'web', description: '', thumbnail: '', thumbnailFile: null,
  creator_name: '', creator_nim: '', creator_major: MAJORS[0], creator_year: 2024,
  collaborators: [],
}

// Platform dropdown options
const PLATFORM_OPTIONS = [
  'Android', 'iOS', 'Android & iOS', 'Web', 'PC', 'PC & Mobile', 'Cross-Platform'
]

// Tech stack dropdown options per category
const TECH_STACK_OPTIONS = {
  web: ['React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Svelte', 'Angular', 'Node.js', 'Express.js', 'Laravel', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Tailwind CSS', 'Bootstrap', 'TypeScript', 'GraphQL', 'REST API', 'Docker'],
  mobile: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Dart', 'Firebase', 'Supabase', 'SQLite', 'Realm', 'GetX', 'Provider', 'BLoC', 'GetX', 'Jetpack Compose', 'SwiftUI'],
  uiux: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision', 'Miro', 'FigJam', 'Canva', 'Zeplin'],
  game: ['Unity', 'Unreal Engine', 'Godot', 'Cocos2d', 'Phaser', 'Pygame', 'GameMaker', 'RPG Maker', 'Blender', 'Aseprite'],
  ai: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'Hugging Face', 'LangChain', 'OpenAI API', 'Gemini API', 'React', 'FastAPI', 'Flask', 'Jupyter Notebook'],
}

// Category-specific fields (all optional) — tech_stack handled separately as tags
const categoryFields = {
  web: [
    { key: 'live_demo', label: 'URL Demo Langsung', placeholder: 'https://...', type: 'url', optional: true },
    { key: 'github_link', label: 'URL GitHub', placeholder: 'https://github.com/...', type: 'url', optional: true },
  ],
  mobile: [
    { key: 'platform', label: 'Platform', type: 'select', options: PLATFORM_OPTIONS, optional: true },
    { key: 'download_link', label: 'URL Unduh / Play Store', placeholder: 'https://...', type: 'url', optional: true },
    { key: 'github_link', label: 'URL GitHub', placeholder: 'https://github.com/...', type: 'url', optional: true },
  ],
  uiux: [
    { key: 'figma_link', label: 'Link Figma', placeholder: 'https://figma.com/...', type: 'url', optional: true },
  ],
  game: [
    { key: 'platform', label: 'Platform', type: 'select', options: PLATFORM_OPTIONS, optional: true },
    { key: 'github_link', label: 'URL GitHub', placeholder: 'https://github.com/...', type: 'url', optional: true },
    { key: 'download_link', label: 'Link Unduh', placeholder: 'https://...', type: 'url', optional: true },
  ],
  ai: [
    { key: 'github_link', label: 'URL GitHub', placeholder: 'https://github.com/...', type: 'url', optional: true },
    { key: 'live_demo', label: 'URL Demo', placeholder: 'https://...', type: 'url', optional: true },
  ],
}

const inputCls = "w-full px-4 py-2.5 bg-theme-secondary border border-theme rounded-xl text-sm text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
const labelCls = "block text-sm font-semibold text-theme-muted mb-1.5"

const SubmitProjectPage = () => {
  const [form, setForm] = useState({ ...baseForm, category: 'web' })
  const [extraFields, setExtraFields] = useState({})
  const [techStackTags, setTechStackTags] = useState([])
  const [techInput, setTechInput] = useState('')
  const [collabName, setCollabName] = useState('')
  const [collabNim, setCollabNim] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const updateExtra = (field, value) => setExtraFields(prev => ({ ...prev, [field]: value }))

  const addTechTag = () => {
    const trimmed = techInput.trim()
    if (trimmed && !techStackTags.includes(trimmed)) {
      setTechStackTags(prev => [...prev, trimmed]);
      setTechInput('')
    }
  }
  const removeTechTag = (idx) => setTechStackTags(prev => prev.filter((_, i) => i !== idx))

  const addCollab = () => { if (collabName.trim()) { update('collaborators', [...form.collaborators, { name: collabName.trim(), nim: collabNim.trim() }]); setCollabName(''); setCollabNim('') } }
  const removeCollab = (idx) => update('collaborators', form.collaborators.filter((_, i) => i !== idx))

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Gambar harus di bawah 2MB')
      return
    }
    update('thumbnailFile', file)
    update('thumbnail', URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()

      // Add text fields
      formData.append('title', form.title)
      formData.append('category', form.category)
      formData.append('description', form.description)
      formData.append('creator_name', form.creator_name)
      formData.append('creator_nim', form.creator_nim)
      formData.append('creator_major', form.creator_major)
      formData.append('creator_year', form.creator_year.toString())

      // Add thumbnail file if uploaded
      if (form.thumbnailFile) {
        formData.append('thumbnail', form.thumbnailFile)
      } else if (form.thumbnail && !form.thumbnail.startsWith('blob:')) {
        // If URL entered instead of file
        formData.append('thumbnail_url', form.thumbnail)
      }

      // Add tech stack as array
      if (techStackTags.length > 0) {
        techStackTags.forEach((tag, index) => {
          formData.append(`tech_stack[${index}]`, tag)
        })
      }

      // Add category-specific fields
      Object.keys(extraFields).forEach(key => {
        if (extraFields[key]) {
          formData.append(key, extraFields[key])
        }
      })

      // Add collaborators
      if (form.collaborators.length > 0) {
        form.collaborators.forEach((collab, index) => {
          const collabStr = typeof collab === 'string' ? collab : `${collab.name}${collab.nim ? ' (' + collab.nim + ')' : ''}`
          formData.append(`collaborators[${index}]`, collabStr)
        })
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Submission failed')
      setResult(data)
      // Store tracking ID in localStorage for session-based tracking
      if (data.tracking_id) {
        localStorage.setItem('tracking_id', data.tracking_id)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const copyTrackingId = () => navigator.clipboard.writeText(result.tracking_id)
  const activeFields = categoryFields[form.category] || []

  if (result) {
    return (
      <div className="min-h-screen bg-transparent relative pt-24 pb-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 py-8">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <GlowCard glowColor="green" className="rounded-3xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-4">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-theme-primary mb-2 font-header">Proyek Berhasil Diajukan!</h2>
                <p className="text-theme-muted mb-6">Proyek Anda telah diajukan untuk ditinjau.</p>
                <div className="bg-theme-secondary border border-theme rounded-2xl p-5 mb-6">
                  <p className="text-xs text-theme-muted mb-1 uppercase tracking-wider font-semibold">ID Pelacakan Anda</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-mono font-bold text-purple-600 dark:text-purple-400">{result.tracking_id}</span>
                    <button onClick={copyTrackingId} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors" title="Salin">
                      <Copy size={16} className="text-theme-muted" />
                    </button>
                  </div>
                  <p className="text-xs text-theme-muted mt-2">Simpan ini untuk memeriksa status pengajuan Anda</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link to={`/track?id=${result.tracking_id}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                    Lacak Status <ExternalLink size={16} />
                  </Link>
                  <Link to="/ilkomgallery" className="text-sm text-theme-muted hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    Kembali ke Galeri
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent relative pt-24 pb-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Breadcrumb />
            <PageHeader
              badge={
                <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1 text-sm text-theme-primary">
                  <div className="bg-card border border-theme rounded-2xl px-3 py-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Proyek Mahasiswa</span>
                  </div>
                  <p className="pr-3 text-xs text-theme-muted">Submit</p>
                </div>
              }
              title="Kirim Proyek"
              subtitle="Bagikan proyek Anda dengan komunitas ILKOM"
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selector */}
            <GlowCard glowColor="purple" className="rounded-3xl p-6">
              <h3 className="text-lg font-bold text-theme-primary mb-4 font-header">Kategori</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon
                  return (
                    <button key={cat.id} type="button" onClick={() => { update('category', cat.id); setExtraFields({}); setTechStackTags([]); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all ${
                        form.category === cat.id
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}>
                      <Icon size={20} />
                      <span className="text-center leading-tight">{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </GlowCard>

            {/* Project Info */}
            <GlowCard glowColor="purple" className="rounded-3xl p-6">
              <h3 className="text-lg font-bold text-theme-primary mb-4 font-header">Detail Proyek</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Judul *</label>
                  <input type="text" required value={form.title} onChange={e => update('title', e.target.value)} placeholder="Proyek Keren Saya" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Deskripsi *</label>
                  <textarea required rows={4} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Deskripsikan proyek Anda..." className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Gambar Thumbnail</label>
                  <div className="flex items-center gap-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${form.thumbnail ? 'border-green-500/50 bg-green-500/5' : 'border-theme hover:border-purple-500/50'}`}>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      {form.thumbnail ? (
                        <>
                          <img src={form.thumbnail} alt="Preview" loading="lazy" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Gambar dipilih</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={18} className="text-theme-muted" />
                          <span className="text-sm text-theme-muted">Klik untuk unggah gambar</span>
                        </>
                      )}
                    </label>
                  </div>
                  <p className="text-xs text-theme-muted mt-1.5">Atau masukkan URL di bawah (opsional)</p>
                  <input type="url" value={form.thumbnail.startsWith('blob:') ? '' : form.thumbnail} onChange={e => update('thumbnail', e.target.value)} placeholder="https://example.com/image.jpg" className={`${inputCls} mt-2`} />
                </div>
              </div>
            </GlowCard>

            {/* Tech Stack Tags */}
            <GlowCard glowColor="purple" className="rounded-3xl p-6">
              <h3 className="text-lg font-bold text-theme-primary mb-4 font-header">Teknologi <span className="text-sm font-normal text-theme-muted">(Opsional)</span></h3>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <select value="" onChange={e => { if (e.target.value && !techStackTags.includes(e.target.value)) { setTechStackTags(prev => [...prev, e.target.value]); setTechInput('') } e.target.value = '' }}
                  className={`${inputCls} flex-1`}>
                  <option value="">Pilih teknologi...</option>
                  {(TECH_STACK_OPTIONS[form.category] || []).filter(t => !techStackTags.includes(t)).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTechTag())}
                  placeholder="Kustom..." className={`${inputCls} flex-1`} />
                <button type="button" onClick={addTechTag}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-1 text-sm font-medium">
                  <Plus size={16} /> Tambah
                </button>
              </div>
              {techStackTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techStackTags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full font-medium">
                      {tag}
                      <button type="button" onClick={() => removeTechTag(i)} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              )}
            </GlowCard>

            {/* Category-Specific Fields */}
            {activeFields.length > 0 && (
              <GlowCard glowColor="purple" className="rounded-3xl p-6">
                <h3 className="text-lg font-bold text-theme-primary mb-4 font-header">
                  Detail {CATEGORIES.find(c => c.id === form.category)?.label}
                </h3>
                <div className="space-y-4">
                  {activeFields.map(field => (
                    <div key={field.key}>
                      <label className={labelCls}>{field.label} {field.optional && <span className="text-theme-muted font-normal">(Opsional)</span>}</label>
                      {field.type === 'select' ? (
                        <select value={extraFields[field.key] || ''} onChange={e => updateExtra(field.key, e.target.value)} className={inputCls}>
                          <option value="">Pilih {field.label}...</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input type={field.type} value={extraFields[field.key] || ''} onChange={e => updateExtra(field.key, e.target.value)} placeholder={field.placeholder} className={inputCls} />
                      )}
                    </div>
                  ))}
                </div>
              </GlowCard>
            )}

            {/* Creator Info */}
            <GlowCard glowColor="purple" className="rounded-3xl p-6">
              <h3 className="text-lg font-bold text-theme-primary mb-4 font-header">Creator Info</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Name *</label>
                    <input type="text" required value={form.creator_name} onChange={e => update('creator_name', e.target.value)} placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>NIM *</label>
                    <input type="text" required value={form.creator_nim} onChange={e => update('creator_nim', e.target.value)} placeholder="20210101001" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Major *</label>
                    <select value={form.creator_major} onChange={e => update('creator_major', e.target.value)} className={inputCls}>
                      {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Year *</label>
                    <input type="number" required min={2000} max={2030} value={form.creator_year} onChange={e => update('creator_year', parseInt(e.target.value))} className={inputCls} />
                  </div>
                </div>
              </div>
            </GlowCard>

            {/* Collaborators */}
            <GlowCard glowColor="purple" className="rounded-3xl p-6">
              <h3 className="text-lg font-bold text-theme-primary mb-4 font-header">Kolaborator <span className="text-sm font-normal text-theme-muted">(Opsional)</span></h3>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input type="text" value={collabName} onChange={e => setCollabName(e.target.value)} placeholder="Nama" className={`${inputCls} flex-1`} />
                <input type="text" value={collabNim} onChange={e => setCollabNim(e.target.value)} placeholder="NIM (opsional)" className={`${inputCls} flex-1`} />
                <button type="button" onClick={addCollab}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-1 text-sm font-medium whitespace-nowrap">
                  <Plus size={16} /> Tambah
                </button>
              </div>
              {form.collaborators.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.collaborators.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full font-medium">
                      {typeof c === 'string' ? c : `${c.name}${c.nim ? ' (' + c.nim + ')' : ''}`}
                      <button type="button" onClick={() => removeCollab(i)} className="hover:text-red-500 transition-colors"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              )}
            </GlowCard>

            <motion.button type="submit" disabled={submitting}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {submitting ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mengirim...</>
              ) : (
                <><Upload size={18} /> Kirim Proyek</>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitProjectPage
