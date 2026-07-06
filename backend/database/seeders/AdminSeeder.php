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
            ['name' => 'Super Admin', 'email' => 'superadmin@fasilkom.unsri.ac.id', 'password' => env('ADMIN_1_PASS', 'SuperAdmin@123!')],
            ['name' => 'Admin Berita', 'email' => 'berita@fasilkom.unsri.ac.id', 'password' => env('ADMIN_2_PASS', 'Berita@123!')],
            ['name' => 'Admin Galeri', 'email' => 'galeri@fasilkom.unsri.ac.id', 'password' => env('ADMIN_3_PASS', 'Galeri@123!')],
            ['name' => 'Admin Artikel', 'email' => 'artikel@fasilkom.unsri.ac.id', 'password' => env('ADMIN_4_PASS', 'Artikel@123!')],
            ['name' => 'Admin Event', 'email' => 'event@fasilkom.unsri.ac.id', 'password' => env('ADMIN_5_PASS', 'Event@123!')],
            ['name' => 'Admin Teknis', 'email' => 'teknis@fasilkom.unsri.ac.id', 'password' => env('ADMIN_6_PASS', 'Teknis@123!')],
            ['name' => 'Admin Keamanan', 'email' => 'keamanan@fasilkom.unsri.ac.id', 'password' => env('ADMIN_7_PASS', 'Aman@123!')],
            ['name' => 'Admin Utama', 'email' => 'utama@fasilkom.unsri.ac.id', 'password' => env('ADMIN_8_PASS', 'Utama@123!')],
            ['name' => 'Admin Proyek', 'email' => 'proyek@fasilkom.unsri.ac.id', 'password' => env('ADMIN_9_PASS', 'Proyek@123!')],
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
