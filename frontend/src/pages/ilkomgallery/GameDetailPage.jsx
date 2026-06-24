// src/pages/ilkomgallery/GameDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Play, X, ExternalLink, Download,
  User, Calendar, Code2, Gamepad2, Award, Users,
  Mail, ArrowLeft
} from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

// Data game projects
const gamesData = {
  'endless-runner-kampus-adventure': {
    id: 1,
    slug: 'endless-runner-kampus-adventure',
    title: 'Endless Runner: Kampus Adventure',
    creator: 'Budi Santoso',
    nim: '20200101111',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    email: 'budi.santoso@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/EF4444/white?text=Endless+Runner',
    banner: 'https://placehold.co/1600x600/DC2626/white?text=Endless+Runner+Game',
    description: 'Game endless runner berlatar kampus dengan mekanik parkour. Koleksi koin dan hindari rintangan!',
    fullDescription: `**Tentang Game:**
Endless Runner: Kampus Adventure adalah game endless runner yang mengambil latar di lingkungan kampus. Pemain akan berlari melewati berbagai gedung dan fasilitas kampus sambil mengumpulkan koin dan menghindari rintangan.

**🎮 Fitur Game:**
- 3 karakter yang bisa dipilih (mahasiswa, dosen, alumni)
- 5 level dengan kesulitan bertahap
- Power-up (speed boost, shield, magnet coin)
- Leaderboard online
- Daily challenge

**🛠️ Teknologi yang Digunakan:**
- Unity Engine 2022 LTS
- C# Programming Language
- Adobe Photoshop untuk asset
- FMOD untuk audio

**🏆 Pencapaian:**
- Best Game Design di ILKOM Game Fest 2024
- 10.000+ downloads di itch.io`,
    downloadLink: 'https://drive.google.com/runner-game.exe',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    engine: 'Unity',
    platform: 'PC',
    techStack: ['C#', 'Unity', 'Photoshop', 'FMOD'],
    collaborators: ['Andi Wijaya', 'Citra Lestari'],
    award: 'Best Game Design di ILKOM Game Fest 2024'
  },
  'puzzle-game-ilkom-memory': {
    id: 2,
    slug: 'puzzle-game-ilkom-memory',
    title: 'Puzzle Game: ILKOM Memory',
    creator: 'Citra Lestari',
    nim: '20210101167',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2021,
    email: 'citra.lestari@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/8B5CF6/white?text=Puzzle+Game',
    banner: 'https://placehold.co/1600x600/7C3AED/white?text=Puzzle+Game',
    description: 'Game puzzle memory dengan tema landmark kampus. Cocok untuk mengasah otak!',
    fullDescription: `**Tentang Game:**
Game puzzle memory interaktif yang menguji daya ingat pemain dengan mencocokkan gambar landmark kampus.

**🎮 Fitur Game:**
- 3 tingkat kesulitan (mudah, sedang, sulit)
- Timer untuk mode challenge
- High score system
- 20+ landmark kampus

**🛠️ Teknologi:**
- Godot Engine
- GDScript
- Aseprite untuk asset`,
    downloadLink: 'https://drive.google.com/puzzle-game.apk',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    engine: 'Godot',
    platform: 'Android',
    techStack: ['GDScript', 'Godot', 'Aseprite'],
    collaborators: ['Budi Santoso'],
    award: null
  },
  'space-shooter-galaxy-defense': {
    id: 3,
    slug: 'space-shooter-galaxy-defense',
    title: 'Space Shooter: Galaxy Defense',
    creator: 'Rizki Pratama',
    nim: '20200101234',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2020,
    email: 'rizki.pratama@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/F97316/white?text=Space+Shooter',
    banner: 'https://placehold.co/1600x600/EA580C/white?text=Space+Shooter',
    description: 'Game shooter arcade dengan grafis retro. Bertahan hidup dari serangan alien!',
    fullDescription: `**Tentang Game:**
Game shooter arcade dengan tema luar angkasa. Pemain mengendalikan pesawat tempur dan harus bertahan dari serangan alien.

**🎮 Fitur Game:**
- 10 level dengan boss fight
- 5 jenis senjata yang bisa di-upgrade
- Power-up system
- Endless mode

**🛠️ Teknologi:**
- Unity Engine
- C#
- Blender untuk 3D assets`,
    downloadLink: 'https://drive.google.com/space-shooter.exe',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    engine: 'Unity',
    platform: 'PC',
    techStack: ['C#', 'Unity', 'Blender'],
    collaborators: [],
    award: null
  },
  'rpg-story-lost-kingdom': {
    id: 4,
    slug: 'rpg-story-lost-kingdom',
    title: 'RPG Story: Lost Kingdom',
    creator: 'Dewi Sartika',
    nim: '20210101234',
    jurusan: 'S1 Sistem Komputer',
    angkatan: 2021,
    email: 'dewi.sartika@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/EC4899/white?text=RPG+Game',
    banner: 'https://placehold.co/1600x600/DB2777/white?text=RPG+Game',
    description: 'Game RPG dengan cerita interaktif. Jelajahi dunia fantasi dan kalahkan monster!',
    fullDescription: `**Tentang Game:**
Game RPG dengan cerita interaktif yang mendalam. Pemain dapat memilih karakter dan menjalankan misi.

**🎮 Fitur Game:**
- 3 class karakter (Warrior, Mage, Archer)
- 20+ quest
- Turn-based combat system
- Multiple endings

**🛠️ Teknologi:**
- Unreal Engine 5
- C++
- Blender`,
    downloadLink: 'https://drive.google.com/rpg-game.apk',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    engine: 'Unreal',
    platform: 'Android',
    techStack: ['C++', 'Unreal Engine', 'Blender'],
    collaborators: ['Rizki Pratama'],
    award: 'Juara Favorit Game Competition 2024'
  },
  'multiplayer-quiz-ilkom-challenge': {
    id: 5,
    slug: 'multiplayer-quiz-ilkom-challenge',
    title: 'Multiplayer Quiz: ILKOM Challenge',
    creator: 'Fajar Nugroho',
    nim: '20220101111',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2022,
    email: 'fajar.nugroho@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/10B981/white?text=Quiz+Game',
    banner: 'https://placehold.co/1600x600/059669/white?text=Quiz+Game',
    description: 'Game kuis multiplayer real-time. Uji pengetahuanmu tentang ilmu komputer!',
    fullDescription: `**Tentang Game:**
Game kuis multiplayer yang memungkinkan pemain berkompetisi secara real-time.

**🎮 Fitur Game:**
- Real-time multiplayer (2-4 pemain)
- 500+ pertanyaan tentang ilmu komputer
- Ranking system
- Daily tournament

**🛠️ Teknologi:**
- Custom Engine dengan JavaScript
- Node.js backend
- Socket.io untuk real-time
- React untuk frontend`,
    downloadLink: 'https://drive.google.com/quiz-game.web',
    gameplayVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    engine: 'Custom',
    platform: 'Web',
    techStack: ['JavaScript', 'Node.js', 'Socket.io', 'React', 'MongoDB'],
    collaborators: ['Dewi Sartika'],
    award: 'Best Multiplayer Game 2024'
  }
}

