// components/ilkomgallery/tabs/GameProjectsTab.jsx
import React, { useState } from 'react'
import { Gamepad2, Search, Filter } from 'lucide-react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import GameProjectCard from '../shared/GameProjectCard'

const gameProjects = [
  {
    id: 1,
    title: 'Endless Runner: Kampus Adventure',
    creator: 'Budi Santoso',
    nim: '20200101111',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/EF4444/white?text=Endless+Runner',
    description: 'Game endless runner berlatar kampus dengan mekanik parkour. Koleksi koin dan hindari rintangan!',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/runner-game.exe',
    engine: 'Unity',
    platform: 'PC',
    techStack: ['C#', 'Unity', 'Photoshop']
  },
  {
    id: 2,
    title: 'Puzzle Game: ILKOM Memory',
    creator: 'Citra Lestari',
    nim: '20210101167',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/8B5CF6/white?text=Puzzle+Game',
    description: 'Game puzzle memory dengan tema landmark kampus. Cocok untuk mengasah otak!',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/puzzle-game.apk',
    engine: 'Godot',
    platform: 'Android',
    techStack: ['GDScript', 'Godot', 'Aseprite']
  },
  {
    id: 3,
    title: 'Space Shooter: Galaxy Defense',
    creator: 'Rizki Pratama',
    nim: '20200101234',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/F97316/white?text=Space+Shooter',
    description: 'Game shooter arcade dengan grafis retro. Bertahan hidup dari serangan alien!',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/space-shooter.exe',
    engine: 'Unity',
    platform: 'PC',
    techStack: ['C#', 'Unity', 'Blender']
  },
  {
    id: 4,
    title: 'RPG Story: Lost Kingdom',
    creator: 'Dewi Sartika',
    nim: '20210101234',
    jurusan: 'S1 Sistem Komputer',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/EC4899/white?text=RPG+Game',
    description: 'Game RPG dengan cerita interaktif. Jelajahi dunia fantasi dan kalahkan monster!',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/rpg-game.apk',
    engine: 'Unreal',
    platform: 'Android',
    techStack: ['C++', 'Unreal Engine', 'Blender']
  },
  {
    id: 5,
    title: 'Multiplayer Quiz: ILKOM Challenge',
    creator: 'Fajar Nugroho',
    nim: '20220101111',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2022,
    thumbnail: 'https://placehold.co/800x500/10B981/white?text=Quiz+Game',
    description: 'Game kuis multiplayer real-time. Uji pengetahuanmu tentang ilmu komputer!',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadLink: 'https://drive.google.com/quiz-game.web',
    engine: 'Custom',
    platform: 'Web',
    techStack: ['JavaScript', 'Node.js', 'Socket.io', 'React']
  }
]

// Jurusan Options (6 jurusan) - Sama dengan AI Projects
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

// Engine Options
const engineOptions = ['Semua Engine', 'Unity', 'Unreal', 'Godot', 'Custom']

// Platform Options
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
    const matchesAngkatan = selectedAngkatan === 'Semua Angkatan' || project.angkatan === selectedAngkatan
    const matchesEngine = selectedEngine === 'Semua Engine' || project.engine === selectedEngine
    const matchesPlatform = selectedPlatform === 'Semua Platform' || project.platform === selectedPlatform
    
    return matchesSearch && matchesJurusan && matchesAngkatan && matchesEngine && matchesPlatform
  })

  return (
    <div>
      {/* Filter Bar - Modern Design (Sama dengan AI Projects) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-700">Filter Game Projects</h3>
          </div>
          {(selectedJurusan !== 'Semua Jurusan' || 
            selectedAngkatan !== 'Semua Angkatan' || 
            selectedEngine !== 'Semua Engine' || 
            selectedPlatform !== 'Semua Platform' || 
            searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedJurusan('Semua Jurusan')
                setSelectedAngkatan('Semua Angkatan')
                setSelectedEngine('Semua Engine')
                setSelectedPlatform('Semua Platform')
              }}
              className="text-xs text-orange-500 hover:text-orange-600 transition-colors ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Cari game, creator..." 
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

      {/* Result Count - Modern Style */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <p className="text-gray-500 text-sm">
            Menampilkan <span className="font-semibold text-orange-600">{filteredProjects.length}</span> game
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {filteredProjects.length === gameProjects.length ? 'Semua game ditampilkan' : `${gameProjects.length - filteredProjects.length} game lainnya`}
        </div>
      </div>

      {/* Grid Card - 2 card per baris di semua ukuran layar */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <GameProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          {/* Icon Gamepad2 - Ganti emoji 🎮 */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <Gamepad2 size={40} className="text-orange-500" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Tidak ada game yang ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau cari dengan kata kunci lain</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedJurusan('Semua Jurusan')
              setSelectedAngkatan('Semua Angkatan')
              setSelectedEngine('Semua Engine')
              setSelectedPlatform('Semua Platform')
            }}
            className="mt-4 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

export default GameProjectsTab