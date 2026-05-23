// components/ilkomgallery/tabs/AiProjectsTab.jsx
import React, { useState } from 'react'
import SearchBar from '../shared/SearchBar'
import FilterDropdown from '../shared/FilterDropdown'
import AiProjectCard from '../shared/AiProjectCard'

const aiProjects = [
  {
    id: 1,
    title: 'Image Classifier for Plant Diseases',
    creator: 'Andi Wijaya',
    nim: '20190101099',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2019,
    thumbnail: 'https://placehold.co/600x400/3B82F6/white?text=AI+Classifier',
    description: 'Sistem klasifikasi penyakit tanaman menggunakan CNN (Convolutional Neural Network) dengan akurasi 95%.',
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
    thumbnail: 'https://placehold.co/600x400/10B981/white?text=Chatbot',
    description: 'Chatbot AI untuk membantu mahasiswa mendapatkan informasi akademik seperti jadwal, nilai, dan pengumuman.',
    github: 'https://github.com/sarahamelia/academic-chatbot',
    demoLink: 'https://chatbot.demo.com',
    techStack: ['Python', 'Rasa', 'Flask', 'React Native']
  },
  {
    id: 3,
    title: 'Sentiment Analysis for E-Commerce',
    creator: 'M. Farhan',
    nim: '20210101188',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2021,
    thumbnail: 'https://placehold.co/600x400/8B5CF6/white?text=Sentiment+Analysis',
    description: 'Analisis sentimen untuk review produk e-commerce menggunakan NLP dan machine learning.',
    github: 'https://github.com/mfarhan/sentiment-analysis',
    demoLink: 'https://sentiment.demo.com',
    techStack: ['Python', 'Scikit-learn', 'NLTK', 'FastAPI']
  },
  {
    id: 4,
    title: 'IoT Smart Campus Monitoring',
    creator: 'Reno Kurniawan',
    nim: '20200101155',
    jurusan: 'S1 Teknologi Informasi',
    angkatan: 2020,
    thumbnail: 'https://placehold.co/600x400/EF4444/white?text=IoT',
    description: 'Sistem monitoring ruangan kampus berbasis IoT dengan sensor suhu, kelembaban, dan kepadatan.',
    github: 'https://github.com/renokurniawan/smart-campus-iot',
    demoLink: 'https://iot.demo.com',
    techStack: ['Arduino', 'Raspberry Pi', 'Node.js', 'MQTT']
  }
]

const jurusanOptions = [
  'Semua Jurusan',
  'S1 Ilmu Komputer',
  'S1 Sistem Informasi',
  'S1 Teknologi Informasi'
]

const angkatanOptions = ['Semua Angkatan', 2019, 2020, 2021, 2022]

const AiProjectsTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('Semua Jurusan')
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua Angkatan')

  const filteredProjects = aiProjects.filter(project => {
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
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="🔍 Cari project AI / IoT..."
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

      <div className="mb-4">
        <p className="text-text-gray">
          Menampilkan <span className="font-semibold text-primary">{filteredProjects.length}</span> project AI & lainnya
        </p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <AiProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-text-gray text-lg font-medium">Belum ada project AI</p>
          <p className="text-text-gray mt-2">Ayo buat project AI dan bagikan!</p>
        </div>
      )}
    </div>
  )
}

export default AiProjectsTab