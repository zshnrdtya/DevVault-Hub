<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Prompt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prompt>
 */
class PromptFactory extends Factory
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
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'content' => fake()->paragraphs(2, true),
            'is_favorite' => false,
            'last_copied_at' => null,
            'copy_count' => 0,
        ];
    }

    public function favorite(): static
    {
        return $this->state(fn () => ['is_favorite' => true]);
    }

    public function withCategory(?Category $category = null): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category?->id ?? Category::factory()->prompt()->create(['user_id' => $attributes['user_id']])->id,
        ]);
    }
}
