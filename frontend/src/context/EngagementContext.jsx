import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore } from 'react'
import { useVisitorId } from '../hooks/useVisitorId'
import {
  getGlobalStats,
  toggleGlobalLike,
  toggleGlobalSave,
  recordGlobalView,
  recordGlobalShare,
  recordShare as recordShareLocal,
} from '../services/interactions'

const STORAGE_KEY = 'ilkom_interactions'

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* localStorage may be unavailable */
  }
}

const EMPTY = { liked: false, saved: false, viewed: false, shared: false, views: 0, likes: 0, saves: 0, shares: 0, loaded: false }

// Module-scope mirror of the provider's state, so the per-key selector hook
// (useEngagementItem) can read the live value without subscribing to the
// whole context value. Kept in sync from inside EngagementProvider.
const providerStateRef = { current: {} }

// eslint-disable-next-line react-refresh/only-export-components
export function keyOf(type, id) {
  return `${type}:${id}`
}

// Mirror an entry into the legacy `ilkom_interactions` localStorage store so
// KoleksiPage's getAllItems() keeps reflecting likes/saves/views. Existing
// `item` data is preserved so Koleksi cards keep their title/thumbnail.
function mirrorToLocal(type, id, entry) {
  const data = readLocal()
  const lk = `${type}_${id}`
  const prev = data[lk] || {}
  data[lk] = {
    liked: !!entry.liked,
    saved: !!entry.saved,
    shared: !!entry.shared,
    shares: entry.shares || 0,
    viewed: entry.viewed || prev.viewed || false,
    item: entry.item || prev.item || { type, id },
  }
  writeLocal(data)
}

function mirrorViewed(type, id) {
  const data = readLocal()
  const lk = `${type}_${id}`
  const prev = data[lk] || {}
  data[lk] = { ...prev, viewed: true, item: prev.item || { type, id } }
  writeLocal(data)
}

const EngagementContext = createContext(null)

