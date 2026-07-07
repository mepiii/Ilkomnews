import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { adminNews } from '../../services/adminApi';

const INITIAL_STATE = {
  title: '',
  summary: '',
  content: '',
  category: '',
  date: '',
  author: '',
  author_institution: '',
  author_position: '',
  author_image: null,
  image: null,
  tags: '',
  published: false,
};

const CATEGORIES = ['Workshop', 'Kompetisi', 'Pelatihan', 'Seminar'];

const TAG_OPTIONS = ['Berita', 'Kampus', 'Lomba', 'Teknologi', 'Workshop', 'Seminar', 'Kompetisi', 'Pelatihan', 'Event', 'Tutorial', 'Pembelajaran', 'Fasilkom', 'Unsri', 'Open Source', 'AI', 'Web Development', 'Mobile', 'UI/UX', 'Cyber Security', 'Data Science'];

export default function NewsFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const authorFileInputRef = useRef(null);

  const [form, setForm] = useState(INITIAL_STATE);
  const [imagePreview, setImagePreview] = useState(null);
  const [authorImagePreview, setAuthorImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    adminNews.getById(id)
      .then((data) => {
        const item = data.news || data;
        setForm({
          title: item.title || '',
          summary: item.summary || '',
          content: item.content || '',
          category: item.category || '',
          date: item.date ? item.date.split('T')[0] : '',
          author: item.author || '',
          author_institution: item.author_institution || '',
          author_position: item.author_position || '',
          author_image: null,
          image: null, 
          tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
          published: Boolean(item.published),
        });
        if (item.image_url || item.image) {
          setImagePreview(item.image_url || item.image);
        }
        if (item.author_image) {
          setAuthorImagePreview(item.author_image);
        }
      })
      .catch((err) => setServerError(err.message || 'Failed to fetch news'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const objectUrlRef = useRef(null);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateField('image', file);
      // Revoke previous object URL to avoid memory leaks
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    updateField('image', null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAuthorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateField('author_image', file);
      const url = URL.createObjectURL(file);
      setAuthorImagePreview(url);
    }
  };

  const removeAuthorImage = () => {
    updateField('author_image', null);
    setAuthorImagePreview(null);
    if (authorFileInputRef.current) {
      authorFileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Judul wajib diisi';
    if (!form.content.trim()) errs.content = 'Konten wajib diisi';
    if (!form.category) errs.category = 'Kategori wajib dipilih';
    if (!form.date) errs.date = 'Tanggal wajib diisi';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      return; 
    }
    
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('category', form.category);
      formData.append('date', form.date);
      formData.append('published', form.published ? '1' : '0');
      
      if (form.summary) formData.append('summary', form.summary);
      if (form.author) formData.append('author', form.author);
      if (form.author_institution) formData.append('author_institution', form.author_institution);
      if (form.author_position) formData.append('author_position', form.author_position);
      if (form.tags) {
        const tagsArray = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
        formData.append('tags', JSON.stringify(tagsArray));
      }
      
      if (form.image instanceof File) {
        formData.append('image', form.image);
      } else if (isEdit && !imagePreview) {
        // user removed the image in edit mode
        formData.append('remove_image', '1');
      }

      if (form.author_image instanceof File) {
        formData.append('author_image', form.author_image);
      } else if (isEdit && !authorImagePreview) {
        formData.append('remove_author_image', '1');
      }

      if (isEdit) {
        formData.append('_method', 'PUT');
        await adminNews.updateWithForm(id, formData);
      } else {
        await adminNews.createWithForm(formData);
      }
      
      navigate('/admin/news');
    } catch (err) {
      setServerError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)] ${
      errors[field]
        ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
        : 'border-[var(--border-color)]'
    }`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-4">
        <button
          onClick={() => navigate('/admin/news')}
          className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {isEdit ? 'Edit Berita' : 'Tambah Berita'}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Lengkapi form di bawah untuk artikel berita.</p>
        </div>
      </div>

      {serverError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Judul <span className="text-red-500">*</span></label>
          <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} className={inputClass('title')} placeholder="Masukkan judul..." />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Ringkasan</label>
          <textarea value={form.summary} onChange={(e) => updateField('summary', e.target.value)} rows={2} className={inputClass('summary')} placeholder="Ringkasan singkat (opsional)..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--text-primary)]">Kategori <span className="text-red-500">*</span></label>
            <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className={inputClass('category')}>
              <option value="">-- Pilih Kategori --</option>
              {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--text-primary)]">Tanggal <span className="text-red-500">*</span></label>
            <input type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)} className={inputClass('date')} />
            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--text-primary)]">Penulis</label>
            <input type="text" value={form.author} onChange={(e) => updateField('author', e.target.value)} className={inputClass('author')} placeholder="Nama Penulis" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--text-primary)]">Institusi/Perusahaan</label>
            <input type="text" value={form.author_institution} onChange={(e) => updateField('author_institution', e.target.value)} className={inputClass('author_institution')} placeholder="Contoh: FASILKOM Unsri" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--text-primary)]">Jabatan</label>
            <input type="text" value={form.author_position} onChange={(e) => updateField('author_position', e.target.value)} className={inputClass('author_position')} placeholder="Contoh: Ketua BEM" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--text-primary)]">Tags</label>
            <select
              value={form.tags ? form.tags.split(',')[0]?.trim() || '' : ''}
              onChange={(e) => updateField('tags', e.target.value)}
              className={inputClass('tags')}
            >
              <option value="">-- Pilih Tag --</option>
              {TAG_OPTIONS.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Foto Profil Penulis</label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => authorFileInputRef.current?.click()}
              className="relative group cursor-pointer shrink-0"
            >
              <input type="file" accept="image/*" ref={authorFileInputRef} onChange={handleAuthorImageChange} className="hidden" />
              <div className={`w-20 h-20 rounded-full border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors ${authorImagePreview ? 'border-green-500/50' : 'border-[var(--border-color)] hover:border-[var(--accent)]'}`}>
                {authorImagePreview ? (
                  <img src={authorImagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload size={20} className="text-[var(--text-secondary)]" />
                    <span className="text-[9px] text-[var(--text-muted)]">Foto</span>
                  </div>
                )}
              </div>
              {authorImagePreview && (
                <button type="button" onClick={(e) => { e.stopPropagation(); removeAuthorImage(); }} className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md">
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              <p className="font-medium text-[var(--text-primary)]">Foto Profil</p>
              <p>Opsional. JPG/PNG, max 5MB.</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Konten <span className="text-red-500">*</span></label>
          <textarea value={form.content} onChange={(e) => updateField('content', e.target.value)} rows={10} className={inputClass('content')} placeholder="Isi lengkap berita..." />
          {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Thumbnail Berita</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 block border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 bg-[var(--bg-secondary)] text-center transition-colors hover:border-[var(--accent)] cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }} className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-[var(--bg-primary)] rounded-full">
                  <Upload size={24} className="text-[var(--text-secondary)]" />
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  <span className="font-medium text-[var(--accent)]">Klik atau seret gambar</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
          <input type="checkbox" id="isPublished" checked={form.published} onChange={(e) => updateField('published', e.target.checked)} className="w-5 h-5 accent-[var(--accent)] rounded" />
          <label htmlFor="isPublished" className="font-medium text-[var(--text-primary)] cursor-pointer">
            Publikasikan secara publik
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="button" onClick={() => navigate('/admin/news')} className="px-5 py-2 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors font-medium">
            Batal
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--accent)] text-white rounded-lg hover:brightness-110 transition-colors font-medium disabled:opacity-50">
            <Save size={18} />
            {saving ? 'Menyimpan...' : 'Simpan Berita'}
          </button>
        </div>
      </form>
    </div>
  );
}
