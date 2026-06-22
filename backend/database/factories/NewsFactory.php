<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<News>
 */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->randomNumber(5),
            'summary' => fake()->paragraph(2),
            'content' => fake()->paragraphs(5, true),
            'category' => fake()->randomElement(['Workshop', 'Kompetisi', 'Pelatihan', 'Seminar', 'Teknologi', 'Akademik']),
            'date' => fake()->dateTimeBetween('-30 days', '+30 days'),
            'author' => fake()->name(),
            'image' => 'https://picsum.photos/800/400',
            'views' => 100,
            'tags' => fake()->words(3),
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
