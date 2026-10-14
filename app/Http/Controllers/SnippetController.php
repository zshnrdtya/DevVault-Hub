<?php

namespace App\Http\Controllers;

use App\Enums\SnippetLanguage;
use App\Http\Requests\SnippetRequest;
use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SnippetController extends Controller
{
    /**
     * Display a listing of user code snippets.
     */
    public function index(Request $request): Response
    {
        $query = $request->user()->snippets()->with(['category:id,name,color', 'tags:id,name,slug']);

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhereHas('tags', fn ($tagQ) => $tagQ->where('name', 'like', "%{$search}%"));
            });
        }

        if ($lang = $request->input('language')) {
            $query->where('language', $lang);
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

        $snippets = $query->paginate(9)->withQueryString();

        $categories = $request->user()->categories()
            ->where('type', 'snippet')
            ->get(['id', 'name', 'color']);

        return Inertia::render('Snippets/Index', [
            'snippets' => $snippets,
            'categories' => $categories,
            'languages' => SnippetLanguage::options(),
            'filters' => $request->only(['q', 'language', 'category_id', 'favorite', 'tag', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new snippet.
     */
    public function create(Request $request): Response
    {
        $categories = $request->user()->categories()
            ->where('type', 'snippet')
            ->get(['id', 'name', 'color']);

        $userTags = $request->user()->tags()->pluck('name');

        return Inertia::render('Snippets/Create', [
            'categories' => $categories,
            'languages' => SnippetLanguage::options(),
            'availableTags' => $userTags,
        ]);
    }

    /**
     * Store a newly created snippet in storage.
     */
    public function store(SnippetRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $snippet = $user->snippets()->create([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'code' => $validated['code'],
            'language' => $validated['language'],
            'is_favorite' => $validated['is_favorite'] ?? false,
        ]);

        if (! empty($validated['tags'])) {
            $this->syncTags($snippet, $validated['tags'], $user->id);
        }

        return redirect()->route('snippets.show', $snippet)->with('success', 'Snippet berhasil disimpan.');
    }

    /**
     * Display the specified snippet.
     */
    public function show(Request $request, Snippet $snippet): Response
    {
        Gate::authorize('view', $snippet);

        $snippet->load(['category:id,name,color', 'tags:id,name,slug']);

        return Inertia::render('Snippets/Show', [
            'snippet' => $snippet,
            'languages' => SnippetLanguage::options(),
        ]);
    }

    /**
     * Show the form for editing the specified snippet.
     */
    public function edit(Request $request, Snippet $snippet): Response
    {
        Gate::authorize('update', $snippet);

        $snippet->load(['category:id,name,color', 'tags:id,name,slug']);

        $categories = $request->user()->categories()
            ->where('type', 'snippet')
            ->get(['id', 'name', 'color']);

        $userTags = $request->user()->tags()->pluck('name');

        return Inertia::render('Snippets/Edit', [
            'snippet' => $snippet,
            'categories' => $categories,
            'languages' => SnippetLanguage::options(),
            'availableTags' => $userTags,
        ]);
    }

    /**
     * Update the specified snippet in storage.
     */
    public function update(SnippetRequest $request, Snippet $snippet): RedirectResponse
    {
        Gate::authorize('update', $snippet);

        $validated = $request->validated();

        $snippet->update([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'code' => $validated['code'],
            'language' => $validated['language'],
            'is_favorite' => $validated['is_favorite'] ?? $snippet->is_favorite,
        ]);

        $this->syncTags($snippet, $validated['tags'] ?? [], $request->user()->id);

        return redirect()->route('snippets.show', $snippet)->with('success', 'Snippet berhasil diperbarui.');
    }

    /**
     * Remove the specified snippet from storage.
     */
    public function destroy(Request $request, Snippet $snippet): RedirectResponse
    {
        Gate::authorize('delete', $snippet);

        $snippet->delete();

        return redirect()->route('snippets.index')->with('success', 'Snippet dipindahkan ke tong sampah.');
    }

    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(Request $request, Snippet $snippet): RedirectResponse
    {
        Gate::authorize('update', $snippet);

        $snippet->update([
            'is_favorite' => ! $snippet->is_favorite,
        ]);

        return back();
    }

    /**
     * Record a copy action and update timestamp.
     */
    public function recordCopy(Request $request, Snippet $snippet): RedirectResponse
    {
        Gate::authorize('view', $snippet);

        $snippet->increment('copy_count');
        $snippet->update(['last_copied_at' => now()]);

        return back();
    }

    /**
     * Synchronize tags for the given snippet.
     *
     * @param  list<string>  $tagNames
     */
    private function syncTags(Snippet $snippet, array $tagNames, int $userId): void
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

        $snippet->tags()->sync($tagIds);
    }
}
