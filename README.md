# ILKOM NEWS

News and project gallery portal for **Faculty of Computer Science (FASILKOM), Sriwijaya University**.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19 + Vite 8 + Tailwind CSS + Framer Motion |
| **Backend** | Laravel 13 + Sanctum + MySQL |
| **Chatbot** | Google Gemini 2.0 Flash (RAG-based, server-side proxy) |
| **Auth** | Laravel Sanctum (token-based) |

## Features

### Public
- **News (Berita)** — News articles with categories, search, and filtering
- **Ilkom Gallery** — Student project gallery (Web, Mobile, UI/UX, Game, AI)
- **Events** — Campus event calendar
- **Submit Project** — Student project submission form with tracking ID
- **Wolfy Chatbot** — AI assistant powered by Gemini, answers questions about news, projects, and submissions

### Admin
- **Dashboard** — Statistics for news, projects, views, and submissions
- **News Management** — Full CRUD for news articles
- **Project Management** — Review, accept, or reject submitted projects
- **Notifications** — Real-time notifications for project status changes

## Installation

### Prerequisites
- PHP 8.3+
- Composer
- MySQL 8.0+ or MariaDB 10.3+
- Node.js 18+ & npm
- Google Gemini API key (for chatbot)

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

# Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=ilkom
# DB_USERNAME=root
# DB_PASSWORD=

# Add Gemini API key for chatbot
# GEMINI_API_KEY=your_key_here

# Run migrations & seed
php artisan migrate --seed

# Start server
php artisan serve --port=8000
```

### 3. Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 4. Open Browser

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000

## Admin Accounts

| Email | Password | Role |
|-------|----------|------|
| superadmin@ilkom.id | Sup3r@dm1n#2026! | Super Admin |
| riset.pti@ilkom.id | R1s3t!Pti#2026 | Riset PTI |
| akademik@ilkom.id | Ak@d3m1k!2026 | Akademik |

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | List news articles |
| GET | `/api/news/latest` | Latest news |
| GET | `/api/news/categories` | News categories |
| GET | `/api/articles` | List articles |
| GET | `/api/events` | List events |
| GET | `/api/events/upcoming` | Upcoming events |
| GET | `/api/projects` | List accepted projects |
| POST | `/api/submissions` | Submit a project |
| GET | `/api/submissions/track/{id}` | Track submission status |
| POST | `/api/chat` | Wolfy chatbot (RAG) |

### Admin (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET/POST | `/api/admin/news` | News CRUD |
| GET | `/api/admin/projects` | List projects |
| POST | `/api/admin/projects/{id}/accept` | Accept project |
| POST | `/api/admin/projects/{id}/reject` | Reject project |

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

GEMINI_API_KEY=             # Google Gemini API key for chatbot
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_USE_REAL_API=true
```

## Chatbot (Wolfy)

Wolfy is an RAG-based chatbot that answers questions about:
- News articles and categories
- Project submission status (pending/accepted/rejected)
- Student project gallery details
- General ILKOM/FASILKOM information

### Rate Limits
- 5 requests per minute per IP
- 20 requests per day per IP
- 250 character input limit

### Security
- Content filter blocks jailbreak attempts
- Anti-prompt-injection system prompt
- Server-side Gemini API key (never exposed to frontend)

## Security Features

- **Rate Limiting** — Per-IP limits on all endpoints
- **Admin Authentication** — Laravel Sanctum token-based
- **Input Validation** — Server-side validation on all inputs
- **Content Filtering** — Chatbot anti-jailbreak protection
- **LIKE Wildcard Escaping** — SQL injection prevention in search queries

## Project Structure

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
│   │   │   ├── chat/           # Wolfy chatbot widget
│   │   │   ├── common/         # Shared components
│   │   │   ├── home/           # Homepage components
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── ui/             # UI primitives
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── hooks/              # Custom hooks
│   └── public/                 # Static assets
└── README.md
```

## License

MIT
