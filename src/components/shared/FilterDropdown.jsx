// components/ilkomgallery/shared/FilterDropdown.jsx
import React from 'react'

const FilterDropdown = ({ label, options, value, onChange }) => {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {label}: {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterDropdown