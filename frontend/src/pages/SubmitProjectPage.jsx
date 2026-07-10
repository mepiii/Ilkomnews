import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, Copy, ExternalLink, Plus, X, Globe, Smartphone, Palette, Gamepad2, Cpu, Image as ImageIcon, Tag, Layers, User, Users } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import { PageHeader } from '../components/ui/PageHeader'
import { PageBackground } from '../components/ui/PageBackground'
import SlideButton from '../components/ui/SlideButton'
import SlideConfirm from '../components/ui/SlideConfirm'
import { useToast } from '../components/ui/Toast'

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
  creator_name: '', creator_type: 'mahasiswa', creator_nim: '', creator_nidn: '', creator_major: '', creator_year: '', creator_jabatan: '',
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

const ProfilePhotoUpload = ({ preview, name, onFile, onClear, size = 'w-20 h-20' }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
    <div className={`relative ${size} shrink-0`}>
      <div className="w-full h-full rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
        {preview ? (
          <img src={preview} className="w-full h-full object-cover" alt="Foto profil" />
        ) : (
          <User size={32} className="text-neutral-400" />
        )}
      </div>
      <label className="absolute -bottom-1 -right-1 rounded-full bg-[var(--accent)] text-white border-2 border-white dark:border-neutral-900 w-8 h-8 flex items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow">
        <ImageIcon size={15} />
        <input type="file" accept="image/*" onChange={onFile} className="hidden" />
      </label>
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
        {name?.trim() || 'Foto Profil'}
      </p>
      <p className="text-xs text-neutral-400 mb-2">Klik ikon untuk mengunggah foto <span className="text-neutral-400 font-normal">(opsional)</span></p>
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-[var(--accent)] cursor-pointer hover:underline">
          {preview ? 'Ubah Foto' : 'Unggah Foto'}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
        {preview && (
          <button type="button" onClick={onClear} className="text-xs text-red-500 hover:underline">Hapus</button>
        )}
      </div>
    </div>
  </div>
)

