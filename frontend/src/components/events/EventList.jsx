import React from 'react'
import EventCard from './EventCard'
import EmptyState from '../common/EmptyState'
import LoadingSpinner from '../common/LoadingSpinner'

const EventList = ({ events, loading }) => {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!events || events.length === 0) {
    return <EmptyState title="Tidak ada event" message="Belum ada event yang tersedia saat ini" />
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

export default EventList