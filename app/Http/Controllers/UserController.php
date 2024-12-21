<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role; // Import Spatie Role model

class UserController extends Controller
{
 
    public function index()
    {
        $users = User::with('roles')->paginate(10);

        foreach ($users as $user) {
            $user->role = $user->roles->first()->name ?? null; 
        }
        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }


    public function create()
    {
        return Inertia::render('Users/Form', [
            'roles' => $this->getAvailableRoles(), 
        ]);
    }

    public function store(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:5|confirmed', // Ensure password confirmation
            'role' => 'required|string|in:' . implode(',', $this->getAvailableRoles()),
        ]);

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password
            'created_by' => auth()->id(),
        ]);

        // Sync the selected role
        $user->syncRoles([$request->role]); // Sync the selected role

        return redirect()->route('users.index')->with('success', 'User created successfully!');
    }

    public function edit(User $user)
    {
        $user->load('roles');
        $user->role = $user->roles->first()->name ?? null; 
        return Inertia::render('Users/Form', [
            'user' => $user,
            'roles' => $this->getAvailableRoles(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Validate incoming data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:5|confirmed', // Password is optional
            'role' => 'required|string|in:' . implode(',', $this->getAvailableRoles()),
        ]);

        // Update the user details
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'updated_by' => auth()->id(),
        ]);

        // Update password if provided
        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password), // Hash the new password
            ]);
        }

        // Sync the selected role
        $user->syncRoles([$request->role]); // Sync the role with the user

        return redirect()->route('users.index')->with('success', 'User updated successfully!');
    }

    public function destroy(User $user)
    {
        // Soft delete or permanently delete the user
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully!');
    }

    /**
     * Get the list of available roles.
     *
     * @return array
     */
    private function getAvailableRoles()
    {
        // Retrieve all available roles from Spatie's Role model
        return Role::all()->pluck('name')->toArray(); // Fetch roles dynamically from the database
    }
}
