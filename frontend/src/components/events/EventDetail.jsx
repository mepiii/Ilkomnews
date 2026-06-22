import React, { useState } from 'react'
import { Calendar, MapPin, Users, Clock, User, Mail, Phone, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { formatDate } from '../../utils/formatters'

const EventDetail = ({ event, onRegister }) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    reason: ''
  })

  const isEventFull = event.registered >= event.capacity
  const isEventPast = new Date(event.date) < new Date()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onRegister(event.id, formData)
    setShowRegistrationForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-theme rounded-lg shadow-lg overflow-hidden">
        {/* Header Image */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {event.title}
            </h1>
            <p className="text-theme-secondary">{event.category}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex items-center space-x-3 text-text-gray">
              <Calendar size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-primary">Tanggal & Waktu</p>
                <p className="text-sm">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-text-gray">
              <MapPin size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-primary">Lokasi</p>
                <p className="text-sm">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-text-gray">
              <Users size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-primary">Kapasitas</p>
                <p className="text-sm">{event.registered} / {event.capacity} peserta</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-text-gray">
              <Clock size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-primary">Durasi</p>
                <p className="text-sm">{event.duration || 'Full Day'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Deskripsi Event</h2>
            <p className="text-theme-primary leading-relaxed">{event.description || event.summary}</p>
          </div>

          {/* Agenda */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Agenda</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-bg-light rounded-lg">
                <div className="bg-secondary text-white px-3 py-1 rounded-md text-sm font-semibold">
                  08:00
                </div>
                <div>
                  <p className="font-medium text-primary">Registrasi & Pembukaan</p>
                  <p className="text-sm text-text-gray">Pendaftaran ulang peserta</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-bg-light rounded-lg">
                <div className="bg-secondary text-white px-3 py-1 rounded-md text-sm font-semibold">
                  09:00
                </div>
                <div>
                  <p className="font-medium text-primary">Sesi 1: Keynote Speech</p>
                  <p className="text-sm text-text-gray">Pembicara utama</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-bg-light rounded-lg">
                <div className="bg-secondary text-white px-3 py-1 rounded-md text-sm font-semibold">
                  12:00
                </div>
                <div>
                  <p className="font-medium text-primary">Ishoma</p>
                  <p className="text-sm text-text-gray">Istirahat, shalat, makan</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-bg-light rounded-lg">
                <div className="bg-secondary text-white px-3 py-1 rounded-md text-sm font-semibold">
                  13:00
                </div>
                <div>
                  <p className="font-medium text-primary">Sesi 2: Workshop</p>
                  <p className="text-sm text-text-gray">Sesi praktik langsung</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-bg-light rounded-lg">
                <div className="bg-secondary text-white px-3 py-1 rounded-md text-sm font-semibold">
                  16:00
                </div>
                <div>
                  <p className="font-medium text-primary">Penutupan & Sertifikasi</p>
                  <p className="text-sm text-text-gray">Pembagian sertifikat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-8 p-6 bg-bg-light rounded-lg">
            <h2 className="text-xl font-bold text-primary mb-4">Persyaratan Peserta</h2>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle size={18} className="text-green-500 mt-0.5" />
                <span className="text-theme-primary">Mahasiswa aktif Ilmu Komputer</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={18} className="text-green-500 mt-0.5" />
                <span className="text-theme-primary">Membawa laptop (untuk sesi workshop)</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={18} className="text-green-500 mt-0.5" />
                <span className="text-theme-primary">Mengisi formulir pendaftaran</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle size={18} className="text-green-500 mt-0.5" />
                <span className="text-theme-primary">Membayar biaya pendaftaran (jika ada)</span>
              </li>
            </ul>
          </div>

          {/* Register Button */}
          <div className="pt-6 border-t border-border">
            {isEventPast ? (
              <div className="bg-theme-secondary rounded-lg p-4 text-center">
                <AlertCircle className="mx-auto text-theme-muted mb-2" size={24} />
                <p className="text-theme-secondary">Event ini telah selesai</p>
              </div>
            ) : isEventFull ? (
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <XCircle className="mx-auto text-red-500 mb-2" size={24} />
                <p className="text-red-600">Maaf, kuota peserta telah penuh</p>
              </div>
            ) : (
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="w-full bg-accent text-primary py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Daftar Sekarang
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-theme rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary">Form Pendaftaran</h2>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-text-gray hover:text-primary"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <p className="text-sm text-text-gray mb-4">
                Pendaftaran untuk: <span className="font-semibold text-primary">{event.title}</span>
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">No. Telepon</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Institusi / Universitas</label>
                  <input
                    type="text"
                    name="institution"
                    required
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Alasan Mendaftar</label>
                  <textarea
                    name="reason"
                    rows="3"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Ceritakan alasan Anda ingin mengikuti event ini..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Kirim Pendaftaran
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetail