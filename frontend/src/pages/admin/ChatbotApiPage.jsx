import { useState, useEffect } from 'react'
import { Key, Eye, EyeOff, Save, CheckCircle, XCircle, Plug } from 'lucide-react'
import { adminApiKeys } from '../../services/adminApi'

export default function ChatbotApiPage() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [model, setModel] = useState('gemini-2.5-flash')

  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApiKeys.getStatus()
      const gemini = data?.gemini ?? {}
      setStatus(gemini)
      if (gemini.chat_model) setModel(gemini.chat_model)
    } catch (err) {
      setError(err.message || 'Gagal memuat status API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg(null)
    setError(null)
    try {
      await adminApiKeys.updateGemini({ api_key: apiKey, chat_model: model })
      setSaveMsg({ success: true, message: 'Kunci API Gemini berhasil disimpan.' })
      setApiKey('')
      await fetchStatus()
    } catch (err) {
      setSaveMsg({ success: false, message: err.message || 'Gagal menyimpan kunci API.' })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestMsg(null)
    try {
      const res = await adminApiKeys.testGemini()
      const ok = res?.status === 'success'
      setTestMsg({ success: ok, message: res?.message || (ok ? 'Koneksi berhasil.' : 'Koneksi gagal.') })
    } catch (err) {
      setTestMsg({ success: false, message: err.message || 'Gagal menguji koneksi.' })
    } finally {
      setTesting(false)
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-header">Kunci API Gemini</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Kelola integrasi Google Gemini secara native untuk chatbot Wolfy.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
          <XCircle size={16} />
          {error}
        </div>
      )}

      <div className="bg-gray-50 dark:bg-[#141414] backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-sm space-y-6">
        {/* Status saat ini */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-neutral-800 flex items-center justify-center">
              <Key size={18} className="text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Status Gemini</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status?.configured ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-neutral-500/10 text-neutral-500 border border-neutral-500/20'}`}>
                  {status?.configured ? 'Terkonfigurasi' : 'Belum diatur'}
                </span>
                {status?.configured && status?.key_masked && (
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#141414] px-2 py-1 rounded border border-gray-200 dark:border-neutral-800">
                    {status.key_masked}
                  </span>
                )}
              </div>
            </div>
          </div>
          {status?.chat_model && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Model: <span className="font-medium text-gray-900 dark:text-gray-100">{status.chat_model}</span>
            </span>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Kunci API Gemini</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  required
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Masukkan Gemini API Key (mis. AIza...)"
                  className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-neutral-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:border-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors p-1"
                  aria-label={showKey ? 'Sembunyikan kunci' : 'Tampilkan kunci'}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Model</label>
            <input
              required
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gemini-2.5-flash"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-neutral-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:border-white font-mono"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Gunakan <code>gemini-2.5-flash</code> untuk cepat, atau <code>gemini-2.5-pro</code> untuk penalaran tinggi.
            </p>
          </div>

          {saveMsg && (
            <div className={"flex items-center gap-2 px-3 py-2 rounded-lg text-sm " + (saveMsg.success
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20")}>
              {saveMsg.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {saveMsg.message}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !apiKey}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-xl hover:opacity-90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  Menguji...
                </>
              ) : (
                <>
                  <Plug size={16} />
                  Uji Koneksi
                </>
              )}
            </button>
          </div>

          {testMsg && (
            <div className={"flex items-center gap-2 px-3 py-2 rounded-lg text-sm " + (testMsg.success
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20")}>
              {testMsg.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {testMsg.message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
