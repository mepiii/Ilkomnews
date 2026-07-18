<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeApiInput
{
    /**
     * Keys that may legally contain rich text and should not be strip-tagged.
     *
     * @var array<int, string>
     */
    private array $allowHtmlKeys = ['content', 'description', 'message', 'summary', 'response'];

    public function handle(Request $request, Closure $next): Response
    {
        $request->query->replace($this->sanitizeArray($request->query->all(), true));

        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            $request->request->replace($this->sanitizeArray($request->request->all(), false));
        }

        if ($request->route()) {
            foreach ($request->route()->parameters() as $key => $value) {
                if (is_string($value)) {
                    $request->route()->setParameter($key, $this->sanitizeString($value, true, $key));
                }
            }
        }

        return $next($request);
    }

    private function sanitizeArray(array $data, bool $stripHtml): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value, $stripHtml);
                continue;
            }

            if (is_string($value)) {
                $sanitized[$key] = $this->sanitizeString(
                    $value,
                    $stripHtml && ! in_array((string) $key, $this->allowHtmlKeys, true),
                    (string) $key
                );
                continue;
            }

            $sanitized[$key] = $value;
        }

        return $sanitized;
    }

    private function sanitizeString(string $value, bool $stripHtml, string $key): string
    {
        $cleaned = trim(preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '');

        if ($stripHtml) {
            $cleaned = strip_tags($cleaned);
        }

        $maxLength = match ($key) {
            'search' => 200,
            'title' => 255,
            'category', 'type', 'status', 'action', 'entity_type' => 100,
            'trackingId', 'tracking_id', 'slug' => 64,
            default => 10000,
        };

        return mb_substr($cleaned, 0, $maxLength);
    }
}
