import { Link } from 'react-router-dom'
import { ExpandableCard } from '../ui/ExpandableCard'
import { formatDate } from '../../utils/formatters'
import { MapPin, Users, Clock } from 'lucide-react'

const EventExpandableCard = ({ event }) => {
  const getStatus = (date, capacity, registered) => {
    const now = new Date()
    const eventDate = new Date(date)
    if (eventDate < now) return { text: 'Selesai', color: 'bg-gray-500' }
    if (registered >= capacity) return { text: 'Penuh', color: 'bg-red-500' }
    if (eventDate - now <= 7 * 24 * 60 * 60 * 1000) return { text: 'Segera', color: 'bg-orange-500' }
    return { text: 'Tersedia', color: 'bg-green-500' }
  }

  const status = getStatus(event.date, event.capacity, event.registered)

  return (
    <ExpandableCard
      title={event.title}
      src={event.image || 'https://placehold.co/800x500/8B5CF6/white?text=Tidak+Ada+Gambar'}
      description={event.summary || event.title}
      itemType="event"
      itemId={event.id}
      badge={
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.color} text-white`}>
          {status.text}
        </span>
      }
      meta={
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <MapPin size={12} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Clock size={12} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Users size={12} />
            <span>{event.registered}/{event.capacity} peserta</span>
          </div>
        </div>
      }
    >
      <div className="w-full space-y-4">
        {event.description && (
          <div>
            <h4 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-2">Deskripsi</h4>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed break-words">{event.description}</p>
          </div>
        )}

        {event.schedule && (
          <div>
            <h4 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-2">Jadwal</h4>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed break-words">{event.schedule}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-600/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25 text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-600/25 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Lihat Detail
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </ExpandableCard>
  )
}

export default EventExpandableCard
