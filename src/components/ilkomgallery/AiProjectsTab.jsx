// components/ilkomgallery/tabs/AiProjectsTab.jsx
import React, { useState } from 'react'
import { Cpu, Search, Filter } from 'lucide-react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import AiProjectCard from '../shared/AiProjectCard'

const aiProjects = [
  {
    id: 1,
    title: 'Image Classifier for Plant Diseases',
    creator: 'Andi Wijaya',
    nim: '20190101099',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2019,
    thumbnail: 'https://placehold.co/800x500/3B82F6/white?text=AI+Classifier',
    description: 'Sistem klasifikasi penyakit tanaman menggunakan CNN dengan akurasi 95% untuk membantu petani mendeteksi penyakit secara dini.',
    github: 'https://github.com/andiwijaya/plant-disease-classifier',
    demoLink: 'https://plant-ai.demo.com',
    techStack: ['Python', 'TensorFlow', 'Flask', 'React']
  },
  {
    id: 2,
    title: 'Chatbot for Academic Services',
    creator: 'Sarah Amelia',
    nim: '20200101123',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/10B981/white?text=Chatbot',
    description: 'Chatbot AI untuk membantu mahasiswa mendapatkan informasi akademik seperti jadwal, nilai, dan pengumuman.',
    github: 'https://github.com/sarahamelia/academic-chatbot',
    demoLink: 'https://chatbot.demo.com',
    techStack: ['Python', 'Rasa', 'Flask', 'PostgreSQL']
  },
  {
    id: 3,
    title: 'Sentiment Analysis for E-Commerce',
    creator: 'M. Farhan',
    nim: '20210101188',
    jurusan: 'S1 Sistem Komputer',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/8B5CF6/white?text=Sentiment+Analysis',
    description: 'Analisis sentimen untuk review produk e-commerce menggunakan NLP dan machine learning untuk mengetahui kepuasan pelanggan.',
    github: 'https://github.com/mfarhan/sentiment-analysis',
    demoLink: 'https://sentiment.demo.com',
    techStack: ['Python', 'Scikit-learn', 'NLTK', 'FastAPI']
  },
  {
    id: 4,
    title: 'IoT Smart Campus Monitoring',
    creator: 'Reno Kurniawan',
    nim: '20200101155',
    jurusan: 'D3 Teknik Komputer',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/800x500/EF4444/white?text=IoT',
    description: 'Sistem monitoring ruangan kampus berbasis IoT dengan sensor suhu, kelembaban, dan kepadatan secara real-time.',
    github: 'https://github.com/renokurniawan/smart-campus-iot',
    demoLink: 'https://iot.demo.com',
    techStack: ['Arduino', 'Raspberry Pi', 'Node.js', 'MQTT']
  },
  {
    id: 5,
    title: 'AI Movie Recommendation System',
    creator: 'Putri Maharani',
    nim: '20210101234',
    jurusan: 'S1 Teknik Informatika',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/800x500/EC4899/white?text=Movie+Recommendation',
    description: 'Sistem rekomendasi film berbasis AI dengan algoritma collaborative filtering yang memberikan saran personalized.',
    github: 'https://github.com/putrimaharani/movie-recommendation',
    demoLink: 'https://movie-recommendation.demo.com',
    techStack: ['Python', 'FastAPI', 'Scikit-learn', 'React', 'PostgreSQL']
  }
]

// Jurusan Options (6 jurusan)
const jurusanOptions = [
  'Semua Jurusan',
  'S1 Teknik Informatika',
  'S1 Sistem Informação',
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

const AiProjectsTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('Semua Jurusan')
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua Angkatan')

  const filteredProjects = aiProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-700">Filter AI Projects</h3>
          </div>
          {(selectedJurusan !== 'Semua Jurusan' || selectedAngkatan !== 'Semua Angkatan' || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedJurusan('Semua Jurusan')
                setSelectedAngkatan('Semua Angkatan')
              }}
              className="text-xs text-purple-500 hover:text-purple-600 transition-colors ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Cari project AI, creator..." 
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
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <p className="text-gray-500 text-sm">
            Menampilkan <span className="font-semibold text-purple-600">{filteredProjects.length}</span> project AI
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {filteredProjects.length === aiProjects.length ? 'Semua project ditampilkan' : `${aiProjects.length - filteredProjects.length} project lainnya`}
        </div>
      </div>

      {/* Grid Card - 2 card per baris di semua ukuran layar */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <AiProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          {/* Icon Cpu - Ganti emoji 🔍 */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <Cpu size={40} className="text-purple-500" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Tidak ada project yang ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau cari dengan kata kunci lain</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedJurusan('Semua Jurusan')
              setSelectedAngkatan('Semua Angkatan')
            }}
            className="mt-4 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

export default AiProjectsTab