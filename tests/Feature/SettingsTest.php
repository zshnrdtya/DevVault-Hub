<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_view_settings_page(): void
    {
        $response = $this->get(route('settings'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_settings_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('settings'));

        $response->assertOk();
    }
}
