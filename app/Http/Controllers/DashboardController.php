<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display personal developer hub overview.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $stats = [
            'snippets' => $user->snippets()->count(),
            'prompts' => $user->prompts()->count(),
            'resources' => $user->resources()->count(),
            'categories' => $user->categories()->count(),
        ];

        $favoriteSnippets = $user->snippets()
            ->favorite()
            ->with('category:id,name,color')
            ->latest()
            ->take(4)
            ->get(['id', 'title', 'language', 'category_id', 'created_at']);

        $favoritePrompts = $user->prompts()
            ->favorite()
            ->with('category:id,name,color')
            ->latest()
            ->take(4)
            ->get(['id', 'title', 'category_id', 'created_at']);

        $favoriteResources = $user->resources()
            ->favorite()
            ->with('category:id,name,color')
            ->latest()
            ->take(4)
            ->get(['id', 'title', 'url', 'category_id', 'created_at']);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'favoriteSnippets' => $favoriteSnippets,
            'favoritePrompts' => $favoritePrompts,
            'favoriteResources' => $favoriteResources,
        ]);
    }
}
