import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { formatDate } from '../../utils/formatters'

const EventCard = ({ event }) => {
  const getStatus = (eventDate, capacity, registered) => {
    const today = new Date()
    const eventDateTime = new Date(eventDate)
    
    if (eventDateTime < today) return { text: 'Selesai', color: 'bg-gray-500' }
    if (registered >= capacity) return { text: 'Penuh', color: 'bg-red-500' }
    if (eventDateTime.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
      return { text: 'Segera', color: 'bg-orange-500' }
    }
    return { text: 'Tersedia', color: 'bg-green-500' }
  }

  const status = getStatus(event.date, event.capacity, event.registered)

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image || 'https://via.placeholder.com/400x300'} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className={`absolute top-4 right-4 ${status.color} text-white px-2 py-1 rounded-md text-xs font-semibold`}>
            {status.text}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center text-white text-sm">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(event.date)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.summary}
          </p>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-text-gray">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-text-gray">
              <Users size={14} className="mr-1 flex-shrink-0" />
              <span>{event.registered} / {event.capacity} peserta</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-secondary rounded-full h-2 transition-all duration-500"
              style={{ width: `${(event.registered / event.capacity) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center text-xs text-text-gray">
              <Clock size={12} className="mr-1" />
              <span>Pendaftaran dibuka</span>
            </div>
            <span className="text-secondary text-sm font-medium group-hover:text-accent transition-colors">
              Daftar →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard