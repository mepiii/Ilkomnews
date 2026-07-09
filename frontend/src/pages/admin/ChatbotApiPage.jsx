import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Key, Globe, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminChatbot } from '../../services/adminApi'

export default function ChatbotApiPage() {
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: '', provider_type: '', model: '', api_key: '', base_url: '', prefix: '', api_type: 'chat', is_active: false })
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApis()
  }, [])

  const handleOpenModal = (api = null) => {
    if (api) {
      // Backend returns model_id (DB column) but our form uses model
      setFormData({ ...api, model: api.model_id || api.model || '', prefix: api.prefix || '', api_type: api.api_type || 'chat' })
    } else {
      setFormData({ id: null, name: '', provider_type: 'openai', model: 'gpt-3.5-turbo', api_key: '', base_url: '', prefix: '', api_type: 'chat', is_active: true })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ id: null, name: '', provider_type: '', model: '', api_key: '', base_url: '', prefix: '', api_type: 'chat', is_active: false })
  }

  
  const handleTestConnection = async () => {
    if (!formData.api_key || !formData.provider_type) {
      setTestResult({ success: false, message: 'Please fill in API Key and Provider Type' })
      return
    }
    setTesting(true)
    setTestResult(null)
    try {
      const result = await adminChatbot.testConnection({
        provider_type: formData.provider_type,
        api_key: formData.api_key,
        base_url: formData.base_url,
        model_id: formData.model,
        api_type: formData.api_type,
      })
      setTestResult({ success: true, message: result.message || 'Connection successful!' })
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Connection failed' })
    } finally {
      setTesting(false)
    }
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
        <div className="w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-header">Chatbot API Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola integrasi API untuk Wolfy (OpenAI, Anthropic, dll).</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white text-sm font-medium rounded-xl hover:opacity-90 transition-colors shadow-md"
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

      <div className="bg-gray-50 dark:bg-[#141414] backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#262626] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#141414]/50">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">API Key</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
              {apis.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    Belum ada konfigurasi API yang ditambahkan.
                  </td>
                </tr>
              ) : (
                apis.map((api) => (
                  <tr key={api.id} className="hover:bg-gray-50 dark:bg-[#141414]/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] flex items-center justify-center">
                          <Globe size={16} className="text-gray-900 dark:text-gray-100" />
                        </div>
                        <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">{api.provider_type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm">{api.model_id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Key size={14} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-mono bg-gray-50 dark:bg-[#141414] px-2 py-1 rounded">
                          {showKeys[api.id] ? api.api_key : '••••••••••••••••'}
                        </span>
                        <button onClick={() => toggleShowKey(api.id)} className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 transition-colors p-1">
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
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(api.id)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
              className="relative w-full max-w-lg bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-[#262626] bg-white dark:bg-[#0a0a0a]">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formData.id ? 'Edit API Chatbot' : 'Tambah API Chatbot'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Nama Konfigurasi</label>
                  <input
                    required
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Production OpenAI, Development Claude"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Provider</label>
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
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:border-white"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="gemini">Gemini</option>
                      <option value="custom">Custom (OpenAI Compatible)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Model</label>
                    <input
                      required
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g. gpt-4o, claude-3-opus"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">API Key</label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="password"
                      value={formData.api_key}
                      onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                      placeholder="sk-..."
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:border-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testing || !formData.api_key}
                      className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {testing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Key size={14} />
                          Check
                        </>
                      )}
                    </button>
                  </div>
                  {testResult && (
                    <div className={"mt-2 px-3 py-2 rounded-lg text-sm " + (testResult.success 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20")}>
                      {testResult.message}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Base URL (Opsional)</label>
                  <input
                    type="url"
                    value={formData.base_url || ''}
                    onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                    placeholder={formData.provider_type === 'anthropic' ? 'https://api.anthropic.com/v1' : 'https://api.openai.com/v1'}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:border-white"
                  />
                  {formData.provider_type === 'anthropic' && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">System will automatically append /messages for Anthropic API</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">System Prompt / Prefix (Opsional)</label>
                  <textarea
                    value={formData.prefix || ''}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                    rows={2}
                    placeholder="e.g. You are a helpful assistant..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:border-white resize-none"
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
                    <div className="w-11 h-6 bg-gray-50 dark:bg-[#141414] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 dark:bg-white"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Set sebagai API Aktif</span>
                </div>

                <div className="flex gap-3 pt-4 mt-2 border-t border-gray-200 dark:border-[#262626]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-gray-100 text-sm font-medium rounded-xl hover:bg-gray-50 dark:bg-[#141414] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white hover:opacity-90 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 shadow-md"
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
