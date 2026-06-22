// Konfigurasi API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Helper untuk fetch dengan error handling
const fetchAPI = async (endpoint, options = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

// ============ MOCK DATA ============
// Data untuk development (ketika backend belum siap)

const mockNewsData = [
  {
    id: 1,
    title: "Workshop AI: Masa Depan Kecerdasan Buatan",
    summary: "Pelajari tentang perkembangan terbaru dalam AI dan bagaimana implementasinya di industri. Workshop ini akan membahas berbagai topik menarik seputar AI.",
    content: "Workshop AI merupakan program pelatihan intensif yang dirancang untuk memberikan pemahaman mendalam tentang kecerdasan buatan. Peserta akan belajar tentang machine learning, deep learning, dan implementasinya dalam berbagai bidang industri. Workshop ini dipandu oleh praktisi AI berpengalaman dari berbagai perusahaan teknologi terkemuka.\n\nMateri yang akan dibahas meliputi:\n- Pengenalan AI dan Machine Learning\n- Supervised vs Unsupervised Learning\n- Neural Networks dan Deep Learning\n- Implementasi AI dengan Python\n- Studi kasus AI di industri\n\nPeserta akan mendapatkan sertifikat setelah menyelesaikan workshop.",
    category: "Workshop",
    date: new Date('2024-01-15'),
    author: "Dr. Ahmad Rizki",
    image: "https://picsum.photos/id/1/800/400",
    views: 1234,
    tags: ["AI", "Machine Learning", "Workshop"]
  },
  {
    id: 2,
    title: "Lomba Programming Competition 2024",
    summary: "Ajang bergengsi untuk mahasiswa Ilmu Komputer se-Indonesia. Berkesempatan memenangkan hadiah jutaan rupiah.",
    content: "Programming Competition 2024 adalah kompetisi coding tingkat nasional yang diselenggarakan untuk mahasiswa Ilmu Komputer. Kompetisi ini bertujuan untuk mengasah kemampuan problem solving dan algoritma.\n\nKategori lomba:\n- Competitive Programming\n- UI/UX Design\n- Mobile Development\n- Web Development\n\nHadiah total puluhan juta rupiah menanti para pemenang. Pendaftaran dibuka hingga 31 Januari 2024.",
    category: "Kompetisi",
    date: new Date('2024-01-20'),
    author: "Tim Ilkom News",
    image: "https://picsum.photos/id/2/800/400",
    views: 892,
    tags: ["Competition", "Programming", "Coding"]
  },
  {
    id: 3,
    title: "Web Development Bootcamp Batch 3",
    summary: "Program intensif belajar full-stack web development selama 3 bulan. Dapatkan pengalaman langsung membangun proyek nyata.",
    content: "Bootcamp Web Development Batch 3 hadir untuk Anda yang ingin menguasai skill full-stack web development. Program ini dirancang untuk pemula hingga tingkat mahir.\n\nMateri yang dipelajari:\n- HTML, CSS, JavaScript\n- React JS\n- Node JS\n- Database (MongoDB, PostgreSQL)\n- Deployment\n\nBootcamp berlangsung selama 3 bulan dengan metode pembelajaran hybrid (online & offline).",
    category: "Pelatihan",
    date: new Date('2024-01-25'),
    author: "Team Bootcamp",
    image: "https://picsum.photos/id/3/800/400",
    views: 1567,
    tags: ["Bootcamp", "Web Development", "React"]
  },
  {
    id: 4,
    title: "Seminar Cyber Security: Protecting Your Digital Identity",
    summary: "Pelajari cara melindungi data pribadi dan mengamankan sistem dari serangan siber.",
    content: "Di era digital ini, keamanan siber menjadi semakin penting. Seminar ini akan membahas berbagai ancaman siber dan cara mengatasinya.\n\nPembicara dari praktisi keamanan siber akan berbagi pengalaman dan tips praktis untuk melindungi data dan sistem Anda.",
    category: "Seminar",
    date: new Date('2024-02-01'),
    author: "Dr. Budi Santoso",
    image: "https://picsum.photos/id/4/800/400",
    views: 678,
    tags: ["Cyber Security", "Seminar", "Keamanan Data"]
  }
]

const mockArticlesData = [
  {
    id: 1,
    title: "Memahami Konsep Dasar Machine Learning",
    summary: "Panduan lengkap untuk pemula dalam machine learning. Pelajari algoritma dasar dan implementasinya.",
    content: "Machine Learning adalah cabang dari AI yang memungkinkan sistem untuk belajar dari data. Artikel ini akan membahas konsep dasar, jenis-jenis algoritma, dan contoh implementasi sederhana.\n\nJenis-jenis Machine Learning:\n1. Supervised Learning\n2. Unsupervised Learning\n3. Reinforcement Learning\n\nContoh implementasi ML dalam kehidupan sehari-hari:\n- Rekomendasi produk\n- Deteksi spam\n- Pengenalan wajah\n- Kendaraan otonom",
    category: "Pembelajaran",
    date: new Date('2024-01-10'),
    author: "Dr. Budi Santoso",
    image: "https://picsum.photos/id/5/800/400",
    readTime: "8 min read",
    tags: ["Machine Learning", "AI", "Data Science"]
  },
  {
    id: 2,
    title: "Best Practices React JS 2024",
    summary: "Tips dan trik dalam pengembangan React modern. Optimasi performa, struktur folder, dan hooks terbaru.",
    content: "React JS terus berkembang dengan fitur-fitur baru. Artikel ini membahas best practices terbaru untuk pengembangan React di tahun 2024.\n\nTopik yang dibahas:\n- React Server Components\n- Optimasi dengan useMemo dan useCallback\n- State Management dengan Zustand\n- Testing dengan React Testing Library\n- Performance optimization tips\n\nDengan mengikuti best practices ini, aplikasi React Anda akan lebih maintainable dan performant.",
    category: "Tutorial",
    date: new Date('2024-01-18'),
    author: "John Doe",
    image: "https://picsum.photos/id/6/800/400",
    readTime: "10 min read",
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: 3,
    title: "Database Design untuk Pemula",
    summary: "Panduan merancang database yang efisien dan scalable untuk aplikasi Anda.",
    content: "Database design yang baik adalah fondasi dari aplikasi yang scalable. Artikel ini akan membahas prinsip-prinsip dasar database design, normalisasi, dan best practices.\n\nPrinsip utama:\n- Normalisasi database\n- Pemilihan tipe data yang tepat\n- Indexing untuk performa\n- Relationship antar tabel",
    category: "Pembelajaran",
    date: new Date('2024-01-22'),
    author: "Dr. Rina Andriani",
    image: "https://picsum.photos/id/7/800/400",
    readTime: "6 min read",
    tags: ["Database", "SQL", "Backend"]
  }
]

const mockEventsData = [
  {
    id: 1,
    title: "Tech Conference 2024",
    summary: "Konferensi teknologi terbesar tahun ini dengan pembicara dari berbagai perusahaan teknologi terkemuka.",
    content: "Tech Conference 2024 adalah event tahunan yang menghadirkan para ahli teknologi dari seluruh Indonesia. Acara ini akan membahas tren teknologi terbaru dan masa depan industri digital.\n\nPembicara:\n- CTO Google Indonesia\n- Head of Engineering Tokopedia\n- AI Researcher dari ITB\n\nEarly bird ticket tersedia hingga 31 Januari!",
    category: "Conference",
    date: new Date('2024-02-15'),
    location: "Gedung Serba Guna UNIKOM, Bandung",
    image: "https://picsum.photos/id/8/800/400",
    registered: 150,
    capacity: 300,
    duration: "Full Day",
    price: "Free"
  },
  {
    id: 2,
    title: "Hackathon AI for Good",
    summary: "Kompetisi hackathon untuk solusi AI berdampak sosial. Kembangkan inovasi yang membantu masyarakat.",
    content: "Hackathon AI for Good mengajak para developer untuk menciptakan solusi AI yang memberikan dampak positif bagi masyarakat. Tema tahun ini adalah 'AI untuk Pendidikan dan Kesehatan'.\n\nHadiah:\n- Juara 1: Rp 15.000.000\n- Juara 2: Rp 10.000.000\n- Juara 3: Rp 5.000.000\n\nPendaftaran tim (3-5 orang) dibuka hingga 10 Februari.",
    category: "Hackathon",
    date: new Date('2024-03-01'),
    location: "Online",
    image: "https://picsum.photos/id/9/800/400",
    registered: 89,
    capacity: 200,
    duration: "3 Hari",
    price: "Free"
  },
  {
    id: 3,
    title: "Workshop UI/UX Design for Beginners",
    summary: "Pelajari dasar-dasar UI/UX design dari praktisi berpengalaman. Cocok untuk pemula yang ingin memulai karir di bidang design.",
    content: "Workshop ini ditujukan untuk pemula yang ingin belajar UI/UX design. Peserta akan belajar prinsip-prinsip design, wireframing, prototyping, dan user research.\n\nTools yang digunakan:\n- Figma\n- Adobe XD\n- Miro\n\nSetiap peserta akan mendapatkan sertifikat dan materi workshop.",
    category: "Workshop",
    date: new Date('2024-02-20'),
    location: "Online via Zoom",
    image: "https://picsum.photos/id/10/800/400",
    registered: 75,
    capacity: 100,
    duration: "2 Hari",
    price: "Rp 50.000"
  }
]

const mockCareersData = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Tech Startup Co.",
    location: "Bandung",
    type: "Internship",
    salary: "Rp 2.000.000 - 3.000.000",
    description: "Kami mencari frontend developer yang passionate untuk bergabung dalam tim kami. Anda akan bekerja dengan tim yang dinamis dan belajar teknologi terbaru.\n\nTanggung jawab:\n- Mengembangkan fitur frontend menggunakan React JS\n- Berkolaborasi dengan tim backend dan design\n- Melakukan testing dan debugging\n- Ikut serta dalam daily standup dan sprint planning",
    requirements: ["React JS", "Tailwind CSS", "Git", "JavaScript/ES6", "Memahami REST API"],
    deadline: new Date('2024-02-28')
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "DataCorp Indonesia",
    location: "Jakarta",
    type: "Full Time",
    salary: "Rp 5.000.000 - 7.000.000",
    description: "Bergabung dengan tim data analytics kami untuk membantu klien membuat keputusan berbasis data. Anda akan menganalisis data, membuat visualisasi, dan memberikan rekomendasi.\n\nTanggung jawab:\n- Mengumpulkan dan membersihkan data\n- Membuat dashboard dan laporan\n- Menganalisis tren dan pola\n- Berkomunikasi dengan stakeholder",
    requirements: ["Python", "SQL", "Tableau/Power BI", "Statistika", "Excel"],
    deadline: new Date('2024-02-25')
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "FinTech Solutions",
    location: "Remote",
    type: "Full Time",
    salary: "Rp 6.000.000 - 9.000.000",
    description: "Kami mencari backend developer untuk mengembangkan sistem keuangan yang aman dan scalable.\n\nTanggung jawab:\n- Mengembangkan RESTful API\n- Optimasi database query\n- Implementasi security best practices\n- Monitoring dan debugging",
    requirements: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Docker"],
    deadline: new Date('2024-03-05')
  }
]

