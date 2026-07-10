<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * IlkomAdminSeeder
 * ----------------
 * Append-only seeder for the ILKOM News default admin account(s).
 *
 * SHARED-API SAFE: unlike the legacy AdminSeeder (which DELETES any admin not
 * in its canonical list), this seeder ONLY creates/updates its own accounts and
 * never touches SAPA / BEM admins. Use this one when seeding inside the shared
 * `/home/pina/api` codebase so existing admins are preserved.
 *
 * Passwords come from .env (never hardcoded secrets). Change after first login.
 */
class IlkomAdminSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'name'     => 'ILKOM Admin',
                'email'    => env('ILKOM_ADMIN_EMAIL', 'admin@ilkomnews.bemfasilkomunsri.org'),
                'password' => env('ILKOM_ADMIN_PASSWORD', 'IlkomAdmin#2026'),
            ],
        ];

        foreach ($admins as $admin) {
            $user = User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name'              => $admin['name'],
                    'password'          => Hash::make($admin['password']),
                    'email_verified_at' => now(),
                ]
            );

            // Guarantee admin privilege regardless of $fillable state.
            $user->forceFill(['is_admin' => true])->save();
        }

        // NOTE: intentionally NO delete()/whereNotIn cleanup here — this seeder
        // is append-only so it can run safely against the shared BEM/SAPA API.
        if ($this->command) {
            $this->command->info('ILKOM admin account(s) created/updated (append-only, no deletions).');
        }
    }
}
