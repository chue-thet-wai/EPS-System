<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Category;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    public function index()
    {
        $authUser = auth()->user();
        $agentInfo = Agent::with('user')->where('user_id', $authUser->id)->first(); 

        $services = Service::with(['user', 'category', 'subcategory'])
            ->where('created_by', $authUser->id)
            ->paginate(config('common.paginate_per_page'));

        return Inertia::render('Services/Index', [
            'agent' => $agentInfo,
            'services' => $services,
            'statuses' => config('common.statuses'),
            'pageTitle' => 'allServices'
        ]);
    }


    public function create()
    {
        $categories = Category::with('subcategories')->get();

        return Inertia::render('Services/Form', [
            'categories' => $categories,
            'statuses' => config('common.statuses'),
            'pageTitle' => 'createService'
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'title' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'duration' => 'nullable|string',
            'cost' => 'nullable|string',
           // 'is_renew' => 'boolean',
            'status' => 'required|in:0,1',
        ]);

        Service::create([
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id,
            'title' => $request->title,
            'detail' => $request->detail,
            'duration' => $request->duration,
            'cost' => $request->cost,
           // 'is_renew' => $request->is_renew ?? false,
            'status' => $request->status,
            'created_by' => Auth::id(), 
        ]);

        return redirect()->route('services.index')->with('success', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        $categories = Category::with('subcategories')->get();
        return Inertia::render('Services/Form', [
            'service' => $service->load('user', 'category'),
            'categories' => $categories,
            'statuses' => config('common.statuses'),
            'pageTitle' => 'editService'
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'title' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'duration' => 'nullable|string',
            'cost' => 'nullable|string',
            //'is_renew' => 'boolean',
            'status' => 'required|in:0,1',
        ]);

        $service->update([
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id,
            'title' => $request->title,
            'detail' => $request->detail,
            'duration' => $request->duration,
            'cost' => $request->cost,
            //'is_renew' => $request->is_renew ?? false,
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
