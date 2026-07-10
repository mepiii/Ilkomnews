<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * The trusted proxies for this application.
     *
     * Ported from the L11 `trustProxies()` builder call. Override with
     * TRUSTED_PROXIES (comma-separated CIDRs / IPs) when deployed behind a
     * known reverse proxy / CDN so $request->ip() reflects the real client.
     *
     * @var array<int, string>|string|null
     */
    protected $proxies;

    /**
     * The headers that should be used to detect proxies.
     *
     * @var int
     */
    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB;

    public function __construct()
    {
        $proxies = env('TRUSTED_PROXIES');

        $this->proxies = $proxies !== null && $proxies !== ''
            ? array_map('trim', explode(',', $proxies))
            : ['127.0.0.1', '::1', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];
    }
}
