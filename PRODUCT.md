# PRODUCT.md — IlkomNews

## Register
product

## Product
IlkomNews (ILKOM NEWS) — campus news and student project portal for FASILKOM (Fakultas Ilmu Komputer) Universitas Sriwijaya. Community: 2,000+ members.

URL: https://ilkomnews.fasilkom.unsri.ac.id/

## Target Users
- FASILKOM Unsri students (primary) — browse news, discover projects, use Wolfy chatbot
- Faculty / staff — consume official content
- Admins — publish content, manage site, operate the admin control center

## Pages in Scope
- Home (Beranda)
- News List / News Detail
- Project List / Project Detail
- Admin Dashboard (Control Center)

## Core Features to Preserve
- Dark / light mode (class-based, `darkMode: 'class'`)
- PWA (service worker at `public/sw.js`, `<meta name="theme-color">`)
- Ctrl+K command search
- Bilingual content (ID/EN)
- Wolfy — site-scoped RAG chatbot (extend existing spec; do not redesign)

## Brand Personality
Academic but alive. Purple-forward, slightly cosmic/tech. Not corporate, not startup-generic. Feels like it belongs to students who build things.

Anti-references:
- Generic university portal (boring, institutional gray)
- Crypto/NFT dark purple (too trendy, wrong crowd)
- SaaS dashboard (wrong register — this is editorial/community, not a tool)

## Stack
- Frontend: React + Vite + Tailwind CSS, custom CSS vars, dark mode via `.dark` class
- Backend: Laravel + MySQL/MariaDB (shared hosting, cPanel)
- Build: Vite, Playwright E2E

## Design Anchors
- Brand: `#300B55` primary, `#7A47A6` secondary, `#FFC148` accent
- Dark bg: `#000000` / near-black; Light bg: `#ffffff`
- Glass morphism used deliberately (navbar, cards) — not as default pattern
- Tile grid background (fixed, z-0, purple-tinted dots)
- Mascot: Wolfy (talking mascot component at `frontend/src/components/home/TalkingMascot.jsx`)

## Strategic Design Principles
1. Evolve, don't replace. The identity (purple, Wolfy, Tiles grid, glass nav) is recognizable — preserve it.
2. Content-first hierarchy. News and projects are the product; UI is the frame.
3. Bilingual-ready layouts. Strings can be longer in Indonesian; don't design tight text boxes.
4. Mobile is primary. FASILKOM students browse on phones.
5. Dark mode is native, not an afterthought. Both themes must feel intentional.
