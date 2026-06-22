<?php

namespace Database\Factories;

use App\Models\Career;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Career>
 */
class CareerFactory extends Factory
{
    protected $model = Career::class;

    public function definition(): array
    {
        $title = fake()->jobTitle();
        $company = fake()->company();

        return [
            'title' => $title,
            'slug' => Str::slug($title . ' ' . $company) . '-' . fake()->unique()->randomNumber(5),
            'company' => $company,
            'location' => fake()->city() . ' / Remote',
            'type' => fake()->randomElement(['Internship', 'Full Time', 'Part Time', 'Contract']),
            'salary' => 'Rp ' . fake()->numberBetween(5, 30) . '.000.000/bln',
            'description' => fake()->paragraphs(3, true),
            'requirements' => fake()->words(5),
            'deadline' => fake()->dateTimeBetween('+7 days', '+60 days'),
            'published' => true,
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'published' => false,
        ]);
    }
}
