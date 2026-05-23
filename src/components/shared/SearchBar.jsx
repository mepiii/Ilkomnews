// components/ilkomgallery/shared/SearchBar.jsx
import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = "Cari project atau mahasiswa..." }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
      />
    </div>
  )
}

export default SearchBar