<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(2, true);

        return [
            'user_id' => User::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 9999),
            'type' => fake()->randomElement(['snippet', 'prompt', 'resource']),
            'color' => fake()->safeHexColor(),
        ];
    }

    public function snippet(): static
    {
        return $this->state(fn () => ['type' => 'snippet']);
    }

    public function prompt(): static
    {
        return $this->state(fn () => ['type' => 'prompt']);
    }

    public function resource(): static
    {
        return $this->state(fn () => ['type' => 'resource']);
    }
}
