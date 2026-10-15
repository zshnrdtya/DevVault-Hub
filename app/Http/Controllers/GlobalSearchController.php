<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    /**
     * Search across snippets, prompts, and resources.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $q = trim((string) $request->input('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json([
                'snippets' => [],
                'prompts' => [],
                'resources' => [],
            ]);
        }

        $user = $request->user();

        $snippets = $user->snippets()
            ->with('category:id,name,color')
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('code', 'like', "%{$q}%")
                    ->orWhereHas('tags', fn ($tagQ) => $tagQ->where('name', 'like', "%{$q}%"));
            })
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'language', 'category_id', 'created_at']);

        $prompts = $user->prompts()
            ->with('category:id,name,color')
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('content', 'like', "%{$q}%")
                    ->orWhereHas('tags', fn ($tagQ) => $tagQ->where('name', 'like', "%{$q}%"));
            })
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'category_id', 'created_at']);

        $resources = $user->resources()
            ->with('category:id,name,color')
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('url', 'like', "%{$q}%")
                    ->orWhere('note', 'like', "%{$q}%")
                    ->orWhereHas('tags', fn ($tagQ) => $tagQ->where('name', 'like', "%{$q}%"));
            })
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'url', 'category_id', 'created_at']);

        return response()->json([
            'snippets' => $snippets,
            'prompts' => $prompts,
            'resources' => $resources,
        ]);
    }
}
