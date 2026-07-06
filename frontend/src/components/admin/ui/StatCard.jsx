const StatCard = ({ icon: Icon, label, value, color, iconColor }) => (
  <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        <p className="mt-1.5 text-3xl font-bold text-[var(--text-primary)]">{value ?? '-'}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  </div>
)

export default StatCard
