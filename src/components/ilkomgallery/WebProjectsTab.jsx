// components/ilkomgallery/tabs/WebProjectsTab.jsx
import React, { useState } from 'react'
import { Search, Filter, Globe, Frown } from 'lucide-react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import WebProjectCard from '../shared/WebProjectCard'

// Data Web Projects (5 project)
const webProjects = [
  {
    id: 1,
    title: 'Sistem Absensi Mahasiswa Berbasis QR Code',
    creator: 'Dimas Prayoga',
    nim: '20210101001',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/3B82F6/white?text=Absensi+App',
    description: 'Sistem absensi modern menggunakan QR code yang memudahkan mahasiswa dan dosen dalam proses absensi kuliah. Dilengkapi dengan rekap kehadiran real-time.',
    liveDemo: 'https://absensi.demo.com',
    github: 'https://github.com/dimasprayoga/absensi-qr',
    techStack: ['React JS', 'Laravel', 'MySQL', 'Tailwind CSS']
  },
  {
    id: 2,
    title: 'E-Commerce UMKM Batik Nusantara',
    creator: 'Siti Aisyah',
    nim: '20210101023',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/10B981/white?text=Batik+Shop',
    description: 'Platform e-commerce khusus untuk UMKM batik dari berbagai daerah di Indonesia. Fitur lengkap dengan payment gateway dan sistem rating.',
    liveDemo: 'https://batiknusantara.demo.com',
    github: 'https://github.com/sitiaisyah/batik-ecommerce',
    techStack: ['Next.js', 'Tailwind CSS', 'MongoDB', 'Midtrans']
  },
  {
    id: 3,
    title: 'Sistem Informasi Perpustakaan Digital',
    creator: 'Rizki Ramadhan',
    nim: '20200101045',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/8B5CF6/white?text=Digital+Library',
    description: 'Sistem perpustakaan digital dengan koleksi e-book, jurnal, dan skripsi. Fitur pencarian advanced dan sistem peminjaman online.',
    liveDemo: 'https://library.demo.com',
    github: 'https://github.com/rizkiramadhan/digital-library',
    techStack: ['PHP', 'Laravel', 'MySQL', 'Bootstrap 5']
  },
  {
    id: 4,
    title: 'Aplikasi Monitoring Skripsi',
    creator: 'Maria Ulfah',
    nim: '20210101112',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/EF4444/white?text=Skripsi+Monitor',
    description: 'Aplikasi monitoring progress skripsi mahasiswa untuk dosen pembimbing. Dilengkapi jadwal bimbingan dan notifikasi otomatis.',
    liveDemo: 'https://skripsimonitor.demo.com',
    github: 'https://github.com/mariaulfah/skripsi-monitor',
    techStack: ['Vue.js', 'Django', 'PostgreSQL', 'Redis']
  },
  {
    id: 5,
    title: 'Portal Lowongan Magang ILKOM',
    creator: 'Ahmad Fauzi',
    nim: '20200101188',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/F59E0B/white?text=Job+Portal',
    description: 'Portal khusus lowongan magang untuk mahasiswa Ilmu Komputer. Terintegrasi dengan perusahaan tech partner.',
    liveDemo: 'https://magangilkom.demo.com',
    github: 'https://github.com/ahmadfauzi/magang-portal',
    techStack: ['React', 'Express.js', 'Node.js', 'MongoDB']
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

const WebProjectsTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('Semua Jurusan')
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua Angkatan')

  const filteredProjects = webProjects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesJurusan = selectedJurusan === 'Semua Jurusan' || project.jurusan === selectedJurusan
    const matchesAngkatan = selectedAngkatan === 'Semua Angkatan' || project.angkatan === selectedAngkatan
    
    return matchesSearch && matchesJurusan && matchesAngkatan
  })

  return (
    <div>
      {/* Filter Bar - Modern Design */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-700">Filter Web Projects</h3>
          </div>
          {(selectedJurusan !== 'Semua Jurusan' || 
            selectedAngkatan !== 'Semua Angkatan' || 
            searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedJurusan('Semua Jurusan')
                setSelectedAngkatan('Semua Angkatan')
              }}
              className="text-xs text-blue-500 hover:text-blue-600 transition-colors ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Cari project, creator..." 
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
        </div>
      </div>

      {/* Result Count - Modern Style */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-gray-500 text-sm">
            Menampilkan <span className="font-semibold text-blue-600">{filteredProjects.length}</span> project web
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {filteredProjects.length === webProjects.length ? 'Semua project ditampilkan' : `${webProjects.length - filteredProjects.length} project lainnya`}
        </div>
      </div>

      {/* Grid Card - 2 card per baris di semua ukuran layar */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <WebProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          {/* Icon Globe - Bukan AlertCircle */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Globe size={40} className="text-blue-500" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Tidak ada project yang ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau cari dengan kata kunci lain</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedJurusan('Semua Jurusan')
              setSelectedAngkatan('Semua Angkatan')
            }}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

export default WebProjectsTab