<?php

namespace Tests\Feature\Api;

use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_returns_xml()
    {
        $response = $this->get('/sitemap.xml');

        $response->assertOk()
            ->assertHeader('Content-Type', 'application/xml');
    }

    public function test_sitemap_contains_static_pages()
    {
        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        $this->assertStringContainsString('/news', $content);
        $this->assertStringContainsString('/events', $content);
        $this->assertStringContainsString('/gallery', $content);
        $this->assertStringContainsString('/submit', $content);
    }

    public function test_sitemap_contains_published_news()
    {
        $news = News::factory()->create([
            'published' => true,
            'slug' => 'test-news-slug',
        ]);

        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        $this->assertStringContainsString($news->slug, $content);
    }
}
