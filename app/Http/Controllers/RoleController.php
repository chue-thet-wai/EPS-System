<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    // Display a listing of the roles
    public function index()
    {
        $roles = Role::paginate(10);  // Adjust pagination as needed
        return Inertia::render('Roles/Index', ['roles' => $roles]);
    }

    // Show the form for creating a new role
    public function create()
    {
        $permissions = Permission::all();  // Get all permissions
        return Inertia::render('Roles/Form', ['permissions' => $permissions]);
    }

    // Store a newly created role
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array',  // Ensure permissions are selected
        ]);
        log::info('permission');
        Log::info($request->permissions);

        $permissions = array_map('intval', $request->permissions);

        // Create the role
        $role = Role::create(['name' => $request->name]);

        // Assign the selected permissions to the role
        $role->syncPermissions($permissions);

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    // Show the form for editing the specified role
    public function edit(Role $role)
    {
        Log::info('Role being edited:');
        Log::info($role);
        
        // Get all permissions
        $permissions = Permission::all();  
        
        // Get the previously assigned permissions for this role
        $role->permissions->pluck('id')->toArray();  // Pluck the IDs of assigned permissions

        // Pass the role, all permissions, and the assigned permissions to the view
        return Inertia::render('Roles/Form', [
            'role' => $role,
            'permissions' => $permissions
        ]);
    }


    // Update the specified role
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'permissions' => 'required|array',  // Ensure permissions are selected
        ]);

        $permissions = array_map('intval', $request->permissions);

        // Update the role's name
        $role->update(['name' => $request->name]);

        // Sync the selected permissions with the role
        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    // Remove the specified role
    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
