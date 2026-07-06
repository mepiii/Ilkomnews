import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onRegister?.(event.id, formData)
    setShowRegistrationForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[var(--bg-card)] rounded-lg shadow-lg overflow-hidden">
        {/* Header Image */}
        <div className="relative h-80 overflow-hidden">
          <img src={event.image} alt={event.title} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-white/70">{event.category}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-[var(--border-color)]">
            {[
              { icon: Calendar, label: 'Tanggal & Waktu', value: formatDate(event.date) },
              { icon: MapPin, label: 'Lokasi', value: event.location },
              { icon: Users, label: 'Kapasitas', value: `${event.registered} / ${event.capacity} peserta` },
              { icon: Clock, label: 'Durasi', value: event.duration || 'Full Day' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center space-x-3 text-[var(--text-secondary)]">
                <Icon size={20} className="text-[var(--accent)]" />
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{label}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Deskripsi Event</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">{event.description || event.summary}</p>
          </div>

          {/* Agenda */}
          {event.schedule && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Jadwal</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{event.schedule}</p>
            </div>
          )}

          {/* Requirements */}
          <div className="mb-8 p-6 bg-[var(--bg-secondary)] rounded-lg">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Persyaratan Peserta</h2>
            <ul className="space-y-2">
              {['Mahasiswa aktif Ilmu Komputer', 'Membawa laptop (untuk sesi workshop)', 'Mengisi formulir pendaftaran'].map((req, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle size={18} className="text-green-500 mt-0.5" />
                  <span className="text-[var(--text-secondary)]">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Register Button */}
          <div className="pt-6 border-t border-[var(--border-color)]">
            {isEventPast ? (
              <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
                <AlertCircle className="mx-auto text-[var(--text-muted)] mb-2" size={24} />
                <p className="text-[var(--text-muted)]">Event ini telah selesai</p>
              </div>
            ) : isEventFull ? (
              <div className="bg-red-500/10 rounded-lg p-4 text-center">
                <XCircle className="mx-auto text-red-500 mb-2" size={24} />
                <p className="text-red-400">Maaf, kuota peserta telah penuh</p>
              </div>
            ) : (
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                Daftar Sekarang
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-[var(--border-color)]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Form Pendaftaran</h2>
                <button onClick={() => setShowRegistrationForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <XCircle size={24} />
                </button>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Pendaftaran untuk: <span className="font-semibold text-[var(--text-primary)]">{event.title}</span>
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'name', label: 'Nama Lengkap', type: 'text' },
                  { name: 'email', label: 'Email', type: 'email' },
                  { name: 'phone', label: 'No. Telepon', type: 'tel' },
                  { name: 'institution', label: 'Institusi / Universitas', type: 'text' },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">{label}</label>
                    <input type={type} name={name} required value={formData[name]} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Alasan Mendaftar</label>
                  <textarea name="reason" rows="3" value={formData.reason} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Ceritakan alasan Anda ingin mengikuti event ini..." />
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all">
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
