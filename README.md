# ILKOM News

Portal berita dan galeri proyek untuk Fakultas Ilmu Komputer Universitas Sriwijaya (FASILKOM UNSRI).

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Laravel 13 + Sanctum + MySQL
- **Chatbot:** Google Gemini 2.0 Flash (RAG-based)

## Features

- News (Berita) management with CRUD
- Ilkom Gallery - student project submissions
- Events calendar
- AI Chatbot (Wolfy) for website Q&A
- Admin dashboard with security center

## Quick Start

```bash
# Clone
git clone https://github.com/gerraddimas86-max/ilkomnews.git
cd ilkomnews

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Admin Accounts

| Email | Password |
|-------|----------|
| superadmin@ilkom.id | Sup3r@dm1n#2026! |
| riset.pti@ilkom.id | R1s3t!Pti#2026 |
| akademik@ilkom.id | Ak@d3m1k!2026 |

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `GEMINI_API_KEY` - Google Gemini API key for chatbot
- `DB_*` - Database configuration
- `APP_KEY` - Generated via `php artisan key:generate`

## License

MIT
