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
            ['name' => 'Admin', 'email' => 'admin.a1@ilkom.id', 'password' => Hash::make('Adm!n#A1x9kQ')],
            ['name' => 'Admin', 'email' => 'admin.b2@ilkom.id', 'password' => Hash::make('Adm!n#B2pL3z')],
            ['name' => 'Admin', 'email' => 'admin.c3@ilkom.id', 'password' => Hash::make('Adm!n#C3mR7w')],
            ['name' => 'Admin', 'email' => 'admin.d4@ilkom.id', 'password' => Hash::make('Adm!n#D4nK8v')],
            ['name' => 'Admin', 'email' => 'admin.e5@ilkom.id', 'password' => Hash::make('Adm!n#E5qJ6u')],
            ['name' => 'Admin', 'email' => 'admin.f6@ilkom.id', 'password' => Hash::make('Adm!n#F6tH4s')],
            ['name' => 'Admin', 'email' => 'admin.g7@ilkom.id', 'password' => Hash::make('Adm!n#G7yN2p')],
            ['name' => 'Admin', 'email' => 'admin.h8@ilkom.id', 'password' => Hash::make('Adm!n#H8bW5m')],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                array_merge($admin, ['is_admin' => true])
            );
        }
    }
}
