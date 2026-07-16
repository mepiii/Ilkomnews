<?php

namespace Tests\Feature;

use App\Http\Controllers\Admin\DashboardController;
use App\Models\News;
use App\Models\ProjectSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    private function dashboardStats(): array
    {
        // Drive the action directly to isolate stats logic from the admin
        // auth/CSRF middleware guarding the /api/admin/dashboard route.
        return app(DashboardController::class)->apiStats()->getData(true);
    }

    public function test_it_returns_a_zeroed_envelope_on_an_empty_database(): void
    {
        $response = $this->dashboardStats();

        $this->assertArrayHasKey('stats', $response);
        $this->assertArrayHasKey('recent_news', $response);
        $this->assertArrayHasKey('recent_projects', $response);
        $this->assertSame(0, $response['stats']['total_news']);
        $this->assertSame(0, $response['stats']['total_projects']);
        $this->assertEmpty($response['recent_news']);
    }

    public function test_it_computes_stats_from_seeded_data(): void
    {
        News::factory()->count(2)->create(['published' => true]);
        News::factory()->count(1)->create(['published' => false]);
        ProjectSubmission::factory()->accepted()->create();
        ProjectSubmission::factory()->pending()->create();
        ProjectSubmission::factory()->rejected()->create();

        $response = $this->dashboardStats();

        $this->assertSame(3, $response['stats']['total_news']);
        $this->assertSame(2, $response['stats']['published_news']);
        $this->assertSame(1, $response['stats']['draft_news']);
        $this->assertSame(3, $response['stats']['total_projects']);
        $this->assertSame(1, $response['stats']['accepted_projects']);
        $this->assertSame(1, $response['stats']['pending_projects']);
        $this->assertSame(1, $response['stats']['rejected_projects']);
    }
}
