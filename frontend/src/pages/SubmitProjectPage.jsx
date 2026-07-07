import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Upload, CheckCircle, Copy, ExternalLink, Plus, X, Globe, Smartphone, Palette, Gamepad2, Cpu, Image as ImageIcon, Tag, Layers, User, Users } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import { PageHeader } from '../components/ui/PageHeader'
import { PageBackground } from '../components/ui/PageBackground'
import SlideButton from '../components/ui/SlideButton'
import SlideConfirm from '../components/ui/SlideConfirm'

const CATEGORIES = [
  { id: 'web', label: 'Web', icon: Globe },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
  { id: 'uiux', label: 'UI/UX', icon: Palette },
  { id: 'game', label: 'Game', icon: Gamepad2 },
  { id: 'ai', label: 'AI', icon: Cpu },
]

const CREATOR_TYPES = [
  { id: 'mahasiswa', label: 'Mahasiswa' },
  { id: 'dosen', label: 'Dosen' },
]

const MAJORS = [
  'S1 Teknik Informatika', 'S1 Sistem Informasi', 'S1 Sistem Komputer',
  'D3 Manajemen Informatika', 'D3 Komputerisasi Akuntansi', 'D3 Teknik Komputer',
]

const COLLAB_TYPES = [
  { id: 'mahasiswa', label: 'Mahasiswa' },
  { id: 'dosen', label: 'Dosen' },
]

import { API_BASE } from '../services/api'

const baseForm = {
  title: '', category: 'web', description: '', thumbnail: '', thumbnailFile: null,
  creator_name: '', creator_type: 'mahasiswa', creator_nim: '', creator_major: '', creator_year: '',
  creator_avatar: '', creator_avatarFile: null,
  collaborators: [],
}

const PLATFORM_OPTIONS = [
  'Android', 'iOS', 'Android & iOS', 'Web', 'PC', 'PC & Mobile', 'Cross-Platform'
]

const TECH_STACK_OPTIONS = {
  web: ['React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Svelte', 'Angular', 'Node.js', 'Express.js', 'Laravel', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Tailwind CSS', 'Bootstrap', 'TypeScript', 'GraphQL', 'REST API', 'Docker'],
  mobile: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Dart', 'Firebase', 'Supabase', 'SQLite', 'Realm', 'GetX', 'Provider', 'BLoC', 'Jetpack Compose', 'SwiftUI'],
  uiux: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision', 'Miro', 'FigJam', 'Canva', 'Zeplin'],
  game: ['Unity', 'Unreal Engine', 'Godot', 'Cocos2d', 'Phaser', 'Pygame', 'GameMaker', 'RPG Maker', 'Blender', 'Aseprite'],
  ai: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'Hugging Face', 'LangChain', 'OpenAI API', 'Gemini API', 'FastAPI', 'Flask', 'Jupyter Notebook'],
}

const categoryFields = {
  web: [
    { key: 'live_demo', label: 'Demo URL', placeholder: 'https://...', type: 'url', optional: true },
    { key: 'github_link', label: 'GitHub', placeholder: 'https://github.com/...', type: 'url', optional: true },
  ],
  mobile: [
    { key: 'platform', label: 'Platform', type: 'select', options: PLATFORM_OPTIONS, optional: true },
    { key: 'download_link', label: 'Download URL', placeholder: 'https://...', type: 'url', optional: true },
    { key: 'github_link', label: 'GitHub', placeholder: 'https://github.com/...', type: 'url', optional: true },
  ],
  uiux: [
    { key: 'figma_link', label: 'Figma Link', placeholder: 'https://figma.com/...', type: 'url', optional: true },
  ],
  game: [
    { key: 'platform', label: 'Platform', type: 'select', options: PLATFORM_OPTIONS, optional: true },
    { key: 'github_link', label: 'GitHub', placeholder: 'https://github.com/...', type: 'url', optional: true },
    { key: 'download_link', label: 'Download Link', placeholder: 'https://...', type: 'url', optional: true },
  ],
  ai: [
    { key: 'github_link', label: 'GitHub', placeholder: 'https://github.com/...', type: 'url', optional: true },
    { key: 'live_demo', label: 'Demo URL', placeholder: 'https://...', type: 'url', optional: true },
  ],
}

