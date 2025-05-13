<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@email.com'], 
            [
                'name' => 'Admin User',
                'password' => bcrypt('admin123'), 
            ]
        );

        $admin->assignRole($adminRole);
    }
}
