<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FileUploadTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        Storage::fake('public');
    }

    public function test_valid_jpeg_upload_succeeds()
    {
        $file = $this->createFakeImageFile('photo.jpg', 'jpg');

        Sanctum::actingAs($this->admin);
        $response = $this->post('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['path', 'url', 'filename', 'size']);
    }

    public function test_php_file_upload_is_rejected()
    {
        $file = UploadedFile::fake()->create('shell.php', 100, 'application/x-php');

        Sanctum::actingAs($this->admin);
        $response = $this->post('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422);
    }

    public function test_text_file_upload_is_rejected()
    {
        $file = UploadedFile::fake()->create('document.txt', 100, 'text/plain');

        Sanctum::actingAs($this->admin);
        $response = $this->post('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422);
    }

    public function test_oversized_file_is_rejected()
    {
        // Create a fake image that's larger than 10 MB (10 * 1024 * 1024 bytes)
        $file = $this->createFakeImageFile('huge.jpg', 'jpg', 11 * 1024 * 1024);

        Sanctum::actingAs($this->admin);
        $response = $this->post('/api/admin/upload', [
            'file' => $file,
        ]);

        // Will be rejected either by validation (max file) or by the controller's size check
        $this->assertTrue(in_array($response->status(), [422, 413]));
    }

    public function test_double_extension_with_php_is_rejected()
    {
        $file = $this->createFakeImageFile('shell.php.jpg', 'jpg');

        Sanctum::actingAs($this->admin);
        $response = $this->post('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422);
    }

    public function test_upload_requires_authentication()
    {
        $file = $this->createFakeImageFile('photo.jpg', 'jpg');

        $response = $this->postJson('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(401);
    }

    public function test_upload_requires_admin_role()
    {
        $user = User::factory()->create(['is_admin' => false]);

        $file = $this->createFakeImageFile('photo.jpg', 'jpg');

        Sanctum::actingAs($user);
        $response = $this->post('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(403);
    }

    public function test_upload_requires_file_field()
    {
        Sanctum::actingAs($this->admin);
        $response = $this->postJson('/api/admin/upload', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors('file');
    }

    public function test_uploaded_file_is_stored_with_random_name()
    {
        $file = $this->createFakeImageFile('original-name.jpg', 'jpg');

        Sanctum::actingAs($this->admin);
        $response = $this->post('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertCreated();
        $filename = $response->json('filename');

        // Filename should be a 32-char random string + .jpg
        $this->assertMatchesRegularExpression('/^[a-zA-Z0-9]{32}\.jpg$/', $filename);
    }

    /**
     * Helper to create a fake image file without requiring GD extension.
     *
     * @param string $name
     * @param string $type jpg|png|webp
     * @param int $size File size in bytes
     * @return UploadedFile
     */
    private function createFakeImageFile(string $name, string $type, int $size = 1024): UploadedFile
    {
        // Magic bytes for different image formats
        $magicBytes = [
            'jpg' => "\xFF\xD8\xFF",
            'png' => "\x89PNG\r\n\x1a\n",
            'webp' => "RIFF",
        ];

        $content = ($magicBytes[$type] ?? '') . str_repeat('x', $size);

        $tempFile = tempnam(sys_get_temp_dir(), 'fake');
        file_put_contents($tempFile, $content);

        return new UploadedFile($tempFile, $name, null, null, true);
    }
}
