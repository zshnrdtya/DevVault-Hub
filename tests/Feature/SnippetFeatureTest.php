<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Snippet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SnippetFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_when_accessing_snippets(): void
    {
        $response = $this->get(route('snippets.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_snippets_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('snippets.index'));

        $response->assertOk();
    }

    public function test_user_can_create_snippet_with_tags(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->snippet()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post(route('snippets.store'), [
            'title' => 'Query Scope per User',
            'description' => 'Pattern untuk isolasi data user di Laravel.',
            'code' => "public function scopeForUser(\$query, \$userId) { return \$query->where('user_id', \$userId); }",
            'language' => 'php',
            'category_id' => $category->id,
            'tags' => ['laravel', 'eloquent'],
            'is_favorite' => true,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('snippets', [
            'user_id' => $user->id,
            'title' => 'Query Scope per User',
            'language' => 'php',
            'category_id' => $category->id,
            'is_favorite' => true,
        ]);

        $snippet = Snippet::where('title', 'Query Scope per User')->first();
        $this->assertNotNull($snippet);
        $this->assertCount(2, $snippet->tags);
    }

    public function test_user_cannot_use_another_users_category(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $categoryB = Category::factory()->snippet()->create(['user_id' => $userB->id]);

        $response = $this->actingAs($userA)->post(route('snippets.store'), [
            'title' => 'Invalid Category Snippet',
            'code' => 'echo "hello";',
            'language' => 'php',
            'category_id' => $categoryB->id,
        ]);

        $response->assertSessionHasErrors('category_id');
    }

    public function test_user_cannot_view_another_users_snippet(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $snippetB = Snippet::factory()->create(['user_id' => $userB->id]);

        $response = $this->actingAs($userA)->get(route('snippets.show', $snippetB));

        $response->assertForbidden();
    }

    public function test_user_can_update_their_own_snippet(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id, 'title' => 'Old Title']);

        $response = $this->actingAs($user)->put(route('snippets.update', $snippet), [
            'title' => 'New Updated Title',
            'code' => 'console.log("updated");',
            'language' => 'javascript',
            'tags' => ['react', 'vite'],
        ]);

        $response->assertRedirect(route('snippets.show', $snippet));

        $this->assertDatabaseHas('snippets', [
            'id' => $snippet->id,
            'title' => 'New Updated Title',
            'language' => 'javascript',
        ]);
    }

    public function test_user_cannot_update_another_users_snippet(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $snippetB = Snippet::factory()->create(['user_id' => $userB->id]);

        $response = $this->actingAs($userA)->put(route('snippets.update', $snippetB), [
            'title' => 'Hacked Title',
            'code' => 'echo "hacked";',
            'language' => 'php',
        ]);

        $response->assertForbidden();
    }

    public function test_user_can_soft_delete_their_own_snippet(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('snippets.destroy', $snippet));

        $response->assertRedirect(route('snippets.index'));
        $this->assertSoftDeleted('snippets', ['id' => $snippet->id]);
    }

    public function test_user_can_toggle_favorite_status(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id, 'is_favorite' => false]);

        $this->actingAs($user)->patch(route('snippets.favorite', $snippet));

        $this->assertTrue($snippet->fresh()->is_favorite);

        $this->actingAs($user)->patch(route('snippets.favorite', $snippet));

        $this->assertFalse($snippet->fresh()->is_favorite);
    }

    public function test_recording_copy_increments_count_and_sets_timestamp(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create([
            'user_id' => $user->id,
            'copy_count' => 0,
            'last_copied_at' => null,
        ]);

        $this->actingAs($user)->post(route('snippets.copied', $snippet));

        $fresh = $snippet->fresh();
        $this->assertSame(1, $fresh->copy_count);
        $this->assertNotNull($fresh->last_copied_at);
    }
}
