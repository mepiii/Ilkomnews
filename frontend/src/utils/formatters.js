/**
 * Format date ke format Indonesia
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Format relative time (misal: 2 jam yang lalu)
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-'
  const diff = new Date() - new Date(date)
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
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Format read time (minutes)
 * @param {string} content
 * @returns {string}
 */
export const formatReadTime = (content) => {
  if (!content) return '1 menit baca'
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / 200)
  return `${minutes} menit baca`
}

/** Internal helper — not exported */
const slugify = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Generate slug dari title
 * @param {string} title
 * @returns {string}
 */
export const generateSlug = (title) => {
  if (!title) return ''
  return slugify(title)
}

/**
 * Extract ID dari slug (1-999 only, excludes years)
 * @param {string} slug
 * @returns {number|null}
 */
export const getIdFromSlug = (slug) => {
  if (!slug) return null
  const parts = slug.split('-')
  const id = parseInt(parts[parts.length - 1])
  return (!isNaN(id) && id >= 1 && id <= 999) ? id : null
}

/**
 * Extract title dari slug
 * @param {string} slug
 * @returns {string}
 */
export const getTitleFromSlug = (slug) => {
  if (!slug) return ''
  return slug.replace(/-/g, ' ')
}

/**
 * Cek apakah slug memiliki ID di akhir (1-999)
 * @param {string} slug
 * @returns {boolean}
 */
export const hasIdInSlug = (slug) => {
  if (!slug) return false
  const parts = slug.split('-')
  const id = parseInt(parts[parts.length - 1])
  return !isNaN(id) && id >= 1 && id <= 999
}

/**
 * Check apakah string adalah numeric ID
 * @param {string} str
 * @returns {boolean}
 */
export const isNumericId = (str) => /^\d+$/.test(str)

/**
 * Format date dengan waktu (untuk admin pages)
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
