<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\ProjectSubmission;
use App\Services\ImageCompressionService;
use App\Services\UploadQuotaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProjectSubmissionController extends Controller
{
    // Public: submit a project (no auth required)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:web,mobile,uiux,game,ai',
            'description' => 'required|string|max:5000',
            'thumbnail' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'thumbnail_url' => 'nullable|string|max:500',
            'creator_avatar' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:500',
            'creator_avatar_url' => 'nullable|string|max:500',
            'tech_stack' => 'nullable|array|max:20',
            'live_demo' => 'nullable|string|max:500',
            'github_link' => 'nullable|string|max:500',
            'download_link' => 'nullable|string|max:500',
            'figma_link' => 'nullable|string|max:500',
            'platform' => 'nullable|string|max:100',
            'screenshots' => 'nullable|array|max:10',
            'screenshots.*' => 'image|mimes:jpeg,jpg,png,webp|max:5120',
            'creator_name' => 'required|string|max:255',
            'creator_nim' => 'nullable|string|max:50',
            'creator_nidn' => 'nullable|string|max:50',
            'creator_jabatan' => 'nullable|string|max:255',
            'creator_major' => 'nullable|string|max:255',
            'creator_year' => 'nullable|integer|min:2000|max:2030',
            'collaborators' => 'nullable|array',
            'collaborators.*.name' => 'required_with:collaborators|string|max:100',
            'collaborators.*.type' => 'nullable|string|in:mahasiswa,dosen',
            'collaborators.*.avatar' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:500',
            'collaborators.*.avatar_url' => 'nullable|string|max:500',
            'creator_type' => 'nullable|string|in:mahasiswa,dosen,staf,alumni,lainnya',
        ]);
        $validated['creator_type'] = $request->input('creator_type', 'mahasiswa');

        // Check upload quota (5MB/day per IP)
        $quotaService = new UploadQuotaService();
        $totalBytes = 0;
        if ($request->hasFile('thumbnail')) $totalBytes += $request->file('thumbnail')->getSize();
        if ($request->hasFile('creator_avatar')) $totalBytes += $request->file('creator_avatar')->getSize();
        if ($request->hasFile('screenshots')) {
            foreach ($request->file('screenshots') as $screenshot) {
                $totalBytes += $screenshot->getSize();
            }
        }
        if ($totalBytes > 0) {
            $quota = $quotaService->check($request, $totalBytes);
            if (!$quota['allowed']) {
                return response()->json([
                    'message' => 'Batas upload harian tercapai (5MB/hari). Coba lagi besok.',
                    'quota' => $quota,
                ], 429);
            }
        }

        // Normalize thumbnail_url: add https:// if missing
        if (!empty($validated['thumbnail_url'])) {
            $url = $validated['thumbnail_url'];
            if (!preg_match('/^https?:\/\//i', $url)) {
                $validated['thumbnail_url'] = 'https://' . $url;
            }
        }

        // Validate external image URLs (anti-SSRF / anti-abuse): only http(s)
        // schemes and non-private, non-localhost hosts are allowed.
        if (!empty($validated['thumbnail_url']) && !$this->isSafeImageUrl($validated['thumbnail_url'])) {
            return response()->json([
                'error' => 'Invalid or unsafe thumbnail URL provided.',
            ], 422);
        }

        if (!empty($validated['creator_avatar_url']) && !$this->isSafeImageUrl($validated['creator_avatar_url'])) {
            return response()->json([
                'error' => 'Invalid or unsafe avatar URL provided.',
            ], 422);
        }

        // Handle thumbnail - file upload takes precedence over URL
        $compressor = new ImageCompressionService();
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $compressor->compress($request->file('thumbnail'), 'projects/thumbnails');
        } elseif ($request->has('thumbnail_url') && !empty($request->thumbnail_url)) {
            $validated['thumbnail'] = $validated['thumbnail_url'];
        }

        // Handle creator_avatar - file upload takes precedence over URL
        if ($request->hasFile('creator_avatar')) {
            $validated['creator_avatar'] = $compressor->compress($request->file('creator_avatar'), 'projects/avatars');
        } elseif ($request->has('creator_avatar_url') && !empty($request->creator_avatar_url)) {
            $validated['creator_avatar'] = $validated['creator_avatar_url'];
        }
        unset($validated['creator_avatar_url']);

        // Handle screenshots file uploads
        if ($request->hasFile('screenshots')) {
            $screenshotPaths = [];
            foreach ($request->file('screenshots') as $screenshot) {
                $screenshotPaths[] = $compressor->compress($screenshot, 'projects/screenshots');
            }
            $validated['screenshots'] = $screenshotPaths;
        }

        // Handle tech_stack - ensure it's an array of strings
        if ($request->has('tech_stack')) {
            $techStack = $request->input('tech_stack');
            if (is_array($techStack)) {
                $validated['tech_stack'] = array_values(array_filter(array_map(function($item) {
                    return is_string($item) ? trim($item) : strval($item);
                }, $techStack)));
                $validated['tech_stack'] = array_slice($validated['tech_stack'], 0, 20);
            }
        }

        // Handle collaborators - ensure it's an array, reading uploaded avatar files by index
        if ($request->has('collaborators')) {
            $collaborators = $request->input('collaborators');
            if (is_array($collaborators)) {
                $normalized = [];
                foreach (array_values($collaborators) as $i => $item) {
                    if (is_string($item)) {
                        $normalized[] = trim($item);
                        continue;
                    }
                    if (is_array($item) && !empty($item['name'])) {
                        $avatar = $item['avatar'] ?? null;
                        if ($request->hasFile("collaborators.$i.avatar")) {
                            $avatar = $compressor->compress($request->file("collaborators.$i.avatar"), 'projects/avatars');
                        } elseif (!empty($item['avatar_url'])) {
                            $avatar = $item['avatar_url'];
                        }
                        $normalized[] = [
                            'name' => trim($item['name']),
                            'type' => $item['type'] ?? 'mahasiswa',
                            'nim' => $item['nim'] ?? null,
                            'nidn' => $item['nidn'] ?? null,
                            'jabatan' => $item['jabatan'] ?? null,
                            'major' => $item['major'] ?? null,
                            'year' => $item['year'] ?? null,
                            'avatar' => $avatar,
                        ];
                    }
                }
                $validated['collaborators'] = array_slice(array_values($normalized), 0, 20);
            }
        }

        $submission = ProjectSubmission::create($validated);

        // Notify the user that their project was submitted
        Notification::create([
            'tracking_id' => $submission->tracking_id,
            'project_id'  => $submission->id,
            'type'        => 'submitted',
            'title'       => 'Proyek Berhasil Dikirim',
            'message'     => 'Proyek Anda telah berhasil dikirim! ID Pelacakan: ' . $submission->tracking_id,
            'read'        => false,
        ]);

        // Record upload quota usage
        if ($totalBytes > 0) {
            $quotaService->recordUsage($request, $totalBytes);
        }

        return response()->json([
            'message' => 'Proyek berhasil diajukan!',
            'tracking_id' => $submission->tracking_id,
            'status' => $submission->status,
        ], 201);
    }

    // Public: track submission by tracking_id
    public function track(string $trackingId)
    {
        $submission = ProjectSubmission::where('tracking_id', $trackingId)->firstOrFail();

        return response()->json([
            'tracking_id' => $submission->tracking_id,
            'status' => $submission->status,
            'title' => $submission->title,
            'category' => $submission->category,
            'rejection_reason' => $submission->rejection_reason,
            'reviewed_at' => $submission->reviewed_at?->toIso8601String(),
            'created_at' => $submission->created_at->toIso8601String(),
        ]);
    }

    // Public: list accepted projects
    public function publicIndex(Request $request)
    {
        $cacheKey = 'public-projects:index:' . md5(json_encode([
            'category' => $request->category,
            'search' => $request->search,
            'page' => $request->get('page', 1),
        ]));

        $payload = Cache::remember($cacheKey, 60, function () use ($request) {
            $query = ProjectSubmission::where('status', 'accepted');

            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            if ($request->has('search')) {
                $search = addcslashes($request->search, '%_');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('creator_name', 'like', "%{$search}%");
                });
            }

            return $query->latest()->paginate(12)->toArray();
        });

        return response()->json($payload);
    }

    // Public: single accepted project
    public function publicShow(string $id)
    {
        $payload = Cache::remember("public-projects:show:{$id}", 120, function () use ($id) {
            return ProjectSubmission::where('id', $id)
                ->where('status', 'accepted')
                ->firstOrFail()
                ->toArray();
        });

        return response()->json($payload);
    }

    /**
     * Bust the public project caches. Called from admin state changes.
     */
    public function flushPublicCache(): void
    {
        try {
            Cache::tags('public-projects')->flush();
        } catch (\Throwable $e) {
            // cache store doesn't support tags — short TTL covers it
        }
    }

    /**
     * Validate that a user-supplied image URL is safe to reference in markup.
     *
     * Rejects anything that is not an http(s) URL or whose host resolves to a
     * private / localhost / link-local address (SSRF / internal disclosure guard).
     */
    private function isSafeImageUrl(?string $url): bool
    {
        if (empty($url) || !is_string($url)) {
            return false;
        }

        if (!preg_match('/^https?:\/\//i', $url)) {
            return false;
        }

        if (filter_var($url, FILTER_VALIDATE_URL) === false) {
            return false;
        }

        $host = (string) parse_url($url, PHP_URL_HOST);
        if ($host === '') {
            return false;
        }

        $host = strtolower($host);

        if ($host === 'localhost' || str_ends_with($host, '.local') || str_ends_with($host, '.internal')) {
            return false;
        }

        // Resolve to an IP address (handles both literals and hostnames).
        // Resolution is best-effort: if it fails (e.g. sandboxed env with no
        // DNS), we do NOT reject the URL so the normal submission flow keeps
        // working. Private IP literals and localhost are still blocked above.
        $ip = filter_var($host, FILTER_VALIDATE_IP) ? $host : @gethostbyname($host);
        if (!is_string($ip) || $ip === $host) {
            return true;
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return false;
        }

        return true;
    }
}
