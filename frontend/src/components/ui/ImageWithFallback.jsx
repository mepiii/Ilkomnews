import { useState } from 'react'
import PlaceholderImage from './PlaceholderImage'

const ImageWithFallback = ({ src, alt, className = '', fallbackText = 'No Image', ...props }) => {
  const [hasError, setHasError] = useState(false)
  if (hasError || !src) return <PlaceholderImage className={className} text={fallbackText} />
  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} {...props} />
}
export default ImageWithFallback