export function EngagementProvider({ children }) {
  const visitorId = useVisitorId()
  const [state, setState] = useState({})

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
    providerStateRef.current = state
  }, [state])

  const inFlight = useRef(new Set())
  const registry = useRef(new Map())

  const update = useCallback((type, id, patch) => {
    setState((prev) => {
      const key = keyOf(type, id)
      const merged = { ...(prev[key] || EMPTY), ...patch }
      mirrorToLocal(type, id, merged)
      return { ...prev, [key]: merged }
    })
    notifyKey(keyOf(type, id))
  }, [])

  const get = useCallback((type, id) => {
    return stateRef.current[keyOf(type, id)] || { ...EMPTY }
  }, [])

  const doFetch = useCallback((type, id) => {
    const key = keyOf(type, id)
    if (inFlight.current.has(key)) return
    if (!visitorId) return
    inFlight.current.add(key)
    getGlobalStats(type, id, visitorId)
      .then((data) =>
        update(type, id, {
          liked: !!data.isLiked,
          saved: !!data.isSaved,
          views: data.views || 0,
          likes: data.likes || 0,
          saves: data.saves || 0,
          shares: data.shares || 0,
          loaded: true,
        })
      )
      .catch(() => update(type, id, { loaded: true }))
      .finally(() => inFlight.current.delete(key))
  }, [visitorId, update])

  const ensure = useCallback((type, id) => {
    const key = keyOf(type, id)
    registry.current.set(key, { type, id })
    const entry = stateRef.current[key]
    if (!entry || !entry.loaded) doFetch(type, id)
    return stateRef.current[key] || { ...EMPTY }
  }, [doFetch])

  const toggleLike = useCallback((type, id) => {
    const key = keyOf(type, id)
    const cur = stateRef.current[key] || { ...EMPTY }
    const next = !cur.liked
    update(type, id, { liked: next, likes: Math.max(0, (cur.likes || 0) + (next ? 1 : -1)) })
    if (visitorId) {
      toggleGlobalLike(type, id, visitorId)
        .then((data) => update(type, id, { liked: !!data.liked, likes: data.likes || 0 }))
        .catch(() => {})
    }
  }, [visitorId, update])

  const toggleSave = useCallback((type, id) => {
    const key = keyOf(type, id)
    const cur = stateRef.current[key] || { ...EMPTY }
    const next = !cur.saved
    update(type, id, { saved: next, saves: Math.max(0, (cur.saves || 0) + (next ? 1 : -1)) })
    if (visitorId) {
      toggleGlobalSave(type, id, visitorId)
        .then((data) => update(type, id, { saved: !!data.saved, saves: data.saves || 0 }))
        .catch(() => {})
    }
  }, [visitorId, update])

  const recordView = useCallback((type, id, meta) => {
    const key = keyOf(type, id)
    const cur = stateRef.current[key] || { ...EMPTY }
    // One user, one view: if this user already counted a view, do nothing.
    if (cur.viewed) return
    update(type, id, { views: (cur.views || 0) + 1, viewed: true, item: meta || cur.item })
    mirrorViewed(type, id)
    if (visitorId) {
      recordGlobalView(type, id, visitorId)
        .then((views) => {
          if (typeof views === 'number') update(type, id, { views })
        })
        .catch(() => {})
    }
  }, [visitorId, update])

  const recordShare = useCallback((type, id) => {
    const key = keyOf(type, id)
    const cur = stateRef.current[key] || { ...EMPTY }
    // One user, one share: if this user already counted a share, do not
    // increment the counter, mirror locally, or hit the backend again.
    if (cur.shared) return
    update(type, id, { shared: true, shares: (cur.shares || 0) + 1 })
    recordShareLocal(type, id)
    if (visitorId) {
      recordGlobalShare(type, id, visitorId)
        .then((shares) => {
          if (typeof shares === 'number') update(type, id, { shares })
        })
        .catch(() => {})
    }
  }, [visitorId, update])

  // Once the visitor id is available, (re)fetch all registered keys so the
  // initial stats load even if ensure() ran before visitorId resolved.
  useEffect(() => {
    if (!visitorId) return
    registry.current.forEach(({ type, id }) => {
      const entry = stateRef.current[keyOf(type, id)]
      if (!entry || !entry.loaded) doFetch(type, id)
    })
  }, [visitorId, doFetch])

  // Cross-tab sync: merge changes written to ilkom_interactions elsewhere.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      let data
      try {
        data = JSON.parse(e.newValue)
      } catch {
        return
      }
      setState((prev) => {
        const next = { ...prev }
        Object.entries(data).forEach(([k, v]) => {
          const idx = k.indexOf('_')
          if (idx === -1) return
          const type = k.slice(0, idx)
          const id = k.slice(idx + 1)
          const key = keyOf(type, id)
          if (next[key]) {
            next[key] = {
              ...next[key],
              liked: !!v.liked,
              saved: !!v.saved,
              shared: !!v.shared,
              shares: v.shares || 0,
              viewed: !!v.viewed,
            }
          }
        })
        return next
      })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(
    () => ({ state, get, ensure, update, toggleLike, toggleSave, recordView, recordShare }),
    [state, get, ensure, update, toggleLike, toggleSave, recordView, recordShare]
  )

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>
}

// Per-key subscription store so a card re-renders only when ITS entry changes,
// not on every state update. Without this the flat `state` object in `value`
// churns `useEngagement()` consumers app-wide on each card's mount/fetch.
// notifyKey is called from update() above; subscribers read stateRef via the
// selector hook. ponytail: one global listener Map, per-key getSnapshot.
const engagementSubs = new Map() // key -> Set<callback>

const subscribeKey = (key, cb) => {
  let set = engagementSubs.get(key)
  if (!set) {
    set = new Set()
    engagementSubs.set(key, set)
  }
  set.add(cb)
  return () => {
    set.delete(cb)
    if (set.size === 0) engagementSubs.delete(key)
  }
}

const notifyKey = (key) => {
  engagementSubs.get(key)?.forEach((cb) => cb())
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEngagement() {
  const ctx = useContext(EngagementContext)
  if (!ctx) {
    throw new Error('useEngagement must be used within an EngagementProvider')
  }
  return ctx
}

// Selector hook: subscribe to one item only. Used by ExpandableCard so a
// like/save/view on card A never re-renders card B. getSnapshot reads the same
// `stateRef` the provider writes, so it always returns the live value.
// eslint-disable-next-line react-refresh/only-export-components
export function useEngagementItem(type, id) {
  const key = keyOf(type, id)
  const snapshot = useSyncExternalStore(
    useCallback((cb) => subscribeKey(key, cb), [key]),
    () => providerStateRef.current[keyOf(type, id)] || EMPTY,
    () => EMPTY
  )
  return snapshot
}
