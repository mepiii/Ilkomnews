<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_with_valid_credentials_returns_user()
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
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'is_admin']]);
    }

    public function test_login_with_invalid_password_returns_422()
    {
        User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);
    }

    public function test_login_with_non_admin_user_returns_422()
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

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Access denied. Admin privileges required.');
    }

    public function test_account_lockout_after_five_failed_attempts()
    {
        User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        RateLimiter::clear('login_throttle:admin@test.com:127.0.0.1');

        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/admin/login', [
                'email' => 'admin@test.com',
                'password' => 'wrong-password-' . $i,
            ]);
            $this->assertEquals(422, $response->status());
        }

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'wrong-password-final',
        ]);
        $response->assertStatus(422)
            ->assertJsonPath('message', fn ($msg) => str_contains($msg, 'locked'));
    }

    public function test_logout_succeeds()
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        // Login via session (stateful)
        $this->actingAs($admin);
        $this->session(['_token' => 'test-token']);

        $response = $this->postJson('/api/admin/logout');
        $response->assertOk();
    }

    public function test_user_endpoint_returns_authenticated_admin()
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        // Use actingAs for session auth in tests
        $this->actingAs($admin);

        $response = $this->getJson('/api/admin/user');
        $response->assertOk()
            ->assertJsonPath('email', 'admin@test.com');
    }

    public function test_user_endpoint_returns_401_without_session()
    {
        $response = $this->getJson('/api/admin/user');
        $response->assertStatus(401);
    }

    public function test_login_validation_requires_email_and_password()
    {
        $response = $this->postJson('/api/admin/login', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
