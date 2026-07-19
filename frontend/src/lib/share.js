// Dependency-free share helpers. Builds deep links for the common messaging
// targets and falls back to the Web Share API / clipboard copy. All failures
// are swallowed so callers never need a try/catch.

export function buildShareLinks({ title, text, url }) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(text || title || '')
  return {
    copy: url,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  }
}

export function safeCopy(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => {})
  }
}

// Returns true when a native share sheet was shown (so callers can skip UI).
export async function nativeShare({ title, text, url }) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    return navigator.share({ title, text: text || title, url }).then(
      () => true,
      () => false
    )
  }
  return false
}

export async function shareItem({ title, text, url } = {}) {
  if (await nativeShare({ title, text, url })) return
  await safeCopy(url)
}
