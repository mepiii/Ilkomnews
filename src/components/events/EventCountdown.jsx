import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const EventCountdown = ({ eventDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(eventDate)
      const now = new Date()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [eventDate])

  const isEventPassed = new Date(eventDate) < new Date()

  if (isEventPassed) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600">Event telah berlangsung</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-center text-white">
      <div className="flex items-center justify-center mb-4">
        <Clock size={24} className="mr-2" />
        <h3 className="text-xl font-semibold">Event Dimulai Dalam</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        <div className="text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-3xl md:text-4xl font-bold">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">Hari</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-3xl md:text-4xl font-bold">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">Jam</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-3xl md:text-4xl font-bold">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">Menit</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-3xl md:text-4xl font-bold">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs mt-1">Detik</div>
          </div>
        </div>
      </div>
      
      <p className="text-sm mt-4 text-white/80">
        Jangan lewatkan kesempatan ini!
      </p>
    </div>
  )
}

export default EventCountdown