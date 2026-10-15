<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_when_accessing_categories(): void
    {
        $response = $this->get(route('categories.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_categories_and_tags_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('categories.index'));

        $response->assertOk();
    }

    public function test_user_can_create_category(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('categories.store'), [
            'name' => 'Backend Architecture',
            'type' => 'snippet',
            'color' => '#3B82F6',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Backend Architecture',
            'slug' => 'backend-architecture',
            'type' => 'snippet',
        ]);
    }

    public function test_user_cannot_create_category_with_invalid_type(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('categories.store'), [
            'name' => 'Invalid Category',
            'type' => 'invalid_type',
        ]);

        $response->assertSessionHasErrors('type');
    }

    public function test_user_can_update_own_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'name' => 'Old Name',
            'type' => 'prompt',
        ]);

        $response = $this->actingAs($user)->put(route('categories.update', $category), [
            'name' => 'New Name Updated',
            'color' => '#10B981',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name Updated',
            'slug' => 'new-name-updated',
            'color' => '#10B981',
        ]);
    }

    public function test_user_cannot_update_another_users_category(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->put(route('categories.update', $category), [
            'name' => 'Hacked Name',
        ]);

        $response->assertForbidden();
    }

    public function test_user_can_delete_category_without_deleting_related_items(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'type' => 'snippet',
        ]);

        $snippet = Snippet::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Important Snippet',
        ]);

        $response = $this->actingAs($user)->delete(route('categories.destroy', $category));

        $response->assertRedirect();
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);

        // Snippet remains in database with null category
        $this->assertDatabaseHas('snippets', [
            'id' => $snippet->id,
            'category_id' => null,
        ]);
    }

    public function test_user_cannot_delete_another_users_category(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->delete(route('categories.destroy', $category));

        $response->assertForbidden();
    }

    public function test_user_can_update_tag_name(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create([
            'user_id' => $user->id,
            'name' => 'oldtag',
            'slug' => 'oldtag',
        ]);

        $response = $this->actingAs($user)->patch(route('tags.update', $tag), [
            'name' => 'newtag',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tags', [
            'id' => $tag->id,
            'name' => 'newtag',
            'slug' => 'newtag',
        ]);
    }

    public function test_user_merges_tag_when_updated_to_existing_tag_name(): void
    {
        $user = User::factory()->create();
        $tag1 = Tag::factory()->create(['user_id' => $user->id, 'name' => 'php', 'slug' => 'php']);
        $tag2 = Tag::factory()->create(['user_id' => $user->id, 'name' => 'phptips', 'slug' => 'phptips']);

        $snippet = Snippet::factory()->create(['user_id' => $user->id]);
        $snippet->tags()->attach($tag2->id);

        $response = $this->actingAs($user)->patch(route('tags.update', $tag2), [
            'name' => 'php',
        ]);

        $response->assertRedirect();
        // tag2 was merged and deleted
        $this->assertDatabaseMissing('tags', ['id' => $tag2->id]);
        // snippet now attached to tag1
        $this->assertTrue($snippet->fresh()->tags->contains('id', $tag1->id));
    }

    public function test_user_cannot_update_another_users_tag(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $tag = Tag::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->patch(route('tags.update', $tag), [
            'name' => 'hackedtag',
        ]);

        $response->assertForbidden();
    }

    public function test_user_can_delete_own_tag(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('tags.destroy', $tag));

        $response->assertRedirect();
        $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
    }

    public function test_user_cannot_delete_another_users_tag(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $tag = Tag::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->delete(route('tags.destroy', $tag));

        $response->assertForbidden();
    }
}
