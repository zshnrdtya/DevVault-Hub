<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResourceFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_when_accessing_resources(): void
    {
        $response = $this->get(route('resources.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_resources_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('resources.index'));

        $response->assertOk();
    }

    public function test_user_can_filter_resources_by_search_category_and_favorite(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'type' => 'resource',
            'name' => 'Dokumentasi',
        ]);

        $res1 = Resource::factory()->create([
            'user_id' => $user->id,
            'title' => 'Laravel Documentation',
            'url' => 'https://laravel.com/docs',
            'category_id' => $category->id,
            'is_favorite' => true,
        ]);

        $res2 = Resource::factory()->create([
            'user_id' => $user->id,
            'title' => 'React Library Guide',
            'url' => 'https://react.dev',
            'category_id' => null,
            'is_favorite' => false,
        ]);

        // Search query
        $response = $this->actingAs($user)->get(route('resources.index', ['q' => 'Laravel']));
        $response->assertOk();

        // Favorite filter
        $responseFav = $this->actingAs($user)->get(route('resources.index', ['favorite' => '1']));
        $responseFav->assertOk();

        // Category filter
        $responseCat = $this->actingAs($user)->get(route('resources.index', ['category_id' => $category->id]));
        $responseCat->assertOk();
    }

    public function test_user_can_create_resource_with_tags(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'type' => 'resource',
            'name' => 'GitHub',
        ]);

        $response = $this->actingAs($user)->post(route('resources.store'), [
            'title' => 'DevVault GitHub Repository',
            'url' => 'https://github.com/zshnrdtya/DevVault-Hub',
            'note' => 'Repositori utama aplikasi DevVault.',
            'category_id' => $category->id,
            'tags' => ['laravel', 'react'],
            'is_favorite' => true,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('resources', [
            'user_id' => $user->id,
            'title' => 'DevVault GitHub Repository',
            'url' => 'https://github.com/zshnrdtya/DevVault-Hub',
            'category_id' => $category->id,
            'is_favorite' => true,
        ]);

        $resource = Resource::where('title', 'DevVault GitHub Repository')->first();
        $this->assertNotNull($resource);
        $this->assertCount(2, $resource->tags);
    }

    public function test_duplicate_url_flashes_warning_message(): void
    {
        $user = User::factory()->create();
        Resource::factory()->create([
            'user_id' => $user->id,
            'url' => 'https://example.com/duplicate-check',
        ]);

        $response = $this->actingAs($user)->post(route('resources.store'), [
            'title' => 'Duplicate URL Bookmark',
            'url' => 'https://example.com/duplicate-check',
            'note' => null,
            'is_favorite' => false,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('warning');
    }

    public function test_user_cannot_create_resource_with_invalid_url(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('resources.store'), [
            'title' => 'Tautan Rusak',
            'url' => 'bukan-url-valid',
        ]);

        $response->assertSessionHasErrors('url');
    }

    public function test_user_can_view_own_resource(): void
    {
        $user = User::factory()->create();
        $resource = Resource::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('resources.show', $resource));

        $response->assertOk();
    }

    public function test_user_cannot_view_another_users_resource(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $resource = Resource::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->get(route('resources.show', $resource));

        $response->assertForbidden();
    }

    public function test_user_can_update_own_resource(): void
    {
        $user = User::factory()->create();
        $resource = Resource::factory()->create([
            'user_id' => $user->id,
            'title' => 'Judul Lama',
            'url' => 'https://old.example.com',
        ]);

        $response = $this->actingAs($user)->put(route('resources.update', $resource), [
            'title' => 'Judul Baru Diperbarui',
            'url' => 'https://new.example.com',
            'note' => 'Catatan baru diperbarui.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('resources', [
            'id' => $resource->id,
            'title' => 'Judul Baru Diperbarui',
            'url' => 'https://new.example.com',
        ]);
    }

    public function test_user_cannot_update_another_users_resource(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $resource = Resource::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->put(route('resources.update', $resource), [
            'title' => 'Perubahan Tak Sah',
            'url' => 'https://hacked.com',
        ]);

        $response->assertForbidden();
    }

    public function test_user_can_soft_delete_own_resource(): void
    {
        $user = User::factory()->create();
        $resource = Resource::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('resources.destroy', $resource));

        $response->assertRedirect(route('resources.index'));
        $this->assertSoftDeleted('resources', ['id' => $resource->id]);
    }

    public function test_user_cannot_delete_another_users_resource(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $resource = Resource::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)->delete(route('resources.destroy', $resource));

        $response->assertForbidden();
        $this->assertDatabaseHas('resources', ['id' => $resource->id, 'deleted_at' => null]);
    }

    public function test_user_can_toggle_favorite_status(): void
    {
        $user = User::factory()->create();
        $resource = Resource::factory()->create(['user_id' => $user->id, 'is_favorite' => false]);

        $response = $this->actingAs($user)->patch(route('resources.favorite', $resource));

        $response->assertRedirect();
        $this->assertTrue($resource->fresh()->is_favorite);
    }

    public function test_dashboard_displays_resource_stats_and_favorites(): void
    {
        $user = User::factory()->create();
        Resource::factory()->count(3)->create(['user_id' => $user->id]);
        Resource::factory()->favorite()->create([
            'user_id' => $user->id,
            'title' => 'Awesome Resource',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
    }
}
