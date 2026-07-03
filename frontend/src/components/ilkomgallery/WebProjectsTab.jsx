import { useState, useEffect } from 'react'
import { Globe, Filter } from 'lucide-react'
import ExpandingSearchDock from '../shared/ExpandingSearchDock'
import AnimatedFilterDropdown from '../shared/AnimatedFilterDropdown'
import WebProjectCard from '../shared/WebProjectCard'
import { projectsService } from '../../services/api'

const jurusanOptions = ['Semua Jurusan', 'S1 Teknik Informatika', 'S1 Sistem Informasi', 'S1 Sistem Komputer', 'D3 Manajemen Informatika', 'D3 Komputerisasi Akuntansi', 'D3 Teknik Komputer']
const angkatanOptions = ['Semua Angkatan', 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

const WebProjectsTab = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('Semua Jurusan')
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua Angkatan')

  useEffect(() => {
    projectsService.getAll({ category: 'web' })
      .then(res => setProjects(res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredProjects = projects.filter(p => {
    const s = searchQuery.toLowerCase()
    return (p.title?.toLowerCase().includes(s) || p.creator_name?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s))
      && (selectedJurusan === 'Semua Jurusan' || p.creator_major === selectedJurusan)
      && (selectedAngkatan === 'Semua Angkatan' || p.creator_year === selectedAngkatan)
  })

  const reset = () => { setSearchQuery(''); setSelectedJurusan('Semua Jurusan'); setSelectedAngkatan('Semua Angkatan') }
  const hasFilters = selectedJurusan !== 'Semua Jurusan' || selectedAngkatan !== 'Semua Angkatan' || searchQuery

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
        <ExpandingSearchDock value={searchQuery} onChange={setSearchQuery} placeholder="Cari project, creator..." />
        <AnimatedFilterDropdown options={jurusanOptions} value={selectedJurusan} onChange={setSelectedJurusan} icon={Filter} />
        <AnimatedFilterDropdown options={angkatanOptions} value={selectedAngkatan} onChange={setSelectedAngkatan} icon={Filter} />
        {hasFilters && <button onClick={reset} className="px-3 py-2 rounded-full text-xs font-medium text-accent bg-accent/10 hover:bg-accent/20 transition-colors">Reset</button>}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-theme-muted text-sm"><span className="font-semibold text-accent">{filteredProjects.length}</span> project web</p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProjects.map(p => <WebProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-theme-secondary rounded-2xl border border-theme">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-4"><Globe size={40} className="text-accent" /></div>
          <p className="text-theme-primary text-lg font-medium">Tidak ada project yang ditemukan</p>
          <p className="text-theme-muted text-sm mt-1">Coba ubah filter atau cari dengan kata kunci lain</p>
          <button onClick={reset} className="mt-4 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors">Reset Filter</button>
        </div>
      )}
    </div>
  )
}

export default WebProjectsTab
