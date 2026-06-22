<?php

namespace Tests\Feature\Api;

use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_published_news()
    {
        News::factory()->count(15)->create(['published' => true]);
        News::factory()->count(3)->create(['published' => false]);

        $response = $this->getJson('/api/news');
        $response->assertOk()
            ->assertJsonStructure(['data', 'current_page', 'last_page', 'total']);
    }

    public function test_latest_returns_published_news_only()
    {
        News::factory()->count(5)->create(['published' => true]);
        News::factory()->create(['published' => false]);

        $response = $this->getJson('/api/news/latest');
        $response->assertOk()
            ->assertJsonCount(5);
    }

    public function test_categories_returns_unique_categories()
    {
        News::factory()->create(['category' => 'Teknologi', 'published' => true]);
        News::factory()->create(['category' => 'Teknologi', 'published' => true]);
        News::factory()->create(['category' => 'Akademik', 'published' => true]);

        $response = $this->getJson('/api/news/categories');
        $response->assertOk()
            ->assertJsonCount(2);
    }

    public function test_show_returns_single_news_and_increments_views()
    {
        $news = News::factory()->create(['published' => true, 'views' => 0]);

        $response = $this->getJson("/api/news/{$news->id}");
        $response->assertOk()
            ->assertJsonPath('id', $news->id);

        $news->refresh();
        $this->assertEquals(1, $news->views);
    }

    public function test_show_returns_404_for_unpublished()
    {
        $news = News::factory()->create(['published' => false]);

        $response = $this->getJson("/api/news/{$news->id}");
        $response->assertNotFound();
    }

    public function test_search_filters_by_term()
    {
        News::factory()->create(['title' => 'Laravel Framework Update', 'published' => true]);
        News::factory()->create(['title' => 'Python Tutorial', 'published' => true]);

        $response = $this->getJson('/api/news?search=Laravel');
        $response->assertOk();
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertStringContainsString('Laravel', $data[0]['title']);
    }

    public function test_category_filter()
    {
        News::factory()->count(3)->create(['category' => 'Teknologi', 'published' => true]);
        News::factory()->count(2)->create(['category' => 'Akademik', 'published' => true]);

        $response = $this->getJson('/api/news?category=Teknologi');
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }
}
