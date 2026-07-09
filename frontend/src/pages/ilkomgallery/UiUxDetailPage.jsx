import { useParams } from 'react-router-dom'
import { Palette } from 'lucide-react'
import ProjectDetailLayout from '../../components/ilkomgallery/ProjectDetailLayout'

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

**🛠️ Tools:**
- Figma untuk UI design
- Adobe XD untuk prototyping
- Maze untuk user testing

**📊 Hasil User Testing:**
- Task completion rate: 92%
- System Usability Scale (SUS): 85
- User satisfaction: 4.7/5`,
    downloadLink: 'https://figma.com/design/banking-redesign',
    techStack: ['Figma', 'Adobe XD', 'Maze', 'Miro'],
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

**🛠️ Tools:**
- Figma
- Framer untuk prototype
- Whimsical untuk wireframe

**📊 Hasil:**
- Engagement rate meningkat 45%
- 3.000+ users dalam beta testing`,
    downloadLink: 'https://figma.com/design/elearning',
    techStack: ['Figma', 'Framer', 'Whimsical'],
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

**🛠️ Tools:**
- Figma
- Illustrator untuk icon
- After Effects untuk animasi`,
    downloadLink: 'https://figma.com/design/healthcare',
    techStack: ['Figma', 'Illustrator', 'After Effects'],
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

**🛠️ Tools:**
- Figma
- Protopie
- Miro`,
    downloadLink: 'https://figma.com/design/smart-parking',
    techStack: ['Figma', 'Protopie', 'Miro'],
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
- Notifikasi pengumuman
- Akses nilai
- Kartu mahasiswa digital

**🛠️ Tools:**
- Figma
- Adobe XD
- Principle untuk animasi`,
    downloadLink: 'https://figma.com/design/campus-portal',
    techStack: ['Figma', 'Adobe XD', 'Principle'],
    collaborators: [],
    award: null
  }
}

const UiUxDetailPage = () => {
  const { slug } = useParams()
  const project = uiuxData[slug]

  return (
    <ProjectDetailLayout
      project={project}
      categoryLabel="UI/UX Design"
      categoryIcon={Palette}
      backPath="/ilkom-gallery"
      accentColor="purple"
    />
  )
}

export default UiUxDetailPage
