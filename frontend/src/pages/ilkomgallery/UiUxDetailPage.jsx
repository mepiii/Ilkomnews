// src/pages/ilkomgallery/UiUxDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  X, ExternalLink, User, Calendar, Palette, Award, Users,
  Mail, ArrowLeft, Eye
} from 'lucide-react'
import { FaFigma } from 'react-icons/fa'

// Data UI/UX projects
const uiuxData = {
  'mobile-banking-app-redesign': {
    id: 1,
    slug: 'mobile-banking-app-redesign',
    title: 'Mobile Banking App Redesign',
    creator: 'Dewi Sartika',
    nim: '20210101123',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    email: 'dewi.sartika@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/3B82F6/white?text=Mobile+Banking+UIUX',
    banner: 'https://placehold.co/1600x600/2563EB/white?text=Mobile+Banking+Redesign',
    description: 'Redesign aplikasi mobile banking dengan pendekatan user-centered design. Fokus pada kemudahan penggunaan untuk lansia.',
    fullDescription: `**Tentang Desain:**
Redesign aplikasi mobile banking yang berfokus pada aksesibilitas dan kemudahan penggunaan bagi pengguna lansia.

**🎯 Tujuan Desain:**
- Meningkatkan aksesibilitas untuk pengguna lansia
- Menyederhanakan alur transaksi
- Menambahkan fitur voice guidance
- Meningkatkan kepercayaan pengguna

**📱 Fitur yang Didesain:**
- Login dengan biometric
- Dashboard saldo yang jelas
- Transfer antar bank
- Pembayaran tagihan
- Riwayat transaksi
- Customer support chat

**🛠️ Tools yang Digunakan:**
- Figma untuk UI design
- Adobe XD untuk prototyping
- Maze untuk user testing
- Miro untuk brainstorming

**📊 Hasil User Testing:**
- Task completion rate: 92%
- System Usability Scale (SUS): 85
- User satisfaction: 4.7/5`,
    figmaLink: 'https://figma.com/design/banking-redesign',
    platform: 'Mobile App',
    tools: ['Figma', 'Adobe XD', 'Maze', 'Miro'],
    collaborators: ['Andi Wijaya'],
    award: 'Best UI/UX Design 2024'
  },
  'e-learning-platform-design': {
    id: 2,
    slug: 'e-learning-platform-design',
    title: 'E-Learning Platform Design',
    creator: 'Andi Wijaya',
    nim: '20200101099',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    email: 'andi.wijaya@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/8B5CF6/white?text=E-Learning+UIUX',
    banner: 'https://placehold.co/1600x600/7C3AED/white?text=E-Learning+Platform',
    description: 'UI/UX design untuk platform e-learning dengan fitur interactive dashboard dan gamifikasi.',
    fullDescription: `**Tentang Desain:**
Platform e-learning interaktif yang dirancang untuk meningkatkan engagement mahasiswa dalam proses belajar online.

**🎯 Tujuan Desain:**
- Meningkatkan motivasi belajar
- Memudahkan navigasi materi
- Mendorong interaksi antar mahasiswa
- Melacak progress belajar

**📱 Fitur yang Didesain:**
- Personalized dashboard
- Video player interaktif
- Quiz dan assessment
- Forum diskusi
- Leaderboard dan badge
- Sertifikat kelulusan

**🛠️ Tools yang Digunakan:**
- Figma
- Framer untuk prototype
- Whimsical untuk wireframe

**📊 Hasil:**
- Engagement rate meningkat 45%
- 3.000+ users dalam beta testing`,
    figmaLink: 'https://figma.com/design/elearning',
    platform: 'Web & Mobile',
    tools: ['Figma', 'Framer', 'Whimsical'],
    collaborators: ['Dewi Sartika'],
    award: null
  },
  'healthcare-app-interface': {
    id: 3,
    slug: 'healthcare-app-interface',
    title: 'Healthcare App Interface',
    creator: 'Nadia Putri',
    nim: '20210101145',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    email: 'nadia.putri@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/10B981/white?text=Healthcare+UIUX',
    banner: 'https://placehold.co/1600x600/059669/white?text=Healthcare+App',
    description: 'Desain interface untuk aplikasi konsultasi dokter online dengan sistem booking janji temu.',
    fullDescription: `**Tentang Desain:**
Aplikasi konsultasi kesehatan online yang menghubungkan pasien dengan dokter melalui chat dan video call.

**🎯 Tujuan Desain:**
- Memudahkan akses layanan kesehatan
- Meningkatkan kepercayaan pasien
- Menyederhanakan proses booking
- Menjaga privasi data kesehatan

**📱 Fitur yang Didesain:**
- Pencarian dokter by spesialisasi
- Booking janji temu
- Chat dan video call
- Riwayat konsultasi
- Resep obat digital
- Rating dokter

**🛠️ Tools yang Digunakan:**
- Figma
- Illustrator untuk icon
- After Effects untuk animasi`,
    figmaLink: 'https://figma.com/design/healthcare',
    platform: 'Mobile App',
    tools: ['Figma', 'Illustrator', 'After Effects'],
    collaborators: [],
    award: null
  },
  'smart-parking-app-design': {
    id: 4,
    slug: 'smart-parking-app-design',
    title: 'Smart Parking App Design',
    creator: 'Rizki Ramadhan',
    nim: '20200101045',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    email: 'rizki.ramadhan@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/F97316/white?text=Smart+Parking+UIUX',
    banner: 'https://placehold.co/1600x600/EA580C/white?text=Smart+Parking',
    description: 'Desain aplikasi smart parking dengan fitur booking slot parkir real-time dan notifikasi.',
    fullDescription: `**Tentang Desain:**
Aplikasi smart parking yang membantu pengguna menemukan dan memesan slot parkir dengan mudah.

**🎯 Tujuan Desain:**
- Mengurangi waktu mencari parkir
- Optimalisasi penggunaan lahan parkir
- Memudahkan pembayaran
- Integrasi dengan sensor IoT

**📱 Fitur yang Didesain:**
- Peta slot parkir real-time
- Booking slot parkir
- Notifikasi ketersediaan
- Pembayaran digital
- Riwayat parkir
- Reminder waktu parkir

**🛠️ Tools yang Digunakan:**
- Figma
- Protopie
- Miro`,
    figmaLink: 'https://figma.com/design/smart-parking',
    platform: 'Mobile App',
    tools: ['Figma', 'Protopie', 'Miro'],
    collaborators: ['Nadia Putri'],
    award: null
  },
  'campus-portal-dashboard': {
    id: 5,
    slug: 'campus-portal-dashboard',
    title: 'Campus Portal Dashboard',
    creator: 'Putri Maharani',
    nim: '20210101234',
    jurusan: 'S1 Sistem Komputer',
    angkatan: 2021,
    email: 'putri.maharani@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/EF4444/white?text=Campus+Portal+UIUX',
    banner: 'https://placehold.co/1600x600/DC2626/white?text=Campus+Portal',
    description: 'Desain dashboard portal mahasiswa dengan informasi akademik, jadwal, dan pengumuman.',
    fullDescription: `**Tentang Desain:**
Dashboard portal mahasiswa yang menyajikan informasi akademik secara ringkas dan mudah diakses.

**🎯 Tujuan Desain:**
- Menyajikan informasi akademik secara ringkas
- Memudahkan akses jadwal dan nilai
- Meningkatkan engagement mahasiswa
- Mobile-friendly design

**📱 Fitur yang Didesain:**
- Ringkasan akademik
- Kalender jadwal
- Pengumuman terbaru
- Task reminder
- Direct access ke layanan
- Dark/light mode

**🛠️ Tools yang Digunakan:**
- Figma
- Adobe XD
- Maze untuk testing

**📊 Hasil:**
- 92% pengguna merasa terbantu
- Rata-rata session duration 5 menit`,
    figmaLink: 'https://figma.com/design/campus-portal',
    platform: 'Web',
    tools: ['Figma', 'Adobe XD', 'Maze'],
    collaborators: ['Rizki Ramadhan'],
    award: 'Best Dashboard Design 2024'
  }
}

