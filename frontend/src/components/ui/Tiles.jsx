import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const tileSizes = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9 md:w-12 md:h-12',
  lg: 'w-12 h-12 md:w-16 md:h-16',
}

const Tiles = ({ className, rows = 100, cols = 10, tileClassName, tileSize = 'md' }) => {
  const rowsArr = Array.from({ length: rows })
  const colsArr = Array.from({ length: cols })

  return (
    <div className={cn('relative z-0 flex w-full h-full justify-center', className)} aria-hidden="true">
      {rowsArr.map((_, i) => (
        <div key={`row-${i}`} className={cn(tileSizes[tileSize], 'border-l border-neutral-200 dark:border-neutral-900 relative', tileClassName)}>
          {colsArr.map((_, j) => (
            <motion.div
              key={`col-${j}`}
              whileHover={{ backgroundColor: 'var(--tile)', transition: { duration: 0 } }}
              animate={{ transition: { duration: 2 } }}
              className={cn(tileSizes[tileSize], 'border-r border-t border-neutral-200 dark:border-neutral-900 relative', tileClassName)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Tiles }
