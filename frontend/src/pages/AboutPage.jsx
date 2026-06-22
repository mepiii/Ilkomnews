import React, { useEffect, useState } from 'react'
import Breadcrumb from '../components/common/Breadcrumb'
import { 
  Mail, MapPin, Phone, BookOpen, Code, Server, Database, Calculator, 
  Cpu, Trophy, Users, Rocket, Briefcase, GraduationCap, 
  Globe, Award, Zap, Target, Heart
} from 'lucide-react'

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Data Program Studi
  const programs = [
    {
      icon: Code,
      name: 'Teknik Informatika',
      focus: 'Pengembangan perangkat lunak, AI, Machine Learning, dan Cyber Security',
      career: 'Software Engineer, AI Engineer, Data Scientist, Cyber Security Analyst',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Database,
      name: 'Sistem Informasi',
      focus: 'Analisis bisnis, manajemen database, e-business, dan ERP system',
      career: 'System Analyst, IT Consultant, Database Administrator, Project Manager',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Cpu,
      name: 'Sistem Komputer',
      focus: 'Embedded system, IoT, arsitektur komputer, dan jaringan embedded',
      career: 'Embedded Engineer, IoT Specialist, Firmware Developer',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Calculator,
      name: 'Manajemen Informatika',
      focus: 'Manajemen proyek IT, e-commerce, digital marketing, dan bisnis digital',
      career: 'IT Manager, Digital Marketer, E-commerce Specialist, Business Analyst',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Server,
      name: 'Komputerisasi Akuntansi',
      focus: 'Sistem informasi akuntansi, audit IT, dan software akuntansi',
      career: 'IT Auditor, System Accountant, Financial System Analyst',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: Code,
      name: 'Teknik Komputer',
      focus: 'Jaringan komputer, keamanan jaringan, cloud computing, dan administrasi server',
      career: 'Network Engineer, Cloud Architect, System Administrator, Network Security',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  // Data Kenapa FASILKOM
  const reasons = [
    { icon: Zap, title: 'Fokus Teknologi Modern', desc: 'Kurikulum selalu diperbarui sesuai perkembangan industri 4.0' },
    { icon: Trophy, title: 'Prestasi & Lomba', desc: 'Raih 100+ juara di kompetisi nasional dan internasional' },
    { icon: Users, title: 'Organisasi Aktif', desc: '10+ himpunan dan komunitas untuk mengembangkan soft skill' },
    { icon: Rocket, title: 'Peluang Karir Luas', desc: 'Kerjasama dengan 50+ perusahaan teknologi ternama' },
    { icon: Briefcase, title: 'Project-Based Learning', desc: 'Belajar melalui proyek nyata dari industri partner' },
    { icon: Award, title: 'Dosen Berkualitas', desc: '70% dosen bergelar doktor dari universitas top dunia' }
  ]

  // Data Organisasi & Komunitas
  const organizations = [
    { name: 'BEM FASILKOM', role: 'Badan Eksekutif Mahasiswa', color: 'bg-red-500' },
    { name: 'HIMDIKO', role: 'Himpunan Mahasiswa Sistem Komputer', color: 'bg-blue-500' },
    { name: 'HIMSI', role: 'Himpunan Mahasiswa Sistem Informasi', color: 'bg-green-500' },
    { name: 'HMIF', role: 'Himpunan Mahasiswa Informatika', color: 'bg-purple-500' },
    { name: 'HIMASISKO', role: 'Himpunan Mahasiswa Komputerisasi Akuntansi', color: 'bg-yellow-500' },
    { name: 'FASCO', role: 'Fasilkom Computing Competition', color: 'bg-indigo-500' },
    { name: 'NAC', role: 'Network and Computing Community', color: 'bg-cyan-500' },
    { name: 'INTEL', role: 'Information Technology Enthusiast League', color: 'bg-pink-500' },
    { name: 'WIFI', role: 'Women in Information Technology', color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />

        {/* Hero Section */}
        <div
          data-animate
          id="hero"
          className={`relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl mb-16 text-white transform transition-all duration-1000 ${
            isVisible['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="1" />
                  <line x1="30" y1="0" x2="30" y2="60" stroke="white" strokeWidth="1" />
                  <circle cx="30" cy="30" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur rounded-full">
                <p className="text-sm font-semibold tracking-wide">Universitas Sriwijaya</p>
              </div>
              <h1 className="text-4xl md:text-5xl text-white font-bold mb-4 leading-tight">
                Fakultas Ilmu Komputer
              </h1>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                Pusat inovasi teknologi dan pengembangan talenta digital — mencetak generasi unggul yang siap memimpin transformasi digital Indonesia.
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all hover:scale-105">
                  Jelajahi
                </button>
                <button className="px-6 py-2 border-2 border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Virtual Tour
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/gedungfasilkom2.jpg"
                alt="Gedung FASILKOM UNSRI"
                loading="lazy"
                className="rounded-2xl shadow-2xl object-cover w-full h-64 md:h-80"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-2 shadow-lg">
                <img
                  src="/assets/logo.png"
                  alt="Logo UNSRI"
                  loading="lazy"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tentang FASILKOM */}
        <div
          data-animate
          id="about"
          className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 transform transition-all duration-1000 ${
            isVisible['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tentang FASILKOM</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <span className="font-bold text-purple-600">Fakultas Ilmu Komputer (FASILKOM) Universitas Sriwijaya</span> didirikan pada tahun 2010 sebagai respons atas 
              kebutuhan tenaga profesional di bidang teknologi informasi dan komputer. Berdiri sebagai fakultas termuda, FASILKOM tumbuh pesat menjadi 
              pusat pendidikan teknologi unggulan di Sumatera Selatan.
            </p>
            <p>
              Fakultas ini berfokus pada pengembangan <span className="font-semibold">keilmuan komputasi modern</span> yang mencakup Artificial Intelligence, 
              Cyber Security, Data Science, Internet of Things, dan Software Engineering. Dengan pendekatan <span className="font-semibold">project-based learning</span>, 
              mahasiswa dilatih untuk menjadi problem solver yang adaptif terhadap perkembangan teknologi.
            </p>
            <p>
              <span className="font-bold text-purple-600">Visi FASILKOM:</span> Menjadi fakultas ilmu komputer terkemuka di tingkat nasional dan internasional 
              yang menghasilkan lulusan berkompetensi global, berintegritas tinggi, dan mampu berkontribusi dalam pembangunan berbasis teknologi.
            </p>
          </div>
        </div>

        {/* Program Studi */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2
              data-animate
              id="program-title"
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-2 transition-all duration-1000 ${
                isVisible['program-title'] ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Program Studi
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">6 program unggulan dengan kurikulum berbasis industri 4.0</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog, index) => {
              const Icon = prog.icon
              return (
                <div
                  key={index}
                  data-animate
                  id={`prog-${index}`}
                  className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform ${
                    isVisible[`prog-${index}`]
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  } hover:scale-105 hover:-translate-y-2`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`bg-gradient-to-r ${prog.color} p-4`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{prog.name}</h3>
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-purple-600 mb-1">🎯 Fokus Belajar:</p>
                      <p className="text-gray-600 text-sm">{prog.focus}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-600 mb-1">💼 Prospek Karir:</p>
                      <p className="text-gray-600 text-sm">{prog.career}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Kenapa FASILKOM */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2
              data-animate
              id="why-title"
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-2 transition-all duration-1000 ${
                isVisible['why-title'] ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Kenapa FASILKOM?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => {
              const Icon = reason.icon
              return (
                <div
                  key={index}
                  data-animate
                  id={`reason-${index}`}
                  className={`group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-500 transform ${
                    isVisible[`reason-${index}`]
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                  <p className="text-gray-600 text-sm">{reason.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Organisasi & Komunitas */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2
              data-animate
              id="org-title"
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-2 transition-all duration-1000 ${
                isVisible['org-title'] ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Organisasi & Komunitas
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">Wadah pengembangan soft skill dan networking mahasiswa</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {organizations.map((org, index) => (
              <div
                key={index}
                data-animate
                id={`org-${index}`}
                className={`group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-500 flex items-center gap-4 transform ${
                  isVisible[`org-${index}`]
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`${org.color} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{org.name}</h3>
                  <p className="text-xs text-gray-500">{org.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage