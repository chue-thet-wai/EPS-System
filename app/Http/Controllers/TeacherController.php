<?php
namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class TeacherController extends Controller
{
 
    public function index()
    {
        $teachers = Teacher::with('roles')->paginate(10);

        foreach ($teachers as $teacher) {
            $teacher->role = $teacher->roles->first()->name ?? null; 
        }
        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers,
        ]);
    }


    public function create()
    {
        return Inertia::render('Teachers/Form', [
            'roles' => $this->getAvailableRoles(), 
        ]);
    }

    public function store(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:teachers,email',
            'password' => 'required|string|min:5|confirmed', // Ensure password confirmation
            'role' => 'required|string|in:' . implode(',', $this->getAvailableRoles()),
        ]);

        // Create the teacher
        $teacher = Teacher::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password
            'created_by' => auth()->id(),
        ]);

        // Sync the selected role
        $teacher->syncRoles([$request->role]); // Sync the selected role

        return redirect()->route('teachers.index')->with('success', 'Teacher created successfully!');
    }

    public function edit(Teacher $teacher)
    {
        $teacher->load('roles');
        $teacher->role = $teacher->roles->first()->name ?? null; 
        return Inertia::render('Teachers/Form', [
            'teacher' => $teacher,
            'roles' => $this->getAvailableRoles(),
        ]);
    }

    public function update(Request $request, Teacher $teacher)
    {
        // Validate incoming data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:teachers,email,' . $teacher->id,
            'password' => 'nullable|string|min:5|confirmed', // Password is optional
            'role' => 'required|string|in:' . implode(',', $this->getAvailableRoles()),
        ]);

        // Update the teacher details
        $teacher->update([
            'name' => $request->name,
            'email' => $request->email,
            'updated_by' => auth()->id(),
        ]);

        // Update password if provided
        if ($request->filled('password')) {
            $teacher->update([
                'password' => Hash::make($request->password), // Hash the new password
            ]);
        }

        // Sync the selected role
        $teacher->syncRoles([$request->role]); // Sync the role with the teacher

        return redirect()->route('teachers.index')->with('success', 'Teacher updated successfully!');
    }

    public function destroy(Teacher $teacher)
    {
        // Soft delete or permanently delete the teacher
        $teacher->delete();
        return redirect()->route('teachers.index')->with('success', 'Teacher deleted successfully!');
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
