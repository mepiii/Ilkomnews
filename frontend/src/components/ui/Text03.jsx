import { cn } from '../../lib/utils'

export function Text_03({ text, className = '' }) {
  return (
    <span className={cn('bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 dark:from-purple-400 dark:via-purple-500 dark:to-purple-600 bg-clip-text text-transparent', className)}>
      {text}
    </span>
  )
}
