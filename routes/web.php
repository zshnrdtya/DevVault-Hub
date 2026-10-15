<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GlobalSearchController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PromptController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\TagController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::resource('snippets', SnippetController::class);
    Route::patch('/snippets/{snippet}/favorite', [SnippetController::class, 'toggleFavorite'])->name('snippets.favorite');
    Route::post('/snippets/{snippet}/copied', [SnippetController::class, 'recordCopy'])->name('snippets.copied');

    Route::resource('prompts', PromptController::class);
    Route::patch('/prompts/{prompt}/favorite', [PromptController::class, 'toggleFavorite'])->name('prompts.favorite');
    Route::post('/prompts/{prompt}/copied', [PromptController::class, 'recordCopy'])->name('prompts.copied');

    Route::resource('resources', ResourceController::class);
    Route::patch('/resources/{resource}/favorite', [ResourceController::class, 'toggleFavorite'])->name('resources.favorite');

    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::patch('/tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    Route::get('/search', GlobalSearchController::class)->name('search.global');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
