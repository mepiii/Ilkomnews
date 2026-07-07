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
      src={event.image || 'https://placehold.co/600x800/8B5CF6/white?text=Tidak+Ada+Gambar'}
      description={event.summary || event.title}
      itemType="event"
      itemId={event.id}
      badge={
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${status.color} text-white`}>
          {status.text}
        </span>
      }
      meta={
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <MapPin size={10} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <Clock size={10} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <Users size={10} />
            <span>{event.registered}/{event.capacity}</span>
          </div>
        </div>
      }
    >
      <div className="w-full space-y-3">
        {event.description && (
          <div>
            <h4 className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Deskripsi</h4>
            <p className="text-xs leading-relaxed break-words" style={{ color: 'var(--text-secondary)' }}>{event.description}</p>
          </div>
        )}

        {event.schedule && (
          <div>
            <h4 className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Jadwal</h4>
            <p className="text-xs leading-relaxed break-words" style={{ color: 'var(--text-secondary)' }}>{event.schedule}</p>
          </div>
        )}

        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[11px] font-medium hover:bg-[var(--accent)]/20 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Lihat Detail
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </ExpandableCard>
  )
}

export default EventExpandableCard
