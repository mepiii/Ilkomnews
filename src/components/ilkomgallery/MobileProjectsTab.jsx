// components/ilkomgallery/tabs/MobileProjectsTab.jsx
import React, { useState } from 'react'
import { Smartphone, Search, Filter } from 'lucide-react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import MobileProjectCard from '../shared/MobileProjectCard'

const mobileProjects = [
  {
    id: 1,
    title: 'ILKOM Eats - Food Delivery',
    creator: 'Rizki Ramadhan',
    nim: '20200101045',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/EF4444/white?text=Food+Delivery+App',
    description: 'Aplikasi pemesanan makanan untuk kantin kampus dengan fitur tracking real-time dan multiple payment methods.',
    screenshots: [
      'https://placehold.co/300x600/EF4444/white?text=Home',
      'https://placehold.co/300x600/3B82F6/white?text=Cart'
    ],
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/food-delivery.apk',
    platform: 'Android',
    techStack: ['Flutter', 'Firebase', 'Google Maps API', 'Midtrans']
  },
  {
    id: 2,
    title: 'Bank Sampah Digital',
    creator: 'Putri Wulandari',
    nim: '20210101067',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/10B981/white?text=Bank+Sampah+App',
    description: 'Aplikasi manajemen bank sampah dengan sistem poin dan penjadwalan penjemputan sampah.',
    screenshots: [
      'https://placehold.co/300x600/10B981/white?text=Dashboard'
    ],
    downloadLink: 'https://drive.google.com/bank-sampah.apk',
    platform: 'Android & iOS',
    techStack: ['React Native', 'Node.js', 'Express', 'MongoDB']
  },
  {
    id: 3,
    title: 'ILKOM Fit - Health Tracker',
    creator: 'Budi Santoso',
    nim: '20210101088',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/8B5CF6/white?text=Health+Tracker+App',
    description: 'Aplikasi tracking kesehatan untuk mahasiswa, termasuk langkah, kalori, dan konsumsi air.',
    screenshots: [
      'https://placehold.co/300x600/8B5CF6/white?text=Health'
    ],
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/health-tracker.apk',
    platform: 'Android',
    techStack: ['Kotlin', 'Room Database', 'MPAndroidChart']
  },
  {
    id: 4,
    title: 'Campus Navigation App',
    creator: 'Dian Permatasari',
    nim: '20220101123',
    jurusan: 'S1 Sistem Komputer',
    angkatan: 2022,
    thumbnail: 'https://placehold.co/800x500/F97316/white?text=Navigation+App',
    description: 'Aplikasi navigasi kampus dengan fitur petunjuk arah ke setiap gedung dan ruangan.',
    screenshots: [
      'https://placehold.co/300x600/F97316/white?text=Map'
    ],
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/navigation-app.apk',
    platform: 'Android & iOS',
    techStack: ['Flutter', 'Google Maps API', 'Firebase']
  },
  {
    id: 5,
    title: 'Academic Portal Mobile',
    creator: 'Fajar Nugroho',
    nim: '20210101234',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/3B82F6/white?text=Academic+Portal',
    description: 'Aplikasi portal akademik untuk mahasiswa, cek jadwal, nilai, dan pengumuman.',
    screenshots: [
      'https://placehold.co/300x600/3B82F6/white?text=Academic'
    ],
    downloadLink: 'https://drive.google.com/academic-portal.apk',
    platform: 'Android',
    techStack: ['React Native', 'Redux', 'Node.js', 'PostgreSQL']
  }
]

// Jurusan Options (6 jurusan)
const jurusanOptions = [
  'Semua Jurusan',
  'S1 Teknik Informatika',
  'S1 Sistem Informasi',
  'S1 Sistem Komputer',
  'D3 Manajemen Informatika',
  'D3 Komputerisasi Akuntansi',
  'D3 Teknik Komputer'
]

// Angkatan Options (2019 - 2026)
const angkatanOptions = [
  'Semua Angkatan',
  2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026
]

// Platform Options
const platformOptions = ['Semua Platform', 'Android', 'iOS', 'Android & iOS']

const MobileProjectsTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('Semua Jurusan')
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua Angkatan')
  const [selectedPlatform, setSelectedPlatform] = useState('Semua Platform')

  const filteredProjects = mobileProjects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesJurusan = selectedJurusan === 'Semua Jurusan' || project.jurusan === selectedJurusan
    const matchesAngkatan = selectedAngkatan === 'Semua Angkatan' || project.angkatan === selectedAngkatan
    const matchesPlatform = selectedPlatform === 'Semua Platform' || project.platform === selectedPlatform
    
    return matchesSearch && matchesJurusan && matchesAngkatan && matchesPlatform
  })

  return (
    <div>
      {/* Filter Bar - Modern Design */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-700">Filter Mobile Apps</h3>
          </div>
          {(selectedJurusan !== 'Semua Jurusan' || 
            selectedAngkatan !== 'Semua Angkatan' || 
            selectedPlatform !== 'Semua Platform' || 
            searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedJurusan('Semua Jurusan')
                setSelectedAngkatan('Semua Angkatan')
                setSelectedPlatform('Semua Platform')
              }}
              className="text-xs text-emerald-500 hover:text-emerald-600 transition-colors ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Cari aplikasi, creator..." 
          />
          <FilterDropdown 
            label="Jurusan" 
            options={jurusanOptions} 
            value={selectedJurusan} 
            onChange={setSelectedJurusan} 
          />
          <FilterDropdown 
            label="Angkatan" 
            options={angkatanOptions} 
            value={selectedAngkatan} 
            onChange={setSelectedAngkatan} 
          />
          <FilterDropdown 
            label="Platform" 
            options={platformOptions} 
            value={selectedPlatform} 
            onChange={setSelectedPlatform} 
          />
        </div>
      </div>

      {/* Result Count - Modern Style */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <p className="text-gray-500 text-sm">
            Menampilkan <span className="font-semibold text-emerald-600">{filteredProjects.length}</span> aplikasi mobile
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {filteredProjects.length === mobileProjects.length ? 'Semua aplikasi ditampilkan' : `${mobileProjects.length - filteredProjects.length} aplikasi lainnya`}
        </div>
      </div>

      {/* Grid Card - 2 card per baris di semua ukuran layar */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <MobileProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          {/* Icon Smartphone - Ganti emoji 📱 */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <Smartphone size={40} className="text-emerald-500" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Tidak ada aplikasi yang ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau cari dengan kata kunci lain</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedJurusan('Semua Jurusan')
              setSelectedAngkatan('Semua Angkatan')
              setSelectedPlatform('Semua Platform')
            }}
            className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

export default MobileProjectsTab