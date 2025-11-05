<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('subcategories:id,category_id,name') // optional if needed
            ->paginate(config('common.paginate_per_page'));

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'pageTitle'  => 'categories',
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Form', [
            'pageTitle' => 'createCategory',
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subcategories' => 'array',
            'subcategories.*.name' => 'required|string|max:255',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'created_by' => auth()->id(),
        ]);

        foreach ($request->subcategories as $subcat) {
            $category->subcategories()->create([
                'name' => $subcat['name'],
                'created_by' => auth()->id(),
            ]);
        }

        return redirect()->route('categories.index')->with('success', 'Category created successfully!');
    }


    public function edit(Category $category)
    {
        $category->load('subcategories:id,category_id,name');

        return Inertia::render('Categories/Form', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'subcategories' => $category->subcategories->map(fn($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                ]),
            ],
            'pageTitle' => 'editCategory',
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subcategories' => 'array',
            'subcategories.*.name' => 'required|string|max:255',
            'subcategories.*.id' => 'nullable|integer|exists:subcategories,id',
        ]);

        $category->update([
            'name' => $request->name,
            'updated_by' => auth()->id(),
        ]);

       
        $existingSubcategories = $category->subcategories->keyBy('id');
        $incomingSubcategories = collect($request->subcategories);

        $incomingIds = [];

        foreach ($incomingSubcategories as $subcat) {
            if (empty($subcat['name'])) continue;

            if (!empty($subcat['id']) && $existingSubcategories->has($subcat['id'])) {
                $existingSubcategories[$subcat['id']]->update([
                    'name' => $subcat['name'],
                    'updated_by' => auth()->id(),
                ]);
                $incomingIds[] = $subcat['id'];
            } else {
                $new = $category->subcategories()->create([
                    'name' => $subcat['name'],
                    'created_by' => auth()->id(),
                ]);
                $incomingIds[] = $new->id; 
            }
        }

        $existingIds = $existingSubcategories->keys()->all();
        $toDelete = array_diff($existingIds, $incomingIds);

        if (!empty($toDelete)) {
            $category->subcategories()->whereIn('id', $toDelete)->delete();
        }

        return redirect()->route('categories.index')->with('success', 'Category updated successfully!');
    }


    public function destroy(Category $category)
    {
        $category->delete();
        $category->subcategories()->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully!');
    }
}
