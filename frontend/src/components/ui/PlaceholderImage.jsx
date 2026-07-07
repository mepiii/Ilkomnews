const PlaceholderImage = ({ className = '', text = 'No Image' }) => (
  <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className={`w-full h-full min-h-[120px] ${className}`}>
    <rect width="800" height="500" fill="#111827" />
    <rect width="800" height="500" fill="url(#ph-pattern)" opacity="0.15" />
    <path d="M320 200 C320 178 338 160 360 160 L440 160 C462 160 480 178 480 200 L480 300 C480 322 462 340 440 340 L360 340 C338 340 320 322 320 300 Z" fill="#374151" opacity="0.3" />
    <circle cx="370" cy="220" r="15" fill="#6b7280" opacity="0.5" />
    <path d="M330 290 L370 250 L400 275 L440 230 L480 270 L480 340 L320 340 Z" fill="#6b7280" opacity="0.3" />
    <text x="400" y="400" textAnchor="middle" fill="#6b7280" fontSize="16" fontFamily="system-ui, sans-serif" opacity="0.6">{text}</text>
    <defs><pattern id="ph-pattern" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40L40 0" stroke="#374151" strokeWidth="0.5" opacity="0.3" /></pattern></defs>
  </svg>
)
export default PlaceholderImage
