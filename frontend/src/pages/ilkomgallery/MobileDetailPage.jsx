// src/pages/ilkomgallery/MobileDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Play, X, ExternalLink, Download,
  User, Calendar, Code2, Smartphone, Award, Users,
  Mail, ArrowLeft, Image
} from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

// Data mobile projects
const mobileData = {
  'ilkom-eats-food-delivery': {
    id: 1,
    slug: 'ilkom-eats-food-delivery',
    title: 'ILKOM Eats - Food Delivery',
    creator: 'Rizki Ramadhan',
    nim: '20200101045',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    email: 'rizki.ramadhan@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/EF4444/white?text=Food+Delivery+App',
    banner: 'https://placehold.co/1600x600/DC2626/white?text=Food+Delivery+App',
    description: 'Aplikasi pemesanan makanan untuk kantin kampus dengan fitur tracking real-time dan multiple payment methods.',
    fullDescription: `**Tentang Aplikasi:**
ILKOM Eats adalah aplikasi pemesanan makanan yang dirancang khusus untuk memudahkan mahasiswa memesan makanan dari kantin kampus.

**📱 Fitur Utama:**
- Pemesanan makanan dari berbagai tenant kantin
- Tracking pesanan real-time
- Multiple payment methods (QRIS, Transfer Bank, E-Wallet)
- Sistem rating dan review
- Promo dan cashback untuk pengguna baru

**🛠️ Teknologi yang Digunakan:**
- Flutter untuk frontend cross-platform
- Firebase untuk autentikasi dan real-time database
- Google Maps API untuk tracking
- Midtrans untuk payment gateway

**🏆 Pencapaian:**
- 5.000+ downloads di Google Play Store
- Rating 4.8/5 dari pengguna
- Best Student App Award 2024`,
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/food-delivery.apk',
    platform: 'Android',
    techStack: ['Flutter', 'Firebase', 'Google Maps API', 'Midtrans'],
    screenshots: [
      'https://placehold.co/300x600/EF4444/white?text=Home',
      'https://placehold.co/300x600/3B82F6/white?text=Cart',
      'https://placehold.co/300x600/10B981/white?text=Payment'
    ],
    collaborators: ['Putri Wulandari'],
    award: 'Best Student App Award 2024'
  },
  'bank-sampah-digital': {
    id: 2,
    slug: 'bank-sampah-digital',
    title: 'Bank Sampah Digital',
    creator: 'Putri Wulandari',
    nim: '20210101067',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    email: 'putri.wulandari@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/10B981/white?text=Bank+Sampah+App',
    banner: 'https://placehold.co/1600x600/059669/white?text=Bank+Sampah+Digital',
    description: 'Aplikasi manajemen bank sampah dengan sistem poin dan penjadwalan penjemputan sampah.',
    fullDescription: `**Tentang Aplikasi:**
Bank Sampah Digital adalah platform yang menghubungkan nasabah bank sampah dengan petugas untuk memudahkan transaksi dan penjadwalan.

**📱 Fitur Utama:**
- Pendaftaran nasabah online
- Penjadwalan penjemputan sampah
- Sistem poin dan reward
- History transaksi
- Edukasi tentang daur ulang

**🛠️ Teknologi:**
- React Native
- Node.js & Express
- MongoDB
- JWT Authentication`,
    downloadLink: 'https://drive.google.com/bank-sampah.apk',
    platform: 'Android & iOS',
    techStack: ['React Native', 'Node.js', 'Express', 'MongoDB'],
    screenshots: [
      'https://placehold.co/300x600/10B981/white?text=Dashboard'
    ],
    collaborators: ['Rizki Ramadhan'],
    award: null
  },
  'ilkom-fit-health-tracker': {
    id: 3,
    slug: 'ilkom-fit-health-tracker',
    title: 'ILKOM Fit - Health Tracker',
    creator: 'Budi Santoso',
    nim: '20210101088',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2021,
    email: 'budi.santoso@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/8B5CF6/white?text=Health+Tracker+App',
    banner: 'https://placehold.co/1600x600/7C3AED/white?text=Health+Tracker',
    description: 'Aplikasi tracking kesehatan untuk mahasiswa, termasuk langkah, kalori, dan konsumsi air.',
    fullDescription: `**Tentang Aplikasi:**
ILKOM Fit membantu mahasiswa menjaga kesehatan dengan melacak aktivitas harian dan memberikan rekomendasi personal.

**📱 Fitur Utama:**
- Step counter
- Kalori tracker
- Water intake reminder
- Sleep tracker
- Exercise recommendation

**🛠️ Teknologi:**
- Kotlin
- Room Database
- MPAndroidChart
- Work Manager API`,
    downloadLink: 'https://drive.google.com/health-tracker.apk',
    platform: 'Android',
    techStack: ['Kotlin', 'Room Database', 'MPAndroidChart'],
    screenshots: [
      'https://placehold.co/300x600/8B5CF6/white?text=Health'
    ],
    collaborators: [],
    award: null
  },
  'campus-navigation-app': {
    id: 4,
    slug: 'campus-navigation-app',
    title: 'Campus Navigation App',
    creator: 'Dian Permatasari',
    nim: '20220101123',
    jurusan: 'S1 Sistem Komputer',
    angkatan: 2022,
    email: 'dian.permatasari@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/F97316/white?text=Navigation+App',
    banner: 'https://placehold.co/1600x600/EA580C/white?text=Campus+Navigation',
    description: 'Aplikasi navigasi kampus dengan fitur petunjuk arah ke setiap gedung dan ruangan.',
    fullDescription: `**Tentang Aplikasi:**
Aplikasi navigasi interaktif yang membantu mahasiswa baru menemukan lokasi gedung, ruangan, dan fasilitas di kampus.

**📱 Fitur Utama:**
- Peta interaktif kampus
- Petunjuk arah dari lokasi pengguna
- Informasi setiap gedung dan ruangan
- Search facility
- Indoor navigation

**🛠️ Teknologi:**
- Flutter
- Google Maps API
- Firebase
- Geolocator`,
    downloadLink: 'https://drive.google.com/navigation-app.apk',
    platform: 'Android & iOS',
    techStack: ['Flutter', 'Google Maps API', 'Firebase'],
    screenshots: [
      'https://placehold.co/300x600/F97316/white?text=Map'
    ],
    collaborators: ['Budi Santoso'],
    award: null
  },
  'academic-portal-mobile': {
    id: 5,
    slug: 'academic-portal-mobile',
    title: 'Academic Portal Mobile',
    creator: 'Fajar Nugroho',
    nim: '20210101234',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    email: 'fajar.nugroho@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/3B82F6/white?text=Academic+Portal',
    banner: 'https://placehold.co/1600x600/2563EB/white?text=Academic+Portal',
    description: 'Aplikasi portal akademik untuk mahasiswa, cek jadwal, nilai, dan pengumuman.',
    fullDescription: `**Tentang Aplikasi:**
Aplikasi portal akademik yang memudahkan mahasiswa mengakses informasi akademik kapan saja dan di mana saja.

**📱 Fitur Utama:**
- Cek jadwal kuliah
- Lihat nilai ujian
- Pengumuman akademik
- Informasi dosen
- Notifikasi real-time

**🛠️ Teknologi:**
- React Native
- Redux
- Node.js
- PostgreSQL`,
    downloadLink: 'https://drive.google.com/academic-portal.apk',
    platform: 'Android',
    techStack: ['React Native', 'Redux', 'Node.js', 'PostgreSQL'],
    screenshots: [
      'https://placehold.co/300x600/3B82F6/white?text=Academic'
    ],
    collaborators: ['Dian Permatasari'],
    award: null
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

const MobileDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedScreenshot, setSelectedScreenshot] = useState(null)

  useEffect(() => {
    const data = mobileData[slug]
    if (data) {
      setApp(data)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading aplikasi...</p>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Aplikasi tidak ditemukan</p>
          <Link to="/ilkomgallery" className="text-emerald-500 hover:text-emerald-400">
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
          src={app.banner || app.thumbnail} 
          alt={app.title}
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                <Smartphone size={12} />
                <span>MOBILE APP</span>
              </span>
              {app.award && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500 text-black text-xs font-medium rounded-full">
                  <Award size={12} />
                  <span>{app.award}</span>
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-4xl font-header">
              {app.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="text-white/70">Oleh {app.creator}</div>
              <div className="text-white/70">•</div>
              <div className="text-white/70">Angkatan {app.angkatan}</div>
              <div className="text-white/70">•</div>
              <div className="flex items-center gap-1 text-white/70">
                <Smartphone size={12} />
                <span>{app.platform}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {app.previewVideo && (
                <button 
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition"
                >
                  <Play size={18} fill="currentColor" />
                  <span>Preview App</span>
                </button>
              )}
              <a 
                href={app.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition"
              >
                <Download size={18} />
                <span>Download APK</span>
              </a>
            </div>
            
            <p className="text-white/80 text-base md:text-lg max-w-3xl">
              {app.description}
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
              <h2 className="text-white text-2xl font-bold mb-4">About This App</h2>
              <div className="text-theme-secondary leading-relaxed">
                {formatText(app.fullDescription)}
              </div>
            </section>
            
            {/* Screenshots Section */}
            {app.screenshots && app.screenshots.length > 0 && (
              <section>
                <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                  <Image size={24} />
                  <span>Screenshots</span>
                </h2>
                <div className="flex flex-wrap gap-4">
                  {app.screenshots.map((screenshot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedScreenshot(screenshot)}
                      className="w-32 h-56 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-emerald-500 transition-colors"
                    >
                      <img src={screenshot} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </section>
            )}
            
            <section>
              <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 size={24} />
                <span>Tech Stack</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {app.techStack.map((tech, idx) => (
                  <span key={idx} className="px-4 py-2 bg-theme-secondary text-theme-primary rounded-lg text-sm font-medium">
                    {tech}
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
                <span>Creator</span>
              </h3>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white text-2xl font-bold">
                  {app.creator.charAt(0)}
                </div>
                <div>
                  <h4 className="text-theme-primary font-semibold text-lg">{app.creator}</h4>
                  <p className="text-theme-muted text-sm">{app.jurusan}</p>
                  <p className="text-theme-muted text-xs">NIM: {app.nim}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-theme-muted">
                  <Calendar size={14} />
                  <span>Angkatan {app.angkatan}</span>
                </div>
                <div className="flex items-center gap-2 text-theme-muted">
                  <Mail size={14} />
                  <a href={`mailto:${app.email}`} className="hover:text-emerald-400 transition">
                    {app.email}
                  </a>
                </div>
              </div>
            </div>
            
            {app.collaborators && app.collaborators.length > 0 && (
              <div className="bg-theme-secondary rounded-xl p-6 border border-theme">
                <h3 className="text-theme-primary font-bold text-lg mb-3 flex items-center gap-2">
                  <Users size={18} />
                  <span>Collaborators</span>
                </h3>
                <div className="space-y-2">
                  {app.collaborators.map((collab, idx) => (
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

      {/* Video Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition"
            >
              <X size={24} />
            </button>
            <div className="bg-black rounded-xl overflow-hidden">
              <iframe 
                src={app.previewVideo} 
                className="w-full aspect-video"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <button 
              onClick={() => setSelectedScreenshot(null)}
              className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition"
            >
              <X size={24} />
            </button>
            <img src={selectedScreenshot} alt="Screenshot" className="w-full rounded-lg" />
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileDetailPage