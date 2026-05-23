// components/ilkomgallery/tabs/UiUxProjectsTab.jsx
import React, { useState } from 'react'
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
    thumbnail: 'https://placehold.co/600x400/3B82F6/white?text=UI+UX+Banking',
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
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/600x400/8B5CF6/white?text=E-Learning',
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
    jurusan: 'S1 Teknologi Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/600x400/10B981/white?text=Healthcare',
    description: 'Desain interface untuk aplikasi konsultasi dokter online dengan sistem booking janji temu.',
    figmaLink: 'https://figma.com/design/healthcare',
    platform: 'Mobile App',
    tools: ['Figma', 'Illustrator', 'After Effects']
  }
]

const jurusanOptions = [
  'Semua Jurusan',
  'S1 Ilmu Komputer',
  'S1 Sistem Informasi',
  'S1 Teknologi Informasi'
]

const angkatanOptions = ['Semua Angkatan', 2019, 2020, 2021, 2022]
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
    const matchesAngkatan = selectedAngkatan === 'Semua Angkatan' || project.angkatan.toString() === selectedAngkatan.toString()
    const matchesPlatform = selectedPlatform === 'Semua Platform' || project.platform === selectedPlatform
    
    return matchesSearch && matchesJurusan && matchesAngkatan && matchesPlatform
  })

  return (
    <div>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="🔍 Cari desain UI/UX..."
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

      <div className="mb-4">
        <p className="text-text-gray">
          Menampilkan <span className="font-semibold text-primary">{filteredProjects.length}</span> desain UI/UX
        </p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <UiUxProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-text-gray text-lg font-medium">Belum ada desain UI/UX</p>
          <p className="text-text-gray mt-2">Kirimkan desain terbaikmu!</p>
        </div>
      )}
    </div>
  )
}

export default UiUxProjectsTab