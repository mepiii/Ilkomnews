// src/pages/ilkomgallery/WebDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  X, ExternalLink, User, Calendar, Code2, Globe, Award, Users,
  Mail, ArrowLeft, Eye
} from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { projectsService } from '../../services/api'
import { BGPattern } from '../../components/ui/BGPattern'

// Data Web Projects - Lengkap dengan 5 project
const webData = {
  'sistem-absensi-mahasiswa-berbasis-qr-code': {
    id: 1,
    slug: 'sistem-absensi-mahasiswa-berbasis-qr-code',
    title: 'Sistem Absensi Mahasiswa Berbasis QR Code',
    creator: 'Dimas Prayoga',
    nim: '20210101001',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2021,
    email: 'dimas.prayoga@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/3B82F6/white?text=Absensi+App',
    banner: 'https://placehold.co/1600x600/2563EB/white?text=Sistem+Absensi+QR+Code',
    description: 'Sistem absensi modern menggunakan QR code yang memudahkan mahasiswa dan dosen dalam proses absensi kuliah. Dilengkapi dengan rekap kehadiran real-time.',
    fullDescription: `**Tentang Project:**
Sistem absensi berbasis QR code yang dirancang untuk memudahkan proses absensi di lingkungan kampus. Mahasiswa cukup scan QR code yang ditampilkan dosen untuk melakukan absensi.

**🎯 Fitur Utama:**
- Generate QR code dinamis per pertemuan
- Scan QR code menggunakan camera HP/laptop
- Rekap kehadiran real-time
- Laporan absensi per mahasiswa
- Notifikasi otomatis untuk mahasiswa yang tidak hadir
- Export data ke Excel/PDF

**🛠️ Teknologi yang Digunakan:**
- React JS untuk frontend
- Laravel untuk backend API
- MySQL untuk database
- QR code generator library
- Tailwind CSS untuk styling

**📊 Hasil:**
- Digunakan oleh 5+ kelas
- 500+ mahasiswa terdaftar
- Efisiensi waktu absensi meningkat 70%`,
    liveDemo: 'https://absensi.demo.com',
    github: 'https://github.com/dimasprayoga/absensi-qr',
    techStack: ['React JS', 'Laravel', 'MySQL', 'Tailwind CSS'],
    collaborators: ['Siti Aisyah'],
    award: 'Best Innovation Award 2024'
  },
  'e-commerce-umkm-batik-nusantara': {
    id: 2,
    slug: 'e-commerce-umkm-batik-nusantara',
    title: 'E-Commerce UMKM Batik Nusantara',
    creator: 'Siti Aisyah',
    nim: '20210101023',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    email: 'siti.aisyah@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/10B981/white?text=Batik+Shop',
    banner: 'https://placehold.co/1600x600/059669/white?text=Batik+Nusantara',
    description: 'Platform e-commerce khusus untuk UMKM batik dari berbagai daerah di Indonesia. Fitur lengkap dengan payment gateway dan sistem rating.',
    fullDescription: `**Tentang Project:**
Platform e-commerce yang fokus pada pemberdayaan UMKM batik lokal. Memudahkan pengrajin batik menjual produknya secara online.

**🎯 Fitur Utama:**
- Multi-vendor marketplace
- Sistem pembayaran terintegrasi (Midtrans)
- Rating dan review produk
- Manajemen stok otomatis
- Fitur wishlist
- Live chat dengan penjual

**🛠️ Teknologi yang Digunakan:**
- Next.js untuk frontend
- MongoDB untuk database
- Midtrans payment gateway
- Tailwind CSS

**📊 Hasil:**
- 50+ UMKM bergabung
- 1000+ transaksi
- Omset UMKM meningkat 40%`,
    liveDemo: 'https://batiknusantara.demo.com',
    github: 'https://github.com/sitiaisyah/batik-ecommerce',
    techStack: ['Next.js', 'Tailwind CSS', 'MongoDB', 'Midtrans'],
    collaborators: ['Dimas Prayoga'],
    award: null
  },
  'sistem-informasi-perpustakaan-digital': {
    id: 3,
    slug: 'sistem-informasi-perpustakaan-digital',
    title: 'Sistem Informasi Perpustakaan Digital',
    creator: 'Rizki Ramadhan',
    nim: '20200101045',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    email: 'rizki.ramadhan@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/8B5CF6/white?text=Digital+Library',
    banner: 'https://placehold.co/1600x600/7C3AED/white?text=Digital+Library',
    description: 'Sistem perpustakaan digital dengan koleksi e-book, jurnal, dan skripsi. Fitur pencarian advanced dan sistem peminjaman online.',
    fullDescription: `**Tentang Project:**
Sistem perpustakaan digital yang menyediakan akses online ke koleksi buku, jurnal, dan skripsi mahasiswa.

**🎯 Fitur Utama:**
- Pencarian koleksi dengan filter
- Baca online e-book
- Peminjaman digital
- Dashboard admin
- Laporan statistik kunjungan
- Sistem antrian buku populer

**🛠️ Teknologi yang Digunakan:**
- Laravel PHP framework
- MySQL database
- Bootstrap 5
- PDF.js untuk e-book viewer

**📊 Hasil:**
- 2000+ koleksi digital
- 1000+ user aktif
- 500+ peminjaman per bulan`,
    liveDemo: 'https://library.demo.com',
    github: 'https://github.com/rizkiramadhan/digital-library',
    techStack: ['PHP', 'Laravel', 'MySQL', 'Bootstrap 5'],
    collaborators: [],
    award: null
  },
  'aplikasi-monitoring-skripsi': {
    id: 4,
    slug: 'aplikasi-monitoring-skripsi',
    title: 'Aplikasi Monitoring Skripsi',
    creator: 'Maria Ulfah',
    nim: '20210101112',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    email: 'maria.ulfah@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/EF4444/white?text=Skripsi+Monitor',
    banner: 'https://placehold.co/1600x600/DC2626/white?text=Skripsi+Monitor',
    description: 'Aplikasi monitoring progress skripsi mahasiswa untuk dosen pembimbing. Dilengkapi jadwal bimbingan dan notifikasi otomatis.',
    fullDescription: `**Tentang Project:**
Aplikasi untuk memantau progress skripsi mahasiswa, memudahkan komunikasi antara mahasiswa dan dosen pembimbing.

**🎯 Fitur Utama:**
- Manajemen jadwal bimbingan
- Upload draft skripsi
- Feedback dosen real-time
- Notifikasi via email
- Tracking progress per bab
- Rekap bimbingan

**🛠️ Teknologi yang Digunakan:**
- Django (Python) backend
- PostgreSQL database
- Redis untuk caching
- Bootstrap 5

**📊 Hasil:**
- 20+ dosen menggunakan
- 200+ mahasiswa terbantu`,
    liveDemo: 'https://skripsimonitor.demo.com',
    github: 'https://github.com/mariaulfah/skripsi-monitor',
    techStack: ['Vue.js', 'Django', 'PostgreSQL', 'Redis'],
    collaborators: ['Rizki Ramadhan'],
    award: null
  },
  'portal-lowongan-magang-ilkom': {
    id: 5,
    slug: 'portal-lowongan-magang-ilkom',
    title: 'Portal Lowongan Magang ILKOM',
    creator: 'Ahmad Fauzi',
    nim: '20200101188',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2020,
    email: 'ahmad.fauzi@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/F59E0B/white?text=Job+Portal',
    banner: 'https://placehold.co/1600x600/D97706/white?text=Magang+Portal',
    description: 'Portal khusus lowongan magang untuk mahasiswa Ilmu Komputer. Terintegrasi dengan perusahaan tech partner.',
    fullDescription: `**Tentang Project:**
Portal lowongan magang yang menghubungkan mahasiswa Ilmu Komputer dengan perusahaan teknologi partner.

**🎯 Fitur Utama:**
- Filter lowongan by skill
- Upload CV online
- Status lamaran tracking
- Notifikasi matching lowongan
- Company profile
- Review perusahaan

**🛠️ Teknologi yang Digunakan:**
- MERN Stack (MongoDB, Express, React, Node.js)
- JWT Authentication
- Tailwind CSS

**📊 Hasil:**
- 100+ perusahaan terdaftar
- 500+ lowongan
- 1000+ mahasiswa terdaftar`,
    liveDemo: 'https://magangilkom.demo.com',
    github: 'https://github.com/ahmadfauzi/magang-portal',
    techStack: ['React', 'Express.js', 'Node.js', 'MongoDB'],
    collaborators: ['Maria Ulfah'],
    award: 'Best Project 2024'
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

const WebDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = webData[slug]
    if (data) {
      setProject(data)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Project tidak ditemukan</p>
          <Link to="/ilkomgallery" className="text-blue-500 hover:text-blue-400">
            Kembali ke Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme pb-16 relative">
      <BGPattern variant="grid" fill="var(--pattern-color)" size={24} className="fixed inset-0" />
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden pt-16 md:pt-0">
        <img 
          src={project.banner || project.thumbnail} 
          alt={project.title} 
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        
        {/* Tombol Kembali - kiri atas */}
        <button 
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg text-white transition-all duration-300 group cursor-pointer"
          type="button"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Kembali ke Gallery</span>
        </button>
        
        {/* Tombol Close (X) - kanan atas */}
        <button 
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 right-6 z-30 w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
          type="button"
          aria-label="Close"
        >
          <X size={20} className="text-white" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                <Globe size={12} />
                <span>WEB PROJECT</span>
              </span>
              {project.award && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500 text-black text-xs font-medium rounded-full">
                  <Award size={12} />
                  <span>{project.award}</span>
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-4xl font-header">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="text-white/70">Oleh {project.creator}</div>
              <div className="text-white/70">•</div>
              <div className="text-white/70">Angkatan {project.angkatan}</div>
              <div className="text-white/70">•</div>
              <div className="flex items-center gap-1 text-white/70">
                <Globe size={12} />
                <span>Web Application</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a 
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition"
              >
                <ExternalLink size={18} />
                <span>Live Demo</span>
              </a>
              <a 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-theme-secondary text-theme-primary rounded-md font-medium hover:bg-gray-700 transition"
              >
                <FaGithub size={18} />
                <span>GitHub Repository</span>
              </a>
            </div>
            
            <p className="text-white/80 text-base md:text-lg max-w-3xl">
              {project.description}
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
              <h2 className="text-white text-2xl font-bold mb-4">About This Project</h2>
              <div className="text-theme-secondary leading-relaxed">
                {formatText(project.fullDescription)}
              </div>
            </section>
            
            <section>
              <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 size={24} />
                <span>Tech Stack</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, idx) => (
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                  {project.creator.charAt(0)}
                </div>
                <div>
                  <h4 className="text-theme-primary font-semibold text-lg">{project.creator}</h4>
                  <p className="text-theme-muted text-sm">{project.jurusan}</p>
                  <p className="text-theme-muted text-xs">NIM: {project.nim}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-theme-muted">
                  <Calendar size={14} />
                  <span>Angkatan {project.angkatan}</span>
                </div>
                <div className="flex items-center gap-2 text-theme-muted">
                  <Mail size={14} />
                  <a href={`mailto:${project.email}`} className="hover:text-blue-400 transition">
                    {project.email}
                  </a>
                </div>
              </div>
            </div>
            
            {project.collaborators && project.collaborators.length > 0 && (
              <div className="bg-theme-secondary rounded-xl p-6 border border-theme">
                <h3 className="text-theme-primary font-bold text-lg mb-3 flex items-center gap-2">
                  <Users size={18} />
                  <span>Collaborators</span>
                </h3>
                <div className="space-y-2">
                  {project.collaborators.map((collab, idx) => (
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

export default WebDetailPage