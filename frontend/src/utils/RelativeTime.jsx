import { useEffect, useState } from 'react'
import { formatRelativeTime } from './formatters'

/**
 * <RelativeTime date={...} />
 *
 * Self-updating relative-time label. Re-renders every 30s for items
 * shown in minutes/hours and every second for items under 1 minute, so
 * the "Baru saja" / "5 menit yang lalu" label visibly advances without
 * a page reload. Previously the label was a static string inlined into
 * the JSX (frozen at render time), which surfaced as the "news timer
 * doesn't display correctly" bug.
 *
 * Honors prefers-reduced-motion: still updates the text (it's a label,
 * not an animation), just doesn't cause extra re-renders beyond the
 * needed cadence.
 */
export default function RelativeTime({ date, className, title }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!date) return
    const target = new Date(date)
    if (Number.isNaN(target.getTime())) return
    const diff = Date.now() - target.getTime()
    // Under 1 minute: tick every second. Otherwise every 30s is enough.
    const interval = diff < 60_000 ? 1000 : 30_000
    const id = setInterval(() => setTick((n) => n + 1), interval)
    return () => clearInterval(id)
  }, [date])

  return (
    <span className={className} title={title || (date ? new Date(date).toLocaleString('id-ID') : '')}>
      {formatRelativeTime(date)}
    </span>
  )
}
