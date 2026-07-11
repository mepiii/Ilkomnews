import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '../../lib/utils'

const tileSizeConfig = {
  sm: { size: 32 },
  md: { size: 48 },
  lg: { size: 64 },
}

const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
]

function getGridDims(tileSize) {
  const size = tileSizeConfig[tileSize]?.size || 48
  return {
    cols: Math.ceil(window.innerWidth / size) + 2,
    rows: Math.ceil(window.innerHeight / size) + 2,
  }
}

/**
 * Interactive tile grid background.
 * Features:
 *  - Dynamic viewport sizing (recalculates on resize)
 *  - Edge fade via radial-gradient CSS mask
 *  - Adjacent glow ripple on hover (event delegation)
 *  - Theme-aware colors via CSS variables
 */
export function Tiles({ className, tileSize = 'md' }) {
  const size = tileSizeConfig[tileSize]?.size || 48
  const [dims, setDims] = useState(() => getGridDims(tileSize))
  const gridRef = useRef(null)
  const lastHoveredIdx = useRef(-1)
  const lastHighlighted = useRef([])

  // Dynamic viewport sizing
  useEffect(() => {
    let timeout
    const update = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setDims(getGridDims(tileSize)), 150)
    }
    window.addEventListener('resize', update)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', update)
    }
  }, [tileSize])

  // Clear highlights on resize
  useEffect(() => {
    if (!gridRef.current) return
    for (const i of lastHighlighted.current) {
      gridRef.current.children[i]?.classList.remove('tile-glow', 'tile-glow-neighbor')
    }
    lastHighlighted.current = []
    lastHoveredIdx.current = -1
  }, [dims])

  // Adjacent glow ripple — event delegation
  const handleMouseOver = useCallback((e) => {
    const cell = e.target.classList.contains('tile-cell') ? e.target : null
    if (!cell || !gridRef.current) return

    const idx = parseInt(cell.dataset.index, 10)
    if (idx === lastHoveredIdx.current) return
    lastHoveredIdx.current = idx

    // Remove old highlights
    for (const i of lastHighlighted.current) {
      gridRef.current.children[i]?.classList.remove('tile-glow', 'tile-glow-neighbor')
    }

    const row = parseInt(cell.dataset.row, 10)
    const col = parseInt(cell.dataset.col, 10)
    const newHighlighted = [idx]

    // Add new highlights
    cell.classList.add('tile-glow')
    for (const [dr, dc] of NEIGHBOR_OFFSETS) {
      const nr = row + dr
      const nc = col + dc
      if (nr < 0 || nr >= dims.rows || nc < 0 || nc >= dims.cols) continue
      const neighborIdx = nr * dims.cols + nc
      gridRef.current.children[neighborIdx]?.classList.add('tile-glow-neighbor')
      newHighlighted.push(neighborIdx)
    }

    lastHighlighted.current = newHighlighted
  }, [dims])

  const handleMouseLeave = useCallback(() => {
    if (!gridRef.current) return
    for (const i of lastHighlighted.current) {
      gridRef.current.children[i]?.classList.remove('tile-glow', 'tile-glow-neighbor')
    }
    lastHighlighted.current = []
    lastHoveredIdx.current = -1
  }, [])

  if (dims.cols === 0 || dims.rows === 0) return null

  return (
    <div className={cn('pointer-events-none w-full h-full relative overflow-hidden', className)}>
      {/* Grid with edge fade mask */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${dims.cols}, ${size}px)`,
          gridTemplateRows: `repeat(${dims.rows}, ${size}px)`,
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          maskRepeat: 'no-repeat',
          maskSize: '100% 100%',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
        }}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: dims.rows * dims.cols }, (_, i) => {
          const row = Math.floor(i / dims.cols)
          const col = i % dims.cols
          return (
            <div
              key={i}
              className="tile-cell"
              data-index={i}
              data-row={row}
              data-col={col}
              style={{
                width: size,
                height: size,
                borderColor: 'transparent',
                borderRight: '1px solid var(--tile-border)',
                borderBottom: '1px solid var(--tile-border)',
                transition: 'background-color 0.15s ease, opacity 0.2s ease',
              }}
            />
          )
        })}
      </div>

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'var(--glow-primary)' }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'var(--glow-secondary)' }}
        />
        <div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: 'var(--glow-accent)' }}
        />
      </div>
    </div>
  )
}
