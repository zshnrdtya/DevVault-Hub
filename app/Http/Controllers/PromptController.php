<?php

namespace App\Http\Controllers;

use App\Models\Prompt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromptController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Prompts/Index', [
            'prompts' => [],
        ]);
    }

    public function toggleFavorite(Prompt $prompt): RedirectResponse
    {
        $prompt->update(['is_favorite' => ! $prompt->is_favorite]);

        return back();
    }

    public function recordCopy(Prompt $prompt): RedirectResponse
    {
        $prompt->increment('copy_count');
        $prompt->update(['last_copied_at' => now()]);

        return back();
    }
}
