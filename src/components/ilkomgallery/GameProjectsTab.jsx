// components/ilkomgallery/tabs/GameProjectsTab.jsx
import React, { useState } from 'react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import GameProjectCard from '../shared/GameProjectCard'

const gameProjects = [
  {
    id: 1,
    title: 'Endless Runner: Kampus Adventure',
    creator: 'Budi Santoso',
    nim: '20200101111',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/600x400/EF4444/white?text=Runner+Game',
    description: 'Game endless runner berlatar kampus dengan mekanik parkour. Koleksi koin dan hindari rintangan!',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/runner-game.exe',
    engine: 'Unity',
    platform: 'PC'
  },
  {
    id: 2,
    title: 'Puzzle Game: ILKOM Memory',
    creator: 'Citra Lestari',
    nim: '20210101167',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/600x400/8B5CF6/white?text=Puzzle+Game',
    description: 'Game puzzle memory dengan tema landmark kampus. Cocok untuk mengasah otak!',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/puzzle-game.apk',
    engine: 'Godot',
    platform: 'Android'
  }
]

const jurusanOptions = [
  'Semua Jurusan',
  'S1 Ilmu Komputer',
  'S1 Sistem Informasi',
  'S1 Teknologi Informasi'
]

const angkatanOptions = ['Semua Angkatan', 2019, 2020, 2021, 2022]
const engineOptions = ['Semua Engine', 'Unity', 'Unreal', 'Godot', 'Custom']
const platformOptions = ['Semua Platform', 'PC', 'Android', 'iOS', 'Web']

const GameProjectsTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('Semua Jurusan')
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua Angkatan')
  const [selectedEngine, setSelectedEngine] = useState('Semua Engine')
  const [selectedPlatform, setSelectedPlatform] = useState('Semua Platform')

  const filteredProjects = gameProjects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesJurusan = selectedJurusan === 'Semua Jurusan' || project.jurusan === selectedJurusan
    const matchesAngkatan = selectedAngkatan === 'Semua Angkatan' || project.angkatan.toString() === selectedAngkatan.toString()
    const matchesEngine = selectedEngine === 'Semua Engine' || project.engine === selectedEngine
    const matchesPlatform = selectedPlatform === 'Semua Platform' || project.platform === selectedPlatform
    
    return matchesSearch && matchesJurusan && matchesAngkatan && matchesEngine && matchesPlatform
  })

  return (
    <div>
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="🔍 Cari game..."
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
            label="Engine"
            options={engineOptions}
            value={selectedEngine}
            onChange={setSelectedEngine}
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
          Menampilkan <span className="font-semibold text-primary">{filteredProjects.length}</span> game
        </p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <GameProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-text-gray text-lg font-medium">Belum ada game</p>
          <p className="text-text-gray mt-2">Kembangkan game dan bagikan karyamu!</p>
        </div>
      )}
    </div>
  )
}

export default GameProjectsTab