import { ArrowRight } from 'lucide-react'

const FlowButton = ({ text = 'Learn More', onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-1 overflow-hidden rounded-full border-[1.5px] border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-sm font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white active:scale-[0.95] ${className}`}
    >
      <ArrowRight
        className="absolute w-4 h-4 left-[-25%] fill-none z-[9] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ stroke: 'currentColor' }}
      />
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-black rounded-full opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]" />
      <ArrowRight
        className="absolute w-4 h-4 right-4 fill-none z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ stroke: 'currentColor' }}
      />
    </button>
  )
}

export { FlowButton }
