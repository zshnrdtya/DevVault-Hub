<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the workspace settings page.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Settings/Index', [
            'user' => $request->user(),
        ]);
    }
}
