<?php

namespace Database\Factories;

use App\Models\ProjectSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProjectSubmission>
 */
class ProjectSubmissionFactory extends Factory
{
    protected $model = ProjectSubmission::class;

    public function definition(): array
    {
        return [
            'tracking_id' => strtoupper(Str::random(12)),
            'status' => 'pending',
            'title' => fake()->sentence(4),
            'category' => fake()->randomElement(['web', 'mobile', 'uiux', 'game', 'ai']),
            'description' => fake()->paragraphs(3, true),
            'thumbnail' => 'https://picsum.photos/400/300',
            'tech_stack' => fake()->randomElements(['React', 'Laravel', 'Python', 'Flutter', 'Node.js', 'PostgreSQL'], 3),
            'live_demo' => 'https://' . fake()->domainName(),
            'github_link' => 'https://github.com/' . fake()->userName() . '/' . fake()->slug(2),
            'creator_name' => fake()->name(),
            'creator_type' => fake()->randomElement(['mahasiswa', 'dosen']),
            'creator_nim' => '0903128' . fake()->numerify('#######'),
            'creator_major' => fake()->randomElement(['S1 Teknik Informatika', 'S1 Sistem Informasi']),
            'creator_year' => fake()->numberBetween(2020, 2024),
            'collaborators' => fake()->boolean(50) ? [fake()->name(), fake()->name()] : null,
        ];
    }

    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accepted',
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => fake()->sentence(8),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }
}
