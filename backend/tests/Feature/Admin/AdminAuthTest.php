<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_with_valid_credentials_returns_token()
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_login_with_invalid_password_returns_401()
    {
        User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJsonStructure(['message', 'attempts_remaining']);
    }

    public function test_login_with_non_admin_user_returns_403()
    {
        User::factory()->create([
            'email' => 'user@test.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => 'user@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Access denied');
    }

    public function test_account_lockout_after_five_failed_attempts()
    {
        User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        // Clear rate limits for test
        RateLimiter::clear('login_throttle:admin@test.com:127.0.0.1');

        // 5 failed attempts
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/admin/login', [
                'email' => 'admin@test.com',
                'password' => 'wrong-password-' . $i,
            ]);
            $this->assertEquals(401, $response->status());
        }

        // 6th attempt should be locked (429)
        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'wrong-password-final',
        ]);
        $response->assertStatus(429)
            ->assertJsonPath('locked', true);
    }

    public function test_logout_with_valid_token_succeeds()
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $token = $admin->createToken('admin-token')->plainTextToken;

        $response = $this->postJson('/api/admin/logout', [], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Logged out');

        // Token should be deleted
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $admin->id,
            'name' => 'admin-token',
        ]);
    }

    public function test_logout_without_token_returns_401()
    {
        $response = $this->postJson('/api/admin/logout');
        $response->assertStatus(401);
    }

    public function test_login_validation_requires_email_and_password()
    {
        $response = $this->postJson('/api/admin/login', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_user_endpoint_returns_authenticated_admin()
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $token = $admin->createToken('admin-token')->plainTextToken;

        $response = $this->getJson('/api/admin/user', [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertOk()
            ->assertJsonPath('email', 'admin@test.com');
    }
}
