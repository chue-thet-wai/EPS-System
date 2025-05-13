<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            ['name' => 'View Categories', 'route' => 'categories.index'],
            ['name' => 'Create Categories', 'route' => 'categories.create'],
            ['name' => 'Edit Categories', 'route' => 'categories.edit'],
            ['name' => 'Delete Categories', 'route' => 'categories.destroy'],

            ['name' => 'View Roles', 'route' => 'roles.index'],
            ['name' => 'Create Roles', 'route' => 'roles.create'],
            ['name' => 'Edit Roles', 'route' => 'roles.edit'],
            ['name' => 'Delete Roles', 'route' => 'roles.destroy'],

            ['name' => 'View Users', 'route' => 'users.index'],
            ['name' => 'Create Users', 'route' => 'users.create'],
            ['name' => 'Edit Users', 'route' => 'users.edit'],
            ['name' => 'Delete Users', 'route' => 'users.destroy'],

            ['name' => 'View Services', 'route' => 'services.index'],
            ['name' => 'Create Services', 'route' => 'services.create'], 
            ['name' => 'Edit Services', 'route' => 'services.edit'],
            ['name' => 'Delete Services', 'route' => 'services.destroy'],

            ['name' => 'View Customers', 'route' => 'customers.index'],
            ['name' => 'Create Customers', 'route' => 'customers.create'], 
            ['name' => 'Edit Customers', 'route' => 'customers.edit'],
            ['name' => 'Delete Customers', 'route' => 'customers.destroy'],
            ['name' => 'Export Customers', 'route' => 'customers.export'],

            ['name' => 'View Customer Services', 'route' => 'customer-services.index'],
            ['name' => 'Create Customer Services', 'route' => 'customer-services.create'], 
            ['name' => 'Edit Customer Services', 'route' => 'customer-services.edit'],
            ['name' => 'Delete Customer Services', 'route' => 'customer-services.destroy'],
            ['name' => 'Export Customer Services', 'route' => 'customer-services.export'],

        ];

        // Creating permissions if they don't already exist
        foreach ($permissions as $perm) {
            Permission::firstOrCreate([
                'name' => $perm['name'],
                'guard_name' => 'web',
            ])->update(['route' => $perm['route']]);
        }

        // Assign specific permissions to the agent role
        $adminPermissions = [
            'View Categories', 'Create Categories', 'Edit Categories', 'Delete Categories',
            'View Roles', 'Create Roles', 'Edit Roles', 'Delete Roles',
            'View Users', 'Create Users', 'Edit Users', 'Delete Users',
        ];
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $adminRole->syncPermissions($adminPermissions);

        // Assign specific permissions to the agent role
        $agentPermissions = [
            'View Services', 'Create Services', 'Edit Services', 'Delete Services',  
            'View Categories', 'Create Categories', 'Edit Categories', 'Delete Categories',
            'View Customers', 'Create Customers', 'Edit Customers', 'Delete Customers','Export Customers',
            'View Customer Services', 'Create Customer Services', 'Edit Customer Services', 'Delete Customer Services','Export Customer Services',
        ];
        $agentRole = Role::firstOrCreate(['name' => 'Agent']);
        $agentRole->syncPermissions($agentPermissions);

        //Create customer role
        $customerRole = Role::firstOrCreate(['name' => 'Customer']);
    }
}
