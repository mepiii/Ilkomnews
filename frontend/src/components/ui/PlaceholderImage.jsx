const PlaceholderImage = ({ className = '', text = 'No Image' }) => (
  <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`}>
    <rect width="800" height="500" fill="#1A0533" />
    <rect x="0" y="0" width="800" height="500" fill="url(#pattern)" opacity="0.15" />
    <path d="M320 200 C320 178 338 160 360 160 L440 160 C462 160 480 178 480 200 L480 300 C480 322 462 340 440 340 L360 340 C338 340 320 322 320 300 Z" fill="#7C3AED" opacity="0.3" />
    <circle cx="370" cy="220" r="15" fill="#A78BFA" opacity="0.5" />
    <path d="M330 290 L370 250 L400 275 L440 230 L480 270 L480 340 L320 340 Z" fill="#A78BFA" opacity="0.3" />
    <text x="400" y="400" textAnchor="middle" fill="#A78BFA" fontSize="16" fontFamily="system-ui, sans-serif" opacity="0.6">{text}</text>
    <defs>
      <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 40L40 0" stroke="#7C3AED" strokeWidth="0.5" opacity="0.3" />
      </pattern>
    </defs>
  </svg>
)
export default PlaceholderImage
