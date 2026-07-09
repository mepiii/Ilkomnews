import { useParams } from 'react-router-dom'
import { Smartphone } from 'lucide-react'
import ProjectDetailLayout from '../../components/ilkomgallery/ProjectDetailLayout'

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

const MobileDetailPage = () => {
  const { slug } = useParams()
  const project = mobileData[slug]

  return (
    <ProjectDetailLayout
      project={project}
      categoryLabel="Mobile App"
      categoryIcon={Smartphone}
      backPath="/ilkom-gallery"
      accentColor="blue"
    />
  )
}

export default MobileDetailPage
