import { cn } from '../../lib/utils'

export function Text_03({ text, className = '' }) {
  return (
    <span className={cn('bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent', className)}>
      {text}
    </span>
  )
}
