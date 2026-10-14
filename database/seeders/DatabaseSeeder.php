<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Prompt;
use App\Models\Resource;
use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with demo data.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Raka Developer',
                'password' => bcrypt('password'),
            ]
        );

        $this->call(CategorySeeder::class);

        $laravelTag = Tag::firstOrCreate([
            'user_id' => $user->id,
            'slug' => 'laravel',
        ], ['name' => 'laravel']);

        $reactTag = Tag::firstOrCreate([
            'user_id' => $user->id,
            'slug' => 'react',
        ], ['name' => 'react']);

        $backendCategory = Category::where('user_id', $user->id)
            ->where('type', 'snippet')
            ->where('slug', 'backend')
            ->first();

        $snippet = Snippet::firstOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'Query Scope Scoping per User',
            ],
            [
                'category_id' => $backendCategory?->id,
                'description' => 'Pattern query scope untuk isolasi data otomatis per user_id di Laravel.',
                'code' => "public function scopeForUser(Builder \$query, int \$userId): void\n{\n    \$query->where('user_id', \$userId);\n}",
                'language' => 'php',
                'is_favorite' => true,
            ]
        );
        $snippet->tags()->syncWithoutDetaching([$laravelTag->id]);

        $codingPromptCategory = Category::where('user_id', $user->id)
            ->where('type', 'prompt')
            ->where('slug', 'coding')
            ->first();

        $prompt = Prompt::firstOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'Refactoring Kode Bersih (Antislop)',
            ],
            [
                'category_id' => $codingPromptCategory?->id,
                'description' => 'Prompt untuk menyederhanakan kode tanpa over-engineering dan tanpa silent error.',
                'content' => 'Tinjau potongan kode berikut. Sederhanakan alur kontrolnya, hapus abstraksi prematur yang tidak dibutuhkan, dan pastikan setiap error ditangani secara eksplisit tanpa empty catch.',
                'is_favorite' => true,
            ]
        );
        $prompt->tags()->syncWithoutDetaching([$laravelTag->id, $reactTag->id]);

        $docsCategory = Category::where('user_id', $user->id)
            ->where('type', 'resource')
            ->where('slug', 'dokumentasi')
            ->first();

        $resource = Resource::firstOrCreate(
            [
                'user_id' => $user->id,
                'url' => 'https://laravel.com/docs',
            ],
            [
                'category_id' => $docsCategory?->id,
                'title' => 'Dokumentasi Resmi Laravel',
                'note' => 'Referensi cepat routing, eloquent, validation, dan inertia starter kit.',
                'is_favorite' => true,
            ]
        );
        $resource->tags()->syncWithoutDetaching([$laravelTag->id]);
    }
}
