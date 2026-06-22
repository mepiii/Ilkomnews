<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $title = fake()->sentence(5);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->randomNumber(5),
            'summary' => fake()->paragraph(2),
            'content' => fake()->paragraphs(4, true),
            'category' => fake()->randomElement(['Conference', 'Hackathon', 'Workshop', 'Seminar']),
            'date' => fake()->dateTimeBetween('+7 days', '+90 days'),
            'location' => fake()->address(),
            'image' => 'https://picsum.photos/800/400',
            'registered' => fake()->numberBetween(0, 300),
            'capacity' => fake()->numberBetween(100, 500),
            'duration' => fake()->numberBetween(1, 3) . ' hari',
            'price' => fake()->randomElement(['Gratis', 'Rp 25.000', 'Rp 50.000']),
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