const inputCls = "w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-colors"
const labelCls = "block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1.5"

const SubmitProjectPage = () => {
  const [form, setForm] = useState({ ...baseForm, category: 'web' })
  const [extraFields, setExtraFields] = useState({})
  const [techStackTags, setTechStackTags] = useState([])
  const [techInput, setTechInput] = useState('')
  const [collabName, setCollabName] = useState('')
  const [collabNim, setCollabNim] = useState('')
  const [collabMajor, setCollabMajor] = useState(MAJORS[0])
  const [collabYear, setCollabYear] = useState(2024)
  const [collabType, setCollabType] = useState('mahasiswa')
  const [collabAvatar, setCollabAvatar] = useState('')
  const [collabAvatarFile, setCollabAvatarFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

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

  const addCollab = () => {
    if (collabName.trim()) {
      update('collaborators', [...form.collaborators, {
        name: collabName.trim(), nim: collabNim.trim(), major: collabMajor,
        year: collabYear, type: collabType, avatar: collabAvatar, avatarFile: collabAvatarFile
      }])
      setCollabName(''); setCollabNim(''); setCollabMajor('')
      setCollabYear(''); setCollabType('mahasiswa'); setCollabAvatar(''); setCollabAvatarFile(null)
    }
  }
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

  const handleImageUpload = (e, onFile, onPreview) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 500 * 1024) {
      setError('Gambar harus di bawah 500KB')
      return
    }
    onFile(file)
    onPreview(URL.createObjectURL(file))
  }

  const handleAvatarUpload = (e) => handleImageUpload(e, (f) => update('creator_avatarFile', f), (u) => update('creator_avatar', u))
  const handleCollabAvatarUpload = (e) => handleImageUpload(e, setCollabAvatarFile, setCollabAvatar)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('category', form.category)
      formData.append('description', form.description)
      formData.append('creator_name', form.creator_name)
      formData.append('creator_type', form.creator_type)
      formData.append('creator_nim', form.creator_nim)
      formData.append('creator_major', form.creator_major)
      formData.append('creator_year', form.creator_year.toString())

      if (form.thumbnailFile) {
        formData.append('thumbnail', form.thumbnailFile)
      } else if (form.thumbnail && !form.thumbnail.startsWith('blob:')) {
        formData.append('thumbnail_url', form.thumbnail)
      }

      if (form.creator_avatarFile) {
        formData.append('creator_avatar', form.creator_avatarFile)
      } else if (form.creator_avatar && !form.creator_avatar.startsWith('blob:')) {
        formData.append('creator_avatar_url', form.creator_avatar)
      }

      if (techStackTags.length > 0) {
        techStackTags.forEach((tag) => formData.append('tech_stack[]', tag))
      }

      Object.keys(extraFields).forEach(key => {
        if (extraFields[key]) formData.append(key, extraFields[key])
      })

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
      if (data.tracking_id) sessionStorage.setItem('tracking_id', data.tracking_id)
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
      <PageBackground>
        <div className="min-h-screen relative z-0 pt-24 pb-12">
          <div className="relative z-10 py-8">
            <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Proyek Berhasil Diajukan!</h2>
                  <p className="text-neutral-500 text-sm mb-6">Proyek Anda telah diajukan untuk ditinjau.</p>
                  <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-6">
                    <p className="text-[10px] text-neutral-400 mb-1 uppercase tracking-wider font-semibold">ID Pelacakan</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-mono font-bold text-[var(--accent)]">{result.tracking_id}</span>
                      <button onClick={copyTrackingId} className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors" title="Salin">
                        <Copy size={14} className="text-neutral-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to={`/track?id=${result.tracking_id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg font-medium text-sm hover:brightness-110 transition-colors">
                      Lacak Status <ExternalLink size={14} />
                    </Link>
                    <Link to="/ilkomgallery" className="text-xs text-neutral-400 hover:text-[var(--accent)] transition-colors">
                      Kembali ke Galeri
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </PageBackground>
    )
  }

  return (
    <PageBackground>
      <div className="min-h-screen relative z-0 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="mb-8">
            <Breadcrumb />
            <PageHeader
              badge={
                <div className="inline-flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-full bg-white dark:bg-neutral-900 p-1 text-sm">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Submit</span>
                  </div>
                </div>
              }
              title="Kirim Proyek"
              subtitle="Bagikan proyek Anda dengan komunitas ILKOM"
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={14} className="text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Kategori</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon
                  return (
                    <button key={cat.id} type="button" onClick={() => { update('category', cat.id); setExtraFields({}); setTechStackTags([]); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all ${
                        form.category === cat.id
                          ? 'bg-[var(--accent)] text-white shadow-md'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}>
                      <Icon size={18} />
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} className="text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Detail Proyek</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Judul *</label>
                  <input type="text" required value={form.title} onChange={e => update('title', e.target.value)} placeholder="Nama proyek" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Deskripsi *</label>
                  <textarea required rows={4} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Deskripsikan proyek Anda..." className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Thumbnail</label>
                  <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${form.thumbnail ? 'border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-neutral-300 dark:border-neutral-600 hover:border-[var(--accent)]/50'}`}>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    {form.thumbnail ? (
                      <>
                        <img src={form.thumbnail} alt="Preview" loading="lazy" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Terpilih</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={16} className="text-neutral-400" />
                        <span className="text-sm text-neutral-400">Klik atau seret gambar</span>
                      </>
                    )}
                  </label>
                  <input type="url" value={form.thumbnail.startsWith('blob:') ? '' : form.thumbnail} onChange={e => update('thumbnail', e.target.value)} placeholder="Atau masukkan URL gambar" className={`${inputCls} mt-3`} />
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={14} className="text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Teknologi</h3>
              </div>
              <div className="flex gap-2 mb-3">
                <select value="" onChange={e => { if (e.target.value && !techStackTags.includes(e.target.value)) { setTechStackTags(prev => [...prev, e.target.value]); setTechInput('') } e.target.value = '' }}
                  className={`${inputCls} flex-1`}>
                  <option value="">Pilih...</option>
                  {(TECH_STACK_OPTIONS[form.category] || []).filter(t => !techStackTags.includes(t)).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTechTag())}
                  placeholder="Kustom" className={`${inputCls} flex-1`} />
                <button type="button" onClick={addTechTag}
                  className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl hover:brightness-110 transition-colors flex items-center gap-1 text-sm font-medium">
                  <Plus size={14} />
                </button>
              </div>
              {techStackTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {techStackTags.map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-sm rounded-lg font-medium"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTechTag(i)} className="hover:text-red-500"><X size={12} /></button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Category-Specific Fields */}
            {activeFields.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={14} className="text-neutral-400" />
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    {CATEGORIES.find(c => c.id === form.category)?.label}
                  </h3>
                </div>
                <div className="space-y-4">
                  {activeFields.map(field => (
                    <div key={field.key}>
                      <label className={labelCls}>{field.label}</label>
                      {field.type === 'select' ? (
                        <select value={extraFields[field.key] || ''} onChange={e => updateExtra(field.key, e.target.value)} className={inputCls}>
                          <option value="">Pilih...</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input type={field.type} value={extraFields[field.key] || ''} onChange={e => updateExtra(field.key, e.target.value)} placeholder={field.placeholder} className={inputCls} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Creator */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <User size={14} className="text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Pembuat</h3>
              </div>
              <div className="flex items-start gap-4">
                <label className="relative group cursor-pointer shrink-0">
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <div className={`w-16 h-16 rounded-full border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors ${form.creator_avatar ? 'border-green-400' : 'border-neutral-300 dark:border-neutral-600 hover:border-[var(--accent)]/50'}`}>
                    {form.creator_avatar ? (
                      <img src={form.creator_avatar} alt="Avatar" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={18} className="text-neutral-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload size={14} className="text-white" />
                  </div>
                </label>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Nama *</label>
                      <input type="text" required value={form.creator_name} onChange={e => update('creator_name', e.target.value)} placeholder="Nama lengkap" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Tipe</label>
                      <div className="flex gap-2">
                        {CREATOR_TYPES.map(t => (
                          <button key={t.id} type="button" onClick={() => update('creator_type', t.id)}
                            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                              form.creator_type === t.id
                                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700'
                            }`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>{form.creator_type === 'dosen' ? 'NIP' : 'NIM'} <span className="text-neutral-400 dark:text-neutral-500 font-normal">(opsional)</span></label>
                      <input type="text" value={form.creator_nim} onChange={e => update('creator_nim', e.target.value)} placeholder={form.creator_type === 'dosen' ? 'NIP' : 'NIM'} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Prodi <span className="text-neutral-400 dark:text-neutral-500 font-normal">(opsional)</span></label>
                      <select value={form.creator_major} onChange={e => update('creator_major', e.target.value)} className={inputCls}>
                        <option value="">Pilih...</option>
                        {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Angkatan <span className="text-neutral-400 dark:text-neutral-500 font-normal">(opsional)</span></label>
                      <input type="number" min={2000} max={2030} value={form.creator_year} onChange={e => update('creator_year', e.target.value)} placeholder="2024" className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collaborators — same design as Creator */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Kolaborator</h3>
              </div>

              {/* Add collaborator form — same layout as creator */}
              <div className="flex items-start gap-4 mb-4">
                <label className="relative group cursor-pointer shrink-0">
                  <input type="file" accept="image/*" onChange={handleCollabAvatarUpload} className="hidden" />
                  <div className={`w-16 h-16 rounded-full border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors ${collabAvatar ? 'border-green-400' : 'border-neutral-300 dark:border-neutral-600 hover:border-[var(--accent)]/50'}`}>
                    {collabAvatar ? <img src={collabAvatar} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-neutral-400" />}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload size={14} className="text-white" />
                  </div>
                </label>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Nama *</label>
                      <input type="text" value={collabName} onChange={e => setCollabName(e.target.value)} placeholder="Nama kolaborator" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Tipe</label>
                      <div className="flex gap-2">
                        {COLLAB_TYPES.map(t => (
                          <button key={t.id} type="button" onClick={() => setCollabType(t.id)}
                            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                              collabType === t.id ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700'
                            }`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>{collabType === 'dosen' ? 'NIP' : 'NIM'} <span className="text-neutral-400 dark:text-neutral-500 font-normal">(opsional)</span></label>
                      <input type="text" value={collabNim} onChange={e => setCollabNim(e.target.value)} placeholder={collabType === 'dosen' ? 'NIP' : 'NIM'} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Prodi <span className="text-neutral-400 dark:text-neutral-500 font-normal">(opsional)</span></label>
                      <select value={collabMajor} onChange={e => setCollabMajor(e.target.value)} className={inputCls}>
                        <option value="">Pilih...</option>
                        {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Angkatan <span className="text-neutral-400 dark:text-neutral-500 font-normal">(opsional)</span></label>
                      <input type="number" min={2000} max={2030} value={collabYear} onChange={e => setCollabYear(parseInt(e.target.value))} placeholder="2024" className={inputCls} />
                    </div>
                  </div>
                  <button type="button" onClick={addCollab}
                    className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-medium flex items-center gap-1.5 hover:brightness-110 transition-colors">
                    <Plus size={14} /> Tambah Kolaborator
                  </button>
                </div>
              </div>

              {/* Added collaborators */}
              {form.collaborators.length > 0 && (
                <div className="space-y-2">
                  <AnimatePresence>
                    {form.collaborators.map((c, i) => (
                      <motion.div
                        key={`${c.name}-${i}`}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
                      >
                        {c.avatar ? <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold bg-[var(--accent)]/60">{c.name.charAt(0)}</div>}
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                          <span className="text-[11px] text-neutral-400">{c.type === 'dosen' ? 'Dosen' : 'Mahasiswa'}{c.major ? ` · ${c.major}` : ''}{c.nim ? ` · ${c.nim}` : ''}</span>
                        </div>
                        <button type="button" onClick={() => removeCollab(i)} className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"><X size={12} className="text-neutral-400" /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-3">
              <SlideButton onSubmit={() => setShowConfirm(true)} disabled={submitting}>
                Kirim Proyek
              </SlideButton>
            </div>
          </form>

          <SlideConfirm
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => { setShowConfirm(false); handleSubmit(new Event('submit')) }}
            loading={submitting}
          />
        </div>
      </div>
    </PageBackground>
  )
}

export default SubmitProjectPage
