import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Users } from 'lucide-react'
import { GlowCard } from '../ui/GlowCard'
import { formatDate } from '../../utils/formatters'
import ImageWithFallback from '../ui/ImageWithFallback'

const EventCard = ({ event }) => {
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
    <Link to={`/events/${event.id}`} className="block group">
      <GlowCard glowColor="purple" className="rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
        <div className="relative h-56 w-full overflow-hidden">
          <ImageWithFallback
            src={event.image || 'https://via.placeholder.com/400x300'}
            alt={event.title}
            fallbackText={event.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className={`absolute top-4 right-4 ${status.color} text-white px-2.5 py-1 rounded-full text-xs font-semibold`}>
            {status.text}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-3 text-white/60 text-xs mb-1">
              <span className="flex items-center gap-1"><MapPin size={12} />{event.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/50 text-xs">
                <span>{formatDate(event.date)}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Users size={12} />{event.registered}/{event.capacity}</span>
              </div>
              <div className="w-8 h-8 flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white group-hover:bg-purple-500/40 group-hover:border-purple-400/40 transition-all">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  )
}

export default EventCard
