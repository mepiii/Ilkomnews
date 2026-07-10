export default function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-neutral-800">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className={`h-4 rounded bg-gray-200 dark:bg-[#262626] animate-pulse ${
                j === 0 ? 'w-10 h-10 rounded-lg shrink-0' : 'flex-1'
              }`}
              style={{ animationDelay: `${(i * columns + j) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
