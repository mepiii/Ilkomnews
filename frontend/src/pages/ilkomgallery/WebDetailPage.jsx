import { useParams } from 'react-router-dom'
import { Globe } from 'lucide-react'
import ProjectDetailLayout from '../../components/ilkomgallery/ProjectDetailLayout'

// Data Web Projects
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
    description: 'Sistem absensi modern menggunakan QR code yang memudahkan mahasiswa dan dosen dalam proses absensi kuliah.',
    fullDescription: `**Tentang Project:**
Sistem absensi berbasis QR code yang dirancang untuk memudahkan proses absensi di lingkungan kampus.

**🎯 Fitur Utama:**
- Generate QR code dinamis per pertemuan
- Scan QR code menggunakan camera HP/laptop
- Rekap kehadiran real-time
- Laporan absensi per mahasiswa
- Export data ke Excel/PDF

**🛠️ Teknologi:**
- React JS untuk frontend
- Laravel untuk backend API
- MySQL untuk database
- Tailwind CSS`,
    downloadLink: 'https://absensi.demo.com',
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
    description: 'Platform e-commerce khusus untuk UMKM batik dari berbagai daerah di Indonesia.',
    fullDescription: `**Tentang Project:**
Platform e-commerce yang fokus pada pemberdayaan UMKM batik lokal.

**🎯 Fitur Utama:**
- Multi-vendor marketplace
- Sistem pembayaran terintegrasi (Midtrans)
- Rating dan review produk
- Manajemen stok otomatis
- Fitur wishlist

**🛠️ Teknologi:**
- Next.js untuk frontend
- MongoDB untuk database
- Midtrans payment gateway
- Tailwind CSS`,
    downloadLink: 'https://batiknusantara.demo.com',
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
    description: 'Sistem perpustakaan digital dengan koleksi e-book, jurnal, dan skripsi.',
    fullDescription: `**Tentang Project:**
Sistem perpustakaan digital yang menyediakan akses online ke koleksi buku, jurnal, dan skripsi mahasiswa.

**🎯 Fitur Utama:**
- Pencarian koleksi dengan filter
- Baca online e-book
- Peminjaman digital
- Dashboard admin
- Laporan statistik kunjungan

**🛠️ Teknologi:**
- Laravel PHP framework
- MySQL database
- Bootstrap 5
- PDF.js untuk e-book viewer`,
    downloadLink: 'https://library.demo.com',
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
    description: 'Aplikasi monitoring progress skripsi mahasiswa untuk dosen pembimbing.',
    fullDescription: `**Tentang Project:**
Aplikasi untuk memantau progress skripsi mahasiswa, memudahkan komunikasi antara mahasiswa dan dosen pembimbing.

**🎯 Fitur Utama:**
- Manajemen jadwal bimbingan
- Upload draft skripsi
- Feedback dosen real-time
- Notifikasi via email
- Tracking progress per bab

**🛠️ Teknologi:**
- Vue.js frontend
- Django backend
- PostgreSQL database
- Redis untuk caching`,
    downloadLink: 'https://skripsimonitor.demo.com',
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
    description: 'Portal khusus lowongan magang untuk mahasiswa Ilmu Komputer.',
    fullDescription: `**Tentang Project:**
Portal lowongan magang yang menghubungkan mahasiswa Ilmu Komputer dengan perusahaan teknologi partner.

**🎯 Fitur Utama:**
- Filter lowongan by skill
- Upload CV online
- Status lamaran tracking
- Notifikasi matching lowongan
- Company profile

**🛠️ Teknologi:**
- MERN Stack (MongoDB, Express, React, Node.js)
- JWT Authentication
- Tailwind CSS`,
    downloadLink: 'https://magangilkom.demo.com',
    techStack: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind CSS'],
    collaborators: [],
    award: null
  }
}

const WebDetailPage = () => {
  const { slug } = useParams()
  const project = webData[slug]

  return (
    <ProjectDetailLayout
      project={project}
      categoryLabel="Web Application"
      categoryIcon={Globe}
      backPath="/ilkom-gallery"
      accentColor="blue"
    />
  )
}

export default WebDetailPage
