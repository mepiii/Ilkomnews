export function LoadingSkeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-[var(--bg-secondary)] ${className}`} />
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
      <LoadingSkeleton className="mb-4 h-5 w-40" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((__, column) => (
              <LoadingSkeleton key={column} className="h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
