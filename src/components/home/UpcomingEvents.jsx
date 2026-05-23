import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MapPin, Users, Clock, X, Calendar as CalendarIcon, CalendarX, Eye, Info } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const UpcomingEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDateEvents, setSelectedDateEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showNoEventToast, setShowNoEventToast] = useState(false)
  const [toastDate, setToastDate] = useState(null)
  const [isVisible, setIsVisible] = useState({
    'section-header': true, // Default true biar langsung keliatan
    'calendar-nav': true,
    'calendar-grid': true,
    'legend': true,
    'link-button': true
  })

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Data event contoh
    setTimeout(() => {
      const sampleEvents = [
        {
          id: 1,
          title: 'Workshop AI & Machine Learning',
          date: '2026-05-15',
          location: 'Gedung FASILKOM Lt. 3',
          registered: 45,
          capacity: 100,
          description: 'Pelajari dasar-dasar AI dan implementasinya'
        },
        {
          id: 2,
          title: 'Web Development Bootcamp',
          date: '2026-05-15',
          location: 'Lab Komputer 1',
          registered: 30,
          capacity: 50,
          description: 'Bootcamp full-stack web development'
        },
        {
          id: 3,
          title: 'Cyber Security Seminar',
          date: '2026-05-15',
          location: 'Aula FASILKOM',
          registered: 80,
          capacity: 150,
          description: 'Seminar keamanan siber bersama praktisi'
        },
        {
          id: 4,
          title: 'UI/UX Design Workshop',
          date: '2026-06-10',
          location: 'Innovation Hub',
          registered: 25,
          capacity: 40,
          description: 'Workshop desain antarmuka pengguna'
        },
        {
          id: 5,
          title: 'Data Science Competition',
          date: '2026-06-15',
          location: 'Online (Zoom)',
          registered: 120,
          capacity: 200,
          description: 'Kompetisi data science tingkat nasional'
        },
        {
          id: 6,
          title: 'Mobile App Development',
          date: '2026-06-20',
          location: 'Lab Mobile',
          registered: 18,
          capacity: 30,
          description: 'Belajar membuat aplikasi mobile dengan React Native'
        },
        {
          id: 7,
          title: 'Digital Marketing Workshop',
          date: '2026-05-28',
          location: 'Aula FASILKOM',
          registered: 55,
          capacity: 80,
          description: 'Workshop strategi digital marketing'
        },
        {
          id: 8,
          title: 'Cloud Computing Seminar',
          date: '2026-07-05',
          location: 'Gedung FASILKOM Lt. 2',
          registered: 40,
          capacity: 100,
          description: 'Seminar tentang teknologi cloud computing'
        }
      ]
      
      setEvents(sampleEvents)
      setLoading(false)
    }, 500)
  }, [])

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleDateString('id-ID', { month: 'long' })
  }

  // Get year
  const getYear = (date) => {
    return date.getFullYear()
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get events for a specific date
  const getEventsForDate = (year, month, day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getFullYear() === year && 
             eventDate.getMonth() === month && 
             eventDate.getDate() === day
    })
  }

  // Handle date click
  const handleDateClick = (year, month, day) => {
    const eventsOnDate = getEventsForDate(year, month, day)
    
    setSelectedDate({ year, month, day })
    
    if (eventsOnDate.length > 0) {
      setSelectedDateEvents(eventsOnDate)
      setShowModal(true)
    } else {
      setToastDate({ year, month, day })
      setShowNoEventToast(true)
      
      setTimeout(() => {
        setShowNoEventToast(false)
      }, 3000)
    }
  }

  // Check if date has events
  const hasEvents = (year, month, day) => {
    return getEventsForDate(year, month, day).length > 0
  }

  // Check if date is today
  const isToday = (year, month, day) => {
    const today = new Date()
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day
  }

  // Render calendar grid
  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    
    const startOffset = firstDay === 0 ? 6 : firstDay - 1
    
    const days = []
    
    const prevMonthDays = getDaysInMonth(year, month - 1)
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = prevMonthDays - i
      days.push({
        day,
        month: month - 1,
        year,
        isCurrentMonth: false,
        isPrevMonth: true
      })
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
        isPrevMonth: false
      })
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true
      })
    }
    
    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }
    
    return weeks
  }

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  const calendarWeeks = renderCalendar()

  if (loading) return <LoadingSpinner />

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header - Scroll Animation */}
          <div
            data-animate
            id="section-header"
            className={`text-center mb-12 transition-all duration-700 transform ${
              isVisible['section-header'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-1.5 mb-4 hover:bg-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default">
              <CalendarIcon size={16} className="text-purple-600" />
              <span className="text-purple-700 text-sm font-medium">Jangan Lewatkan</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              <span className="hover:text-purple-600 transition-all duration-300 hover:scale-105 inline-block">Event</span>{' '}
              <span className="text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-105 inline-block">Mendatang</span>
            </h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full transition-all duration-500 hover:w-32 hover:bg-purple-700"></div>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto hover:text-purple-600 transition-colors duration-300">
              Klik tanggal untuk melihat event yang tersedia
            </p>
          </div>

          {/* Calendar Navigation - Scroll Animation */}
          <div
            data-animate
            id="calendar-nav"
            className={`flex items-center justify-between mb-6 flex-wrap gap-4 transition-all duration-700 delay-100 transform ${
              isVisible['calendar-nav'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg bg-gray-100 hover:bg-purple-100 transition-all duration-300 text-gray-600 hover:text-purple-600 hover:scale-110"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg bg-gray-100 hover:bg-purple-100 transition-all duration-300 text-gray-600 hover:text-purple-600 hover:scale-110"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={goToToday}
                className="ml-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Hari Ini
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-300 cursor-default">
              {getMonthName(currentDate)} {getYear(currentDate)}
            </h3>
            <div className="w-24"></div>
          </div>

          {/* Calendar Grid - Scroll Animation */}
          <div
            data-animate
            id="calendar-grid"
            className={`transition-all duration-700 delay-200 transform ${
              isVisible['calendar-grid'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-500">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-0">
                {weekDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="text-center py-3 text-sm font-semibold text-purple-700 border-b border-purple-200 bg-purple-50"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-0 auto-rows-fr">
                {calendarWeeks.map((week, weekIdx) => (
                  week.map((day, dayIdx) => {
                    const hasEvent = hasEvents(day.year, day.month, day.day)
                    const isTodayDate = isToday(day.year, day.month, day.day)
                    const eventsOnDate = getEventsForDate(day.year, day.month, day.day)
                    
                    return (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        onClick={() => handleDateClick(day.year, day.month, day.day)}
                        className={`
                          min-h-[100px] p-2 border border-gray-100 transition-all duration-300
                          cursor-pointer hover:bg-purple-50
                          ${!day.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}
                          ${isTodayDate ? 'ring-2 ring-purple-400 ring-inset' : ''}
                        `}
                      >
                        <div className="flex flex-col h-full">
                          {/* Date Number */}
                          <div className={`
                            text-sm mb-1 flex items-center justify-between
                            ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                            ${isTodayDate ? 'font-bold text-purple-600' : ''}
                          `}>
                            <span>{day.day}</span>
                            {hasEvent && (
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            )}
                          </div>
                          
                          {/* Event Indicators */}
                          {hasEvent && eventsOnDate.length > 0 && (
                            <div className="mt-1 space-y-1">
                              {eventsOnDate.slice(0, 2).map((event, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs bg-purple-50 text-purple-700 rounded px-1.5 py-0.5 truncate hover:bg-purple-100 transition-all duration-200"
                                >
                                  {event.title.length > 18 ? event.title.substring(0, 16) + '...' : event.title}
                                </div>
                              ))}
                              {eventsOnDate.length > 2 && (
                                <div className="text-xs text-purple-500 pl-1 font-medium">
                                  +{eventsOnDate.length - 2} event lainnya
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                ))}
              </div>
            </div>
          </div>

          {/* Legend - Scroll Animation */}
          <div
            data-animate
            id="legend"
            className={`flex justify-center gap-6 mt-8 transition-all duration-700 delay-300 transform ${
              isVisible['legend'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-3 h-3 bg-purple-500 rounded-full group-hover:scale-125 transition-all duration-300"></div>
              <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">Ada Event</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-3 h-3 ring-2 ring-purple-400 rounded-full group-hover:scale-125 transition-all duration-300"></div>
              <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">Hari Ini</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-3 h-3 bg-gray-300 rounded-full group-hover:scale-125 transition-all duration-300"></div>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Tidak Ada Event</span>
            </div>
          </div>

          {/* Link Button - Scroll Animation */}
          <div
            data-animate
            id="link-button"
            className={`text-center mt-10 transition-all duration-700 delay-400 transform ${
              isVisible['link-button'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <Link 
              to="/events" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group"
            >
              <Eye size={18} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Lihat Semua Event</span>
              <ChevronLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* No Event Toast */}
      {showNoEventToast && toastDate && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up-fade">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-md">
            <div className="relative">
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="toastPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="40" stroke="#7c3aed" strokeWidth="1" />
                      <line x1="0" y1="0" x2="40" y2="0" stroke="#7c3aed" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#toastPattern)" />
                </svg>
              </div>
              
              <div className="relative p-5 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <CalendarX size={24} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg">
                    Tidak Ada Event
                  </h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Tanggal {toastDate.day} {getMonthName(new Date(toastDate.year, toastDate.month))} {toastDate.year} belum ada event yang dijadwalkan.
                  </p>
                  <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                    <Info size={10} />
                    Coba pilih tanggal lain untuk melihat event
                  </p>
                </div>
              </div>
              
              <div className="h-0.5 bg-gray-100">
                <div className="h-full bg-purple-500 animate-progress-shrink rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Event */}
      {showModal && selectedDateEvents.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Event pada {selectedDate.day} {getMonthName(new Date(selectedDate.year, selectedDate.month))} {selectedDate.year}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{selectedDateEvents.length} event tersedia</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {selectedDateEvents.map((event, idx) => {
                const eventDate = new Date(event.date)
                const today = new Date()
                const daysLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
                const isFull = event.registered >= event.capacity
                
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    onClick={() => setShowModal(false)}
                    className="block bg-gray-50 rounded-xl p-4 hover:bg-purple-50 transition-all duration-300 border border-gray-200 hover:border-purple-300 group"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-20 flex-shrink-0">
                        <div className="bg-purple-600 rounded-xl text-center py-2 shadow-md group-hover:scale-105 transition-transform duration-300">
                          <div className="text-white text-2xl font-bold">{eventDate.getDate()}</div>
                          <div className="text-purple-200 text-xs">
                            {getMonthName(eventDate)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                          {event.title}
                        </h4>
                        
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-purple-400" />
                            <span>{daysLeft > 0 ? `${daysLeft} hari lagi` : daysLeft === 0 ? 'Hari ini' : 'Sudah lewat'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-purple-400" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-purple-400" />
                            <span>{event.registered}/{event.capacity} peserta</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="w-32">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`rounded-full h-1.5 transition-all duration-700 ${
                                  isFull ? 'bg-red-500' : 'bg-purple-600'
                                }`}
                                style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">
                              {isFull ? 'Kuota penuh' : `${event.capacity - event.registered} kursi tersisa`}
                            </span>
                          </div>
                          <span className="text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                            Lihat Detail →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up-fade {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes progress-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-slide-up-fade {
          animation: slide-up-fade 0.4s ease-out forwards;
        }
        
        .animate-progress-shrink {
          animation: progress-shrink 3s linear forwards;
        }
      `}</style>
    </>
  )
}

export default UpcomingEvents