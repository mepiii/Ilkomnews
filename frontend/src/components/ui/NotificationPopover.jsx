import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, XCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../../services/api'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const typeConfig = {
  accepted: { icon: CheckCircle, color: 'text-green-500', label: 'Diterima' },
  rejected: { icon: XCircle, color: 'text-red-500', label: 'Ditolak' },
  submitted: { icon: CheckCircle, color: 'text-emerald-500', label: 'Dikirim' },
}

// All tracking IDs the visitor has stored locally (from submissions and lookups).
function getTrackingIds() {
  let ids = []
  try {
    const parsed = JSON.parse(localStorage.getItem('tracking_ids') || '[]')
    if (Array.isArray(parsed)) ids = parsed
  } catch { /* corrupt value — ignore */ }
  const single = localStorage.getItem('tracking_id')
  return [...new Set([...ids, single].filter(Boolean))]
}

const NotificationPopover = ({ align = 'right', openUp = false }) => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const ref = useRef(null)
  // Last-good notifications per tracking ID. Kept in a ref so a transient
  // failure on one ID never drops its notifications from the merged list.
  const cacheRef = useRef({})
  const navigate = useNavigate()

  // Derived during render — never stored separately, so it cannot desync.
  const unreadCount = notifications.filter((n) => !n.read).length

  const fetchNotifications = useCallback(async () => {
    const trackingIds = getTrackingIds()
    if (trackingIds.length === 0) {
      cacheRef.current = {}
      setNotifications([])
      return
    }
    setLoading(true)
    try {
      // Fetch every tracked ID. Update the per-ID cache only on success; a
      // failed request leaves that ID's previous data untouched (no flicker).
      await Promise.all(
        trackingIds.map(async (id) => {
          try {
            const res = await fetch(`${API_BASE}/notifications/${id}`)
            if (!res.ok) return
            const json = await res.json()
            cacheRef.current[id] = (json.data || []).filter(
              (n) => n && n.tracking_id != null && n.type !== 'admin'
            )
          } catch {
            // network error — keep last-good data for this ID
          }
        })
      )

      // Drop cached entries for IDs the user no longer tracks.
      const active = new Set(trackingIds)
      for (const key of Object.keys(cacheRef.current)) {
        if (!active.has(key)) delete cacheRef.current[key]
      }

      const merged = Object.values(cacheRef.current)
        .flat()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .filter((n, i, self) => i === self.findIndex((x) => x.id === n.id))

      setNotifications(merged)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 10000)
    return () => clearInterval(intervalId)
  }, [fetchNotifications])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Refetch when the app signals new notifications, when a tracking ID is added
  // in another tab, or when the window regains focus.
  useEffect(() => {
    const onRefresh = () => fetchNotifications()
    window.addEventListener('notifications:refresh', onRefresh)
    window.addEventListener('storage', onRefresh)
    window.addEventListener('focus', onRefresh)
    return () => {
      window.removeEventListener('notifications:refresh', onRefresh)
      window.removeEventListener('storage', onRefresh)
      window.removeEventListener('focus', onRefresh)
    }
  }, [fetchNotifications])

  const markRead = async (notification) => {
    // Optimistic update; reconciles on the next fetch if the request fails.
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    )
    const trackingId = notification.tracking_id
    if (!trackingId) return
    // Mirror the read flag into the per-ID cache so a background refetch that
    // finishes before the server persists the change doesn't revert it.
    if (Array.isArray(cacheRef.current[trackingId])) {
      cacheRef.current[trackingId] = cacheRef.current[trackingId].map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    }
    try {
      await fetch(
        `${API_BASE}/notifications/${trackingId}/${notification.id}/read`,
        { method: 'POST' }
      )
    } catch { /* ignore */ }
  }

  const handleNotificationClick = async (notification) => {
    await markRead(notification)
    setOpen(false)
    if (notification.type === 'accepted' && notification.project_id) {
      navigate(`/ilkomgallery/project/${notification.project_id}`)
    } else if (notification.type === 'rejected') {
      document.body.classList.add('scroll-locked')
      setSelectedNotification(notification)
    } else if (notification.type === 'submitted' && notification.tracking_id) {
      navigate(`/track?id=${notification.tracking_id}`)
    }
  }

  return (
    <>
      <div className="relative" ref={ref}>
        <motion.button
          onClick={() => { const next = !open; setOpen(next); if (next) fetchNotifications() }}
          whileTap={{ scale: 0.92 }}
          className="relative p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.1] transition-colors"
          aria-label="Notifikasi"
        >
          <Bell size={18} className="text-black/60 dark:text-white/60" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: openUp ? 8 : -8, scale: 0.98 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: openUp ? 8 : -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className={`absolute w-[440px] max-w-[calc(100vw-1rem)] bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xl z-50 ${openUp ? 'bottom-full mb-2' : 'top-full mt-2'} ${align === 'left' ? 'right-0 lg:left-0 lg:right-auto' : 'right-0'}`}
            >
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                <p className="text-sm font-semibold text-black dark:text-white">Notifikasi</p>
              </div>
              <div className="max-h-[32rem] overflow-y-auto no-scrollbar">
                {loading && notifications.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-neutral-400">Memuat...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4">
                    <p className="text-sm text-neutral-400 text-center py-4">Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notification, idx) => {
                    const config = typeConfig[notification?.type] || typeConfig.submitted
                    const Icon = config.icon
                    const title = notification?.title || notification?.message || 'Notifikasi'
                    const message = notification?.message || (notification?.title ? '' : 'Anda memiliki pemberitahuan baru')
                    return (
                      <motion.button
                        key={notification?.id ?? `notify-${idx}`}
                        layout={!prefersReducedMotion}
                        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left px-4 py-4 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                          !notification?.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon size={18} className={`mt-0.5 flex-shrink-0 ${config.color}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-black dark:text-white truncate">{title}</p>
                            {message && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{message}</p>
                            )}
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                              {notification?.created_at ? new Date(notification.created_at).toLocaleString('id-ID') : ''}
                            </p>
                          </div>
                          {!notification?.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      </motion.button>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rejection Reason Modal — portaled to body for proper centering */}
      {selectedNotification && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => { document.body.classList.remove('scroll-locked'); setSelectedNotification(null) }}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <p className="text-sm font-semibold text-black dark:text-white">Alasan Penolakan</p>
              <button
                onClick={() => { document.body.classList.remove('scroll-locked'); setSelectedNotification(null) }}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X size={16} className="text-neutral-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    {selectedNotification?.title || selectedNotification?.message || 'Notifikasi'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {selectedNotification?.created_at ? new Date(selectedNotification.created_at).toLocaleString('id-ID') : ''}
                  </p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3 border border-red-100 dark:border-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {selectedNotification?.project?.rejection_reason ||
                   selectedNotification?.rejection_reason ||
                   selectedNotification?.message?.replace(/.*Alasan: /, '') ||
                   'Tidak ada alasan spesifik'}
                </p>
              </div>
              <button
                onClick={() => { document.body.classList.remove('scroll-locked'); setSelectedNotification(null) }}
                className="mt-4 w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default NotificationPopover
