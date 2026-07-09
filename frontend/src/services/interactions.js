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
 * Get all liked items
 * @returns {Array} - Array of liked items
 */
function getLikedItems() {
  return getAllItems().filter(item => item.liked)
}

/**
 * Get all saved items
 * @returns {Array} - Array of saved items
 */
function getSavedItems() {
  return getAllItems().filter(item => item.saved)
}

/**
 * Get all viewed items
 * @returns {Array} - Array of viewed items
 */
function getViewedItems() {
  return getAllItems().filter(item => item.viewed)
}

/**
 * Get global stats from database API
 * This function fetches global interaction counts from the backend
 * @param {string} type - Item type (project, news, event)
 * @param {string|number} id - Item ID
 * @returns {Promise<object>} - Global stats { views, likes, saves, shares }
 */
async function getGlobalStats(type, id) {
  try {
    const response = await fetch(`/api/interactions/${type}/${id}/stats`)
    if (!response.ok) throw new Error('Failed to fetch stats')
    const data = await response.json()
    return {
      views: data.views || 0,
      likes: data.likes || 0,
      saves: data.saves || 0,
      shares: data.shares || 0,
    }
  } catch {
    return {
      views: 0,
      likes: 0,
      saves: 0,
      shares: 0,
    }
  }
}

/**
 * Increment global view count in database
 * @param {string} type - Item type
 * @param {string|number} id - Item ID
 * @returns {Promise<number>} - New view count
 */
async function incrementGlobalView(type, id) {
  try {
    const response = await fetch(`/api/interactions/${type}/${id}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to increment view')
    const data = await response.json()
    return data.views || 0
  } catch {
    return 0
  }
}

/**
 * Toggle global like in database
 * @param {string} type - Item type
 * @param {string|number} id - Item ID
 * @returns {Promise<object>} - { isLiked, likes }
 */
export async function toggleGlobalLike(type, id) {
  try {
    const response = await fetch(`/api/interactions/${type}/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to toggle like')
    const data = await response.json()
    return {
      isLiked: data.liked || false,
      likes: data.likes || 0,
    }
  } catch {
    return { isLiked: false, likes: 0 }
  }
}

/**
 * Toggle global save in database
 * @param {string} type - Item type
 * @param {string|number} id - Item ID
 * @returns {Promise<object>} - { isSaved, saves }
 */
export async function toggleGlobalSave(type, id) {
  try {
    const response = await fetch(`/api/interactions/${type}/${id}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error('Failed to toggle save')
    const data = await response.json()
    return {
      isSaved: data.saved || false,
      saves: data.saves || 0,
    }
  } catch {
    return { isSaved: false, saves: 0 }
  }
}
