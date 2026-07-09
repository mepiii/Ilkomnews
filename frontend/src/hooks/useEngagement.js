/**
 * Custom hook for managing user engagement (likes, saves, views)
 * - Views/Likes/Saves: stored in localStorage
 * - Thumbnail, creator info, collaborators: stored in database
 */

const STORAGE_KEYS = {
  LIKES: 'project_likes',
  SAVES: 'project_saves',
  VIEWS: 'project_views_local',
}

/**
 * Get items from localStorage
 */
const getStoredItems = (key) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * Save items to localStorage
 */
const setStoredItems = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * Hook for managing project engagement
 */
const useProjectEngagement = (projectId) => {
  const getLikes = () => {
    const likes = getStoredItems(STORAGE_KEYS.LIKES)
    return {
      isLiked: !!likes[projectId],
      count: likes[projectId]?.count || 0,
    }
  }

  const getSaves = () => {
    const saves = getStoredItems(STORAGE_KEYS.SAVES)
    return {
      isSaved: !!saves[projectId],
      savedAt: saves[projectId]?.savedAt || null,
    }
  }

  const getViews = () => {
    const views = getStoredItems(STORAGE_KEYS.VIEWS)
    return {
      viewCount: views[projectId] || 0,
    }
  }

  const toggleLike = () => {
    const likes = getStoredItems(STORAGE_KEYS.LIKES)
    const currentLike = likes[projectId]
    
    if (currentLike) {
      // Unlike
      delete likes[projectId]
      setStoredItems(STORAGE_KEYS.LIKES, likes)
      return { isLiked: false, count: 0 }
    } else {
      // Like
      likes[projectId] = {
        likedAt: new Date().toISOString(),
        count: 1,
      }
      setStoredItems(STORAGE_KEYS.LIKES, likes)
      return { isLiked: true, count: 1 }
    }
  }

  const toggleSave = () => {
    const saves = getStoredItems(STORAGE_KEYS.SAVES)
    const currentSave = saves[projectId]
    
    if (currentSave) {
      // Unsave
      delete saves[projectId]
      setStoredItems(STORAGE_KEYS.SAVES, saves)
      return { isSaved: false, savedAt: null }
    } else {
      // Save
      saves[projectId] = {
        savedAt: new Date().toISOString(),
      }
      setStoredItems(STORAGE_KEYS.SAVES, saves)
      return { isSaved: true, savedAt: new Date().toISOString() }
    }
  }

  const incrementView = () => {
    const views = getStoredItems(STORAGE_KEYS.VIEWS)
    views[projectId] = (views[projectId] || 0) + 1
    setStoredItems(STORAGE_KEYS.VIEWS, views)
    return views[projectId]
  }

  return {
    getLikes,
    getSaves,
    getViews,
    toggleLike,
    toggleSave,
    incrementView,
  }
}

/**
 * Get all saved projects
 */
const getSavedProjects = () => {
  const saves = getStoredItems(STORAGE_KEYS.SAVES)
  return Object.keys(saves).map(id => ({
    id: parseInt(id),
    savedAt: saves[id].savedAt,
  }))
}

/**
 * Get all liked projects
 */
const getLikedProjects = () => {
  const likes = getStoredItems(STORAGE_KEYS.LIKES)
  return Object.keys(likes).map(id => ({
    id: parseInt(id),
    likedAt: likes[id].likedAt,
  }))
}

/**
 * Check if a project is liked
 */
export const isProjectLiked = (projectId) => {
  const likes = getStoredItems(STORAGE_KEYS.LIKES)
  return !!likes[projectId]
}

/**
 * Check if a project is saved
 */
export const isProjectSaved = (projectId) => {
  const saves = getStoredItems(STORAGE_KEYS.SAVES)
  return !!saves[projectId]
}

export default useProjectEngagement
