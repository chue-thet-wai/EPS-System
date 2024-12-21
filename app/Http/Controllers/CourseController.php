<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::paginate(1); 
        return Inertia::render('Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        return Inertia::render('Courses/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'description'     => 'required|string|max:255',
            'abstract'        => 'nullable|string',
            'bibliography'    => 'nullable|string'
        ]);
        Course::create([
            'description'  => $request->description,
            'abstract'     => $request->abstract,
            'bibliography' => $request->bibliography,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('courses.index')->with('success', 'Course created successfully!');
    }

    public function edit(Course $course)
    {
        return Inertia::render('Courses/Form', [
            'course' => $course,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'abstract'        => 'nullable|string',
            'bibliography'    => 'nullable|string'
        ]);
        $course->update([
            'description'  => $request->description,
            'abstract'     => $request->abstract,
            'bibliography' => $request->bibliography,
            'updated_by'   => auth()->id(),
        ]);

        return redirect()->route('courses.index')->with('success', 'Course updated successfully!');
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return redirect()->route('courses.index')->with('success', 'Course deleted successfully!');
    }
}
