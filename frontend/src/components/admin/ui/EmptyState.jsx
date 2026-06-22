import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Data kosong', description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] p-8 text-center">
      <Icon size={40} className="mx-auto mb-3 text-[var(--text-muted)] opacity-60" aria-hidden="true" />
      <p className="font-medium text-[var(--text-primary)]">{title}</p>
      {description && <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
