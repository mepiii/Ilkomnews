<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\ProjectSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class NotificationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_notifications_scoped_to_a_tracking_id(): void
    {
        $tracked = ProjectSubmission::factory()->create(['tracking_id' => 'ABC123TRACK']);
        $other = ProjectSubmission::factory()->create(['tracking_id' => 'XYZ999OTHER']);

        Notification::factory()->for($tracked, 'project')->create(['tracking_id' => 'ABC123TRACK']);
        Notification::factory()->for($other, 'project')->create(['tracking_id' => 'XYZ999OTHER']);

        $response = $this->getJson('/api/notifications/ABC123TRACK');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.tracking_id', 'ABC123TRACK');
    }

    public function test_it_returns_an_empty_list_when_no_notifications_exist(): void
    {
        $this->getJson('/api/notifications/NOPE123')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_it_marks_a_public_notification_read_within_its_tracking_id(): void
    {
        $sub = ProjectSubmission::factory()->create(['tracking_id' => 'TRKREAD']);
        $notif = Notification::factory()->for($sub, 'project')->create([
            'tracking_id' => 'TRKREAD',
            'read' => false,
        ]);

        $this->postJson("/api/notifications/TRKREAD/{$notif->id}/read")
            ->assertOk()
            ->assertJsonPath('message', 'Notification marked as read');

        $this->assertTrue($notif->fresh()->read);
        $this->assertFalse(Cache::has("public-notifications:TRKREAD"));
    }

    public function test_it_includes_the_rejection_reason_for_rejected_notifications(): void
    {
        $sub = ProjectSubmission::factory()->create([
            'tracking_id' => 'TRKREJECT',
            'status' => 'rejected',
            'rejection_reason' => 'Deskripsi kurang lengkap',
        ]);
        Notification::factory()->for($sub, 'project')->create([
            'tracking_id' => 'TRKREJECT',
            'type' => 'rejected',
        ]);

        $this->getJson('/api/notifications/TRKREJECT')
            ->assertOk()
            ->assertJsonPath('data.0.rejection_reason', 'Deskripsi kurang lengkap');
    }
}
