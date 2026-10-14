<?php

namespace App\Http\Controllers;

use App\Http\Requests\PromptRequest;
use App\Models\Prompt;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PromptController extends Controller
{
    /**
     * Display a listing of user AI prompts.
     */
    public function index(Request $request): Response
    {
        $query = $request->user()->prompts()->with(['category:id,name,color', 'tags:id,name,slug']);

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhereHas('tags', fn ($tagQ) => $tagQ->where('name', 'like', "%{$search}%"));
            });
        }

        if ($catId = $request->input('category_id')) {
            $query->where('category_id', $catId);
        }

        if ($request->boolean('favorite')) {
            $query->favorite();
        }

        if ($tag = $request->input('tag')) {
            $query->whereHas('tags', fn ($q) => $q->where('slug', $tag));
        }

        match ($request->input('sort')) {
            'oldest' => $query->oldest(),
            'title_asc' => $query->orderBy('title', 'asc'),
            'updated' => $query->latest('updated_at'),
            default => $query->latest(),
        };

        $prompts = $query->paginate(9)->withQueryString();

        $categories = $request->user()->categories()
            ->where('type', 'prompt')
            ->get(['id', 'name', 'color']);

        return Inertia::render('Prompts/Index', [
            'prompts' => $prompts,
            'categories' => $categories,
            'filters' => $request->only(['q', 'category_id', 'favorite', 'tag', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new prompt.
     */
    public function create(Request $request): Response
    {
        $categories = $request->user()->categories()
            ->where('type', 'prompt')
            ->get(['id', 'name', 'color']);

        $userTags = $request->user()->tags()->pluck('name');

        return Inertia::render('Prompts/Create', [
            'categories' => $categories,
            'availableTags' => $userTags,
        ]);
    }

    /**
     * Store a newly created prompt in storage.
     */
    public function store(PromptRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $prompt = $user->prompts()->create([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'content' => $validated['content'],
            'is_favorite' => $validated['is_favorite'] ?? false,
        ]);

        if (! empty($validated['tags'])) {
            $this->syncTags($prompt, $validated['tags'], $user->id);
        }

        return redirect()->route('prompts.show', $prompt)->with('success', 'Prompt berhasil disimpan.');
    }

    /**
     * Display the specified prompt.
     */
    public function show(Request $request, Prompt $prompt): Response
    {
        Gate::authorize('view', $prompt);

        $prompt->load(['category:id,name,color', 'tags:id,name,slug']);

        return Inertia::render('Prompts/Show', [
            'prompt' => $prompt,
        ]);
    }

    /**
     * Show the form for editing the specified prompt.
     */
    public function edit(Request $request, Prompt $prompt): Response
    {
        Gate::authorize('update', $prompt);

        $prompt->load(['category:id,name,color', 'tags:id,name,slug']);

        $categories = $request->user()->categories()
            ->where('type', 'prompt')
            ->get(['id', 'name', 'color']);

        $userTags = $request->user()->tags()->pluck('name');

        return Inertia::render('Prompts/Edit', [
            'prompt' => $prompt,
            'categories' => $categories,
            'availableTags' => $userTags,
        ]);
    }

    /**
     * Update the specified prompt in storage.
     */
    public function update(PromptRequest $request, Prompt $prompt): RedirectResponse
    {
        Gate::authorize('update', $prompt);

        $validated = $request->validated();

        $prompt->update([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'content' => $validated['content'],
            'is_favorite' => $validated['is_favorite'] ?? false,
        ]);

        $this->syncTags($prompt, $validated['tags'] ?? [], $request->user()->id);

        return redirect()->route('prompts.show', $prompt)->with('success', 'Prompt berhasil diperbarui.');
    }

    /**
     * Remove the specified prompt from storage.
     */
    public function destroy(Request $request, Prompt $prompt): RedirectResponse
    {
        Gate::authorize('delete', $prompt);

        $prompt->delete();

        return redirect()->route('prompts.index')->with('success', 'Prompt dipindahkan ke tong sampah.');
    }

    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(Request $request, Prompt $prompt): RedirectResponse
    {
        Gate::authorize('update', $prompt);

        $prompt->update([
            'is_favorite' => ! $prompt->is_favorite,
        ]);

        return back();
    }

    /**
     * Record a copy action and update timestamp.
     */
    public function recordCopy(Request $request, Prompt $prompt): RedirectResponse
    {
        Gate::authorize('view', $prompt);

        $prompt->increment('copy_count');
        $prompt->update(['last_copied_at' => now()]);

        return back();
    }

    /**
     * Synchronize tags for the given prompt.
     *
     * @param  list<string>  $tagNames
     */
    private function syncTags(Prompt $prompt, array $tagNames, int $userId): void
    {
        $tagIds = [];
        foreach ($tagNames as $name) {
            $cleanName = strtolower(trim((string) $name));
            if ($cleanName === '') {
                continue;
            }
            $tag = Tag::firstOrCreate(
                [
                    'user_id' => $userId,
                    'slug' => str($cleanName)->slug(),
                ],
                [
                    'name' => $cleanName,
                ]
            );
            $tagIds[] = $tag->id;
        }

        $prompt->tags()->sync($tagIds);
    }
}
