<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Resources/Index', [
            'resources' => [],
        ]);
    }

    public function toggleFavorite(Resource $resource): RedirectResponse
    {
        $resource->update(['is_favorite' => ! $resource->is_favorite]);

        return back();
    }
}
