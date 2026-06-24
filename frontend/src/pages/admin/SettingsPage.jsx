import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, Eye, EyeOff, Settings as SettingsIcon, Save, X } from 'lucide-react';
import { adminChatbot } from '../../services/adminApi';

export default function SettingsPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    provider_type: '',
    model: '',
    api_key: '',
    base_url: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState({});

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await adminChatbot.getAll();
      setProviders(data.data || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const openModal = (provider = null) => {
    if (provider) {
      setFormData({
        id: provider.id,
        name: provider.name || '',
        provider_type: provider.provider_type || provider.provider || '',
        model: provider.model_id || provider.model || '',
        api_key: '',
        base_url: provider.base_url || '',
        is_active: provider.is_active ?? true,
      });
    } else {
      setFormData({
        id: null,
        name: '',
        provider_type: '',
        model: '',
        api_key: '',
        base_url: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        provider_type: formData.provider_type,
        model: formData.model,
        base_url: formData.base_url || undefined,
        is_active: formData.is_active,
      };
      
      if (formData.api_key) {
        payload.api_key = formData.api_key;
      }

      if (formData.id) {
        await adminChatbot.update(formData.id, payload);
      } else {
        if (!formData.api_key) throw new Error('API Key is required for new providers');
        await adminChatbot.create(payload);
      }
      
      await fetchProviders();
      closeModal();
    } catch (err) {
      alert('Error saving provider: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this provider?')) return;
    try {
      await adminChatbot.delete(id);
      await fetchProviders();
    } catch (err) {
      alert('Error deleting provider: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] font-header flex items-center gap-2">
          <SettingsIcon size={24} className="text-[var(--accent)]" />
          Settings (LLM CRUD)
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Manage AI model providers and configurations.</p>
      </div>

      {/* List Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">AI Providers</h2>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:brightness-110 transition-all"
          >
            <Plus size={16} /> Add Provider
          </button>
        </div>

        {error && (
          <div className="m-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="divide-y divide-[var(--border-color)]">
          {providers.length === 0 ? (
            <p className="py-12 text-center text-[var(--text-muted)] text-sm">No providers configured yet.</p>
          ) : (
            providers.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
                    <Globe size={18} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[var(--text-primary)]">{p.name || 'Unnamed'}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.is_active
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : 'bg-neutral-500/10 text-neutral-500 border border-neutral-500/20'
                      }`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {p.provider_type || p.provider || '—'} &bull; {p.model_id || p.model || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => openModal(p)} className="p-2 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl z-10 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {formData.id ? 'Edit Provider' : 'Add Provider'}
              </h3>
              <button onClick={closeModal} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" placeholder="e.g. Production GPT-4o" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Provider Type</label>
                  <input required type="text" value={formData.provider_type} onChange={(e) => setFormData({ ...formData, provider_type: e.target.value })} className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" placeholder="openai, anthropic..." list="provider-suggestions" />
                  <datalist id="provider-suggestions">
                    <option value="openai" />
                    <option value="anthropic" />
                    <option value="gemini" />
                    <option value="groq" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Model</label>
                  <input required type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" placeholder="gpt-4o, claude-3-5-sonnet..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  API Key {formData.id && <span className="text-[var(--text-muted)] font-normal">(leave blank to keep current)</span>}
                </label>
                <input type="password" value={formData.api_key} required={!formData.id} onChange={(e) => setFormData({ ...formData, api_key: e.target.value })} className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono" placeholder="sk-..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Base URL <span className="text-[var(--text-muted)] font-normal">(optional)</span></label>
                <input type="url" value={formData.base_url} onChange={(e) => setFormData({ ...formData, base_url: e.target.value })} className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" placeholder="https://api.openai.com/v1" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 accent-[var(--accent)] rounded" />
                <label htmlFor="isActive" className="text-sm text-[var(--text-primary)] cursor-pointer">Set as Active</label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[var(--border-color)]">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)] font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:brightness-110 transition-colors font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2">
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Provider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
