<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\ProjectSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'tracking_id' => strtoupper(fake()->bothify('????????????')),
            'project_id' => ProjectSubmission::factory(),
            'type' => fake()->randomElement(['submitted', 'accepted', 'rejected', 'admin', 'info']),
            'title' => fake()->sentence(4),
            'message' => fake()->sentence(8),
            'read' => false,
        ];
    }

    public function read(): static
    {
        return $this->state(fn () => ['read' => true]);
    }
}
