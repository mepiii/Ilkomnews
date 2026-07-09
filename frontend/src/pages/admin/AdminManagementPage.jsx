import { useState, useEffect } from 'react'
import { User, Mail, Lock, Save, Eye, EyeOff, Plus, Trash2, X, AlertCircle, CheckCircle, Users } from 'lucide-react'
import { adminFetch } from '../../services/adminApi'

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([])
  const [slots, setSlots] = useState({ used: 0, max: 9, available: 9 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [errors, setErrors] = useState({})
  const [showPasswords, setShowPasswords] = useState({})
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    current_password: ''
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      const data = await adminFetch('/admins')
      // Handle both response formats: { admins: [...] } or direct array
      const adminList = Array.isArray(data) ? data : (data.admins || [])
      const slotsInfo = data.slots || { used: adminList.length, max: 9, available: 9 - adminList.length }
      setAdmins(adminList)
      setSlots(slotsInfo)
    } catch (err) {
      setMessage({ type: 'error', text: `Gagal memuat data admin: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      current_password: ''
    })
    setErrors({})
    setEditingAdmin(null)
    setShowForm(false)
    setMessage({ type: '', text: '' })
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setForm({
      name: admin.name,
      email: admin.email,
      password: '',
      password_confirmation: '',
      current_password: ''
    })
    setShowForm(true)
    setMessage({ type: '', text: '' })
  }

  const handleUpdateName = async () => {
    if (!form.name.trim()) {
      setErrors({ name: 'Nama wajib diisi' })
      return
    }
    
    try {
      const data = await adminFetch(`/admins/${editingAdmin.id}/name`, {
        method: 'PUT',
        body: JSON.stringify({ name: form.name })
      })
      setMessage({ type: 'success', text: data.message || 'Nama berhasil diperbarui' })
      fetchAdmins()
      setEditingAdmin(data.admin)
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Gagal memperbarui nama' })
    }
  }

  const handleUpdateEmail = async () => {
    if (!form.email.trim()) {
      setErrors({ email: 'Email wajib diisi' })
      return
    }
    
    try {
      const data = await adminFetch(`/admins/${editingAdmin.id}/email`, {
        method: 'PUT',
        body: JSON.stringify({ email: form.email })
      })
      setMessage({ type: 'success', text: data.message || 'Email berhasil diperbarui' })
      fetchAdmins()
      setEditingAdmin(data.admin)
    } catch (err) {
      setErrors({ email: err.message || 'Gagal memperbarui email' })
    }
  }

  const handleUpdatePassword = async () => {
    const errs = {}
    if (!form.current_password) errs.current_password = 'Password saat ini wajib diisi'
    if (!form.password) errs.password = 'Password baru wajib diisi'
    else if (form.password.length < 12) errs.password = 'Password minimal 12 karakter'
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(form.password)) {
      errs.password = 'Password harus mengandung huruf besar, kecil, angka, dan simbol'
    }
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Konfirmasi password tidak cocok'
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    
    try {
      const data = await adminFetch(`/admins/${editingAdmin.id}/password`, {
        method: 'PUT',
        body: JSON.stringify({
          current_password: form.current_password,
          password: form.password,
          password_confirmation: form.password_confirmation
        })
      })
      setMessage({ type: 'success', text: data.message || 'Password berhasil diperbarui' })
      setForm(prev => ({ ...prev, password: '', password_confirmation: '', current_password: '' }))
    } catch (err) {
      const errorMsg = err.message || 'Gagal memperbarui password'
      setErrors({ current_password: errorMsg })
    }
  }

  const handleCreate = async () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.email.trim()) errs.email = 'Email wajib diisi'
    if (!form.password) errs.password = 'Password wajib diisi'
    else if (form.password.length < 12) errs.password = 'Password minimal 12 karakter'
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(form.password)) {
      errs.password = 'Password harus mengandung huruf besar, kecil, angka, dan simbol'
    }
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Konfirmasi password tidak cocok'
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    
    try {
      const data = await adminFetch('/admins', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation
        })
      })
      setMessage({ type: 'success', text: data.message || 'Admin berhasil dibuat' })
      fetchAdmins()
      resetForm()
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Gagal membuat admin' })
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
    errors[field] ? 'border-red-500' : 'border-gray-200 dark:border-[#262626] focus:border-gray-900 dark:border-white'
  }`

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manajemen Admin</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Kelola akun administrator sistem
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-[#141414] rounded-lg border border-gray-200 dark:border-[#262626]">
            <Users size={14} className="text-gray-900 dark:text-gray-100" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {slots.used}/{slots.max} Slot
            </span>
          </div>
          {slots.available > 0 && !showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingAdmin(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white rounded-lg text-sm font-medium hover:brightness-110 transition"
            >
              <Plus size={16} /> Tambah Admin
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Admin List */}
      <div className="bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#262626] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-[#141414] border-b border-gray-200 dark:border-[#262626] text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Nama</div>
          <div className="col-span-5">Email</div>
          <div className="col-span-2 text-right">Aksi</div>
        </div>
        
        {admins.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
            Belum ada admin terdaftar
          </div>
        ) : (
          admins.map((admin) => (
            <div key={admin.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 dark:border-[#262626] last:border-0 items-center hover:bg-gray-50 dark:bg-[#141414]/50 transition-colors">
              <div className="col-span-1 text-sm text-gray-400 dark:text-gray-500">#{admin.id}</div>
              <div className="col-span-4 text-sm font-medium text-gray-900 dark:text-gray-100">{admin.name}</div>
              <div className="col-span-5 text-sm text-gray-500 dark:text-gray-400">{admin.email}</div>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(admin)}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:bg-[#141414] rounded-lg transition"
                  title="Edit"
                >
                  <User size={14} />
                </button>
                <button
                  onClick={() => handleDelete(admin)}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                  title="Hapus"
                >
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
          <div className="w-full max-w-md bg-gray-50 dark:bg-[#141414] rounded-2xl border border-gray-200 dark:border-[#262626] shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#262626]">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editingAdmin ? 'Edit Admin' : 'Tambah Admin Baru'}
              </h2>
              <button onClick={resetForm} className="p-1.5 hover:bg-gray-50 dark:bg-[#141414] rounded-lg transition">
                <X size={18} className="text-gray-400 dark:text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                  <User size={14} className="inline mr-1" /> Nama
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => { setForm(prev => ({ ...prev, name: e.target.value })); if (errors.name) setErrors(prev => ({ ...prev, name: null })); }}
                  className={inputClass('name')}
                  placeholder="Nama lengkap"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                  <Mail size={14} className="inline mr-1" /> Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm(prev => ({ ...prev, email: e.target.value })); if (errors.email) setErrors(prev => ({ ...prev, email: null })); }}
                  className={inputClass('email')}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Current Password (only for editing) */}
              {editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                    <Lock size={14} className="inline mr-1" /> Password Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={form.current_password}
                      onChange={(e) => { setForm(prev => ({ ...prev, current_password: e.target.value })); if (errors.current_password) setErrors(prev => ({ ...prev, current_password: null })); }}
                      className={`${inputClass('current_password')} pr-10`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.current_password && <p className="text-xs text-red-500 mt-1">{errors.current_password}</p>}
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                  <Lock size={14} className="inline mr-1" /> {editingAdmin ? 'Password Baru' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => { setForm(prev => ({ ...prev, password: e.target.value })); if (errors.password) setErrors(prev => ({ ...prev, password: null })); }}
                    className={`${inputClass('password')} pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Min. 12 karakter, huruf besar, kecil, angka, dan simbol</p>
              </div>

              {/* Password Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={(e) => { setForm(prev => ({ ...prev, password_confirmation: e.target.value })); if (errors.password_confirmation) setErrors(prev => ({ ...prev, password_confirmation: null })); }}
                  className={inputClass('password_confirmation')}
                  placeholder="••••••••"
                />
                {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-[#262626]">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-colors"
              >
                Batal
              </button>
              {editingAdmin ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateName}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-white text-white rounded-lg text-sm font-medium hover:brightness-110 transition"
                  >
                    <Save size={14} /> Nama
                  </button>
                  <button
                    onClick={handleUpdateEmail}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-white text-white rounded-lg text-sm font-medium hover:brightness-110 transition"
                  >
                    <Mail size={14} /> Email
                  </button>
                  {form.password && (
                    <button
                      onClick={handleUpdatePassword}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:brightness-110 transition"
                    >
                      <Lock size={14} /> Password
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white rounded-lg text-sm font-medium hover:brightness-110 transition"
                >
                  <Plus size={14} /> Buat Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