// Fungsi untuk format teks
const formatText = (text) => {
  return text.split('\n').map((line, idx) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h3 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(2, -2)}</h3>
    }
    if (line.startsWith('- ')) {
      return <li key={idx} className="text-theme-secondary ml-4 mb-1">{line.slice(2)}</li>
    }
    if (line.trim() === '') return <br key={idx} />
    return <p key={idx} className="text-theme-secondary mb-2">{line}</p>
  })
}

const GameDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const data = gamesData[slug]
    if (data) {
      setGame(data)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Game tidak ditemukan</p>
          <Link to="/ilkomgallery" className="text-orange-500 hover:text-orange-400">
            Kembali ke Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme pb-16">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden pt-16 md:pt-0">
        <img 
          src={game.banner || game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Kembali ke Gallery</span>
        </button>
        
        {/* Tombol Close */}
        <button 
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 right-6 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition"
        >
          <X size={20} className="text-white" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded-full">
                <Gamepad2 size={12} />
                <span>GAME PROJECT</span>
              </span>
              {game.award && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500 text-black text-xs font-medium rounded-full">
                  <Award size={12} />
                  <span>{game.award}</span>
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-4xl font-header">
              {game.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="text-white/70">Oleh {game.creator}</div>
              <div className="text-white/70">•</div>
              <div className="text-white/70">Angkatan {game.angkatan}</div>
              <div className="text-white/70">•</div>
              <div className="flex items-center gap-1 text-white/70">
                <Gamepad2 size={12} />
                <span>{game.engine}</span>
              </div>
              <div className="text-white/70">•</div>
              <div className="text-white/70">{game.platform}</div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button 
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition"
              >
                <Play size={18} fill="currentColor" />
                <span>Watch Trailer</span>
              </button>
              <a 
                href={game.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition"
              >
                <Download size={18} />
                <span>Download Game</span>
              </a>
            </div>
            
            <p className="text-white/80 text-base md:text-lg max-w-3xl">
              {game.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-white text-2xl font-bold mb-4">About This Game</h2>
              <div className="text-theme-secondary leading-relaxed">
                {formatText(game.fullDescription)}
              </div>
            </section>
            
            <section>
              <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 size={24} />
                <span>Tech Stack</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {game.techStack.map((tech, idx) => (
                  <span key={idx} className="px-4 py-2 bg-theme-secondary text-theme-primary rounded-lg text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-theme-secondary rounded-xl p-6 border border-theme">
              <h3 className="text-theme-primary font-bold text-lg mb-4 flex items-center gap-2">
                <User size={18} />
                <span>Creator</span>
              </h3>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                  {game.creator.charAt(0)}
                </div>
                <div>
                  <h4 className="text-theme-primary font-semibold text-lg">{game.creator}</h4>
                  <p className="text-theme-muted text-sm">{game.jurusan}</p>
                  <p className="text-theme-muted text-xs">NIM: {game.nim}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-theme-muted">
                  <Calendar size={14} />
                  <span>Angkatan {game.angkatan}</span>
                </div>
                <div className="flex items-center gap-2 text-theme-muted">
                  <Mail size={14} />
                  <a href={`mailto:${game.email}`} className="hover:text-orange-400 transition">
                    {game.email}
                  </a>
                </div>
              </div>
            </div>
            
            {game.collaborators && game.collaborators.length > 0 && (
              <div className="bg-theme-secondary rounded-xl p-6 border border-theme">
                <h3 className="text-theme-primary font-bold text-lg mb-3 flex items-center gap-2">
                  <Users size={18} />
                  <span>Collaborators</span>
                </h3>
                <div className="space-y-2">
                  {game.collaborators.map((collab, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-theme rounded-lg transition">
                      <div className="w-8 h-8 rounded-full bg-theme-secondary flex items-center justify-center text-xs font-bold">
                        {collab.charAt(0)}
                      </div>
                      <span className="text-theme-primary">{collab}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-orange-400 transition"
            >
              <X size={24} />
            </button>
            <div className="bg-black rounded-xl overflow-hidden">
              <iframe 
                src={game.gameplayVideo} 
                className="w-full aspect-video"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameDetailPage