<?php

namespace Database\Factories;

use App\Models\ChatLog;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ChatLog>
 */
class ChatLogFactory extends Factory
{
    protected $model = ChatLog::class;

    public function definition(): array
    {
        return [
            'session_id' => Str::random(32),
            'user_message' => fake()->sentence(6),
            'response' => fake()->paragraph(2),
            'status' => fake()->randomElement(['success', 'rejected', 'topic_rejected', 'no_context']),
            'ip_address' => fake()->ipv4(),
        ];
    }
}
