import { useParams, useNavigate } from 'react-router-dom'
import { Gamepad2 } from 'lucide-react'
import ProjectDetailLayout from '../../components/ilkomgallery/ProjectDetailLayout'

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

const GameDetailPage = () => {
  const { slug } = useParams()
  const game = gamesData[slug]

  return (
    <ProjectDetailLayout
      project={game}
      categoryLabel="Game"
      categoryIcon={Gamepad2}
      backPath="/ilkom-gallery"
      accentColor="orange"
    />
  )
}

export default GameDetailPage
