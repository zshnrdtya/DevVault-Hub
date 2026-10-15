<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories and tags.
     */
    public function index(Request $request): Response
    {
        $categories = $request->user()->categories()
            ->withCount(['snippets', 'prompts', 'resources'])
            ->orderBy('name')
            ->get();

        $tags = $request->user()->tags()
            ->withCount(['snippets', 'prompts', 'resources'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'type' => ['required', 'in:snippet,prompt,resource'],
            'color' => ['nullable', 'string', 'max:30'],
        ]);

        $request->user()->categories()->create([
            ...$validated,
            'slug' => str($validated['name'])->slug(),
        ]);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'color' => ['nullable', 'string', 'max:30'],
        ]);

        $category->update([
            ...$validated,
            'slug' => str($validated['name'])->slug(),
        ]);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->user_id === $request->user()->id, 403);

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
