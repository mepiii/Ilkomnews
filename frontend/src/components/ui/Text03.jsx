import { cn } from '../../lib/utils'

export function Text_03({ text, className = '' }) {
  return (
    <span className={cn('bg-gradient-to-r from-[rgb(48,11,85)] to-[rgb(122,71,166)] bg-clip-text text-transparent', className)}>
      {text}
    </span>
  )
}
