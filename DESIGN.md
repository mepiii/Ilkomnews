# DESIGN.md — ILKOM NEWS

## Brand

| | |
|---|---|
| Name | ILKOM NEWS — Berita & Galeri FASILKOM Unsri |
| URL | https://ilkomnews.bemfasilkomunsri.org/ |
| Community | 2,000+ FASILKOM members |
| Personality | Academic but alive. Purple-forward, slightly cosmic/tech. Not corporate, not startup-generic. |
| Anti-refs | Generic uni portal, crypto/NFT dark purple, SaaS dashboard |
| Mascot | **Wolfy** — talking chatbot (site-scoped RAG) |

## Design Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | `rgb(48, 11, 85)` `#300B55` | same | Brand, key UI |
| Secondary | `rgb(122, 71, 166)` `#7A47A6` | same | Supporting, hover states |
| Accent | `#FFC148` | same | CTAs, highlights |
| Dynamic accent (active/buttons) | `rgb(48, 11, 85)` | `rgb(122, 71, 166)` | Lighter purple in dark for contrast |
| Bg surface | `#ffffff` | `#000000`/near-black | Page/cards |
| Text primary | gray-900 | gray-100 | Body |
| Text muted | gray-500 | gray-400 | Secondary text |
| Border | gray-200 | `#262626` | Cards, tables, containers |

**Status badges:**
| State | Color |
|-------|-------|
| Diterima (accepted) | Green |
| Ditolak (rejected) | Red |
| Menunggu (pending) | Yellow |

## Typography

- **Font:** Inter (Google, weights 300-800). Never change font-family.
- **Scale:** Tailwind type scale. Display weights 700-800, body 400-500, utility 300.
- **Mobile:** 16px body minimum, 1.5 line-height. Line length 50-75 chars.

## Layout

- Container: max-w centered, responsive padding
- Grid: Tailwind grid, 12-col on desktop → stacked on mobile
- Breakpoints: 375 → 768 → 1024 → 1440
- Card footer pinned to bottom via `mt-auto`

## Effects

- **Glass morphism:** deliberate, limited to navbar + hero cards only. Not default.
- **Tile bg:** fixed z-0, purple-tinted dots. Only public pages.
- **Shadows:** Tailwind shadow scale. Subtle — no heavy glow.
- **Borders:** Dark mode: remove light/white borders on cards/tables/containers. Light mode: thin gray borders.
- **Border-radius:** `rounded-xl` (12px) default. No `rounded-full` on everything.

## Scrollbar

- **Global:** thin, modern, themed — `scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`
- **Notification dropdown:** `scrollbar-hide` (hidden but scrollable)

## Modals

- Reject modal: `overflow-hidden` on body + `backdrop-blur-sm`
- Confirm/success/error: consistent pattern, not a different modal per page

## Key Design Rules

1. **Evolve, don't replace** — purple + Wolfy + tiles + glass nav stay recognizable
2. **Content-first** — UI is the frame, news/projects are the product
3. **Bilingual-ready** — ID/EN strings, no tight text boxes
4. **Mobile primary** — phone-first, touch targets 44×44px min
5. **Dark mode native** — not an afterthought. Remove light borders in dark.
6. **Spend boldness in 1 signature element per page** — everything else quiet
7. **Typography: size/weight only** — never change font-family

## Feature Inventory (preserve + polish)

- [x] Dark/light mode (class-based, `darkMode: 'class'`)
- [x] PWA (service worker at `public/sw.js`)
- [x] Ctrl+K command search (`ExpandingSearchDock`)
- [x] Bilingual content (ID/EN)
- [x] Wolfy — site-scoped RAG chatbot
- [x] Tile grid background
- [x] Glass morphism navbar
- [x] Talking mascot (Wolfy)

## Pages & Signatures

| Page | Signature | Notes |
|------|-----------|-------|
| Home | Hero with latest content + Wolfy | Stagger animation, tiles bg |
| News List | Card grid w/ filters | Consistent cards, pagination |
| News Detail | Clean article layout | Correct h1/h2 hierarchy, OG tags |
| Project List | Gallery-style cards | Distinct from news cards, filter/sort |
| Project Detail | Hierarchical info layout | Status, team, outcomes, media |
| Events List | Expandable cards | Same pattern as news |
| Admin Dashboard | Stats overview | Quick actions 2 clicks away |
| Admin pages | Grouped sidebar by job | Content / Chatbot / Monitoring / Users / Settings |

## Admin Design

- **Persistent grouped sidebar** (not flat list)
- **Breadcrumbs** on every nested page
- **2-click rule** — common actions from dashboard
- **Consistent confirm/success/error** pattern — one modal style, reused everywhere
- Apply same design tokens — admin belongs to the same product

## Admin Credentials

9 seed accounts: `admin[1-9]@sapa.fasilkom.unsri.ac.id` / `AdminSapa[01-09]!`. All equal privilege, no super-admin. **Change on first login.**

## Security

- **Obscure admin base path** — admin routes not under `/admin`. Set `VITE_ADMIN_BASE=portal` in `.env` → login at `site.com/portal`. Give URL to admins directly. Anyone guessing `/admin` hits catch-all → redirect home.
- Rate limit: `throttle:5,60` on login
- Session timeout: 30 min, expire on close
- Audit log all admin actions
- See TECH.md for implementation
