import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Key, Globe, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminChatbot } from '../../services/adminApi'

export default function ChatbotApiPage() {
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: '', provider_type: '', model: '', api_key: '', base_url: '', is_active: false })
  const [saving, setSaving] = useState(false)
  
  const [showKeys, setShowKeys] = useState({})

  const fetchApis = async () => {
    try {
      setLoading(true)
      const data = await adminChatbot.getAll()
      setApis(data.data || data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApis()
  }, [])

  const handleOpenModal = (api = null) => {
    if (api) {
      // Backend returns model_id (DB column) but our form uses model
      setFormData({ ...api, model: api.model_id || api.model || '' })
    } else {
      setFormData({ id: null, name: '', provider_type: 'openai', model: 'gpt-3.5-turbo', api_key: '', base_url: '', is_active: true })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ id: null, name: '', provider_type: '', model: '', api_key: '', base_url: '', is_active: false })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (formData.id) {
        await adminChatbot.update(formData.id, formData)
      } else {
        await adminChatbot.create(formData)
      }
      await fetchApis()
      handleCloseModal()
    } catch (err) {
      alert('Error saving API: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus konfigurasi API ini?')) {
      try {
        await adminChatbot.delete(id)
        await fetchApis()
      } catch (err) {
        alert('Error deleting API: ' + err.message)
      }
    }
  }

  const toggleShowKey = (id) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-header">Chatbot API Manager</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Kelola integrasi API untuk Wolfy (OpenAI, Anthropic, dll).</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/25"
        >
          <Plus size={16} />
          Tambah API
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                <th className="py-4 px-6 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Provider</th>
                <th className="py-4 px-6 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Model</th>
                <th className="py-4 px-6 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">API Key</th>
                <th className="py-4 px-6 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {apis.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[var(--text-muted)] text-sm">
                    Belum ada konfigurasi API yang ditambahkan.
                  </td>
                </tr>
              ) : (
                apis.map((api) => (
                  <tr key={api.id} className="hover:bg-[var(--bg-secondary)]/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center">
                          <Globe size={16} className="text-[var(--accent)]" />
                        </div>
                        <span className="text-[var(--text-primary)] font-medium capitalize">{api.provider_type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[var(--text-secondary)] text-sm">{api.model_id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Key size={14} className="text-[var(--text-muted)]" />
                        <span className="text-[var(--text-secondary)] text-sm font-mono bg-[var(--bg-secondary)] px-2 py-1 rounded">
                          {showKeys[api.id] ? api.api_key : '••••••••••••••••'}
                        </span>
                        <button onClick={() => toggleShowKey(api.id)} className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-1">
                          {showKeys[api.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${api.is_active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-neutral-500/10 text-neutral-500 border border-neutral-500/20'}`}>
                        {api.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(api)}
                          className="p-2 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(api.id)}
                          className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {formData.id ? 'Edit API Chatbot' : 'Tambah API Chatbot'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nama Konfigurasi</label>
                  <input
                    required
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Production OpenAI, Development Claude"
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Provider</label>
                    <select
                      required
                      value={formData.provider_type}
                      onChange={(e) => {
                        const providerType = e.target.value
                        const baseUrls = {
                          openai: 'https://api.openai.com/v1',
                          anthropic: 'https://api.anthropic.com/v1',
                          gemini: 'https://generativelanguage.googleapis.com/v1',
                          custom: '',
                        }
                        setFormData({
                          ...formData,
                          provider_type: providerType,
                          base_url: formData.base_url || baseUrls[providerType] || ''
                        })
                      }}
                      className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="gemini">Gemini</option>
                      <option value="custom">Custom (OpenAI Compatible)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Model</label>
                    <input
                      required
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g. gpt-4o, claude-3-opus"
                      className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">API Key</label>
                  <input
                    required
                    type="password"
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Base URL (Opsional)</label>
                  <input
                    type="url"
                    value={formData.base_url || ''}
                    onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                    placeholder="https://api.openai.com/v1"
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                  </label>
                  <span className="text-sm font-medium text-[var(--text-primary)]">Set sebagai API Aktif</span>
                </div>

                <div className="flex gap-3 pt-4 mt-2 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-[var(--accent)] hover:bg-purple-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/25"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
