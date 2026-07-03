const STORAGE_KEY = 'ilkom_interactions'

function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getKey(type, id) {
  return `${type}_${id}`
}

export function toggleLike(type, id) {
  const data = getAll()
  const key = getKey(type, id)
  if (!data[key]) data[key] = { liked: false, saved: false, shares: 0 }
  data[key].liked = !data[key].liked
  save(data)
  return data[key].liked
}

export function toggleSave(type, id, item = {}) {
  const data = getAll()
  const key = getKey(type, id)
  if (!data[key]) data[key] = { liked: false, saved: false, shares: 0 }
  data[key].saved = !data[key].saved
  if (data[key].saved) {
    data[key].item = item
  } else {
    delete data[key].item
  }
  save(data)
  return data[key].saved
}

export function recordShare(type, id) {
  const data = getAll()
  const key = getKey(type, id)
  if (!data[key]) data[key] = { liked: false, saved: false, shares: 0 }
  data[key].shares = (data[key].shares || 0) + 1
  save(data)
  return data[key].shares
}

export function getInteractionCounts(type, id) {
  const data = getAll()
  const key = getKey(type, id)
  const entry = data[key] || {}
  return {
    isLiked: entry.liked || false,
    isSaved: entry.saved || false,
    likes: entry.liked ? 1 : 0,
    saves: entry.saved ? 1 : 0,
    shares: entry.shares || 0,
  }
}

export function getSavedItems() {
  const data = getAll()
  return Object.entries(data)
    .filter(([, v]) => v.saved)
    .map(([key, v]) => {
      const [type, ...idParts] = key.split('_')
      return { type, id: idParts.join('_'), ...v.item }
    })
}
