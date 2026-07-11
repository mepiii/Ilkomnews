// Dependency-free share helper. Uses the Web Share API when available and
// falls back to copying the URL to the clipboard. Safe in any environment:
// all failures are swallowed so callers never need a try/catch.
export async function shareItem({ title, url } = {}) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    return navigator.share({ title, url }).catch(() => {})
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(url).catch(() => {})
  }
  // Nothing available: no-op, no throw.
}
