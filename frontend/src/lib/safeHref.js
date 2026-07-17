// ponytail: single guard for user/admin-supplied URLs rendered into href.
// Blocks javascript:/data: scheme injection; returns null for unsafe input.
export function safeHref(url) {
  if (typeof url !== 'string' || url.length === 0) return null
  try {
    const parsed = new URL(url, window.location.origin)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}
