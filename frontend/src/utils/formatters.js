// src/utils/formatters.js

/**
 * Format date ke format Indonesia
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal dalam format "1 Januari 2024"
 */
export const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return d.toLocaleDateString('id-ID', options)
}

/**
 * Format date dengan waktu
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal dalam format "1 Januari 2024, 14:30"
 */
export const formatDateTime = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  
  const dateOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }
  return `${d.toLocaleDateString('id-ID', dateOptions)}, ${d.toLocaleTimeString('id-ID', timeOptions)}`
}

/**
 * Format relative time (misal: 2 jam yang lalu)
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Waktu relatif seperti "2 jam yang lalu"
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-'
  const now = new Date()
  const target = new Date(date)
  const diff = now - target
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} tahun yang lalu`
  if (months > 0) return `${months} bulan yang lalu`
  if (weeks > 0) return `${weeks} minggu yang lalu`
  if (days > 0) return `${days} hari yang lalu`
  if (hours > 0) return `${hours} jam yang lalu`
  if (minutes > 0) return `${minutes} menit yang lalu`
  return 'Baru saja'
}

/**
 * Format number dengan separator ribuan
 * @param {number} num - Angka yang akan diformat
 * @returns {string} - Angka dengan format "1.000.000"
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Format currency Rupiah
 * @param {number} amount - Jumlah uang
 * @returns {string} - Format Rupiah seperti "Rp 1.000.000"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Truncate text
 * @param {string} text - Teks yang akan dipotong
 * @param {number} maxLength - Panjang maksimal
 * @returns {string} - Teks yang sudah dipotong dengan "..."
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Capitalize first letter
 * @param {string} str - String yang akan di-capitalize
 * @returns {string} - String dengan huruf pertama kapital
 */
export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalize each word
 * @param {string} str - String yang akan di-capitalize setiap katanya
 * @returns {string} - String dengan huruf pertama setiap kata kapital
 */
export const capitalizeWords = (str) => {
  if (!str) return ''
  return str.split(' ').map(word => capitalizeFirst(word)).join(' ')
}

/**
 * Format file size
 * @param {number} bytes - Ukuran file dalam bytes
 * @returns {string} - Format ukuran file seperti "1.5 MB"
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Extract initials from name
 * @param {string} name - Nama lengkap
 * @returns {string} - Inisial (maksimal 2 huruf)
 */
export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Format slug for URL (clean URL tanpa ID)
 * @param {string} text - Teks yang akan dijadikan slug
 * @returns {string} - Slug yang sudah diformat
 */
export const slugify = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, '')       // Hapus karakter special
    .replace(/\-\-+/g, '-')         // Ganti multiple - dengan single -
    .replace(/^-+/, '')             // Hapus - di awal
    .replace(/-+$/, '')             // Hapus - di akhir
}

/**
 * Generate slug dari title saja (tanpa ID)
 * @param {string} title - Judul artikel
 * @returns {string} - Slug format "judul-artikel"
 */
export const generateSlug = (title) => {
  if (!title) return ''
  return slugify(title)
}

/**
 * Generate slug dari title dan id (untuk URL yang unik dengan ID)
 * @param {string} title - Judul artikel
 * @param {number|string} id - ID artikel
 * @returns {string} - Slug format "judul-artikel-123"
 */
export const generateSlugWithId = (title, id) => {
  if (!title) return `${id}`
  const slug = slugify(title)
  return `${slug}-${id}`
}

/**
 * Extract ID dari slug (untuk slug dengan ID di akhir)
 * ID dianggap hanya angka 1-999 (bukan tahun seperti 2024, 2025, dll)
 * @param {string} slug - Slug URL
 * @returns {number|null} - ID yang diekstrak atau null
 */
export const getIdFromSlug = (slug) => {
  if (!slug) return null
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = parseInt(lastPart)
  // ID harus antara 1-999 (bukan tahun seperti 2024)
  if (!isNaN(id) && id >= 1 && id <= 999) {
    return id
  }
  return null
}

/**
 * Extract title dari slug (tanpa ID)
 * @param {string} slug - Slug URL
 * @returns {string} - Title yang sudah diformat
 */
export const getTitleFromSlug = (slug) => {
  if (!slug) return ''
  return slug.replace(/-/g, ' ')
}

/**
 * Cek apakah slug memiliki ID di akhir
 * ID dianggap hanya angka 1-999 (bukan tahun seperti 2024, 2025, dll)
 * @param {string} slug - Slug URL
 * @returns {boolean} - True jika slug memiliki ID di akhir
 */
export const hasIdInSlug = (slug) => {
  if (!slug) return false
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = parseInt(lastPart)
  return !isNaN(id) && id >= 1 && id <= 999
}

/**
 * Extract ID dari URL path
 * @param {string} pathname - Path URL (window.location.pathname)
 * @returns {number|null} - ID atau null
 */
export const getIdFromPath = (pathname) => {
  const parts = pathname.split('/')
  const lastPart = parts[parts.length - 1]
  return getIdFromSlug(lastPart)
}

/**
 * Check apakah string adalah ID (numeric)
 * @param {string} str - String yang akan dicek
 * @returns {boolean} - True jika hanya berisi angka
 */
