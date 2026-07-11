// Route global interaction counters through the shared fetchAPI helper so they
// get timeout + AbortController support (request cancellation) and credentials.
import { fetchAPI } from './api'

const STORAGE_KEY = 'ilkom_interactions'

/**
 * Get all interactions from localStorage
 */
function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

/**
 * Save interactions to localStorage
 */
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/**
 * Generate a unique key for an item
 */
function getKey(type, id) {
  return `${type}_${id}`
}

/**
 * Toggle like for an item
 * @param {string} type - Item type (project, news, event)
 * @param {string|number} id - Item ID
 * @param {object} item - Item data to store (title, src, description, etc.)
 * @returns {boolean} - New like state
 */
export function toggleLike(type, id, item = {}) {
  const data = getAll()
  const key = getKey(type, id)
  if (!data[key]) data[key] = { liked: false, saved: false, shares: 0, viewed: false }
  data[key].liked = !data[key].liked
  
  // Store item data when liking
  if (data[key].liked && item && Object.keys(item).length > 0) {
    data[key].item = { ...data[key].item, ...item, type, id }
  }
  
  save(data)
  return data[key].liked
}

/**
 * Toggle save for an item
 * @param {string} type - Item type (project, news, event)
 * @param {string|number} id - Item ID
 * @param {object} item - Item data to store (title, src, description, etc.)
 * @returns {boolean} - New save state
 */
export function toggleSave(type, id, item = {}) {
  const data = getAll()
  const key = getKey(type, id)
  if (!data[key]) data[key] = { liked: false, saved: false, shares: 0, viewed: false }
  data[key].saved = !data[key].saved
  
  // Store item data when saving
  if (data[key].saved && item && Object.keys(item).length > 0) {
    data[key].item = { ...data[key].item, ...item, type, id }
  }
  
  save(data)
  return data[key].saved
}

/**
 * Record a share for an item
 * @param {string} type - Item type
 * @param {string|number} id - Item ID
 * @returns {number} - New share count
 */
export function recordShare(type, id) {
  const data = getAll()
  const key = getKey(type, id)
  if (!data[key]) data[key] = { liked: false, saved: false, shares: 0, viewed: false }
  data[key].shares = (data[key].shares || 0) + 1
  save(data)
  return data[key].shares
}

/**
 * Record a view for an item
 * @param {string} type - Item type
 * @param {string|number} id - Item ID
 * @param {object} item - Item data to store
 * @returns {boolean} - View state
 */
export function recordView(type, id, item = {}) {
  const data = getAll()
  const key = getKey(type, id)
  if (!data[key]) data[key] = { liked: false, saved: false, shares: 0, viewed: false }
  data[key].viewed = true
  
  // Store item data when viewing
  if (item && Object.keys(item).length > 0) {
    data[key].item = { ...data[key].item, ...item, type, id }
  }
  
  save(data)
  return data[key].viewed
}

/**
 * Get interaction state and counts for an item
 * @param {string} type - Item type
 * @param {string|number} id - Item ID
 * @returns {object} - Interaction state and counts
 */
export function getInteractionCounts(type, id) {
  const data = getAll()
  const key = getKey(type, id)
  const entry = data[key] || {}
  return {
    isLiked: entry.liked || false,
    isSaved: entry.saved || false,
    isViewed: entry.viewed || false,
    likes: entry.liked ? 1 : 0,
    saves: entry.saved ? 1 : 0,
    shares: entry.shares || 0,
  }
}

/**
 * Get all items with their interaction states
 * @returns {Array} - Array of items with interaction states
 */
export function getAllItems() {
  const data = getAll()
  return Object.entries(data).map(([key, v]) => {
    const [type, ...idParts] = key.split('_')
    return {
      type,
      id: idParts.join('_'),
      liked: v.liked || false,
      saved: v.saved || false,
      viewed: v.viewed || false,
      shares: v.shares || 0,
      ...(v.item || {}),
    }
  })
}


