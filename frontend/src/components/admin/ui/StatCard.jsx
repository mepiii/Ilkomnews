const StatCard = ({ icon: Icon, label, value, color, iconColor }) => (
  <div className="relative overflow-hidden rounded-lg sm:rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 sm:p-5">
    <div className="relative flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[10px] sm:text-sm font-medium text-[var(--text-secondary)] truncate">{label}</p>
        <p className="mt-1 sm:mt-1.5 text-xl sm:text-3xl font-bold text-[var(--text-primary)]">{value ?? '-'}</p>
      </div>
      <div className={`flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl ${color} shrink-0`}>
        <Icon size={16} className={`sm:w-5 sm:h-5 ${iconColor}`} />
      </div>
    </div>
  </div>
)

export default StatCard
