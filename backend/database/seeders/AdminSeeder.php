<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            ['name' => 'Admin PTI 1', 'email' => 'admin@pti.fasilkom.unsri.ac.id', 'password' => env('ADMIN_PTI_1_PASS', 'AdminPti01!')],
            ['name' => 'Admin PTI 2', 'email' => 'admin2@pti.fasilkom.unsri.ac.id', 'password' => env('ADMIN_PTI_2_PASS', 'AdminPti02!')],
            ['name' => 'Admin 1', 'email' => 'admin1@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_1_PASS', 'AdminAkademik01!')],
            ['name' => 'Admin 2', 'email' => 'admin2@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_2_PASS', 'AdminAkademik02!')],
            ['name' => 'Admin 3', 'email' => 'admin3@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_3_PASS', 'AdminAkademik03!')],
            ['name' => 'Admin 4', 'email' => 'admin4@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_4_PASS', 'AdminAkademik04!')],
            ['name' => 'Admin 5', 'email' => 'admin5@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_5_PASS', 'AdminAkademik05!')],
            ['name' => 'Admin 6', 'email' => 'admin6@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_6_PASS', 'AdminAkademik06!')],
            ['name' => 'Admin 7', 'email' => 'admin7@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_7_PASS', 'AdminAkademik07!')],
            ['name' => 'Admin 8', 'email' => 'admin8@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_8_PASS', 'AdminAkademik08!')],
            ['name' => 'Admin 9', 'email' => 'admin9@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_9_PASS', 'AdminAkademik09!')],
            ['name' => 'Admin 10', 'email' => 'admin10@akademik.fasilkom.unsri.ac.id', 'password' => env('ADMIN_AKADEMIK_10_PASS', 'AdminAkademik10!')],
        ];

        // Reset: remove any admin accounts no longer in the canonical list.
        // ponytail: keep the admin seeded by DatabaseSeeder so it isn't wiped
        // by the whereNotIn cleanup below.
        $keepEmails = collect($admins)->pluck('email')
            ->push('admin@fasilkom.unsri.ac.id');
        User::where('is_admin', true)->whereNotIn('email', $keepEmails)->delete();

        foreach ($admins as $admin) {
            $user = User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make($admin['password']),
                    'email_verified_at' => now(),
                ]
            );

            // Ensure admin privilege persists regardless of $fillable state.
            $user->forceFill(['is_admin' => true])->save();
        }

        $this->command->info('12 admin accounts created/updated successfully.');
    }
}
