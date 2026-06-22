---
name: ILKOM Admin Dashboard
created: 2026-06-21
status: in_progress
---

# ILKOM Admin Dashboard

## Objective
Build a production-ready admin dashboard for ILKOM (BEM FASILKOM UNSRI) to manage News (Berita) and Project Submissions (Ilkom Gallery). Deploy on Hostinger shared hosting.

## Scope
- **News (Berita):** Full CRUD — create, edit, delete, list with search/filter
- **Projects (Ilkom Gallery):** Full CRUD + approve/reject workflow
- **Admin Auth:** Multi-admin login (seeded accounts, no registration)
- **No:** Articles, Events, Careers modules

## Tech Stack
- **Frontend:** React 19 + Vite + Tailwind CSS + framer-motion (existing)
- **Backend:** Laravel 13 + Sanctum + MySQL (existing, extend)
- **Database:** MySQL (switch from SQLite for Hostinger)
- **Hosting:** Hostinger shared — Laravel in public_html, frontend built into public/

## Requirements

### Must Have
- [ ] REQ-1: MySQL database configuration
- [ ] REQ-2: Admin login API (Sanctum token-based)
- [ ] REQ-3: Seed 2+ admin accounts
- [ ] REQ-4: Admin dashboard page with stats (news count, project count, pending projects)
- [ ] REQ-5: News CRUD — list/search/create/edit/delete
- [ ] REQ-6: Projects CRUD — list/search/create/edit/delete + approve/reject
- [ ] REQ-7: Admin sidebar navigation
- [ ] REQ-8: Admin login page (React)
- [ ] REQ-9: Protected admin routes (redirect to login if not authenticated)
- [ ] REQ-10: Hostinger deployment config (build script, .htaccess, env setup)

### Nice to Have
- [ ] NICE-1: Image upload for news/projects
- [ ] NICE-2: Rich text editor for content
- [ ] NICE-3: Pagination with page controls

## Constraints
- No TypeScript — keep existing JS pattern
- No new heavy dependencies — use existing stack
- All admin CRUD must work via API (no Blade views for admin)

## Deployment
- `npm run build` → frontend builds into `backend/public/`
- Laravel serves from Hostinger's public_html
- `.env` configured for MySQL on Hostinger
- `.htaccess` for Laravel routing
