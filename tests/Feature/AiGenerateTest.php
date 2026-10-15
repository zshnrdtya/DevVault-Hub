<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiGenerateTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_ai_generate(): void
    {
        $response = $this->postJson(route('ai.generate'), [
            'type' => 'snippet',
            'content' => 'function test() { return 1; }',
        ]);

        $response->assertUnauthorized();
    }

    public function test_validation_fails_for_invalid_payload(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('ai.generate'), [
            'type' => 'invalid-type',
            'content' => 'ab',
        ]);

        $response->assertUnprocessable();
    }

    public function test_authenticated_user_can_generate_snippet_metadata(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'name' => 'Backend Development',
        ]);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'title' => 'Fungsi Helper Array Mapping',
                                        'language' => 'php',
                                        'category_name' => 'Backend Development',
                                        'description' => 'Fungsi untuk memetakan struktur array asosiatif ke koleksi objek.',
                                        'tags' => ['php', 'array', 'helper'],
                                    ]),
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($user)->postJson(route('ai.generate'), [
            'type' => 'snippet',
            'content' => 'function mapData(array $items): array { return array_map(fn($i) => (object)$i, $items); }',
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'data' => [
                'title' => 'Fungsi Helper Array Mapping',
                'language' => 'php',
                'category_id' => $category->id,
                'category_name' => 'Backend Development',
                'tags' => ['php', 'array', 'helper'],
            ],
        ]);
    }

    public function test_anti_slop_removes_em_dashes_from_ai_output(): void
    {
        $user = User::factory()->create();

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'title' => "Prompt Refactoring \u{2014} Antislop",
                                        'category_name' => 'General',
                                        'description' => "Instruksi refactoring kode \u{2013} tanpa fitur rusak.",
                                        'tags' => ['prompt', 'ai'],
                                    ]),
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($user)->postJson(route('ai.generate'), [
            'type' => 'prompt',
            'content' => 'Refactor this code to clean architecture without bugs.',
        ]);

        $response->assertOk();
        $data = $response->json('data');

        $this->assertStringNotContainsString("\u{2014}", $data['title']);
        $this->assertStringNotContainsString("\u{2013}", $data['title']);
        $this->assertStringNotContainsString("\u{2014}", $data['description']);
        $this->assertStringNotContainsString("\u{2013}", $data['description']);
    }
}
