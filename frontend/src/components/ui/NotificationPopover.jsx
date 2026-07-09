import { useState, useRef, useEffect, useCallback, useContext } from 'react'
import { createPortal } from 'react-dom'
import { Bell, CheckCircle, XCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchAdmin } from '../../services/adminApi'
import { AdminAuthContext } from '../../context/AdminAuthContext'
import { API_BASE } from '../../services/api'

const typeConfig = {
  accepted: { icon: CheckCircle, color: 'text-green-500', label: 'Diterima' },
  rejected: { icon: XCircle, color: 'text-red-500', label: 'Ditolak' },
}

const NotificationPopover = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const ref = useRef(null)
  const navigate = useNavigate()

  const authContext = useContext(AdminAuthContext)
  const isAuthenticated = authContext?.isAuthenticated || false

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      if (isAuthenticated) {
        const data = await fetchAdmin('/admin/notifications')
        setNotifications(data.data || [])
        setUnreadCount(data.unread_count || 0)
      } else {
        // Fetch notifications for all stored tracking IDs
        const trackingIds = JSON.parse(localStorage.getItem('tracking_ids') || '[]')
        const singleTrackingId = localStorage.getItem('tracking_id')
        
        // Combine both sources and dedupe
        const allTrackingIds = [...new Set([...trackingIds, singleTrackingId].filter(Boolean))]
        
        if (allTrackingIds.length > 0) {
          const fetchPromises = allTrackingIds.map(id => 
            fetch(`${API_BASE}/notifications/${id}`)
              .then(r => r.ok ? r.json() : { data: [] })
              .catch(() => ({ data: [] }))
          )
          
          const results = await Promise.all(fetchPromises)
          const allNotifications = results.flatMap(r => r.data || [])
          
          // Sort by created_at descending and remove duplicates by id
          const uniqueNotifications = allNotifications
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter((notif, index, self) => 
              index === self.findIndex(n => n.id === notif.id)
            )
          
          setNotifications(uniqueNotifications)
          setUnreadCount(uniqueNotifications.filter(n => !n.read).length)
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 60000)
    return () => clearInterval(intervalId)
  }, [fetchNotifications])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMarkRead = async (notification) => {
    try {
      if (isAuthenticated) {
        await fetchAdmin(`/admin/notifications/${notification.id}/read`, { method: 'POST' })
      } else {
        // Find the tracking_id for this notification from stored IDs
        const trackingIds = JSON.parse(localStorage.getItem('tracking_ids') || '[]')
        const singleTrackingId = localStorage.getItem('tracking_id')
        const allTrackingIds = [...new Set([...trackingIds, singleTrackingId].filter(Boolean))]
        
        // Try each tracking_id until one works
        for (const trackingId of allTrackingIds) {
          try {
            const res = await fetch(`${API_BASE}/notifications/${trackingId}/${notification.id}/read`, { method: 'POST' })
            if (res.ok) break
          } catch {
            continue
          }
        }
      }
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      // silently fail
    }
  }

  const handleNotificationClick = async (notification) => {
    await handleMarkRead(notification)
    setOpen(false)

    if (notification.type === 'accepted' && notification.project_id) {
      // Redirect to the published project in gallery
      navigate(`/ilkomgallery/project/${notification.project_id}`)
    } else if (notification.type === 'rejected') {
      // Show rejection reason modal
      document.body.classList.add("scroll-locked")
      setSelectedNotification(notification)
    }
  }

  const handleMarkAllRead = async () => {
    if (!isAuthenticated) return
    try {
      await fetchAdmin('/admin/notifications/read-all', { method: 'POST' })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      // silently fail
    }
  }

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.1] transition-colors"
          aria-label="Notifikasi"
        >
          <Bell size={18} className="text-black/60 dark:text-white/60" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg z-50">
            <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <p className="text-sm font-semibold text-black dark:text-white">Notifikasi</p>
              {isAuthenticated && unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto no-scrollbar">
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-neutral-400">Memuat...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4">
                  <p className="text-sm text-neutral-400 text-center py-4">Tidak ada notifikasi</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const config = typeConfig[notification.type] || typeConfig.accepted
                  const Icon = config.icon
                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-4 py-3 border-b border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={18} className={`mt-0.5 flex-shrink-0 ${config.color}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-black dark:text-white truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                            {notification.created_at ? new Date(notification.created_at).toLocaleString('id-ID') : ''}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rejection Reason Modal — portaled to body for proper centering */}
      {selectedNotification && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => { document.body.classList.remove("scroll-locked"); setSelectedNotification(null) }}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <p className="text-sm font-semibold text-black dark:text-white">Alasan Penolakan</p>
              <button
                onClick={() => { document.body.classList.remove("scroll-locked"); setSelectedNotification(null) }}
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
                    {selectedNotification.title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {selectedNotification.created_at ? new Date(selectedNotification.created_at).toLocaleString('id-ID') : ''}
                  </p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3 border border-red-100 dark:border-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {selectedNotification.project?.rejection_reason ||
                   selectedNotification.rejection_reason ||
                   selectedNotification.message?.replace(/.*Alasan: /, '') ||
                   'Tidak ada alasan spesifik'}
                </p>
              </div>
              <button
                onClick={() => { document.body.classList.remove("scroll-locked"); setSelectedNotification(null) }}
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
