<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Categories/Index', [
            'categories' => $request->user()->categories()->withCount(['snippets', 'prompts', 'resources'])->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'in:snippet,prompt,resource'],
            'color' => ['nullable', 'string', 'max:30'],
        ]);

        $request->user()->categories()->create([
            ...$validated,
            'slug' => str($validated['name'])->slug(),
        ]);

        return back();
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:30'],
        ]);

        $category->update([
            ...$validated,
            'slug' => str($validated['name'])->slug(),
        ]);

        return back();
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->user_id === $request->user()->id, 403);

        $category->delete();

        return back();
    }
}
