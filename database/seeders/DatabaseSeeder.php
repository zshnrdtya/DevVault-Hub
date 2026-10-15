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

        // Tags
        $tagLaravel = Tag::firstOrCreate(['user_id' => $user->id, 'slug' => 'laravel'], ['name' => 'laravel']);
        $tagReact = Tag::firstOrCreate(['user_id' => $user->id, 'slug' => 'react'], ['name' => 'react']);
        $tagPhp = Tag::firstOrCreate(['user_id' => $user->id, 'slug' => 'php'], ['name' => 'php']);
        $tagTypescript = Tag::firstOrCreate(['user_id' => $user->id, 'slug' => 'typescript'], ['name' => 'typescript']);
        $tagDatabase = Tag::firstOrCreate(['user_id' => $user->id, 'slug' => 'database'], ['name' => 'database']);
        $tagTailwind = Tag::firstOrCreate(['user_id' => $user->id, 'slug' => 'tailwind'], ['name' => 'tailwind']);

        // Categories
        $catBackend = Category::where('user_id', $user->id)->where('type', 'snippet')->where('slug', 'backend')->first();
        $catFrontend = Category::where('user_id', $user->id)->where('type', 'snippet')->where('slug', 'frontend')->first();
        $catDb = Category::where('user_id', $user->id)->where('type', 'snippet')->where('slug', 'database-query')->first();

        $catCoding = Category::where('user_id', $user->id)->where('type', 'prompt')->where('slug', 'coding')->first();
        $catDebugging = Category::where('user_id', $user->id)->where('type', 'prompt')->where('slug', 'debugging')->first();
        $catRefactor = Category::where('user_id', $user->id)->where('type', 'prompt')->where('slug', 'refactoring')->first();

        $catDocs = Category::where('user_id', $user->id)->where('type', 'resource')->where('slug', 'dokumentasi')->first();
        $catGithub = Category::where('user_id', $user->id)->where('type', 'resource')->where('slug', 'github')->first();
        $catLibrary = Category::where('user_id', $user->id)->where('type', 'resource')->where('slug', 'library')->first();

        // 1. Snippets Demo
        $s1 = Snippet::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Query Scope Scoping per User'],
            [
                'category_id' => $catBackend?->id,
                'description' => 'Pattern query scope untuk isolasi data otomatis per user_id di Laravel.',
                'code' => "public function scopeForUser(Builder \$query, int \$userId): void\n{\n    \$query->where('user_id', \$userId);\n}",
                'language' => 'php',
                'is_favorite' => true,
                'copy_count' => 12,
            ]
        );
        $s1->tags()->syncWithoutDetaching([$tagLaravel->id, $tagPhp->id]);

        $s2 = Snippet::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Debounced Value Hook di React'],
            [
                'category_id' => $catFrontend?->id,
                'description' => 'Custom hook debounce untuk input pencarian hemat API request.',
                'code' => "export function useDebounce<T>(value: T, delay: number = 300): T {\n  const [debounced, setDebounced] = useState<T>(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}",
                'language' => 'typescript',
                'is_favorite' => true,
                'copy_count' => 8,
            ]
        );
        $s2->tags()->syncWithoutDetaching([$tagReact->id, $tagTypescript->id]);

        $s3 = Snippet::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'SQL Dense Rank Window Function'],
            [
                'category_id' => $catDb?->id,
                'description' => 'Ranking data transaksi per kategori tanpa melewatkan urutan rank.',
                'code' => "SELECT id, category_id, amount,\n       DENSE_RANK() OVER (PARTITION BY category_id ORDER BY amount DESC) as rank_pos\nFROM transactions;",
                'language' => 'sql',
                'is_favorite' => false,
                'copy_count' => 3,
            ]
        );
        $s3->tags()->syncWithoutDetaching([$tagDatabase->id]);

        // 2. Prompts Demo
        $p1 = Prompt::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Refactoring Kode Bersih (Antislop)'],
            [
                'category_id' => $catRefactor?->id,
                'description' => 'Prompt untuk menyederhanakan kode tanpa over-engineering dan tanpa silent error.',
                'content' => "Tinjau potongan kode {{bahasa}} berikut:\n\n{{kode}}\n\nSederhanakan alur kontrolnya, hapus abstraksi prematur, dan pastikan setiap error ditangani secara eksplisit tanpa empty catch.",
                'is_favorite' => true,
                'copy_count' => 15,
            ]
        );
        $p1->tags()->syncWithoutDetaching([$tagLaravel->id, $tagReact->id]);

        $p2 = Prompt::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Investigasi Bug & Root Cause Analysis'],
            [
                'category_id' => $catDebugging?->id,
                'description' => 'Menganalisis stack trace error dan memberikan 3 hipotesis penyebab utama.',
                'content' => "Berikut adalah pesan error dan stack trace yang terjadi di lingkungan {{environment}}:\n\n{{error_log}}\n\nTolong jelaskan root cause, mekanisme kegagalannya, dan berikan solusi kode perbaikannya.",
                'is_favorite' => true,
                'copy_count' => 9,
            ]
        );
        $p2->tags()->syncWithoutDetaching([$tagPhp->id]);

        $p3 = Prompt::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Generator Feature Test PHPUnit / Pest'],
            [
                'category_id' => $catCoding?->id,
                'description' => 'Membuat automated test komprehensif mencakup skenario sukses dan 403 Forbidden.',
                'content' => 'Buatkan test suite feature untuk endpoint {{endpoint}} di Laravel. Pastikan mencakup pengujian otorisasi data (user A tidak bisa mengakses milik user B) dan pengujian validasi input.',
                'is_favorite' => false,
                'copy_count' => 5,
            ]
        );
        $p3->tags()->syncWithoutDetaching([$tagLaravel->id]);

        // 3. Resources Demo
        $r1 = Resource::firstOrCreate(
            ['user_id' => $user->id, 'url' => 'https://laravel.com/docs'],
            [
                'category_id' => $catDocs?->id,
                'title' => 'Dokumentasi Resmi Laravel',
                'note' => 'Referensi cepat routing, eloquent relations, validation rules, dan starter kit.',
                'is_favorite' => true,
            ]
        );
        $r1->tags()->syncWithoutDetaching([$tagLaravel->id]);

        $r2 = Resource::firstOrCreate(
            ['user_id' => $user->id, 'url' => 'https://react.dev'],
            [
                'category_id' => $catDocs?->id,
                'title' => 'React Documentation Official',
                'note' => 'Panduan Hooks, Server Components, dan arsitektur komponen React terkini.',
                'is_favorite' => true,
            ]
        );
        $r2->tags()->syncWithoutDetaching([$tagReact->id]);

        $r3 = Resource::firstOrCreate(
            ['user_id' => $user->id, 'url' => 'https://tailwindcss.com/docs'],
            [
                'category_id' => $catLibrary?->id,
                'title' => 'Tailwind CSS Utility Documentation',
                'note' => 'Cheatsheet responsive breakpoints, flexbox grid, dan konfigurasi tema dark mode.',
                'is_favorite' => false,
            ]
        );
        $r3->tags()->syncWithoutDetaching([$tagTailwind->id]);

        $r4 = Resource::firstOrCreate(
            ['user_id' => $user->id, 'url' => 'https://github.com/zshnrdtya/DevVault-Hub'],
            [
                'category_id' => $catGithub?->id,
                'title' => 'DevVault-Hub Source Code Repository',
                'note' => 'Repositori utama aplikasi DevVault: Personal Developer Hub & Second Brain.',
                'is_favorite' => true,
            ]
        );
        $r4->tags()->syncWithoutDetaching([$tagLaravel->id, $tagReact->id]);
    }
}
