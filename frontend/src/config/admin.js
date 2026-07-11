// Single source of truth for the obscure admin route prefix.
// Set VITE_ADMIN_BASE in frontend/.env (e.g. portal) — never "admin".
export const ADMIN_BASE = import.meta.env.VITE_ADMIN_BASE || 'admin'
export const ADMIN_LOGIN_PATH = `/${ADMIN_BASE}/login`
