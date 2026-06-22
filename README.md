# ILKOM News

Portal berita dan galeri proyek untuk **Fakultas Ilmu Komputer Universitas Sriwijaya (FASILKOM UNSRI)**.

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Frontend** | React 19 + Vite + Tailwind CSS + Framer Motion |
| **Backend** | Laravel 13 + Sanctum + MySQL |
| **Chatbot** | Google Gemini 2.0 Flash (RAG-based) |
| **Auth** | Laravel Sanctum (token-based) |

## Fitur

### Public
- **Berita (News)** - CRUD berita dengan kategori, pencarian, dan filter
- **Ilkom Gallery** - Galeri proyek mahasiswa (Web, Mobile, UI/UX, Game, AI)
- **Events** - Kalender acara kampus
- **Submit Project** - Form submit proyek mahasiswa dengan tracking
- **Chatbot (Wolfy)** - AI chatbot untuk Q&A seputar website

### Admin
- **Dashboard** - Statistik berita, proyek, views
- **Manajemen Berita** - CRUD berita lengkap
- **Manajemen Proyek** - Review, accept, reject proyek
- **Security Center** - Monitoring login attempts, suspicious IPs
- **Chat Statistics** - Statistik penggunaan chatbot
- **Audit Logs** - Log semua aktivitas admin

## Cara Install

### Prasyarat
- PHP 8.3+
- Composer
- MySQL 8.0+ atau MariaDB 10.3+
- Node.js 18+ & npm
- Google Gemini API Key (untuk chatbot)

### 1. Clone Repository

```bash
git clone https://github.com/mepiii/ilkomnews.git
cd ilkomnews
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi database di .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=ilkom
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations & seed
php artisan migrate --seed

# Start server
php artisan serve --port=8000
```

### 3. Setup Frontend (Terminal Baru)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev
```

### 4. Buka Browser

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000

## Akun Admin

| Email | Password | Role |
|-------|----------|------|
| superadmin@ilkom.id | Sup3r@dm1n#2026! | Super Admin |
| riset.pti@ilkom.id | R1s3t!Pti#2026 | Riset PTI |
| akademik@ilkom.id | Ak@d3m1k!2026 | Akademik |

## API Endpoints

### Public
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/news` | List berita |
| GET | `/api/news/latest` | Berita terbaru |
| GET | `/api/news/categories` | Kategori berita |
| GET | `/api/articles` | List artikel |
| GET | `/api/events` | List events |
| GET | `/api/events/upcoming` | Events mendatang |
| GET | `/api/projects` | List proyek (accepted) |
| POST | `/api/submissions` | Submit proyek |
| POST | `/api/chat` | Chatbot |

### Admin (Need Auth)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/admin/login` | Login admin |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET/POST | `/api/admin/news` | CRUD berita |
| GET | `/api/admin/projects` | List proyek |
| POST | `/api/admin/projects/{id}/accept` | Accept proyek |
| POST | `/api/admin/projects/{id}/reject` | Reject proyek |
| GET | `/api/admin/audit-logs` | Log aktivitas |
| GET | `/api/admin/chat-stats` | Statistik chatbot |
| GET | `/api/admin/health` | Health check |

## Environment Variables

### Backend (.env)

```env
APP_NAME="ILKOM News"
APP_ENV=local
APP_KEY=                    # Generate: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ilkom
DB_USERNAME=root
DB_PASSWORD=

GEMINI_API_KEY=             # Google Gemini API key untuk chatbot
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_USE_REAL_API=true
```

## Security Features

- **Security Headers** - CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting** - 5 req/min, 20 req/hr, 50 req/day untuk chatbot
- **Admin Lockout** - 5 gagal login = lock 15 menit
- **Audit Logging** - Semua aktivitas admin tercatat
- **Input Validation** - Validasi di semua endpoint
- **File Upload** - Validasi MIME, magic bytes, extension

## Struktur Folder

```
ilkomnews/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/    # API Controllers
│   │   ├── Models/              # Eloquent Models
│   │   └── Middleware/          # Custom Middleware
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/            # Database seeders
│   ├── routes/                 # Route definitions
│   └── tests/                  # PHPUnit tests
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── hooks/              # Custom hooks
│   └── public/                 # Static assets
└── README.md
```

## Testing

```bash
cd backend
php artisan test
```

## Deployment

### Hostinger Shared Hosting

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Upload `backend/` folder ke `public_html/`

3. Konfigurasi `.env` di server

4. Jalankan migrations:
```bash
php artisan migrate --force
```

## License

MIT
