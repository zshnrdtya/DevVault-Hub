<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<resource>
 */
class ResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => null,
            'title' => fake()->sentence(3),
            'url' => fake()->url(),
            'note' => fake()->optional()->sentence(),
            'is_favorite' => false,
        ];
    }

    public function favorite(): static
    {
        return $this->state(fn () => ['is_favorite' => true]);
    }

    public function withCategory(?Category $category = null): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category?->id ?? Category::factory()->resource()->create(['user_id' => $attributes['user_id']])->id,
        ]);
    }
}
