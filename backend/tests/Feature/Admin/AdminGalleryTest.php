<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\ProjectSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class AdminGalleryTest extends TestCase
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
        $response = $this->getJson('/api/admin/projects');
        $response->assertStatus(401);
    }

    public function test_index_returns_paginated_submissions()
    {
        ProjectSubmission::factory()->count(20)->create();

        Sanctum::actingAs($this->admin);
        $response = $this->getJson('/api/admin/projects');
        $response->assertOk()
            ->assertJsonStructure(['data', 'current_page', 'last_page', 'total']);
    }

    public function test_index_filters_by_status()
    {
        ProjectSubmission::factory()->count(3)->pending()->create();
        ProjectSubmission::factory()->count(2)->accepted()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->getJson('/api/admin/projects?status=pending');
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    public function test_accept_changes_status_to_accepted()
    {
        $submission = ProjectSubmission::factory()->pending()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->postJson(
            "/api/admin/projects/{$submission->id}/accept",
            []
        );

        $response->assertOk()
            ->assertJsonPath('data.status', 'accepted');

        $submission->refresh();
        $this->assertEquals('accepted', $submission->status);
        $this->assertEquals($this->admin->id, $submission->reviewed_by);
    }

    public function test_accept_creates_notification()
    {
        $submission = ProjectSubmission::factory()->pending()->create();

        Sanctum::actingAs($this->admin);
        $this->postJson(
            "/api/admin/projects/{$submission->id}/accept",
            []
        );

        $this->assertDatabaseHas('notifications', [
            'tracking_id' => $submission->tracking_id,
            'type' => 'accepted',
        ]);
    }

    public function test_accept_creates_audit_log()
    {
        $submission = ProjectSubmission::factory()->pending()->create();

        Sanctum::actingAs($this->admin);
        $this->postJson(
            "/api/admin/projects/{$submission->id}/accept",
            []
        );

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'accept_project',
            'entity_type' => 'project_submission',
            'entity_id' => $submission->id,
        ]);
    }

    public function test_reject_requires_rejection_reason()
    {
        $submission = ProjectSubmission::factory()->pending()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->postJson(
            "/api/admin/projects/{$submission->id}/reject",
            []
        );

        $response->assertStatus(422)
            ->assertJsonValidationErrors('rejection_reason');
    }

    public function test_reject_changes_status_to_rejected()
    {
        $submission = ProjectSubmission::factory()->pending()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->postJson(
            "/api/admin/projects/{$submission->id}/reject",
            ['rejection_reason' => 'Deskripsi kurang detail']
        );

        $response->assertOk()
            ->assertJsonPath('data.status', 'rejected');

        $submission->refresh();
        $this->assertEquals('rejected', $submission->status);
        $this->assertEquals('Deskripsi kurang detail', $submission->rejection_reason);
    }

    public function test_reject_creates_notification()
    {
        $submission = ProjectSubmission::factory()->pending()->create();

        Sanctum::actingAs($this->admin);
        $this->postJson(
            "/api/admin/projects/{$submission->id}/reject",
            ['rejection_reason' => 'Tidak sesuai kriteria']
        );

        $this->assertDatabaseHas('notifications', [
            'tracking_id' => $submission->tracking_id,
            'type' => 'rejected',
        ]);
    }

    public function test_reject_creates_audit_log()
    {
        $submission = ProjectSubmission::factory()->pending()->create();

        Sanctum::actingAs($this->admin);
        $this->postJson(
            "/api/admin/projects/{$submission->id}/reject",
            ['rejection_reason' => 'Kurang detail']
        );

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'reject_project',
            'entity_type' => 'project_submission',
            'entity_id' => $submission->id,
        ]);
    }

    public function test_stats_returns_counts()
    {
        ProjectSubmission::factory()->count(3)->pending()->create();
        ProjectSubmission::factory()->count(2)->accepted()->create();
        ProjectSubmission::factory()->rejected()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->getJson('/api/admin/projects/stats');
        $response->assertOk()
            ->assertJsonPath('total', 6)
            ->assertJsonPath('pending', 3)
            ->assertJsonPath('accepted', 2)
            ->assertJsonPath('rejected', 1);
    }

    public function test_show_returns_single_submission()
    {
        $submission = ProjectSubmission::factory()->create();

        Sanctum::actingAs($this->admin);
        $response = $this->getJson("/api/admin/projects/{$submission->id}");
        $response->assertOk()
            ->assertJsonPath('id', $submission->id);
    }
}
