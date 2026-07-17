import { useState, useEffect } from 'react'
import { User, Mail, Lock, Save, Eye, EyeOff, Plus, Trash2, X, AlertCircle, CheckCircle, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { adminFetch, normalizeList } from '../../services/adminApi'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { springPreset, useReducedMotionSafe } from '../../lib/animations'

export default function AdminManagementPage() {
  const { user } = useAdminAuth()
  const [admins, setAdmins] = useState([])
  const [slots, setSlots] = useState({ used: 0, max: 12, available: 12 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [errors, setErrors] = useState({})
  const [showPasswords, setShowPasswords] = useState({})
  const [saving, setSaving] = useState(false)
  const reduce = useReducedMotionSafe()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    current_password: ''
  })

  // Only require the current password when the admin edits their OWN account.
  const isSelf = !!(editingAdmin && user && user.id === editingAdmin.id)

  useEffect(() => {
    fetchAdmins()
  }, [])

  async function fetchAdmins() {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      const data = await adminFetch('/admins')
      const adminList = normalizeList(data)
      const slotsInfo = data.slots || { used: adminList.length, max: 12, available: 12 - adminList.length }
      setAdmins(adminList)
      setSlots(slotsInfo)
    } catch (err) {
      setMessage({ type: 'error', text: `Gagal memuat data admin: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', password_confirmation: '', current_password: '' })
    setErrors({})
    setEditingAdmin(null)
    setShowForm(false)
    setMessage({ type: '', text: '' })
  }

  // Close the modal but KEEP the page-level success message so the user sees
  // clear feedback after saving (resetForm would wipe it).
  const closeModalKeepMessage = () => {
    setForm({ name: '', email: '', password: '', password_confirmation: '', current_password: '' })
    setErrors({})
    setEditingAdmin(null)
    setShowForm(false)
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setForm({ name: admin.name, email: admin.email, password: '', password_confirmation: '', current_password: '' })
    setShowForm(true)
    setMessage({ type: '', text: '' })
  }

  const validateForm = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.email.trim()) errs.email = 'Email wajib diisi'

    if (editingAdmin) {
      // Edit mode: password is optional, but if filled must be valid and (self) confirm current.
      if (form.password) {
        if (isSelf && !form.current_password) errs.current_password = 'Password saat ini wajib diisi'
        if (form.password.length < 12) errs.password = 'Password minimal 12 karakter'
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(form.password)) {
          errs.password = 'Password harus mengandung huruf besar, kecil, angka, dan simbol'
        }
        if (form.password !== form.password_confirmation) errs.password_confirmation = 'Konfirmasi password tidak cocok'
      }
    } else {
      // Create mode: password is required.
      if (!form.password) errs.password = 'Password wajib diisi'
      else if (form.password.length < 12) errs.password = 'Password minimal 12 karakter'
      else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(form.password)) {
        errs.password = 'Password harus mengandung huruf besar, kecil, angka, dan simbol'
      }
      if (form.password !== form.password_confirmation) errs.password_confirmation = 'Konfirmasi password tidak cocok'
    }

    if (Object.keys(errs).length > 0) { setErrors(errs); return false }
    setErrors({})
    return true
  }

  const handleSaveAll = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      if (editingAdmin) {
        await adminFetch(`/admins/${editingAdmin.id}/name`, {
          method: 'PUT',
          body: JSON.stringify({ name: form.name })
        })
        await adminFetch(`/admins/${editingAdmin.id}/email`, {
          method: 'PUT',
          body: JSON.stringify({ email: form.email })
        })

        if (form.password) {
          const payload = {
            password: form.password,
            password_confirmation: form.password_confirmation,
          }
          if (isSelf) payload.current_password = form.current_password
          await adminFetch(`/admins/${editingAdmin.id}/password`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          })
        }

        fetchAdmins()

        const title = form.password ? 'Profil & Password Diperbarui' : 'Profil Admin Diperbarui'
        const notifMessage = form.password
          ? `Profil dan password admin "${form.name}" berhasil diperbarui.`
          : `Profil admin "${form.name}" berhasil diperbarui.`

        // Best-effort bell notification; never block success feedback.
        try {
          await adminFetch('/notifications', {
            method: 'POST',
            body: JSON.stringify({ type: 'admin', title, message: notifMessage })
          })
        } catch { /* ignore notification errors */ }

        closeModalKeepMessage()
        setMessage({ type: 'success', text: notifMessage })
      } else {
        await adminFetch('/admins', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation
          })
        })
        fetchAdmins()

        const title = 'Admin Baru Ditambahkan'
        const notifMessage = `Admin "${form.name}" berhasil ditambahkan ke sistem.`

        // Best-effort bell notification; never block success feedback.
        try {
          await adminFetch('/notifications', {
            method: 'POST',
            body: JSON.stringify({ type: 'admin', title, message: notifMessage })
          })
        } catch { /* ignore notification errors */ }

        closeModalKeepMessage()
        setMessage({ type: 'success', text: notifMessage })
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || (editingAdmin ? 'Gagal menyimpan perubahan' : 'Gagal membuat admin')
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (admin) => {
    if (!confirm(`Hapus admin "${admin.name}"?`)) return
    try {
      const data = await adminFetch(`/admins/${admin.id}`, { method: 'DELETE' })
      setMessage({ type: 'success', text: data.message || 'Admin berhasil dihapus' })
      fetchAdmins()
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Gagal menghapus admin' })
    }
  }

  const inputClass = (field) => `w-full px-3 py-2 bg-gray-50 dark:bg-[#141414] border rounded-lg text-sm transition-colors ${
    errors[field] ? 'border-red-500' : 'border-gray-200 dark:border-neutral-800 focus:border-gray-900 dark:focus:border-neutral-500'
  }`

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : springPreset}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manajemen Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola akun administrator sistem</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-[#141414] rounded-lg border border-gray-200 dark:border-neutral-800">
            <Users size={14} className="text-gray-900 dark:text-gray-100" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{slots.used}/{slots.max} Slot</span>
          </div>
          {slots.available > 0 && !showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingAdmin(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:brightness-110 transition"
            >
              <Plus size={16} /> Tambah Admin
            </button>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          message.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-green-500/10 border-green-500/30 text-green-400'
        }`}>
          {message.type === 'error' ? <AlertCircle size={20} className="flex-shrink-0" /> : <CheckCircle size={20} className="flex-shrink-0" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Admin List */}
      <div className="bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-[#141414] border-b border-gray-200 dark:border-neutral-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Nama</div>
          <div className="col-span-5">Email</div>
          <div className="col-span-2 text-right">Aksi</div>
        </div>

        {admins.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Belum ada admin terdaftar</div>
        ) : (
          admins.map((admin, idx) => (
            <div key={admin.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 dark:border-neutral-800 last:border-0 items-center hover:bg-gray-50 dark:bg-[#141414]/50 transition-colors">
              <div className="col-span-1 text-sm text-gray-500 dark:text-gray-400">#{idx + 1}</div>
              <div className="col-span-4 text-sm font-medium text-gray-900 dark:text-gray-100">{admin.name}</div>
              <div className="col-span-5 text-sm text-gray-500 dark:text-gray-400 break-words-force">{admin.email}</div>
              <div className="col-span-2 flex justify-end gap-2">
                <button onClick={() => handleEdit(admin)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:bg-[#141414] rounded-lg transition" title="Edit">
                  <User size={14} />
                </button>
                <button onClick={() => handleDelete(admin)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition" title="Hapus">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gray-50 dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{editingAdmin ? 'Edit Admin' : 'Tambah Admin Baru'}</h2>
              <button onClick={resetForm} className="p-1.5 hover:bg-gray-50 dark:bg-[#141414] rounded-lg transition">
                <X size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5"><User size={14} className="inline mr-1" /> Nama</label>
                <input type="text" value={form.name} onChange={(e) => { setForm(prev => ({ ...prev, name: e.target.value })); if (errors.name) setErrors(prev => ({ ...prev, name: null })); }} className={inputClass('name')} placeholder="Nama lengkap" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5"><Mail size={14} className="inline mr-1" /> Email</label>
                <input type="email" value={form.email} onChange={(e) => { setForm(prev => ({ ...prev, email: e.target.value })); if (errors.email) setErrors(prev => ({ ...prev, email: null })); }} className={inputClass('email')} placeholder="email@example.com" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Current Password (only when editing your own account) */}
              {editingAdmin && isSelf && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5"><Lock size={14} className="inline mr-1" /> Password Saat Ini</label>
                  <div className="relative">
                    <input type={showPasswords.current ? 'text' : 'password'} value={form.current_password} onChange={(e) => { setForm(prev => ({ ...prev, current_password: e.target.value })); if (errors.current_password) setErrors(prev => ({ ...prev, current_password: null })); }} className={`${inputClass('current_password')} pr-10`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.current_password && <p className="text-xs text-red-500 mt-1">{errors.current_password}</p>}
                </div>
              )}

              {/* New / Reset Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                  <Lock size={14} className="inline mr-1" /> {editingAdmin ? (isSelf ? 'Password Baru' : 'Reset Password') : 'Password'}
                </label>
                <div className="relative">
                  <input type={showPasswords.new ? 'text' : 'password'} value={form.password} onChange={(e) => { setForm(prev => ({ ...prev, password: e.target.value })); if (errors.password) setErrors(prev => ({ ...prev, password: null })); }} className={`${inputClass('password')} pr-10`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Min. 12 karakter, huruf besar, kecil, angka, dan simbol</p>
              </div>

              {/* Password Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Konfirmasi Password</label>
                <input type="password" value={form.password_confirmation} onChange={(e) => { setForm(prev => ({ ...prev, password_confirmation: e.target.value })); if (errors.password_confirmation) setErrors(prev => ({ ...prev, password_confirmation: null })); }} className={inputClass('password_confirmation')} placeholder="••••••••" />
                {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-neutral-800">
              <button onClick={resetForm} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-colors disabled:opacity-50">Batal</button>
              <button onClick={handleSaveAll} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:brightness-110 transition disabled:opacity-70 disabled:cursor-not-allowed">
                {saving ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white/70 dark:border-gray-900/70 border-t-transparent rounded-full" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
