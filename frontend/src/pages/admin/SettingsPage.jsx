import { useState, useEffect } from 'react'
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { adminAuth } from '../../services/adminApi'
import { springPreset, pageContainer, pageItem, useReducedMotionSafe } from '../../lib/animations'

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  const [errors, setErrors] = useState({})
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(() => {
    return !localStorage.getItem('password_prompt_dismissed')
  })
  const reduce = useReducedMotionSafe()
  const containerVariants = reduce
    ? { hidden: {}, show: {} }
    : pageContainer
  const itemVariants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0 } } }
    : pageItem

  async function fetchProfile() {
    try {
      const data = await adminAuth.getProfile()
      setProfile({ name: data.name || '', email: data.email || '' })
    } catch {
      setMessage({ type: 'error', text: 'Gagal memuat profil' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      await adminAuth.updateProfile(profile)
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Gagal memperbarui profil' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    const errs = {}
    if (!passwords.current_password) errs.current_password = 'Password saat ini wajib diisi'
    if (!passwords.password) errs.password = 'Password baru wajib diisi'
    else if (passwords.password.length < 8) errs.password = 'Password minimal 8 karakter'
    if (passwords.password !== passwords.password_confirmation) errs.password_confirmation = 'Konfirmasi password tidak cocok'
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      await adminAuth.updatePassword(passwords)
      setMessage({ type: 'success', text: 'Password berhasil diperbarui' })
      setPasswords({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      const msg = err.message || 'Gagal memperbarui password'
      if (msg.includes('Password lama yang Anda masukkan salah')) {
        setErrors(prev => ({ ...prev, current_password: msg }))
      } else {
        setMessage({ type: 'error', text: msg })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors ${
      errors[field] ? 'border-red-400' : 'border-gray-200 dark:border-neutral-800'
    }`

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola profil dan keamanan akun Anda</p>
      </motion.div>

      {message.text && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : springPreset}
          className={`p-4 rounded-xl text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Profile Section */}
      <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-neutral-800 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <User size={18} /> Profil
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Nama</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className={inputClass('name')}
              placeholder="Nama lengkap"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className={inputClass('email')}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={springPreset}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:brightness-110 transition disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </motion.button>
        </form>
      </motion.div>

      {/* Password Section */}
      <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-neutral-800 rounded-xl p-6">
        {showPasswordPrompt && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-sm flex items-start justify-between gap-2">
            <span>Disarankan mengubah password setelah login pertama untuk keamanan akun.</span>
            <button
              onClick={() => { setShowPasswordPrompt(false); localStorage.setItem('password_prompt_dismissed', '1') }}
              className="shrink-0 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300"
            >
              ✕
            </button>
          </div>
        )}
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Lock size={18} /> Ubah Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwords.current_password}
                onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                className={`${inputClass('current_password')} pr-10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.current_password && <p className="text-xs text-red-500 mt-1">{errors.current_password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Password Baru</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwords.password}
                onChange={(e) => handlePasswordChange('password', e.target.value)}
                className={`${inputClass('password')} pr-10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={passwords.password_confirmation}
              onChange={(e) => handlePasswordChange('password_confirmation', e.target.value)}
              className={inputClass('password_confirmation')}
              placeholder="••••••••"
            />
            {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation}</p>}
          </div>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={springPreset}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:brightness-110 transition disabled:opacity-50"
          >
            <Lock size={16} /> {saving ? 'Menyimpan...' : 'Ubah Password'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