// Fungsi untuk format teks
const formatText = (text) => {
  return text.split('\n').map((line, idx) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h3 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(2, -2)}</h3>
    }
    if (line.startsWith('- ')) {
      return <li key={idx} className="text-theme-secondary ml-4 mb-1">{line.slice(2)}</li>
    }
    if (line.trim() === '') return <br key={idx} />
    return <p key={idx} className="text-theme-secondary mb-2">{line}</p>
  })
}

const UiUxDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [design, setDesign] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = uiuxData[slug]
    if (data) {
      setDesign(data)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading desain...</p>
        </div>
      </div>
    )
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Desain tidak ditemukan</p>
          <Link to="/ilkomgallery" className="text-pink-500 hover:text-pink-400">
            Kembali ke Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme pb-16">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] md:min-h-[70vh] overflow-hidden pt-16">
        <img 
          src={design.banner || design.thumbnail} 
          alt={design.title}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Kembali ke Gallery</span>
        </button>
        
        {/* Tombol Close */}
        <button 
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 right-6 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition"
        >
          <X size={20} className="text-white" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded-full">
                <Palette size={12} />
                <span>UI/UX DESIGN</span>
              </span>
              {design.award && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500 text-black text-xs font-medium rounded-full">
                  <Award size={12} />
                  <span>{design.award}</span>
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-4xl font-header">
              {design.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="text-white/70">Oleh {design.creator}</div>
              <div className="text-white/70">•</div>
              <div className="text-white/70">Angkatan {design.angkatan}</div>
              <div className="text-white/70">•</div>
              <div className="flex items-center gap-1 text-white/70">
                <Palette size={12} />
                <span>{design.platform}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a 
                href={design.figmaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition"
              >
                <FaFigma size={18} />
                <span>Lihat di Figma</span>
              </a>
            </div>
            
            <p className="text-white/80 text-base md:text-lg max-w-3xl">
              {design.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-white text-2xl font-bold mb-4">About This Design</h2>
              <div className="text-theme-secondary leading-relaxed">
                {formatText(design.fullDescription)}
              </div>
            </section>
            
            <section>
              <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <Palette size={24} />
                <span>Tools Used</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {design.tools.map((tool, idx) => (
                  <span key={idx} className="px-4 py-2 bg-theme-secondary text-theme-primary rounded-lg text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-theme-secondary rounded-xl p-6 border border-theme">
              <h3 className="text-theme-primary font-bold text-lg mb-4 flex items-center gap-2">
                <User size={18} />
                <span>Designer</span>
              </h3>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold">
                  {design.creator.charAt(0)}
                </div>
                <div>
                  <h4 className="text-theme-primary font-semibold text-lg">{design.creator}</h4>
                  <p className="text-theme-muted text-sm">{design.jurusan}</p>
                  <p className="text-theme-muted text-xs">NIM: {design.nim}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-theme-muted">
                  <Calendar size={14} />
                  <span>Angkatan {design.angkatan}</span>
                </div>
                <div className="flex items-center gap-2 text-theme-muted">
                  <Mail size={14} />
                  <a href={`mailto:${design.email}`} className="hover:text-pink-400 transition">
                    {design.email}
                  </a>
                </div>
              </div>
            </div>
            
            {design.collaborators && design.collaborators.length > 0 && (
              <div className="bg-theme-secondary rounded-xl p-6 border border-theme">
                <h3 className="text-theme-primary font-bold text-lg mb-3 flex items-center gap-2">
                  <Users size={18} />
                  <span>Collaborators</span>
                </h3>
                <div className="space-y-2">
                  {design.collaborators.map((collab, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-theme rounded-lg transition">
                      <div className="w-8 h-8 rounded-full bg-theme-secondary flex items-center justify-center text-xs font-bold">
                        {collab.charAt(0)}
                      </div>
                      <span className="text-theme-primary">{collab}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UiUxDetailPage