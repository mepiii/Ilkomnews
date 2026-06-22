<?php

namespace Tests\Feature\Security;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_response_includes_x_content_type_options()
    {
        $response = $this->getJson('/api/news');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    public function test_response_includes_x_frame_options()
    {
        $response = $this->getJson('/api/news');
        $response->assertHeader('X-Frame-Options', 'DENY');
    }

    public function test_response_includes_strict_transport_security()
    {
        $response = $this->getJson('/api/news');
        $response->assertHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    public function test_response_includes_content_security_policy()
    {
        $response = $this->getJson('/api/news');
        $response->assertHeader('Content-Security-Policy');
        $csp = $response->headers->get('Content-Security-Policy');
        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString("frame-src 'none'", $csp);
    }

    public function test_response_includes_referrer_policy()
    {
        $response = $this->getJson('/api/news');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_response_includes_permissions_policy()
    {
        $response = $this->getJson('/api/news');
        $response->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    }

    public function test_error_responses_also_include_security_headers()
    {
        $response = $this->getJson('/api/nonexistent-route');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
    }

    public function test_xss_protection_header_is_set()
    {
        $response = $this->getJson('/api/news');
        $response->assertHeader('X-XSS-Protection', '1; mode=block');
    }
}