// ============ API SERVICES ============

// News Service
export const newsService = {
  // Get all news
  getAll: async () => {
    // Untuk development, gunakan mock data
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      return Promise.resolve([...mockNewsData].sort((a, b) => new Date(b.date) - new Date(a.date)))
    }
    return fetchAPI('/news')
  },

  // Get latest news
  getLatest: async (limit = 5) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const news = [...mockNewsData].sort((a, b) => new Date(b.date) - new Date(a.date))
      return Promise.resolve(news.slice(0, limit))
    }
    return fetchAPI(`/news/latest?limit=${limit}`)
  },

  // Get news by ID
  getById: async (id) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const news = mockNewsData.find(item => item.id === parseInt(id))
      if (news) {
        return Promise.resolve({ ...news, views: (news.views || 0) + 1 })
      }
      return Promise.resolve(null)
    }
    return fetchAPI(`/news/${id}`)
  },

  // Search news
  search: async (query, filters = {}) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      let results = [...mockNewsData]
      if (query) {
        results = results.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.summary.toLowerCase().includes(query.toLowerCase())
        )
      }
      if (filters.category && filters.category !== 'all') {
        results = results.filter(item => item.category === filters.category)
      }
      return Promise.resolve(results)
    }
    const queryString = new URLSearchParams({ q: query, ...filters }).toString()
    return fetchAPI(`/news/search?${queryString}`)
  },

  // Get categories
  getCategories: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const categories = [...new Set(mockNewsData.map(item => item.category))]
      return Promise.resolve(categories)
    }
    return fetchAPI('/news/categories')
  }
}

