<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminNewsCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create([
            'password' => bcrypt('password'),
        ]);
    }

    public function test_index_requires_authentication()
    {
        $response = $this->getJson('/api/admin/news');
        $response->assertStatus(401);
    }

    public function test_index_requires_admin_role()
    {
        $user = User::factory()->create(['is_admin' => false]);

        Sanctum::actingAs($user);
        $response = $this->getJson('/api/admin/news');
        $response->assertStatus(403);
    }

    public function test_index_returns_paginated_news()
    {
        News::factory()->count(20)->create();

        Sanctum::actingAs($this->admin);
        $response = $this->getJson('/api/admin/news');
        $response->assertOk()
            ->assertJsonStructure(['data', 'current_page', 'last_page', 'total']);
    }

    public function test_store_creates_news()
    {
        $payload = [
            'title' => 'Berita Baru dari Admin',
            'content' => 'Konten berita baru yang cukup panjang.',
            'category' => 'Workshop',
            'date' => now()->toDateString(),
            'summary' => 'Ringkasan berita',
            'author' => 'Admin Test',
            'published' => true,
        ];

        Sanctum::actingAs($this->admin);
        $response = $this->postJson('/api/admin/news', $payload);
        $response->assertCreated()
            ->assertJsonPath('data.title', 'Berita Baru dari Admin');

        $this->assertDatabaseHas('news', ['title' => 'Berita Baru dari Admin']);
    }

    public function test_store_creates_audit_log()
    {
        $payload = [
            'title' => 'Audit Test News',
            'content' => 'Content here',
            'category' => 'Seminar',
            'date' => now()->toDateString(),
            'published' => true,
        ];

        Sanctum::actingAs($this->admin);
        $this->postJson('/api/admin/news', $payload);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'create_news',
            'entity_type' => 'news',
        ]);
    }

    public function test_store_validates_required_fields()
    {
        Sanctum::actingAs($this->admin);
        $response = $this->postJson('/api/admin/news', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'content', 'category', 'date']);
    }

    public function test_update_modifies_news()
    {
        $news = News::factory()->create();

        $payload = [
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'category' => 'Seminar',
            'date' => now()->toDateString(),
            'published' => false,
        ];

        Sanctum::actingAs($this->admin);
        $response = $this->putJson("/api/admin/news/{$news->id}", $payload);
        $response->assertOk();

        $this->assertDatabaseHas('news', [
            'id' => $news->id,
            'title' => 'Updated Title',
            'published' => false,
        ]);
    }

    public function test_update_creates_audit_log()
    {
        $news = News::factory()->create();

        Sanctum::actingAs($this->admin);
        $this->putJson("/api/admin/news/{$news->id}", [
            'title' => 'Updated',
            'content' => 'Content',
            'category' => 'Workshop',
            'date' => now()->toDateString(),
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'update_news',
            'entity_type' => 'news',
            'entity_id' => $news->id,
        ]);
    }

    public function test_destroy_deletes_news()
    {
        $news = News::factory()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->deleteJson("/api/admin/news/{$news->id}");
        $response->assertOk();

        $this->assertDatabaseMissing('news', ['id' => $news->id]);
    }

    public function test_destroy_creates_audit_log()
    {
        $news = News::factory()->create();

        Sanctum::actingAs($this->admin);
        $this->deleteJson("/api/admin/news/{$news->id}");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'delete_news',
            'entity_type' => 'news',
            'entity_id' => $news->id,
        ]);
    }

    public function test_show_returns_single_news()
    {
        $news = News::factory()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->getJson("/api/admin/news/{$news->id}");
        $response->assertOk()
            ->assertJsonPath('id', $news->id);
    }

    public function test_stats_returns_counts()
    {
        News::factory()->count(3)->create(['published' => true]);
        News::factory()->count(2)->create(['published' => false]);

        Sanctum::actingAs($this->admin);
        $response = $this->getJson('/api/admin/news/stats');
        $response->assertOk()
            ->assertJsonPath('total', 5)
            ->assertJsonPath('published', 3)
            ->assertJsonPath('draft', 2);
    }
}
