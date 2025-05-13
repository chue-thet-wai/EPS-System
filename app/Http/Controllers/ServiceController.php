<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ServiceController extends Controller
{
    public function index()
    {
        $authUser = auth()->user();
        $services = Service::with('user', 'category')
                    ->where('created_by',$authUser->id)
                    ->paginate(config('common.paginate_per_page'));
        return Inertia::render('Services/Index', compact('services'));
    }

    public function create()
    {
        $authUser = auth()->user();

        if (checkUserRole('Agent', $authUser)) {
            $users = collect([$authUser]);
        } elseif (checkUserRole('Admin', $authUser)) {
            $users = User::role('Agent')->get();
        } else {
            $users = collect();
        }

        $categories = Category::all();

        return Inertia::render('Services/Form', [
            'users' => $users,
            'categories' => $categories,
            'statuses' => config('common.statuses'),
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'remark' => 'nullable|string',
            'status' => 'required|in:0,1',
        ]);

        Service::create([
            'agent_id' => $request->user_id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'remark' => $request->remark,
            'status' => $request->status,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('services.index')->with('success', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        return Inertia::render('Services/Form', [
            'service' => $service->load('user', 'category'),
            'users' => \App\Models\User::all(),
            'categories' => \App\Models\Category::all(),
            'statuses' => config('common.statuses'),
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'remark' => 'nullable|string',
            'status' => 'required|in:0,1',
        ]);

        $service->update([
            'agent_id' => $request->user_id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'remark' => $request->remark,
            'status' => $request->status,
            'updated_by' => Auth::id(),
        ]);

        return redirect()->route('services.index')->with('success', 'Service updated successfully!');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('services.index')->with('success', 'Service deleted successfully!');
    }
}
