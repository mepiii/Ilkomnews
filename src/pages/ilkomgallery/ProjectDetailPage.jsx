// src/pages/ilkomgallery/ProjectDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Play, X, ExternalLink, 
  User, Calendar, Code2, Brain, Award, Users,
  Mail, ArrowLeft
} from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

// Data project (key-nya sekarang pake slug)
const projectsData = {
  'image-classifier-for-plant-diseases': {
    id: 1,
    slug: 'image-classifier-for-plant-diseases',
    title: 'Image Classifier for Plant Diseases',
    creator: 'Andi Wijaya',
    nim: '20190101099',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2019,
    email: 'andi.wijaya@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/3B82F6/white?text=AI+Classifier',
    banner: 'https://placehold.co/1600x600/2563EB/white?text=Image+Classifier+Project',
    description: 'Sistem klasifikasi penyakit tanaman menggunakan CNN dengan akurasi 95%.',
    fullDescription: `Proyek ini dikembangkan sebagai tugas akhir yang bertujuan membantu petani mendeteksi penyakit tanaman secara dini.

**Teknologi yang Digunakan:**
- Convolutional Neural Network (CNN) dengan arsitektur ResNet50
- Dataset berisi 15,000+ gambar daun tanaman
- Akurasi mencapai 95% pada data uji

**Dampak:**
- Telah diuji coba pada 3 kelompok tani
- Mengurangi waktu diagnosis dari 3 hari menjadi 5 menit`,
    github: 'https://github.com/andiwijaya/plant-disease-classifier',
    demoLink: 'https://plant-ai.demo.com',
    techStack: ['Python', 'TensorFlow', 'Flask', 'React'],
    collaborators: ['Budi Santoso', 'Citra Dewi'],
    award: 'Juara 1 Lomba Inovasi Teknologi 2024'
  },
  'chatbot-for-academic-services': {
    id: 2,
    slug: 'chatbot-for-academic-services',
    title: 'Chatbot for Academic Services',
    creator: 'Sarah Amelia',
    nim: '20200101123',
    jurusan: 'S1 Sistem Informasi',
    angkatan: 2020,
    email: 'sarah.amelia@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/10B981/white?text=Chatbot',
    banner: 'https://placehold.co/1600x600/059669/white?text=Chatbot+Project',
    description: 'Chatbot AI untuk membantu mahasiswa mendapatkan informasi akademik.',
    fullDescription: `Chatbot akademik yang dapat diakses melalui LINE Messenger.

**Fitur Utama:**
- Informasi jadwal kuliah
- Cek nilai ujian
- Pengumuman akademik real-time`,
    github: 'https://github.com/sarahamelia/academic-chatbot',
    demoLink: 'https://chatbot.demo.com',
    techStack: ['Python', 'Rasa', 'Flask', 'PostgreSQL'],
    collaborators: ['M. Farhan'],
    award: null
  },
  'sentiment-analysis-for-e-commerce': {
    id: 3,
    slug: 'sentiment-analysis-for-e-commerce',
    title: 'Sentiment Analysis for E-Commerce',
    creator: 'M. Farhan',
    nim: '20210101188',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2021,
    email: 'farhan@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/8B5CF6/white?text=Sentiment+Analysis',
    banner: 'https://placehold.co/1600x600/7C3AED/white?text=Sentiment+Analysis+Project',
    description: 'Analisis sentimen untuk review produk e-commerce menggunakan NLP.',
    fullDescription: `Sistem analisis sentimen otomatis untuk review produk.

**Teknologi:**
- Natural Language Processing
- Machine Learning dengan Scikit-learn
- API dengan FastAPI`,
    github: 'https://github.com/mfarhan/sentiment-analysis',
    demoLink: 'https://sentiment.demo.com',
    techStack: ['Python', 'Scikit-learn', 'NLTK', 'FastAPI'],
    collaborators: [],
    award: 'Best Paper Award 2024'
  },
  'iot-smart-campus-monitoring': {
    id: 4,
    slug: 'iot-smart-campus-monitoring',
    title: 'IoT Smart Campus Monitoring',
    creator: 'Reno Kurniawan',
    nim: '20200101155',
    jurusan: 'S1 Teknologi Informasi',
    angkatan: 2020,
    email: 'reno.kurniawan@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/EF4444/white?text=IoT',
    banner: 'https://placehold.co/1600x600/DC2626/white?text=IoT+Project',
    description: 'Sistem monitoring ruangan kampus berbasis IoT dengan sensor.',
    fullDescription: `Sistem monitoring ruangan kampus real-time.

**Fitur:**
- Monitoring suhu dan kelembaban
- Deteksi kepadatan ruangan
- Dashboard real-time`,
    github: 'https://github.com/renokurniawan/smart-campus-iot',
    demoLink: 'https://iot.demo.com',
    techStack: ['Arduino', 'Raspberry Pi', 'Node.js', 'MQTT'],
    collaborators: ['Andi Wijaya'],
    award: null
  },
  'ai-movie-recommendation-system': {
    id: 5,
    slug: 'ai-movie-recommendation-system',
    title: 'AI Movie Recommendation System',
    creator: 'Putri Maharani',
    nim: '20210101234',
    jurusan: 'S1 Ilmu Komputer',
    angkatan: 2021,
    email: 'putri.maharani@student.ac.id',
    thumbnail: 'https://placehold.co/1200x600/EC4899/white?text=Movie+Recommendation+AI',
    banner: 'https://placehold.co/1600x600/DB2777/white?text=AI+Movie+Recommendation+System',
    description: 'Sistem rekomendasi film berbasis AI yang memberikan saran personalized berdasarkan history tontonan dan preferensi pengguna.',
    fullDescription: `**Tentang Project:**
Sistem rekomendasi film yang menggunakan algoritma collaborative filtering dan content-based filtering untuk memberikan rekomendasi film yang akurat dan personal.

**🎯 Fitur Utama:**
- Rekomendasi film berdasarkan genre favorit
- Personalisasi berdasarkan rating pengguna
- Similar movie finder (cari film yang mirip)
- Top 10 trending movies hari ini
- Save to watchlist

**🛠️ Teknologi yang Digunakan:**
- Machine Learning: Surprise Library, Scikit-learn
- Algoritma: Collaborative Filtering (SVD), Content-Based Filtering (Cosine Similarity)
- Backend: FastAPI, PostgreSQL, Redis
- Frontend: React.js, Tailwind CSS
- Deployment: Docker, Railway

**📊 Dataset:**
Menggunakan MovieLens dataset dengan:
- 25,000+ movies
- 1,000,000+ user ratings
- 100+ genre categories

**🏆 Pencapaian:**
- Akurasi rekomendasi mencapai 87% pada user testing
- Rata-rata user engagement meningkat 45% setelah menggunakan sistem
- Top 3 finalis Hackathon AI 2024

**📈 Dampak:**
- Digunakan oleh 500+ pengguna beta
- Rating rata-rata 4.8/5 dari pengguna
- Rencana kerjasama dengan platform streaming lokal`,
    github: 'https://github.com/putrimaharani/movie-recommendation',
    demoLink: 'https://movie-recommendation.demo.com',
    techStack: ['Python', 'FastAPI', 'Scikit-learn', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    collaborators: ['Ahmad Fauzi', 'Rizky Pratama'],
    award: 'Top 3 Hackathon AI 2024'
  }
}

// Fungsi untuk format teks (support markdown sederhana)
const formatText = (text) => {
  return text.split('\n').map((line, idx) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h3 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(2, -2)}</h3>
    }
    if (line.startsWith('- ')) {
      return <li key={idx} className="text-gray-300 ml-4 mb-1">{line.slice(2)}</li>
    }
    if (line.trim() === '') return <br key={idx} />
    return <p key={idx} className="text-gray-300 mb-2">{line}</p>
  })
}

const ProjectDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = projectsData[slug]
    if (data) {
      setProject(data)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Project tidak ditemukan</p>
          <Link to="/ilkomgallery" className="text-purple-500 hover:text-purple-400">
            Kembali ke Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-16">
      {/* Hero Section - Tambah pt-16 untuk kasih space dari navbar */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden pt-16">
        <img 
          src={project.banner || project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        
        {/* Tombol Kembali - Sekarang aman tidak ketutupan navbar karena hero section punya pt-16 */}
        <button 
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Kembali ke Gallery</span>
        </button>
        
        {/* Tombol Close (X) di Kanan Atas */}
        <button 
          onClick={() => navigate('/ilkomgallery')}
          className="absolute top-24 right-6 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition"
        >
          <X size={20} className="text-white" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                <Brain size={12} />
                <span>AI PROJECT</span>
              </span>
              {project.award && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500 text-black text-xs font-medium rounded-full">
                  <Award size={12} />
                  <span>{project.award}</span>
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="text-white/70">Oleh {project.creator}</div>
              <div className="text-white/70">•</div>
              <div className="text-white/70">Angkatan {project.angkatan}</div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a 
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition"
              >
                <Play size={18} fill="currentColor" />
                <span>Demo Project</span>
              </a>
            </div>
            
            <p className="text-white/80 text-base md:text-lg max-w-3xl">
              {project.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Detail Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-white text-2xl font-bold mb-4">About This Project</h2>
              <div className="text-gray-300 leading-relaxed">
                {formatText(project.fullDescription)}
              </div>
            </section>
            
            <section>
              <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 size={24} />
                <span>Tech Stack</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-white text-2xl font-bold mb-4">Links & Resources</h2>
              <div className="flex flex-wrap gap-4">
                {project.demoLink && (
                  <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                    <FaGithub size={18} />
                    <span>GitHub Repository</span>
                  </a>
                )}
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <User size={18} />
                <span>Creator</span>
              </h3>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                  {project.creator.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{project.creator}</h4>
                  <p className="text-gray-400 text-sm">{project.jurusan}</p>
                  <p className="text-gray-500 text-xs">NIM: {project.nim}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} />
                  <span>Angkatan {project.angkatan}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={14} />
                  <a href={`mailto:${project.email}`} className="hover:text-purple-400 transition">
                    {project.email}
                  </a>
                </div>
              </div>
            </div>
            
            {project.collaborators && project.collaborators.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <Users size={18} />
                  <span>Collaborators</span>
                </h3>
                <div className="space-y-2">
                  {project.collaborators.map((collab, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                        {collab.charAt(0)}
                      </div>
                      <span className="text-gray-300">{collab}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage