<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromptFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_when_accessing_prompts(): void
    {
        $response = $this->get(route('prompts.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_prompts_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('prompts.index'));

        $response->assertOk();
    }

    public function test_user_can_create_prompt_with_tags(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'type' => 'prompt',
            'name' => 'Refactoring',
        ]);

        $response = $this->actingAs($user)->post(route('prompts.store'), [
            'title' => 'Prompt Refactoring Bersih',
            'description' => 'Prompt untuk menyederhanakan kode.',
            'content' => 'Tinjau kode {{bahasa}} berikut dan sederhanakan.',
            'category_id' => $category->id,
            'tags' => ['ai', 'refactor'],
            'is_favorite' => true,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('prompts', [
            'user_id' => $user->id,
            'title' => 'Prompt Refactoring Bersih',
            'category_id' => $category->id,
            'is_favorite' => true,
        ]);

        $prompt = Prompt::where('title', 'Prompt Refactoring Bersih')->first();
        $this->assertNotNull($prompt);
        $this->assertCount(2, $prompt->tags);
    }

    public function test_user_can_view_own_prompt(): void
    {
        $user = User::factory()->create();
        $prompt = Prompt::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('prompts.show', $prompt));

        $response->assertOk();
    }

    public function test_user_cannot_view_another_users_prompt(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $prompt = Prompt::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->get(route('prompts.show', $prompt));

        $response->assertForbidden();
    }

    public function test_user_can_update_own_prompt(): void
    {
        $user = User::factory()->create();
        $prompt = Prompt::factory()->create(['user_id' => $user->id, 'title' => 'Judul Lama']);

        $response = $this->actingAs($user)->put(route('prompts.update', $prompt), [
            'title' => 'Judul Baru Diperbarui',
            'content' => 'Konten prompt baru.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('prompts', [
            'id' => $prompt->id,
            'title' => 'Judul Baru Diperbarui',
        ]);
    }

    public function test_user_cannot_update_another_users_prompt(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $prompt = Prompt::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->put(route('prompts.update', $prompt), [
            'title' => 'Perubahan Tak Sah',
            'content' => 'Konten diubah.',
        ]);

        $response->assertForbidden();
    }

    public function test_user_can_soft_delete_own_prompt(): void
    {
        $user = User::factory()->create();
        $prompt = Prompt::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('prompts.destroy', $prompt));

        $response->assertRedirect(route('prompts.index'));
        $this->assertSoftDeleted('prompts', ['id' => $prompt->id]);
    }

    public function test_user_cannot_delete_another_users_prompt(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $prompt = Prompt::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->delete(route('prompts.destroy', $prompt));

        $response->assertForbidden();
        $this->assertDatabaseHas('prompts', ['id' => $prompt->id, 'deleted_at' => null]);
    }

    public function test_user_can_toggle_favorite_status(): void
    {
        $user = User::factory()->create();
        $prompt = Prompt::factory()->create(['user_id' => $user->id, 'is_favorite' => false]);

        $response = $this->actingAs($user)->patch(route('prompts.favorite', $prompt));

        $response->assertRedirect();
        $this->assertTrue($prompt->fresh()->is_favorite);
    }

    public function test_user_can_record_copy_and_increment_counter(): void
    {
        $user = User::factory()->create();
        $prompt = Prompt::factory()->create(['user_id' => $user->id, 'copy_count' => 0]);

        $response = $this->actingAs($user)->post(route('prompts.copied', $prompt));

        $response->assertRedirect();
        $prompt->refresh();
        $this->assertSame(1, $prompt->copy_count);
        $this->assertNotNull($prompt->last_copied_at);
    }
}
