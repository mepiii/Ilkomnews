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
            ['name' => 'Admin 1', 'email' => 'admin1@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_1_PASS', 'AdminSapa01!')],
            ['name' => 'Admin 2', 'email' => 'admin2@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_2_PASS', 'AdminSapa02!')],
            ['name' => 'Admin 3', 'email' => 'admin3@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_3_PASS', 'AdminSapa03!')],
            ['name' => 'Admin 4', 'email' => 'admin4@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_4_PASS', 'AdminSapa04!')],
            ['name' => 'Admin 5', 'email' => 'admin5@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_5_PASS', 'AdminSapa05!')],
            ['name' => 'Admin 6', 'email' => 'admin6@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_6_PASS', 'AdminSapa06!')],
            ['name' => 'Admin 7', 'email' => 'admin7@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_7_PASS', 'AdminSapa07!')],
            ['name' => 'Admin 8', 'email' => 'admin8@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_8_PASS', 'AdminSapa08!')],
            ['name' => 'Admin 9', 'email' => 'admin9@sapa.fasilkom.unsri.ac.id', 'password' => env('ADMIN_9_PASS', 'AdminSapa09!')],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make($admin['password']),
                    'is_admin' => true,
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('9 admin accounts created/updated successfully.');
    }
}