/**
 * Toggle global like in database
 * @param {string} type - Item type (news, project, ...)
 * @param {string|number} id - Item ID
 * @param {string} visitorId - Stable visitor id (sent in POST body)
 * @param {AbortSignal} [signal] - Optional signal to cancel the request
 * @returns {Promise<object>} - { liked, likes }
 */
export async function toggleGlobalLike(type, id, visitorId, signal) {
  try {
    const data = await fetchAPI(`/interactions/${type}/${id}/like`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: visitorId }),
      ...(signal ? { signal } : {}),
    })
    return {
      liked: data.liked || false,
      likes: data.likes || 0,
    }
  } catch (err) {
    if (import.meta.env.DEV) console.warn(`[interactions] toggleGlobalLike failed for ${type}/${id}:`, err.message)
    return { liked: false, likes: 0 }
  }
}

/**
 * Toggle global save in database
 * @param {string} type - Item type (news, project, ...)
 * @param {string|number} id - Item ID
 * @param {string} visitorId - Stable visitor id (sent in POST body)
 * @param {AbortSignal} [signal] - Optional signal to cancel the request
 * @returns {Promise<object>} - { saved, saves }
 */
export async function toggleGlobalSave(type, id, visitorId, signal) {
  try {
    const data = await fetchAPI(`/interactions/${type}/${id}/save`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: visitorId }),
      ...(signal ? { signal } : {}),
    })
    return {
      saved: data.saved || false,
      saves: data.saves || 0,
    }
  } catch (err) {
    if (import.meta.env.DEV) console.warn(`[interactions] toggleGlobalSave failed for ${type}/${id}:`, err.message)
    return { saved: false, saves: 0 }
  }
}

/**
 * Fetch global interaction stats for an item.
 * @param {string} type - Item type (news, project, ...)
 * @param {string|number} id - Item ID
 * @param {string} visitorId - Stable visitor id (sent as query param)
 * @returns {Promise<object>} - { views, likes, saves, shares, isLiked, isSaved }
 */
export async function getGlobalStats(type, id, visitorId) {
  try {
    const data = await fetchAPI(
      `/interactions/${type}/${id}/stats?visitor_id=${encodeURIComponent(visitorId)}`,
      { credentials: 'include' }
    )
    return {
      views: data.views || 0,
      likes: data.likes || 0,
      saves: data.saves || 0,
      shares: data.shares || 0,
      isLiked: !!data.isLiked,
      isSaved: !!data.isSaved,
    }
  } catch (err) {
    if (import.meta.env.DEV) console.warn(`[interactions] getGlobalStats failed for ${type}/${id}:`, err.message)
    return { views: 0, likes: 0, saves: 0, shares: 0, isLiked: false, isSaved: false }
  }
}

/**
 * Record a global view for an item.
 * @param {string} type - Item type (news, project, ...)
 * @param {string|number} id - Item ID
 * @param {string} visitorId - Stable visitor id (sent in POST body)
 * @returns {Promise<number|undefined>} - server views count
 */
export async function recordGlobalView(type, id, visitorId) {
  try {
    const data = await fetchAPI(`/interactions/${type}/${id}/view`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: visitorId }),
    })
    return data.views
  } catch (err) {
    if (import.meta.env.DEV) console.warn(`[interactions] recordGlobalView failed for ${type}/${id}:`, err.message)
    return undefined
  }
}

/**
 * Record a global share for an item.
 * @param {string} type - Item type (news, project, ...)
 * @param {string|number} id - Item ID
 * @param {string} visitorId - Stable visitor id (sent in POST body)
 * @returns {Promise<number|undefined>} - server shares count
 */
export async function recordGlobalShare(type, id, visitorId) {
  try {
    const data = await fetchAPI(`/interactions/${type}/${id}/share`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: visitorId }),
    })
    return data.shares
  } catch (err) {
    if (import.meta.env.DEV) console.warn(`[interactions] recordGlobalShare failed for ${type}/${id}:`, err.message)
    return undefined
  }
}