// Articles Service
export const articlesService = {
  getAll: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      return Promise.resolve([...mockArticlesData].sort((a, b) => new Date(b.date) - new Date(a.date)))
    }
    return fetchAPI('/articles')
  },

  getLatest: async (limit = 5) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const articles = [...mockArticlesData].sort((a, b) => new Date(b.date) - new Date(a.date))
      return Promise.resolve(articles.slice(0, limit))
    }
    return fetchAPI(`/articles/latest?limit=${limit}`)
  },

  getById: async (id) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      return Promise.resolve(mockArticlesData.find(item => item.id === parseInt(id)) || null)
    }
    return fetchAPI(`/articles/${id}`)
  },

  filterByCategory: async (category) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const results = mockArticlesData.filter(item => item.category === category)
      return Promise.resolve(results)
    }
    return fetchAPI(`/articles/category/${category}`)
  },

  getCategories: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const categories = [...new Set(mockArticlesData.map(item => item.category))]
      return Promise.resolve(categories)
    }
    return fetchAPI('/articles/categories')
  }
}

// Events Service
export const eventsService = {
  getAll: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      return Promise.resolve([...mockEventsData])
    }
    return fetchAPI('/events')
  },

  getUpcoming: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const events = mockEventsData.filter(event => new Date(event.date) > new Date())
      return Promise.resolve(events)
    }
    return fetchAPI('/events/upcoming')
  },

  getById: async (id) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      return Promise.resolve(mockEventsData.find(item => item.id === parseInt(id)) || null)
    }
    return fetchAPI(`/events/${id}`)
  },

  register: async (eventId, userData) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      // ponytail: mock logging, remove when real API is up
      return Promise.resolve({ success: true, message: "Registration successful", registrationId: Date.now() })
    }
    return fetchAPI(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  getCategories: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const categories = [...new Set(mockEventsData.map(item => item.category))]
      return Promise.resolve(categories)
    }
    return fetchAPI('/events/categories')
  }
}

