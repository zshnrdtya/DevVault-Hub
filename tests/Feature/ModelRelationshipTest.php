<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Prompt;
use App\Models\Resource;
use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_have_multiple_entities(): void
    {
        $user = User::factory()->create();

        $category = Category::factory()->snippet()->create(['user_id' => $user->id]);
        $snippet = Snippet::factory()->create(['user_id' => $user->id, 'category_id' => $category->id]);
        $prompt = Prompt::factory()->create(['user_id' => $user->id]);
        $resource = Resource::factory()->create(['user_id' => $user->id]);
        $tag = Tag::factory()->create(['user_id' => $user->id]);

        $this->assertCount(1, $user->categories);
        $this->assertCount(1, $user->snippets);
        $this->assertCount(1, $user->prompts);
        $this->assertCount(1, $user->resources);
        $this->assertCount(1, $user->tags);
    }

    public function test_snippet_prompt_resource_can_share_polymorphic_tags(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create(['user_id' => $user->id, 'name' => 'laravel', 'slug' => 'laravel']);

        $snippet = Snippet::factory()->create(['user_id' => $user->id]);
        $prompt = Prompt::factory()->create(['user_id' => $user->id]);
        $resource = Resource::factory()->create(['user_id' => $user->id]);

        $snippet->tags()->attach($tag);
        $prompt->tags()->attach($tag);
        $resource->tags()->attach($tag);

        $this->assertTrue($snippet->tags->contains($tag));
        $this->assertTrue($prompt->tags->contains($tag));
        $this->assertTrue($resource->tags->contains($tag));

        $this->assertCount(1, $tag->snippets);
        $this->assertCount(1, $tag->prompts);
        $this->assertCount(1, $tag->resources);
    }

    public function test_deleting_category_sets_item_category_id_to_null_instead_of_deleting_item(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->snippet()->create(['user_id' => $user->id]);
        $snippet = Snippet::factory()->create(['user_id' => $user->id, 'category_id' => $category->id]);

        $category->delete();

        $this->assertDatabaseHas('snippets', [
            'id' => $snippet->id,
            'category_id' => null,
        ]);
    }

    public function test_soft_deletes_keep_records_in_database(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id]);

        $snippet->delete();

        $this->assertSoftDeleted('snippets', ['id' => $snippet->id]);
    }
}
