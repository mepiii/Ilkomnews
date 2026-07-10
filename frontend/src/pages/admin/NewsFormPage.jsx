import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { adminNews } from '../../services/adminApi';
import { ADMIN_BASE } from '../../config/admin';
import { springPreset, useReducedMotionSafe } from '../../lib/animations';
import { useToast } from '../../components/ui/Toast';
import NewsPreviewCard from '../../components/admin/NewsPreviewCard';

const NEWS_LIST = `/${ADMIN_BASE}/news`;

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
  published: false,
};

const CATEGORIES = ['Workshop', 'Kompetisi', 'Pelatihan', 'Seminar'];

// Helper to get full URL for stored images
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `/storage/${path}`;
};

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
  const reduce = useReducedMotionSafe();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isEdit) return;
    adminNews.getById(id)
      .then((data) => {
        const item = data.news || data.data || data;
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
          published: Boolean(item.published),
        });
        
        // Handle main image preview - check both image_url and image
        const mainImageUrl = item.image_url || getImageUrl(item.image);
        if (mainImageUrl) {
          setImagePreview(mainImageUrl);
        }
        
        // Handle author image preview - check both author_image_url and author_image
        const authorUrl = item.author_image_url || getImageUrl(item.author_image);
        if (authorUrl) {
          setAuthorImagePreview(authorUrl);
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
  const authorObjectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (authorObjectUrlRef.current) {
        URL.revokeObjectURL(authorObjectUrlRef.current);
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateField('image', file);
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
      if (authorObjectUrlRef.current) {
        URL.revokeObjectURL(authorObjectUrlRef.current);
      }
      const url = URL.createObjectURL(file);
      authorObjectUrlRef.current = url;
      setAuthorImagePreview(url);
    }
  };

  const removeAuthorImage = () => {
    updateField('author_image', null);
    if (authorObjectUrlRef.current) {
      URL.revokeObjectURL(authorObjectUrlRef.current);
      authorObjectUrlRef.current = null;
    }
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
      
      if (form.image instanceof File) {
        formData.append('image', form.image);
      } else if (isEdit && !imagePreview) {
        formData.append('remove_image', '1');
      }

      if (form.author_image instanceof File) {
        formData.append('author_image', form.author_image);
      } else if (isEdit && !authorImagePreview) {
        formData.append('remove_author_image', '1');
      }
      
      if (isEdit) {
        await adminNews.updateWithForm(id, formData);
      } else {
        await adminNews.createWithForm(formData);
      }
      
      showToast(isEdit ? 'Berita berhasil diperbarui' : 'Berita berhasil dibuat', { type: 'success' });
      navigate(NEWS_LIST);
    } catch (err) {
      setServerError(err.message || 'Failed to save news');
      showToast(err.message || 'Gagal menyimpan berita', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors ${
      errors[field] ? 'border-red-400' : 'border-gray-200 dark:border-neutral-800'
    }`;

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : springPreset}
    >
      <div className="mb-6">
        <button
          onClick={() => navigate(NEWS_LIST)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Berita
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEdit ? 'Edit Berita' : 'Buat Berita Baru'}
        </h1>
      </div>

      {serverError && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : springPreset}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm"
        >
          {serverError}
        </motion.div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Preview Berita</h3>
        <NewsPreviewCard
          image={imagePreview}
          authorImage={authorImagePreview}
          title={form.title}
          category={form.category}
          summary={form.summary}
          author={form.author}
          date={form.date}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Judul <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={inputClass('title')}
              placeholder="Judul berita"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Kategori <span className="text-red-500">*</span></label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className={inputClass('category')}
            >
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Tanggal <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              className={`${inputClass('date')} dark:[color-scheme:dark]`}
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Ringkasan</label>
            <input
              type="text"
              value={form.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              className={inputClass('summary')}
              placeholder="Ringkasan singkat (opsional)"
            />
          </div>
        </div>

        {/* Author Section */}
        <div className="p-4 border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50 dark:bg-[#141414]/30">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Informasi Penulis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm text-gray-900 dark:text-gray-100">Nama Penulis</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => updateField('author', e.target.value)}
                className={inputClass('author')}
                placeholder="Nama penulis"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-gray-900 dark:text-gray-100">Institusi</label>
              <input
                type="text"
                value={form.author_institution}
                onChange={(e) => updateField('author_institution', e.target.value)}
                className={inputClass('author_institution')}
                placeholder="Universitas/Institusi"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-gray-900 dark:text-gray-100">Posisi/Jabatan</label>
              <input
                type="text"
                value={form.author_position}
                onChange={(e) => updateField('author_position', e.target.value)}
                className={inputClass('author_position')}
                placeholder="Dosen/Mahasiswa/Staf"
              />
            </div>
          </div>
          
          {/* Author Image Upload */}
          <div className="flex items-start gap-4">
            <div
              onClick={() => authorFileInputRef.current?.click()}
              className="relative cursor-pointer group"
            >
              <input type="file" accept="image/*" ref={authorFileInputRef} onChange={handleAuthorImageChange} className="hidden" />
              <div className={`w-20 h-20 rounded-full border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors ${
                authorImagePreview 
                  ? 'border-green-500/50 bg-gray-50 dark:bg-[#141414]' 
                  : 'border-gray-200 dark:border-neutral-800 hover:border-gray-900 dark:border-white bg-gray-50 dark:bg-[#141414]'
              }`}>
                {authorImagePreview ? (
                  <img 
                    src={authorImagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text x="50%" y="50%" fill="%239CA3AF" font-size="12" text-anchor="middle" dy=".3em">Error</text></svg>';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">Foto</span>
                  </div>
                )}
              </div>
              {authorImagePreview && (
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); removeAuthorImage(); }} 
                  className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-gray-100">Foto Profil Penulis</p>
              <p>Opsional. JPG/PNG, max 500KB.</p>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Gambar akan ditampilkan di preview berita.</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Konten <span className="text-red-500">*</span></label>
          <textarea 
            value={form.content} 
            onChange={(e) => updateField('content', e.target.value)} 
            rows={10} 
            className={inputClass('content')} 
            placeholder="Isi lengkap berita..." 
          />
          {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Thumbnail Berita</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 block border-2 border-dashed border-gray-200 dark:border-neutral-800 rounded-xl p-6 bg-gray-50 dark:bg-[#141414] text-center transition-colors hover:border-gray-900 dark:border-white cursor-pointer"
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
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-64 rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect fill="%23374151" width="400" height="200"/><text x="50%" y="50%" fill="%239CA3AF" font-size="14" text-anchor="middle" dy=".3em">Image Error</text></svg>';
                  }}
                />
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); removeImage(); }} 
                  className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-white dark:bg-[#0a0a0a] rounded-full">
                  <Upload size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Klik atau seret gambar</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
          <input 
            type="checkbox" 
            id="isPublished" 
            checked={form.published} 
            onChange={(e) => updateField('published', e.target.checked)} 
            className="w-5 h-5 accent-gray-900 dark:accent-white rounded" 
          />
          <label htmlFor="isPublished" className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
            Publikasikan secara publik
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
          <button 
            type="button" 
            onClick={() => navigate(NEWS_LIST)} 
            className="px-5 py-2 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:bg-[#141414] transition-colors font-medium"
          >
            Batal
          </button>
          <motion.button 
            type="submit" 
            disabled={saving} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={springPreset}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:brightness-110 transition-colors font-medium disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Menyimpan...' : 'Simpan Berita'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
