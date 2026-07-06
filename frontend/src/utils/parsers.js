/**
 * Parse tags/tech_stack from various formats into a clean string array.
 * Handles: null, arrays, JSON strings, comma-separated strings.
 */
export const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean)
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      if (Array.isArray(parsed)) return parsed.map(t => String(t).trim()).filter(Boolean)
    } catch { /* not JSON, fall through */ }
    return tags.split(',').map(t => t.trim()).filter(Boolean)
  }
  return []
}
