import { API_BASE } from '../services/api'

/**
 * Open a server-sent-events stream for one tracking ID.
 * Handlers: { onInit(payload), onNotification(notif) }
 * Returns the EventSource — caller must call .close() on unmount.
 */
export function openNotificationStream(trackingId, handlers) {
  const es = new EventSource(`${API_BASE}/notifications/stream/${trackingId}`)
  es.addEventListener('init', (e) => handlers.onInit(JSON.parse(e.data)))
  es.addEventListener('notification', (e) => handlers.onNotification(JSON.parse(e.data)))
  return es
}
