import { useEffect, useRef, useState } from 'react'

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const STATUS_LABELS = {
  pending: 'Menunggu',
  accepted: 'Diterima',
  rejected: 'Ditolak',
  published: 'Tayang',
  draft: 'Belum Tayang',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft
  const label = STATUS_LABELS[status] || status

  // Pop once when status changes (accept/decline/reject) so the transition
  // reads as motion rather than an instant swap.
  const [pop, setPop] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setPop(true)
    const t = setTimeout(() => setPop(false), 320)
    return () => clearTimeout(t)
  }, [status])

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-transform duration-300 ease-out ${style} ${
        pop ? 'scale-110' : 'scale-100'
      }`}
    >
      {label}
    </span>
  )
}
