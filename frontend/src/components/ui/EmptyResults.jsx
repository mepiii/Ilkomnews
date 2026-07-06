export default function EmptyResults({ icon, title = 'Tidak ada data', description, onReset }) {
  return (
    <div className="col-span-full text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--accent)]/10 rounded-full mb-4">
        {icon}
      </div>
      <p className="text-neutral-900 dark:text-white text-lg font-medium">{title}</p>
      {description && <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{description}</p>}
      {onReset && (
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors"
        >
          Reset Filter
        </button>
      )}
    </div>
  )
}