export const isNumericId = (str) => {
  return /^\d+$/.test(str)
}

/**
 * Convert ID ke slug (untuk redirect)
 * @param {number|string} id - ID artikel
 * @param {string} title - Judul artikel
 * @param {string} path - Path prefix ('news', 'articles', 'events')
 * @returns {string} - URL lengkap dengan slug
 */
export const redirectIdToSlug = (id, title, path) => {
  const slug = generateSlug(title)
  return `${path}/${slug}`
}

/**
 * Format URL dengan slug (clean URL tanpa ID)
 * @param {string} type - Tipe konten ('news', 'articles', 'events')
 * @param {string} title - Judul artikel
 * @returns {string} - URL lengkap dengan slug
 */
export const formatDetailUrl = (type, title) => {
  const slug = generateSlug(title)
  return `/${type}/${slug}`
}

/**
 * Format URL dengan slug dan ID (untuk keunikan)
 * @param {string} type - Tipe konten ('news', 'articles', 'events')
 * @param {number|string} id - ID artikel
 * @param {string} title - Judul artikel
 * @returns {string} - URL lengkap dengan slug dan ID
 */
export const formatDetailUrlWithId = (type, id, title) => {
  const slug = generateSlugWithId(title, id)
  return `/${type}/${slug}`
}

/**
 * Get type from pathname
 * @param {string} pathname - Path URL
 * @returns {string} - Type ('news', 'articles', 'events')
 */
export const getTypeFromPath = (pathname) => {
  const parts = pathname.split('/')
  return parts[1] || ''
}

/**
 * Format read time (minutes)
 * @param {string} content - Konten teks
 * @returns {string} - Format waktu baca seperti "5 menit baca"
 */
export const formatReadTime = (content) => {
  if (!content) return '1 menit baca'
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} menit baca`
}

/**
 * Format phone number Indonesia
 * @param {string} phone - Nomor telepon
 * @returns {string} - Nomor telepon terformat
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1)
  }
  if (cleaned.startsWith('62')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '+$1 $2 $3 $4')
  }
  return phone
}

/**
 * Get status badge color
 * @param {string} status - Status ('active', 'inactive', 'pending', etc)
 * @returns {string} - CSS class untuk badge
 */
export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
    upcoming: 'bg-orange-100 text-orange-700',
    full: 'bg-red-100 text-red-700',
    available: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-red-100 text-red-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Format duration (days, hours, minutes)
 * @param {number} minutes - Durasi dalam menit
 * @returns {string} - Format durasi seperti "2 hari 3 jam 30 menit"
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '0 menit'
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  
  const parts = []
  if (days > 0) parts.push(`${days} hari`)
  if (hours > 0) parts.push(`${hours} jam`)
  if (mins > 0) parts.push(`${mins} menit`)
  
  return parts.join(' ')
}

/**
 * Parse query string to object
 * @param {string} queryString - Query string (contoh: '?page=1&limit=10')
 * @returns {object} - Object parameter
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

/**
 * Build query string from object
 * @param {object} params - Object parameter
 * @returns {string} - Query string (contoh: '?page=1&limit=10')
 */
export const buildQueryString = (params) => {
  const query = new URLSearchParams()
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      query.append(key, params[key])
    }
  })
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Format angka dengan suffix (K, M, B)
 * @param {number} num - Angka yang akan diformat
 * @returns {string} - Format angka dengan suffix
 */
export const formatNumberSuffix = (num) => {
  if (num === null || num === undefined) return '0'
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format tanggal dengan format custom
 * @param {string|Date} date - Tanggal
 * @param {string} format - Format yang diinginkan (YYYY, MM, DD, etc)
 * @returns {string} - Tanggal terformat
 */
export const formatDateCustom = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
}

/**
 * Escape HTML special characters
 * @param {string} str - String yang akan di-escape
 * @returns {string} - String yang sudah di-escape
 */
export const escapeHtml = (str) => {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Extract domain dari URL
 * @param {string} url - URL lengkap
 * @returns {string} - Domain name
 */
export const extractDomain = (url) => {
  if (!url) return ''
  const domain = url.replace(/(https?:\/\/)?(www\.)?/, '')
  return domain.split('/')[0]
}

/**
 * Validasi email
 * @param {string} email - Email yang akan divalidasi
 * @returns {boolean} - True jika email valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validasi URL
 * @param {string} url - URL yang akan divalidasi
 * @returns {boolean} - True jika URL valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Generate random string
 * @param {number} length - Panjang string
 * @returns {string} - Random string
 */
export const randomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Export semua functions sebagai object (default export)
export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  formatFileSize,
  getInitials,
  slugify,
  generateSlug,
  generateSlugWithId,
  getIdFromSlug,
  getTitleFromSlug,
  hasIdInSlug,
  getIdFromPath,
  isNumericId,
  redirectIdToSlug,
  formatDetailUrl,
  formatDetailUrlWithId,
  getTypeFromPath,
  formatReadTime,
  formatPhoneNumber,
  getStatusColor,
  formatDuration,
  parseQueryString,
  buildQueryString,
  formatNumberSuffix,
  formatDateCustom,
  escapeHtml,
  extractDomain,
  isValidEmail,
  isValidUrl,
  randomString
}