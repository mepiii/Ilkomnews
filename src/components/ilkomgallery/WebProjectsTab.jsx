// components/ilkomgallery/tabs/WebProjectsTab.jsx
import React, { useState } from 'react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import WebProjectCard from '../shared/WebProjectCard'

// Data Web Projects
const webProjects = [
  {
    id: 1,
    title: 'Sistem Absensi Mahasiswa Berbasis QR Code',
    creator: 'Dimas Prayoga',
    nim: '20210101001',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/600x400/3B82F6/white?text=Absensi+App',
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
    thumbnail: 'https://placehold.co/600x400/10B981/white?text=Batik+Shop',
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
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/600x400/8B5CF6/white?text=Digital+Library',
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
    thumbnail: 'https://placehold.co/600x400/EF4444/white?text=Skripsi+Monitor',
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
    jurusan: 'S1 Teknologi Informasi',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/600x400/F59E0B/white?text=Job+Portal',
    description: 'Portal khusus lowongan magang untuk mahasiswa Ilmu Komputer. Terintegrasi dengan perusahaan tech partner.',
    liveDemo: 'https://magangilkom.demo.com',
    github: 'https://github.com/ahmadfauzi/magang-portal',
    techStack: ['React', 'Express.js', 'Node.js', 'MongoDB']
  }
]

const jurusanOptions = [
  'Semua Jurusan',
  'S1 Ilmu Komputer',
  'S1 Sistem Informasi',
  'S1 Teknologi Informasi',
  'D3 Manajemen Informatika'
]

const angkatanOptions = ['Semua Angkatan', 2019, 2020, 2021, 2022, 2023, 2024]

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
    const matchesAngkatan = selectedAngkatan === 'Semua Angkatan' || project.angkatan.toString() === selectedAngkatan.toString()
    
    return matchesSearch && matchesJurusan && matchesAngkatan
  })

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="🔍 Cari project web atau mahasiswa..."
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

      <div className="flex justify-between items-center mb-4">
        <p className="text-text-gray">
          Menampilkan <span className="font-semibold text-primary">{filteredProjects.length}</span> project
        </p>
        <button className="text-sm text-primary hover:underline">
          Lihat Semua →
        </button>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <WebProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-text-gray text-lg font-medium">Tidak ada project ditemukan</p>
          <p className="text-text-gray mt-2">Coba cari dengan kata kunci lain atau ubah filter</p>
        </div>
      )}
    </div>
  )
}

export default WebProjectsTab