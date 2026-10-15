<?php

namespace Tests\Feature;

use App\Models\Prompt;
use App\Models\Resource;
use App\Models\Snippet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GlobalSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_when_accessing_search(): void
    {
        $response = $this->get(route('search.global'));

        $response->assertRedirect(route('login'));
    }

    public function test_global_search_returns_empty_when_query_is_too_short(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('search.global', ['q' => 'a']));

        $response->assertOk()
            ->assertJson([
                'snippets' => [],
                'prompts' => [],
                'resources' => [],
            ]);
    }

    public function test_global_search_finds_matching_items_across_all_three_modules(): void
    {
        $user = User::factory()->create();

        $snippet = Snippet::factory()->create([
            'user_id' => $user->id,
            'title' => 'Laravel Authentication Middleware',
        ]);

        $prompt = Prompt::factory()->create([
            'user_id' => $user->id,
            'title' => 'Laravel Refactoring Prompt',
        ]);

        $resource = Resource::factory()->create([
            'user_id' => $user->id,
            'title' => 'Laravel Official Documentation',
        ]);

        $response = $this->actingAs($user)->getJson(route('search.global', ['q' => 'Laravel']));

        $response->assertOk();

        $data = $response->json();
        $this->assertCount(1, $data['snippets']);
        $this->assertSame($snippet->id, $data['snippets'][0]['id']);

        $this->assertCount(1, $data['prompts']);
        $this->assertSame($prompt->id, $data['prompts'][0]['id']);

        $this->assertCount(1, $data['resources']);
        $this->assertSame($resource->id, $data['resources'][0]['id']);
    }

    public function test_global_search_does_not_leak_items_belonging_to_other_users(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        Snippet::factory()->create([
            'user_id' => $userB->id,
            'title' => 'Secret Algorithm in Python',
        ]);

        $response = $this->actingAs($userA)->getJson(route('search.global', ['q' => 'Algorithm']));

        $response->assertOk();
        $data = $response->json();

        $this->assertEmpty($data['snippets']);
    }
}
