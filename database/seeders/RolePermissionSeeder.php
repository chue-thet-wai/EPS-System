<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Define permissions
        $permissions = [
            'list_roles','create_roles','edit_roles','delete_roles',
            'list_users','create_users','edit_users','delete_users',
            'list_teachers','create_teachers','edit_teachers','delete_teachers',
            'list_categories','create_categories','edit_categories','delete_categories',
            'list_courses','create_courses','edit_courses','delete_courses',
            'list_cycles','create_cycles','edit_cycles','delete_cycles',
            
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $adminRole->syncPermissions($permissions);
    }
}
