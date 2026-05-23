// components/ilkomgallery/tabs/MobileProjectsTab.jsx
import React, { useState } from 'react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import MobileProjectCard from '../shared/MobileProjectCard'

const mobileProjects = [
  {
    id: 1,
    title: 'Food Delivery App - ILKOM Eats',
    creator: 'Rizki Ramadhan',
    nim: '20200101045',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/600x400/EF4444/white?text=Food+Delivery',
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
    thumbnail: 'https://placehold.co/600x400/10B981/white?text=Bank+Sampah',
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
    title: 'Health Tracker - ILKOM Fit',
    creator: 'Budi Santoso',
    nim: '20210101088',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/600x400/8B5CF6/white?text=Health+Tracker',
    description: 'Aplikasi tracking kesehatan untuk mahasiswa, termasuk langkah, kalori, dan konsumsi air.',
    screenshots: [
      'https://placehold.co/300x600/8B5CF6/white?text=Health'
    ],
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/health-tracker.apk',
    platform: 'Android',
    techStack: ['Kotlin', 'Room Database', 'MPAndroidChart']
  }
]

const jurusanOptions = [
  'Semua Jurusan',
  'S1 Ilmu Komputer',
  'S1 Sistem Informasi',
  'S1 Teknologi Informasi'
]

const angkatanOptions = ['Semua Angkatan', 2019, 2020, 2021, 2022]
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
    const matchesAngkatan = selectedAngkatan === 'Semua Angkatan' || project.angkatan.toString() === selectedAngkatan.toString()
    const matchesPlatform = selectedPlatform === 'Semua Platform' || project.platform === selectedPlatform
    
    return matchesSearch && matchesJurusan && matchesAngkatan && matchesPlatform
  })

  return (
    <div>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="🔍 Cari aplikasi mobile..."
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
          Menampilkan <span className="font-semibold text-primary">{filteredProjects.length}</span> aplikasi mobile
        </p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <MobileProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-text-gray text-lg font-medium">Belum ada aplikasi mobile</p>
          <p className="text-text-gray mt-2">Yuk, kirim project mobile-mu!</p>
        </div>
      )}
    </div>
  )
}

export default MobileProjectsTab