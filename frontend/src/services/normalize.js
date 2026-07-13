// Single source of truth for API-envelope normalization.
// Endpoints inconsistently return a bare array, {data:[...]}, or {projects:[...]}.
// Item endpoints may return bare {...} or {data:{...}}.
// ponytail: covers the three observed shapes; extend only if a 4th appears.

export const normalizeList = (resp) =>
  Array.isArray(resp) ? resp
    : Array.isArray(resp?.data) ? resp.data
    : Array.isArray(resp?.projects) ? resp.projects
    : []

export const normalizeItem = (resp) =>
  resp?.data && typeof resp.data === 'object' && !Array.isArray(resp.data)
    ? resp.data
    : resp
