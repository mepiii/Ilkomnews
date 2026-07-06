const SkeletonCard = () => (
  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 w-20 rounded bg-[var(--bg-secondary)]" />
        <div className="h-7 w-12 rounded bg-[var(--bg-secondary)]" />
      </div>
      <div className="h-11 w-11 rounded-xl bg-[var(--bg-secondary)]" />
    </div>
  </div>
)

export default SkeletonCard
