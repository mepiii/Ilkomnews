<?php

namespace Tests\Feature\Admin;

use App\Models\News;
use App\Models\ProjectSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HealthEndpointTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
    }

    public function test_dashboard_returns_200_with_stats()
    {
        News::factory()->count(5)->create(['published' => true]);
        News::factory()->count(2)->create(['published' => false]);
        ProjectSubmission::factory()->count(3)->pending()->create();
        ProjectSubmission::factory()->accepted()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->getJson('/api/admin/dashboard');
        $response->assertOk()
            ->assertJsonStructure([
                'stats' => [
                    'total_news',
                    'published_news',
                    'draft_news',
                    'total_views',
                    'total_projects',
                    'pending_projects',
                    'accepted_projects',
                    'rejected_projects',
                ],
                'recent_news',
                'recent_projects',
            ]);
    }

    public function test_dashboard_requires_authentication()
    {
        $response = $this->getJson('/api/admin/dashboard');
        $response->assertStatus(401);
    }

    public function test_dashboard_requires_admin_role()
    {
        $user = User::factory()->create(['is_admin' => false]);

        Sanctum::actingAs($user);
        $response = $this->getJson('/api/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_dashboard_stats_are_accurate()
    {
        News::factory()->count(4)->create(['published' => true, 'views' => 100]);
        News::factory()->create(['published' => false, 'views' => 0]);
        ProjectSubmission::factory()->count(2)->pending()->create();
        ProjectSubmission::factory()->count(3)->accepted()->create();
        ProjectSubmission::factory()->rejected()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->getJson('/api/admin/dashboard');
        $response->assertOk()
            ->assertJsonPath('stats.total_news', 5)
            ->assertJsonPath('stats.published_news', 4)
            ->assertJsonPath('stats.draft_news', 1)
            ->assertJsonPath('stats.total_views', 400)
            ->assertJsonPath('stats.total_projects', 6)
            ->assertJsonPath('stats.pending_projects', 2)
            ->assertJsonPath('stats.accepted_projects', 3)
            ->assertJsonPath('stats.rejected_projects', 1);
    }
}
