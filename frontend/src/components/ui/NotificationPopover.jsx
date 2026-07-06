import { useState, useRef, useEffect, useCallback, useContext } from 'react'
import { Bell, CheckCircle, XCircle } from 'lucide-react'
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
  const ref = useRef(null)

  // Safely access auth context - works with or without AdminAuthProvider
  const authContext = useContext(AdminAuthContext)
  const isAuthenticated = authContext?.isAuthenticated || false

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      if (isAuthenticated) {
        const data = await fetchAdmin('/admin/notifications')
        setNotifications(data.data)
        setUnreadCount(data.unread_count)
      } else {
        const trackingId = localStorage.getItem('tracking_id')
        if (trackingId) {
          const res = await fetch(`${API_BASE}/notifications/${trackingId}`)
          if (res.ok) {
            const data = await res.json()
            setNotifications(data.data)
            setUnreadCount(data.data.filter(n => !n.read).length)
          }
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleMarkRead = async (id) => {
    if (!isAuthenticated) return
    try {
      await fetchAdmin(`/admin/notifications/${id}/read`, { method: 'POST' })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      // silently fail
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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.1] transition-colors"
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
          <div className="max-h-80 overflow-y-auto">
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
                    onClick={() => handleMarkRead(notification.id)}
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
                          {new Date(notification.created_at).toLocaleString('id-ID')}
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
  )
}

export default NotificationPopover
