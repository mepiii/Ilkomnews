<?php

namespace Tests\Feature\Api;

use App\Models\ProjectSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectSubmissionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_submission_with_tracking_id()
    {
        $payload = [
            'title' => 'My Cool Project',
            'category' => 'web',
            'description' => 'A web project description with enough detail.',
            'creator_name' => 'Andi Pratama',
            'creator_nim' => '09031282306001',
            'creator_nidn' => '0008123456',
            'creator_jabatan' => 'Dosen Pengajar',
            'creator_major' => 'S1 Teknik Informatika',
            'creator_year' => 2023,
            'tech_stack' => ['React', 'Laravel'],
        ];

        $response = $this->postJson('/api/submissions', $payload);
        $response->assertCreated()
            ->assertJsonStructure(['message', 'tracking_id', 'status']);

        $this->assertDatabaseHas('project_submissions', ['title' => 'My Cool Project']);
    }

    public function test_store_validates_required_fields()
    {
        $response = $this->postJson('/api/submissions', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'category', 'description', 'creator_name']);
    }

    public function test_track_returns_submission_status()
    {
        $submission = ProjectSubmission::factory()->pending()->create();

        $response = $this->getJson("/api/submissions/track/{$submission->tracking_id}");
        $response->assertOk()
            ->assertJsonPath('tracking_id', $submission->tracking_id)
            ->assertJsonPath('status', 'pending');
    }

    public function test_track_returns_404_for_unknown_tracking_id()
    {
        $response = $this->getJson('/api/submissions/track/NONEXISTENT123');
        $response->assertNotFound();
    }

    public function test_public_index_returns_accepted_projects_only()
    {
        ProjectSubmission::factory()->count(3)->accepted()->create();
        ProjectSubmission::factory()->count(2)->pending()->create();
        ProjectSubmission::factory()->rejected()->create();

        $response = $this->getJson('/api/projects');
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    public function test_public_show_returns_404_for_non_accepted()
    {
        $pending = ProjectSubmission::factory()->pending()->create();
        $rejected = ProjectSubmission::factory()->rejected()->create();

        $this->getJson("/api/projects/{$pending->id}")->assertNotFound();
        $this->getJson("/api/projects/{$rejected->id}")->assertNotFound();
    }

    public function test_public_show_returns_accepted_project()
    {
        $project = ProjectSubmission::factory()->accepted()->create();

        $response = $this->getJson("/api/projects/{$project->id}");
        $response->assertOk()
            ->assertJsonPath('id', $project->id);
    }

    public function test_public_index_filters_by_category()
    {
        ProjectSubmission::factory()->count(2)->accepted()->create(['category' => 'web']);
        ProjectSubmission::factory()->accepted()->create(['category' => 'mobile']);

        $response = $this->getJson('/api/projects?category=web');
        $response->assertOk();
        $this->assertCount(2, $response->json('data'));
    }
}
