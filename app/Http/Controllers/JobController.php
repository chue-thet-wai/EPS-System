<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index()
    {
        $jobs = Job::paginate(config('common.paginate_per_page'));

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'types' => config('common.job_types'),
            'pageTitle' => 'Jobs'
        ]);
    }

    public function create()
    {
        return Inertia::render('Jobs/Form', [
            'pageTitle' => 'Create Job',
            'types' => config('common.job_types'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type'  => 'required|string',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'salary' => 'nullable|string',
        ]);

        Job::create([
            'title' => $request->title,
            'type'  => $request->type,
            'description' => $request->description,
            'location' => $request->location,
            'salary' => $request->salary,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('jobs.index')->with('success', 'Job created successfully!');
    }

    public function edit(Job $job)
    {
        return Inertia::render('Jobs/Form', [
            'job' => $job,
            'types' => config('common.job_types'),
            'pageTitle' => 'Edit Job'
        ]);
    }

    public function update(Request $request, Job $job)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type'  => 'required|string',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'salary' => 'nullable|string',
        ]);

        $job->update($request->only('title','type', 'description', 'location', 'salary'));

        return redirect()->route('jobs.index')->with('success', 'Job updated successfully!');
    }

    public function destroy(Job $job)
    {
        $job->delete();
        return redirect()->route('jobs.index')->with('success', 'Job deleted successfully!');
    }
}