// Careers Service
export const careersService = {
  getAll: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      return Promise.resolve([...mockCareersData])
    }
    return fetchAPI('/careers')
  },

  getById: async (id) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      return Promise.resolve(mockCareersData.find(item => item.id === parseInt(id)) || null)
    }
    return fetchAPI(`/careers/${id}`)
  },

  apply: async (jobId, application) => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      // ponytail: mock logging, remove when real API is up
      return Promise.resolve({ success: true, message: "Application submitted successfully", applicationId: Date.now() })
    }
    return fetchAPI(`/careers/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(application)
    })
  },

  getTypes: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const types = [...new Set(mockCareersData.map(item => item.type))]
      return Promise.resolve(types)
    }
    return fetchAPI('/careers/types')
  },

  getLocations: async () => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      const locations = [...new Set(mockCareersData.map(item => item.location))]
      return Promise.resolve(locations)
    }
    return fetchAPI('/careers/locations')
  }
}

// Public Projects Service (accepted only)
export const projectsService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return fetchAPI(`/projects${queryString ? `?${queryString}` : ''}`)
  },

  getById: async (id) => {
    return fetchAPI(`/projects/${id}`)
  },

  getCategories: async () => {
    return Promise.resolve(['web', 'mobile', 'uiux', 'game', 'ai'])
  },
}

// Export all services
export const api = {
  news: newsService,
  articles: articlesService,
  events: eventsService,
  careers: careersService,
  projects: projectsService,
}

// Default export untuk kompatibilitas dengan kode sebelumnya
export const mockNews = newsService
export const mockArticles = articlesService
export const mockEvents = eventsService

// ============ VIEW TRACKING ============
// MySQL-backed view counter via API
export const viewTracker = {
  increment: async (type, id, baseViews = 0) => {
    try {
      const data = await fetchAPI(`/views/${type}/${id}`, { method: 'POST' })
      return data.views || baseViews + 1
    } catch {
      return baseViews + 1
    }
  },
  get: async (type, id, baseViews = 0) => {
    try {
      const data = await fetchAPI(`/views/${type}/${id}`)
      return data.views || baseViews
    } catch {
      return baseViews
    }
  }
}
export const mockCareers = careersService

export default api