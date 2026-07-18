<?php

namespace App\Services;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\Event;
use App\Models\News;
use App\Models\ProjectSubmission;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Optimized service for chatbot context retrieval with caching.
 */
class ChatContextService
{
    private const CONTEXT_CACHE_TTL = 30;
    private const RECENT_CACHE_TTL = 60;

    /**
     * Get cached recent context for chatbot.
     */
    public function getRecentContext(): string
    {
        return Cache::store('redis')->remember('chat:recent_context', self::RECENT_CACHE_TTL, function () {
            try {
                $news = News::published()
                    ->latest('date')
                    ->limit(3)
                    ->get(['title', 'summary', 'category', 'date']);

                $projects = ProjectSubmission::where('status', 'accepted')
                    ->latest()
                    ->limit(3)
                    ->get(['title', 'category', 'creator_name']);
            } catch (\Throwable $e) {
                return '';
            }

            $lines = [];
            foreach ($news as $n) {
                $date = $n->date?->format('d M Y') ?? '';
                $lines[] = "- Berita terbaru: {$n->title} [{$n->category}] ({$date})";
            }
            foreach ($projects as $p) {
                $lines[] = "- Proyek terbaru: {$p->title} [{$p->category}] oleh {$p->creator_name}";
            }

            return empty($lines) ? '' : "[Konten Terbaru di Website]\n".implode("\n", $lines);
        });
    }

    /**
     * Search news context with caching.
     */
    public function searchNews(string $query): string
    {
        $cacheKey = 'chat:news:' . md5($query);
        
        return Cache::store('redis')->remember($cacheKey, self::CONTEXT_CACHE_TTL, function () use ($query) {
            try {
                $search = addcslashes($query, '%_');
                $results = News::published()
                    ->where(function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                          ->orWhere('summary', 'like', "%{$search}%")
                          ->orWhere('content', 'like', "%{$search}%");
                    })
                    ->latest('date')
                    ->limit(3)
                    ->get(['title', 'summary', 'category', 'date']);
            } catch (\Throwable $e) {
                return '';
            }

            if ($results->isEmpty()) {
                return '';
            }

            $lines = [];
            foreach ($results as $news) {
                $date = $news->date?->format('d M Y') ?? '';
                $summary = $news->summary ? Str::limit($news->summary, 100) : '';
                $lines[] = "- {$news->title} [{$news->category}] ({$date}): {$summary}";
            }

            return implode("\n", $lines);
        });
    }

    /**
     * Search events context with caching.
     */
    public function searchEvents(string $query): string
    {
        $cacheKey = 'chat:events:' . md5($query);
        
        return Cache::store('redis')->remember($cacheKey, self::CONTEXT_CACHE_TTL, function () use ($query) {
            try {
                $search = addcslashes($query, '%_');
                $results = Event::published()
                    ->where(function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                          ->orWhere('summary', 'like', "%{$search}%");
                    })
                    ->latest('date')
                    ->limit(3)
                    ->get(['title', 'summary', 'category', 'date', 'location']);
            } catch (\Throwable $e) {
                return '';
            }

            if ($results->isEmpty()) {
                return '';
            }

            $lines = [];
            foreach ($results as $event) {
                $date = $event->date?->format('d M Y') ?? '';
                $location = $event->location ?? 'Online';
                $lines[] = "- {$event->title} [{$event->category}] ({$date}) di {$location}";
            }

            return implode("\n", $lines);
        });
    }

    /**
     * Search projects context with caching.
     */
    public function searchProjects(string $query): string
    {
        $cacheKey = 'chat:projects:' . md5($query);
        
        return Cache::store('redis')->remember($cacheKey, self::CONTEXT_CACHE_TTL, function () use ($query) {
            try {
                $search = addcslashes($query, '%_');
                $results = ProjectSubmission::where('status', 'accepted')
                    ->where(function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%")
                          ->orWhere('creator_name', 'like', "%{$search}%");
                    })
                    ->latest()
                    ->limit(3)
                    ->get(['title', 'category', 'status', 'creator_name', 'description', 'tech_stack']);
            } catch (\Throwable $e) {
                return '';
            }

            if ($results->isEmpty()) {
                return '';
            }

            $lines = [];
            foreach ($results as $project) {
                $desc = $project->description ? Str::limit($project->description, 100) : '';
                $tech = is_array($project->tech_stack) ? implode(', ', array_slice($project->tech_stack, 0, 3)) : '';
                $line = "- {$project->title} [{$project->category}] oleh {$project->creator_name}";
                if ($tech) {
                    $line .= " | Tech: {$tech}";
                }
                $lines[] = $line;
            }

            return implode("\n", $lines);
        });
    }

    /**
     * Get or create conversation with optimized query.
     */
    public function getOrCreateConversation(string $sessionId, ?string $visitorId = null): ChatConversation
    {
        return ChatConversation::firstOrCreate(
            ['session_id' => $sessionId],
            ['visitor_id' => $visitorId]
        );
    }

    /**
     * Get recent messages for conversation with limit.
     */
    public function getRecentMessages(int $conversationId, int $limit = 10): array
    {
        $messages = ChatMessage::where('conversation_id', $conversationId)
            ->select(['role', 'content'])
            ->latest()
            ->limit($limit)
            ->get()
            ->reverse()
            ->values();

        $result = [];
        foreach ($messages as $msg) {
            $result[] = ['role' => $msg->role, 'content' => $msg->content];
        }

        return $result;
    }

    /**
     * Get static baseline context.
     */
    public function getBaseContext(): string
    {
        return "[Tentang ILKOM NEWS & FASILKOM]\n"
            ."- ILKOM NEWS adalah portal berita dan galeri proyek mahasiswa FASILKOM, Universitas Sriwijaya (Unsri).\n"
            ."- FASILKOM = Fakultas Ilmu Komputer, Universitas Sriwijaya.\n"
            ."- ILKOM = Ilmu Komputer (program studi di FASILKOM).\n"
            .'- Konten website saat ini: Berita dan Galeri Proyek mahasiswa. (Belum ada Artikel atau Event.)';
    }
}
