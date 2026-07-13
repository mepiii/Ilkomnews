const STATUS_STYLES = {
  pending:   'status-pill status-pending',
  accepted:  'status-pill status-accepted',
  rejected:  'status-pill status-rejected',
  published: 'status-pill status-published',
  draft:     'status-pill status-draft',
}

const STATUS_LABELS = {
  pending:   'Menunggu',
  accepted:  'Diterima',
  rejected:  'Ditolak',
  published: 'Tayang',
  draft:     'Belum Tayang',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft
  const label = STATUS_LABELS[status] || status

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  )
}
