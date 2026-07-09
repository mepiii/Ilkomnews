<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_type',
        'item_id',
        'views',
        'likes',
        'saves',
        'shares',
    ];

    protected $casts = [
        'views' => 'integer',
        'likes' => 'integer',
        'saves' => 'integer',
        'shares' => 'integer',
    ];

    /**
     * Get stats for a specific item
     */
    public static function getStats(string $type, $id): array
    {
        $interaction = static::where('item_type', $type)
            ->where('item_id', $id)
            ->first();

        return [
            'views' => $interaction?->views ?? 0,
            'likes' => $interaction?->likes ?? 0,
            'saves' => $interaction?->saves ?? 0,
            'shares' => $interaction?->shares ?? 0,
        ];
    }
}
