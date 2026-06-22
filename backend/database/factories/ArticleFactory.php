<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->randomNumber(5),
            'summary' => fake()->paragraph(2),
            'content' => fake()->paragraphs(5, true),
            'category' => fake()->randomElement(['Tutorial', 'Pembelajaran', 'Opini', 'Review', 'Tips & Trik']),
            'date' => fake()->dateTimeBetween('-30 days', '+30 days'),
            'author' => fake()->name(),
            'image' => 'https://picsum.photos/800/400',
            'read_time' => fake()->numberBetween(3, 20) . ' min read',
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
