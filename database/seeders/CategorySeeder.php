<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Default categories from PRD sections 7.2, 7.3, and 7.4.
     */
    public function run(?User $user = null): void
    {
        $targetUser = $user ?? User::first() ?? User::factory()->create([
            'name' => 'Raka Developer',
            'email' => 'raka@devvault.local',
        ]);

        $defaultCategories = [
            'snippet' => [
                ['name' => 'Backend', 'color' => '#3B82F6'],
                ['name' => 'Frontend', 'color' => '#10B981'],
                ['name' => 'Database & Query', 'color' => '#8B5CF6'],
                ['name' => 'DevOps & CI/CD', 'color' => '#F59E0B'],
                ['name' => 'Helper & Utility', 'color' => '#6B7280'],
            ],
            'prompt' => [
                ['name' => 'Coding', 'color' => '#2563EB'],
                ['name' => 'Debugging', 'color' => '#EF4444'],
                ['name' => 'UI/UX', 'color' => '#EC4899'],
                ['name' => 'Requirement Analysis', 'color' => '#F97316'],
                ['name' => 'Dokumentasi', 'color' => '#14B8A6'],
                ['name' => 'Refactoring', 'color' => '#84CC16'],
                ['name' => 'Lainnya', 'color' => '#64748B'],
            ],
            'resource' => [
                ['name' => 'GitHub', 'color' => '#18181B'],
                ['name' => 'Dokumentasi', 'color' => '#0284C7'],
                ['name' => 'Library', 'color' => '#059669'],
                ['name' => 'Referensi Desain', 'color' => '#D97706'],
                ['name' => 'Artikel', 'color' => '#7C3AED'],
                ['name' => 'Tools', 'color' => '#475569'],
            ],
        ];

        foreach ($defaultCategories as $type => $categories) {
            foreach ($categories as $cat) {
                Category::firstOrCreate(
                    [
                        'user_id' => $targetUser->id,
                        'type' => $type,
                        'slug' => Str::slug($cat['name']),
                    ],
                    [
                        'name' => $cat['name'],
                        'color' => $cat['color'],
                    ]
                );
            }
        }
    }
}
