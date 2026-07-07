import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * HoverButton - Button with slide-up text reveal animation
 * Shows text sliding up and changing color on hover
 * Supports both link (href) and button (onClick) modes
 */
export default function HoverButton({
  text,
  onClick,
  href,
  className = '',
  variant = 'green',
}) {
  const variantClasses = {
    green: 'bg-green-400',
    primary: 'bg-[var(--accent)]',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white',
  }

  const content = (
    <div
      className={cn(
        'group relative cursor-pointer p-2 w-56 h-14 border bg-white rounded-full overflow-hidden text-black text-center font-bold font-heading text-base',
        className
      )}
    >
      {/* Default text */}
      <span className="translate-y-0 group-hover:-translate-y-14 group-hover:opacity-0 transition-all duration-300 inline-block">
        {text}
      </span>

      {/* Hover text */}
      <div
        className={cn(
          'flex gap-2 text-white z-10 items-center absolute left-0 top-0 h-full w-full justify-center translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-full group-hover:rounded-none',
          variantClasses[variant]
        )}
      >
        <span>{text}</span>
        <ArrowRight size={18} />
      </div>
    </div>
  )

  if (href) {
    return <Link to={href}>{content}</Link>
  }

  return (
    <button type="button" onClick={onClick}>
      {content}
    </button>
  )
}
