import React, { useState, useEffect } from 'react'
import EventList from '../components/events/EventList'
import EventFilter from '../components/events/EventFilter'
import Breadcrumb from '../components/common/Breadcrumb'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { mockEvents } from '../services/api'

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category: 'all', location: 'all', month: 'all' })
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['Konferensi', 'Workshop', 'Hackathon', 'Seminar', 'Webinar']
  const locations = ['Bandung', 'Jakarta', 'Online', 'Surabaya', 'Yogyakarta']

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await mockEvents.getAll()
        setEvents(data)
        setFilteredEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    let filtered = [...events]
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category)
    }
    
    // Filter by location
    if (filters.location !== 'all') {
      filtered = filtered.filter(item => item.location === filters.location)
    }
    
    // Filter by month
    if (filters.month !== 'all') {
      filtered = filtered.filter(item => new Date(item.date).getMonth() + 1 === parseInt(filters.month))
    }
    
    // Search
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Sort by date (upcoming first)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    setFilteredEvents(filtered)
  }, [filters, searchQuery, events])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Event & Kegiatan</h1>
        <p className="text-text-gray mt-1">Ikuti berbagai event menarik untuk mengembangkan diri</p>
      </div>
      
      <EventFilter 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        categories={categories}
        locations={locations}
      />
      
      {loading ? <LoadingSpinner /> : <EventList events={filteredEvents} loading={loading} />}
    </div>
  )
}

export default EventsPage