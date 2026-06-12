// components/ilkomgallery/tabs/UiUxProjectsTab.jsx
import React, { useState } from 'react'
import { Palette, Search, Filter } from 'lucide-react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import UiUxProjectCard from '../shared/UiUxProjectCard'

const uiuxProjects = [
  {
    id: 1,
    title: 'Mobile Banking App Redesign',
    creator: 'Dewi Sartika',
    nim: '20210101123',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/3B82F6/white?text=Mobile+Banking+UIUX',
    description: 'Redesign aplikasi mobile banking dengan pendekatan user-centered design. Fokus pada kemudahan penggunaan untuk lansia.',
    figmaLink: 'https://figma.com/design/banking-redesign',
    platform: 'Mobile App',
    tools: ['Figma', 'Adobe XD', 'Maze', 'Miro']
  },
  {
    id: 2,
    title: 'E-Learning Platform Design',
    creator: 'Andi Wijaya',
    nim: '20200101099',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/8B5CF6/white?text=E-Learning+UIUX',
    description: 'UI/UX design untuk platform e-learning dengan fitur interactive dashboard dan gamifikasi.',
    figmaLink: 'https://figma.com/design/elearning',
    platform: 'Web & Mobile',
    tools: ['Figma', 'Framer', 'Whimsical']
  },
  {
    id: 3,
    title: 'Healthcare App Interface',
    creator: 'Nadia Putri',
    nim: '20210101145',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/10B981/white?text=Healthcare+UIUX',
    description: 'Desain interface untuk aplikasi konsultasi dokter online dengan sistem booking janji temu.',
    figmaLink: 'https://figma.com/design/healthcare',
    platform: 'Mobile App',
    tools: ['Figma', 'Illustrator', 'After Effects']
  },
  {
    id: 4,
    title: 'Smart Parking App Design',
    creator: 'Rizki Ramadhan',
    nim: '20200101045',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/F97316/white?text=Smart+Parking+UIUX',
    description: 'Desain aplikasi smart parking dengan fitur booking slot parkir real-time dan notifikasi.',
    figmaLink: 'https://figma.com/design/smart-parking',
    platform: 'Mobile App',
    tools: ['Figma', 'Protopie', 'Miro']
  },
  {
    id: 5,
    title: 'Campus Portal Dashboard',
    creator: 'Putri Maharani',
    nim: '20210101234',
    jurusan: 'S1 Sistem Komputer',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/EF4444/white?text=Campus+Portal+UIUX',
    description: 'Desain dashboard portal mahasiswa dengan informasi akademik, jadwal, dan pengumuman.',
    figmaLink: 'https://figma.com/design/campus-portal',
    platform: 'Web',
    tools: ['Figma', 'Adobe XD', 'Maze']
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
const platformOptions = ['Semua Platform', 'Web', 'Mobile App', 'Web & Mobile', 'Desktop']

const UiUxProjectsTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('Semua Jurusan')
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua Angkatan')
  const [selectedPlatform, setSelectedPlatform] = useState('Semua Platform')

  const filteredProjects = uiuxProjects.filter(project => {
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
            <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-700">Filter UI/UX Design</h3>
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
              className="text-xs text-pink-500 hover:text-pink-600 transition-colors ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Cari desain, creator..." 
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
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          <p className="text-gray-500 text-sm">
            Menampilkan <span className="font-semibold text-pink-600">{filteredProjects.length}</span> desain UI/UX
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {filteredProjects.length === uiuxProjects.length ? 'Semua desain ditampilkan' : `${uiuxProjects.length - filteredProjects.length} desain lainnya`}
        </div>
      </div>

      {/* Grid Card - 2 card per baris di semua ukuran layar */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <UiUxProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          {/* Icon Palette - Ganti emoji 🎨 */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
            <Palette size={40} className="text-pink-500" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Tidak ada desain yang ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau cari dengan kata kunci lain</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedJurusan('Semua Jurusan')
              setSelectedAngkatan('Semua Angkatan')
              setSelectedPlatform('Semua Platform')
            }}
            className="mt-4 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

export default UiUxProjectsTab