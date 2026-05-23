import React from 'react'
import { Inbox } from 'lucide-react'

const EmptyState = ({ title, message }) => {
  return (
    <div className="text-center py-12">
      <Inbox size={64} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  )
}

export default EmptyState