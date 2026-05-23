import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-accent"></div>
    </div>
  )
}

export default LoadingSpinner