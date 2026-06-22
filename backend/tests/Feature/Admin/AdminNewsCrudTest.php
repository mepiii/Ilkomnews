<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminNewsCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create([
            'password' => bcrypt('password'),
        ]);
        $this->token = $this->admin->createToken('admin-token')->plainTextToken;
    }

    private function authHeaders(): array
    {
        return ['Authorization' => "Bearer {$this->token}"];
    }

    public function test_index_requires_authentication()
    {
        $response = $this->getJson('/api/admin/news');
        $response->assertStatus(401);
    }

    public function test_index_requires_admin_role()
    {
        $user = User::factory()->create(['is_admin' => false]);
        $token = $user->createToken('user-token')->plainTextToken;

        $response = $this->getJson('/api/admin/news', [
            'Authorization' => "Bearer {$token}",
        ]);
        $response->assertStatus(403);
    }

    public function test_index_returns_paginated_news()
    {
        News::factory()->count(20)->create();

        $response = $this->getJson('/api/admin/news', $this->authHeaders());
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

        $response = $this->postJson('/api/admin/news', $payload, $this->authHeaders());
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

        $this->postJson('/api/admin/news', $payload, $this->authHeaders());

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'create_news',
            'entity_type' => 'news',
        ]);
    }

    public function test_store_validates_required_fields()
    {
        $response = $this->postJson('/api/admin/news', [], $this->authHeaders());
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

        $response = $this->putJson("/api/admin/news/{$news->id}", $payload, $this->authHeaders());
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

        $this->putJson("/api/admin/news/{$news->id}", [
            'title' => 'Updated',
            'content' => 'Content',
            'category' => 'Workshop',
            'date' => now()->toDateString(),
        ], $this->authHeaders());

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

        $response = $this->deleteJson("/api/admin/news/{$news->id}", [], $this->authHeaders());
        $response->assertOk();

        $this->assertDatabaseMissing('news', ['id' => $news->id]);
    }

    public function test_destroy_creates_audit_log()
    {
        $news = News::factory()->create();

        $this->deleteJson("/api/admin/news/{$news->id}", [], $this->authHeaders());

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

        $response = $this->getJson("/api/admin/news/{$news->id}", $this->authHeaders());
        $response->assertOk()
            ->assertJsonPath('id', $news->id);
    }

    public function test_stats_returns_counts()
    {
        News::factory()->count(3)->create(['published' => true]);
        News::factory()->count(2)->create(['published' => false]);

        $response = $this->getJson('/api/admin/news/stats', $this->authHeaders());
        $response->assertOk()
            ->assertJsonPath('total', 5)
            ->assertJsonPath('published', 3)
            ->assertJsonPath('draft', 2);
    }
}
