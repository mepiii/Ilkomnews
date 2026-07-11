<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\News;
use App\Models\Article;
use App\Models\Event;
use App\Models\Career;
use App\Models\ProjectSubmission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Admin user
        User::updateOrCreate(['email' => 'admin@fasilkom.unsri.ac.id'], [
            'name' => 'Admin FASILKOM',
            'email' => 'admin@fasilkom.unsri.ac.id',
            'password' => bcrypt('password'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate(['email' => 'user@example.com'], [
            'name' => 'User Demo',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // News
        $newsData = [
            ['title' => 'Workshop Pengembangan Web Modern dengan React', 'category' => 'Workshop', 'summary' => 'Workshop intensif 3 hari tentang React 19, hooks, dan Server Components.', 'author' => 'Budi Santoso', 'views' => 342],
            ['title' => 'Kompetisi Hackathon FASILKOM 2026', 'category' => 'Kompetisi', 'summary' => 'Hackathon tahunan dengan tema "AI untuk Pendidikan". Hadiah total 50 juta rupiah.', 'author' => 'Rina Wati', 'views' => 891],
            ['title' => 'Pelatihan Cloud Computing bersama AWS', 'category' => 'Pelatihan', 'summary' => 'Sertifikasi AWS Cloud Practitioner gratis untuk mahasiswa aktif.', 'author' => 'Ahmad Fauzi', 'views' => 567],
            ['title' => 'Seminar Nasional Cybersecurity 2026', 'category' => 'Seminar', 'summary' => 'Pembicara dari BSSN dan tokoh industri keamanan siber nasional.', 'author' => 'Dewi Lestari', 'views' => 1203],
            ['title' => 'Penerimaan Mahasiswa Baru S1 Teknik Informatika', 'category' => 'Kompetisi', 'summary' => 'Informasi pendaftaran dan jalur masuk FASILKOM Unsri 2026.', 'author' => 'Panitia SPMB', 'views' => 2341],
            ['title' => 'Workshop Machine Learning dengan Python', 'category' => 'Workshop', 'summary' => 'Praktik langsung membuat model ML menggunakan scikit-learn dan TensorFlow.', 'author' => 'Dr. Siti Nurhaliza', 'views' => 445],
            ['title' => 'Kuliah Umum: Masa Depan Quantum Computing', 'category' => 'Seminar', 'summary' => 'Prof. dari ITB berbagi wawasan tentang potensi komputasi kuantum di Indonesia.', 'author' => 'Prof. Hendra Wijaya', 'views' => 678],
            ['title' => 'Bootcamp Mobile App Development Flutter', 'category' => 'Pelatihan', 'summary' => '2 minggu intensif membangun aplikasi cross-platform dengan Flutter & Dart.', 'author' => 'Maya Putri', 'views' => 312],
        ];

        foreach ($newsData as $i => $n) {
            News::updateOrCreate(['slug' => Str::slug($n['title'])], [
                ...$n,
                'content' => $n['summary'] . "\n\nKonten lengkap akan segera tersedia. Pantau terus portal berita FASILKOM untuk informasi lebih lanjut.",
                'date' => now()->subDays(rand(1, 30)),
                'published' => $i !== 7,
            ]);
        }

        // Articles
        $articleData = [
            ['title' => 'Tutorial Membuat REST API dengan Laravel 13', 'category' => 'Tutorial', 'author' => 'Rizky Ahmad', 'read_time' => '12 min read'],
            ['title' => 'Panduan Lengkap Git untuk Pemula', 'category' => 'Pembelajaran', 'author' => 'Andi Pratama', 'read_time' => '8 min read'],
            ['title' => 'Opini: Pentingnya Literasi Digital di Era AI', 'category' => 'Opini', 'author' => 'Dr. Bambang Sutedjo', 'read_time' => '6 min read'],
            ['title' => 'Review: VS Code vs Cursor untuk AI-Assisted Coding', 'category' => 'Review', 'author' => 'Fajar Nugroho', 'read_time' => '10 min read'],
            ['title' => 'Tips & Trik Optimasi Performance React Apps', 'category' => 'Tips & Trik', 'author' => 'Sari Dewi', 'read_time' => '7 min read'],
            ['title' => 'Tutorial Deploy Next.js ke Vercel dan Docker', 'category' => 'Tutorial', 'author' => 'Rizky Ahmad', 'read_time' => '15 min read'],
        ];

        foreach ($articleData as $a) {
            Article::updateOrCreate(['slug' => Str::slug($a['title'])], [
                ...$a,
                'summary' => "Ringkasan untuk {$a['title']}",
                'content' => "Konten lengkap untuk {$a['title']}. Ini adalah artikel tutorial yang membahas secara mendalam topik yang dibahas.",
                'date' => now()->subDays(rand(1, 14)),
            ]);
        }

        // Events
        $eventData = [
            ['title' => 'FASILKOM Tech Summit 2026', 'category' => 'Conference', 'location' => 'Gedung Fasilkom Unsri', 'capacity' => 500, 'registered' => 342, 'duration' => '2 hari', 'price' => 'Gratis'],
            ['title' => 'Hack4Sri #3 — AI for Education', 'category' => 'Hackathon', 'location' => 'Online + Lab Fasilkom', 'capacity' => 200, 'registered' => 187, 'duration' => '48 jam', 'price' => 'Gratis'],
            ['title' => 'Workshop Docker & Kubernetes', 'category' => 'Workshop', 'location' => 'Lab 3 Fasilkom', 'capacity' => 40, 'registered' => 40, 'duration' => '4 jam', 'price' => 'Rp 25.000'],
            ['title' => 'Seminar Career Readiness 2026', 'category' => 'Seminar', 'location' => 'Auditorium Unsri', 'capacity' => 300, 'registered' => 156, 'duration' => '3 jam', 'price' => 'Gratis'],
        ];

        foreach ($eventData as $e) {
            Event::updateOrCreate(['slug' => Str::slug($e['title'])], [
                ...$e,
                'summary' => "Acara {$e['title']} di FASILKOM Unsri.",
                'content' => "Deskripsi lengkap acara {$e['title']}. Bergabunglah untuk pengalaman belajar yang berharga.",
                'date' => now()->addDays(rand(7, 60)),
            ]);
        }

        // Careers
        $careerData = [
            ['title' => 'Frontend Developer Intern', 'company' => 'Gojek', 'location' => 'Jakarta / Remote', 'type' => 'Internship', 'salary' => 'Rp 4.000.000/bln', 'requirements' => ['React', 'TypeScript', 'CSS'], 'deadline' => now()->addDays(14)],
            ['title' => 'Backend Engineer', 'company' => 'Tokopedia', 'location' => 'Jakarta', 'type' => 'Full Time', 'salary' => 'Rp 15-25 juta/bln', 'requirements' => ['Go', 'PostgreSQL', 'Microservices'], 'deadline' => now()->addDays(21)],
            ['title' => 'Machine Learning Engineer', 'company' => 'Bank Mandiri', 'location' => 'Jakarta', 'type' => 'Full Time', 'salary' => 'Rp 18-30 juta/bln', 'requirements' => ['Python', 'TensorFlow', 'MLOps'], 'deadline' => now()->addDays(30)],
            ['title' => 'Mobile Developer Intern', 'company' => 'Traveloka', 'location' => 'Jakarta / Remote', 'type' => 'Internship', 'salary' => 'Rp 3.500.000/bln', 'requirements' => ['Flutter', 'Dart', 'REST API'], 'deadline' => now()->addDays(10)],
        ];

        foreach ($careerData as $c) {
            Career::updateOrCreate(['slug' => Str::slug($c['title'])], [
                ...$c,
                'description' => "Lowongan {$c['title']} di {$c['company']}. Kami mencari kandidat terbaik untuk bergabung dengan tim kami.",
            ]);
        }

        // Sample project submissions
        $submissions = [
            ['title' => 'AbsenKu — Sistem Absensi QR Code', 'category' => 'mobile', 'creator_name' => 'Andi Pratama', 'creator_nim' => '09031282306001', 'creator_major' => 'S1 Teknik Informatika', 'creator_year' => 2023, 'status' => 'accepted', 'tech_stack' => ['Flutter', 'Firebase', 'QR Code'], 'description' => 'Aplikasi mobile untuk absensi mahasiswa menggunakan QR Code dinamis.'],
            ['title' => 'ParkirPintar — IoT Smart Parking', 'category' => 'ai', 'creator_name' => 'Sari Dewi', 'creator_nim' => '09031282306042', 'creator_major' => 'S1 Teknik Informatika', 'creator_year' => 2022, 'status' => 'accepted', 'tech_stack' => ['Python', 'TensorFlow', 'Raspberry Pi', 'MQTT'], 'description' => 'Sistem parkir pintar berbasis IoT dengan deteksi objek menggunakan deep learning.'],
            ['title' => 'TugasKu — Task Management App', 'category' => 'web', 'creator_name' => 'Rina Wati', 'creator_nim' => '09031282306018', 'creator_major' => 'S1 Sistem Informasi', 'creator_year' => 2023, 'status' => 'pending', 'tech_stack' => ['React', 'Node.js', 'PostgreSQL'], 'description' => 'Aplikasi manajemen tugas untuk mahasiswa dengan fitur reminder dan kolaborasi.'],
            ['title' => 'RetroNesia — Game Edukasi Sejarah', 'category' => 'game', 'creator_name' => 'Fajar Nugroho', 'creator_nim' => '09031282306055', 'creator_major' => 'S1 Teknik Informatika', 'creator_year' => 2022, 'status' => 'pending', 'tech_stack' => ['Unity', 'C#', 'Firebase'], 'description' => 'Game petualangan 2D bertema sejarah Indonesia.'],
            ['title' => 'Fasilkom UI Kit — Design System', 'category' => 'uiux', 'creator_name' => 'Maya Putri', 'creator_nim' => '09031282306071', 'creator_major' => 'S1 Sistem Informasi', 'creator_year' => 2023, 'status' => 'accepted', 'tech_stack' => ['Figma'], 'description' => 'Design system komprehensif untuk website FASILKOM Unsri.'],
            ['title' => 'ChatBot Fasilkom — AI Assistant', 'category' => 'ai', 'creator_name' => 'Ahmad Fauzi', 'creator_nim' => '09031282306009', 'creator_major' => 'S1 Teknik Informatika', 'creator_year' => 2023, 'status' => 'rejected', 'rejection_reason' => 'Deskripsi kurang detail. Mohon jelaskan arsitektur model NLP yang digunakan.', 'tech_stack' => ['Python', 'OpenAI API', 'FastAPI'], 'description' => 'Chatbot untuk FAQ FASILKOM menggunakan LLM.'],
        ];

        foreach ($submissions as $s) {
            ProjectSubmission::firstOrCreate(['title' => $s['title']], [
                ...$s,
                'tracking_id' => strtoupper(Str::random(12)),
                'reviewed_by' => $s['status'] !== 'pending' ? 1 : null,
                'reviewed_at' => $s['status'] !== 'pending' ? now()->subDays(rand(1, 5)) : null,
            ]);
        }

        $this->call([AdminSeeder::class]);
    }
}
