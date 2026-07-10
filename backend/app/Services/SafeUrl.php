<?php

namespace App\Services;

/**
 * SafeUrl — SSRF guard for admin-supplied provider URLs.
 *
 * Admin-configured `base_url` values are fetched server-side together with the
 * provider's API key. Without validation, a malicious/hijacked admin could point
 * them at internal services (cloud metadata, loopback, private ranges) and
 * exfiltrate the key. This helper rejects any URL that resolves to a private,
 * loopback, link-local, or otherwise internal address.
 *
 * Dependency-free (no external packages).
 */
class SafeUrl
{
    /**
     * Returns true only for normal, public http/https URLs.
     * Any parse failure, private/loopback/link-local IP, or internal-looking
     * host name is treated as unsafe.
     */
    public static function isSafe(string $url): bool
    {
        // 1. Must be a syntactically valid URL.
        if (filter_var($url, FILTER_VALIDATE_URL) === false) {
            return false;
        }

        // 2. Only allow http/https schemes.
        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
        if ($scheme !== 'http' && $scheme !== 'https') {
            return false;
        }

        // 3. Extract host.
        $host = parse_url($url, PHP_URL_HOST);
        if (!is_string($host) || $host === '') {
            return false;
        }

        $host = strtolower(trim($host));

        // Strip IPv6 brackets, e.g. "[::1]" -> "::1".
        if (str_starts_with($host, '[') && str_ends_with($host, ']')) {
            $host = substr($host, 1, -1);
        }

        // 4. Block obvious internal host names outright.
        if ($host === 'localhost') {
            return false;
        }
        foreach (['.internal', '.local', '.localhost'] as $suffix) {
            if (str_ends_with($host, $suffix)) {
                return false;
            }
        }

        // 5. Resolve to an IP. If the host is already an IP, use it directly;
        //    otherwise resolve via DNS (gethostbyname). A failed resolution
        //    (gethostbyname returns the input host unchanged) is unsafe.
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            $ip = $host;
        } else {
            $ip = gethostbyname($host);
            // gethostbyname returns the original hostname on failure.
            if ($ip === $host || filter_var($ip, FILTER_VALIDATE_IP) === false) {
                return false;
            }
        }

        return self::isPublicIp($ip);
    }

    /**
     * True only for public, routable IP addresses.
     *
     * FILTER_FLAG_NO_PRIV_RANGE rejects RFC1918 private ranges
     * (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) and IPv6 unique-local.
     * FILTER_FLAG_NO_RES_RANGE rejects reserved ranges, which INCLUDES
     * loopback (127.0.0.0/8, ::1) and link-local (169.254.0.0/16 — the cloud
     * metadata range at 169.254.169.254, plus IPv6 fe80::/10).
     */
    private static function isPublicIp(string $ip): bool
    {
        // Explicit loopback checks (defensive; also covered by NO_RES_RANGE).
        if ($ip === '::1' || str_starts_with($ip, '127.')) {
            return false;
        }

        // Explicit link-local / metadata check (defensive).
        if (str_starts_with($ip, '169.254.')) {
            return false;
        }

        $valid = filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        );

        return $valid !== false;
    }
}