const SubmitProjectPage = () => {
  const [form, setForm] = useState({ ...baseForm })
  const [extraFields, setExtraFields] = useState({})
  const [techStackTags, setTechStackTags] = useState([])
  const [techInput, setTechInput] = useState('')
  const [selectedTech, setSelectedTech] = useState('')
  const [collabName, setCollabName] = useState('')
  const [collabNim, setCollabNim] = useState('')
  const [collabMajor, setCollabMajor] = useState(MAJORS[0])
  const [collabYear, setCollabYear] = useState(2024)
  const [collabType, setCollabType] = useState('mahasiswa')
  const [collabNidn, setCollabNidn] = useState('')
  const [collabJabatan, setCollabJabatan] = useState('')
  const [collabAvatar, setCollabAvatar] = useState('')
  const [collabAvatarFile, setCollabAvatarFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [quota, setQuota] = useState(null)
  const { showToast } = useToast()
  const slideButtonRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE}/upload-quota`)
      .then((r) => r.json())
      .then(setQuota)
      .catch(() => {})
  }, [])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const updateExtra = (field, value) => setExtraFields(prev => ({ ...prev, [field]: value }))

  // Tech stack handlers - properly rewritten
  const handleTechSelect = (e) => {
    const value = e.target.value
    if (value && !techStackTags.includes(value)) {
      setTechStackTags(prev => [...prev, value])
    }
    setSelectedTech('') // Reset select after adding
  }

  const handleTechInput = (e) => {
    const value = e.target.value
    if (value.includes(',')) {
      value.split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .forEach(token => {
          if (!techStackTags.includes(token)) {
            setTechStackTags(prev => [...prev, token])
          }
        })
      setTechInput('')
    } else {
      setTechInput(value)
    }
  }

  const addTechTag = () => {
    const trimmed = techInput.trim()
    if (trimmed && !techStackTags.includes(trimmed)) {
      setTechStackTags(prev => [...prev, trimmed])
      setTechInput('')
    }
  }

  const removeTechTag = (tagToRemove) => {
    setTechStackTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  // Handle category change - reset tech stack and extra fields
  const handleCategoryChange = (newCategory) => {
    update('category', newCategory)
    setExtraFields({})
    setTechStackTags([])
    setSelectedTech('')
    setTechInput('')
  }

  const addCollab = () => {
    if (collabName.trim()) {
      const isDosen = collabType === 'dosen'
      const collabObj = isDosen
        ? { name: collabName.trim(), type: 'dosen', nidn: collabNidn.trim(), jabatan: collabJabatan.trim(), avatar: collabAvatar, avatarFile: collabAvatarFile }
        : { name: collabName.trim(), type: 'mahasiswa', nim: collabNim.trim(), major: collabMajor, year: collabYear, avatar: collabAvatar, avatarFile: collabAvatarFile }
      update('collaborators', [...form.collaborators, collabObj])
      setCollabName(''); setCollabNim(''); setCollabMajor(MAJORS[0]); setCollabNidn(''); setCollabJabatan('')
      setCollabYear(2024); setCollabType('mahasiswa'); setCollabAvatar(''); setCollabAvatarFile(null)
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
      formData.append('creator_major', form.creator_major)
      if (form.creator_type === 'dosen') {
        if (form.creator_nidn) formData.append('creator_nidn', form.creator_nidn)
        if (form.creator_jabatan) formData.append('creator_jabatan', form.creator_jabatan)
      } else {
        if (form.creator_nim) formData.append('creator_nim', form.creator_nim)
        if (form.creator_year) formData.append('creator_year', form.creator_year.toString())
      }

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

      // Tech stack - properly formatted as array
      if (techStackTags.length > 0) {
        techStackTags.forEach((tag) => formData.append('tech_stack[]', tag))
      }

      Object.keys(extraFields).forEach(key => {
        if (extraFields[key]) formData.append(key, extraFields[key])
      })

      if (form.collaborators.length > 0) {
        form.collaborators.forEach((collab, index) => {
          if (typeof collab === 'string') {
            formData.append(`collaborators[${index}][name]`, collab)
          } else {
            formData.append(`collaborators[${index}][name]`, collab.name)
            if (collab.type === 'dosen') {
              if (collab.nidn) formData.append(`collaborators[${index}][nidn]`, collab.nidn)
              if (collab.major) formData.append(`collaborators[${index}][major]`, collab.major)
              if (collab.jabatan) formData.append(`collaborators[${index}][jabatan]`, collab.jabatan)
            } else {
              if (collab.nim) formData.append(`collaborators[${index}][nim]`, collab.nim)
              if (collab.major) formData.append(`collaborators[${index}][major]`, collab.major)
              if (collab.year) formData.append(`collaborators[${index}][year]`, collab.year.toString())
            }
            if (collab.type) formData.append(`collaborators[${index}][type]`, collab.type)
            if (collab.avatarFile) {
              formData.append(`collaborators[${index}][avatar]`, collab.avatarFile)
            } else if (collab.avatar && !collab.avatar.startsWith('blob:')) {
              formData.append(`collaborators[${index}][avatar_url]`, collab.avatar)
            }
          }
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
      if (data.tracking_id) {
        const existingIds = JSON.parse(localStorage.getItem('tracking_ids') || '[]')
        if (!existingIds.includes(data.tracking_id)) {
          existingIds.push(data.tracking_id)
          localStorage.setItem('tracking_ids', JSON.stringify(existingIds))
        }
        window.dispatchEvent(new Event('notifications:refresh'))
      }
      showToast(`Proyek berhasil dikirim! ID Pelacakan: ${data.tracking_id}`)
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Request timeout. Please try again.' : err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const copyTrackingId = () => {
    if (result?.tracking_id) {
      navigator.clipboard.writeText(result.tracking_id)
    }
  }

  const activeFields = categoryFields[form.category] || []

  if (result) {
    return (
      <PageBackground>
        <div className="max-w-lg mx-auto pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-lg"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Proyek Berhasil Dikirim!</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">Proyek Anda sedang dalam peninjauan.</p>
            
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Tracking ID</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-mono font-semibold text-[var(--accent)]">{result.tracking_id}</code>
                <button onClick={copyTrackingId} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                  <Copy size={16} className="text-neutral-500" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/track?id=${result.tracking_id}`} className="flex-1 px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl font-medium hover:brightness-110 transition flex items-center justify-center gap-2">
                <ExternalLink size={16} /> Lacak Status
              </Link>
              <Link to="/" className="flex-1 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center justify-center">
                Ke Beranda
              </Link>
            </div>
          </motion.div>
        </div>
      </PageBackground>
    )
  }

  return (
    <PageBackground>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumb />
        <PageHeader title="Kirim Proyek" subtitle="Bagikan karya Anda ke galeri ILKOM" />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="space-y-6">
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
                  <button key={cat.id} type="button" onClick={() => handleCategoryChange(cat.id)}
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

          {/* Tech Stack - Rewritten for reliability */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={14} className="text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Teknologi</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select 
                  value={selectedTech} 
                  onChange={handleTechSelect}
                  className={`${inputCls} flex-1`}
                >
                  <option value="">Pilih teknologi...</option>
                  {(TECH_STACK_OPTIONS[form.category] || [])
                    .filter(t => !techStackTags.includes(t))
                    .map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))
                  }
                </select>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={handleTechInput}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTechTag()
                    }
                  }}
                  placeholder="Atau ketik teknologi kustom..."
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={addTechTag}
                  className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl hover:brightness-110 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <Plus size={14} />
                  Tambah
                </button>
              </div>

              {/* Selected tech stack tags */}
              {techStackTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <AnimatePresence>
                    {techStackTags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-[var(--accent)] text-sm rounded-full font-medium"
                      >
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTechTag(tag)} 
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Category-Specific Fields */}
          {activeFields.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={14} className="text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  {CATEGORIES.find(c => c.id === form.category)?.label} Links
                </h3>
              </div>
              <div className="space-y-4">
                {activeFields.map(field => (
                  <div key={field.key}>
                    <label className={labelCls}>
                      {field.label} {field.optional && <span className="text-neutral-400 font-normal">(opsional)</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select 
                        value={extraFields[field.key] || ''} 
                        onChange={e => updateExtra(field.key, e.target.value)} 
                        className={inputCls}
                      >
                        <option value="">Pilih...</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input 
                        type={field.type || 'text'} 
                        value={extraFields[field.key] || ''} 
                        onChange={e => updateExtra(field.key, e.target.value)} 
                        placeholder={field.placeholder} 
                        className={inputCls} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creator Info */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User size={14} className="text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Informasi Pembuat</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nama Lengkap *</label>
                  <input type="text" required value={form.creator_name} onChange={e => update('creator_name', e.target.value)} placeholder="Nama pembuat" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Tipe</label>
                  <div className="flex gap-2">
                    {CREATOR_TYPES.map(t => (
                      <button key={t.id} type="button" onClick={() => update('creator_type', t.id)}
                        className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                          form.creator_type === t.id ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700'
                        }`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {form.creator_type === 'dosen' ? (
                  <>
                    <div>
                      <label className={labelCls}>NIDN / NIDK <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <input type="text" value={form.creator_nidn} onChange={e => update('creator_nidn', e.target.value)} placeholder="NIDN / NIDK" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Jabatan <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <input type="text" value={form.creator_jabatan} onChange={e => update('creator_jabatan', e.target.value)} placeholder="Jabatan" className={inputCls} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={labelCls}>NIM <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <input type="text" value={form.creator_nim} onChange={e => update('creator_nim', e.target.value)} placeholder="NIM" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Prodi <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <select value={form.creator_major} onChange={e => update('creator_major', e.target.value)} className={inputCls}>
                        <option value="">Pilih...</option>
                        {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Angkatan <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <input type="number" min={2000} max={2030} value={form.creator_year} onChange={e => update('creator_year', e.target.value)} placeholder="2024" className={inputCls} />
                    </div>
                  </>
                )}
              </div>
              <div>
                <ProfilePhotoUpload preview={form.creator_avatar} name={form.creator_name} onFile={handleAvatarUpload} onClear={() => { update('creator_avatar', ''); update('creator_avatarFile', null) }} />
              </div>
            </div>
          </div>

          {/* Collaborators */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users size={14} className="text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Kolaborator <span className="text-neutral-400 font-normal">(opsional)</span></h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nama</label>
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
                {collabType === 'dosen' ? (
                  <>
                    <div>
                      <label className={labelCls}>NIDN / NIDK <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <input type="text" value={collabNidn} onChange={e => setCollabNidn(e.target.value)} placeholder="NIDN / NIDK" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Jabatan <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <input type="text" value={collabJabatan} onChange={e => setCollabJabatan(e.target.value)} placeholder="Jabatan" className={inputCls} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={labelCls}>NIM <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <input type="text" value={collabNim} onChange={e => setCollabNim(e.target.value)} placeholder="NIM" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Prodi <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <select value={collabMajor} onChange={e => setCollabMajor(e.target.value)} className={inputCls}>
                        <option value="">Pilih...</option>
                        {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Angkatan <span className="text-neutral-400 font-normal">(opsional)</span></label>
                      <input type="number" min={2000} max={2030} value={collabYear} onChange={e => setCollabYear(parseInt(e.target.value))} placeholder="2024" className={inputCls} />
                    </div>
                  </>
                )}
              </div>
              <div>
                <ProfilePhotoUpload preview={collabAvatar} name={collabName} onFile={handleCollabAvatarUpload} onClear={() => { setCollabAvatar(''); setCollabAvatarFile(null) }} />
              </div>
              <button type="button" onClick={addCollab}
                className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-medium flex items-center gap-1.5 hover:brightness-110 transition-colors">
                <Plus size={14} /> Tambah Kolaborator
              </button>

              {form.collaborators.length > 0 && (
                <div className="space-y-2 pt-2">
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
                           <span className="text-[11px] text-neutral-400">{c.type === 'dosen' ? 'Dosen' : 'Mahasiswa'}{c.type !== 'dosen' && c.major ? ` · ${c.major}` : ''}{c.type === 'dosen' ? (c.nidn ? ` · ${c.nidn}` : '') : (c.nim ? ` · ${c.nim}` : '')}</span>
                        </div>
                        <button type="button" onClick={() => removeCollab(i)} className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"><X size={12} className="text-neutral-400" /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            {quota && quota.is_exceeded && (
              <p className="text-sm text-red-500 mb-3">Batas upload harian tercapai (5MB/hari). Coba lagi besok.</p>
            )}
            {quota && !quota.is_exceeded && quota.remaining < 1024 * 1024 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Sisa kuota hari ini: {Math.round(quota.remaining / 1024)}KB
              </p>
            )}
            <SlideButton ref={slideButtonRef} onSubmit={() => { slideButtonRef.current?.reset(); setShowConfirm(true); }} disabled={submitting || (quota && quota.is_exceeded)}>
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
    </PageBackground>
  )
}

export default SubmitProjectPage
