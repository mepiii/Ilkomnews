# Product

## Register

product

## Users
- **Public visitors**: students & faculty of Fakultas Ilmu Komputer browsing news, events, gallery, and submitting projects. Mobile-first (Indonesia, mostly phone).
- **Admins**: faculty staff managing news/articles/events/projects, moderating submissions, viewing chat stats and audit logs. Use the obscured `/portal` admin on desktop and tablet, increasingly on mobile.

## Product Purpose
ILKOM NEWS is the faculty's content hub: publish news/events, showcase student project gallery, run an AI chatbot (Wolfy) for visitors. Success = visitors find and engage with content fast on any screen; admins manage content without friction.

## Brand Personality
Helpful, calm, academic-but-modern. Three words: **gede, ramah, lokal** (clear, welcoming, local). Confidence without shouting.

## Anti-references
- Generic SaaS dashboards with side-stripe accent borders and identical card grids.
- AI-gradient-text hero slop; glassmorphism-as-default; tiny all-caps eyebrows above every section.
- Washed-out gray body text on tinted near-white (contrast failures).

## Design Principles
1. Mobile-first always: every admin control and public section must be fully usable and all actions visible at ≤375px without horizontal scroll.
2. Configuration over hardcoding: admin credentials and secrets live in the database / env, editable by admins, never baked into source.
3. Defense in depth for admin: obscured route + auth middleware + JSON 401/403 + DB-backed credentials + IP/2FA-ready structure.
4. Real data, not mock counts: engagement signals (views/likes/saves/shares) persist and update from the database.
5. Flat and legible: avoid decorative circles/glass; rely on contrast, spacing, and weight.

## Accessibility & Inclusion
- WCAG 2.1 AA target. Body text ≥4.5:1; large ≥3:1.
- Honor `prefers-reduced-motion`.
- Touch targets ≥44px; no element clipped on mobile.
