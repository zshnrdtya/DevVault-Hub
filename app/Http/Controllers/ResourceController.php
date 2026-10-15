<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResourceRequest;
use App\Models\Resource;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    /**
     * Display a listing of user resource bookmarks.
     */
    public function index(Request $request): Response
    {
        $query = $request->user()->resources()->with(['category:id,name,color', 'tags:id,name,slug']);

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%")
                    ->orWhere('note', 'like', "%{$search}%")
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

        $resources = $query->paginate(9)->withQueryString();

        $categories = $request->user()->categories()
            ->where('type', 'resource')
            ->get(['id', 'name', 'color']);

        return Inertia::render('Resources/Index', [
            'resources' => $resources,
            'categories' => $categories,
            'filters' => $request->only(['q', 'category_id', 'favorite', 'tag', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new resource bookmark.
     */
    public function create(Request $request): Response
    {
        $categories = $request->user()->categories()
            ->where('type', 'resource')
            ->get(['id', 'name', 'color']);

        $userTags = $request->user()->tags()->pluck('name');

        return Inertia::render('Resources/Create', [
            'categories' => $categories,
            'availableTags' => $userTags,
        ]);
    }

    /**
     * Store a newly created resource bookmark in storage.
     */
    public function store(ResourceRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $alreadyExists = $user->resources()
            ->where('url', $validated['url'])
            ->exists();

        $resource = $user->resources()->create([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'url' => $validated['url'],
            'note' => $validated['note'] ?? null,
            'is_favorite' => $validated['is_favorite'] ?? false,
        ]);

        if (! empty($validated['tags'])) {
            $this->syncTags($resource, $validated['tags'], $user->id);
        }

        if ($alreadyExists) {
            session()->flash('warning', 'Catatan: URL ini sudah pernah Anda simpan pada bookmark lain.');
        }

        return redirect()->route('resources.show', $resource)->with('success', 'Bookmark berhasil disimpan.');
    }

    /**
     * Display the specified resource bookmark.
     */
    public function show(Request $request, Resource $resource): Response
    {
        Gate::authorize('view', $resource);

        $resource->load(['category:id,name,color', 'tags:id,name,slug']);

        return Inertia::render('Resources/Show', [
            'resource' => $resource,
        ]);
    }

    /**
     * Show the form for editing the specified resource bookmark.
     */
    public function edit(Request $request, Resource $resource): Response
    {
        Gate::authorize('update', $resource);

        $resource->load(['category:id,name,color', 'tags:id,name,slug']);

        $categories = $request->user()->categories()
            ->where('type', 'resource')
            ->get(['id', 'name', 'color']);

        $userTags = $request->user()->tags()->pluck('name');

        return Inertia::render('Resources/Edit', [
            'resource' => $resource,
            'categories' => $categories,
            'availableTags' => $userTags,
        ]);
    }

    /**
     * Update the specified resource bookmark in storage.
     */
    public function update(ResourceRequest $request, Resource $resource): RedirectResponse
    {
        Gate::authorize('update', $resource);

        $validated = $request->validated();

        $resource->update([
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'url' => $validated['url'],
            'note' => $validated['note'] ?? null,
            'is_favorite' => $validated['is_favorite'] ?? false,
        ]);

        $this->syncTags($resource, $validated['tags'] ?? [], $request->user()->id);

        return redirect()->route('resources.show', $resource)->with('success', 'Bookmark berhasil diperbarui.');
    }

    /**
     * Remove the specified resource bookmark from storage.
     */
    public function destroy(Request $request, Resource $resource): RedirectResponse
    {
        Gate::authorize('delete', $resource);

        $resource->delete();

        return redirect()->route('resources.index')->with('success', 'Bookmark dipindahkan ke tong sampah.');
    }

    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(Request $request, Resource $resource): RedirectResponse
    {
        Gate::authorize('update', $resource);

        $resource->update([
            'is_favorite' => ! $resource->is_favorite,
        ]);

        return back();
    }

    /**
     * Synchronize tags for the given resource.
     *
     * @param  list<string>  $tagNames
     */
    private function syncTags(Resource $resource, array $tagNames, int $userId): void
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

        $resource->tags()->sync($tagIds);
    }
}
