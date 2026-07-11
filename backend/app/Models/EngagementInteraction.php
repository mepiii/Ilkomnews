<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EngagementInteraction extends Model
{
    use HasFactory;

    protected $table = 'engagement_interactions';

    public $timestamps = false;

    protected $fillable = [
        'visitor_id',
        'interactable_type',
        'interactable_id',
        'type',
    ];

    protected $casts = [
        'interactable_id' => 'integer',
        'type' => 'string',
    ];

    /**
     * Scope rows for a given item + interaction type.
     */
    public function scopeForItem(Builder $query, string $type, $id): Builder
    {
        return $query->where('interactable_type', $type)
            ->where('interactable_id', (int) $id);
    }

    /**
     * Count rows for a given item + interaction type + (optional) visitor.
     */
    public static function countForItem(string $type, $id, ?string $interactionType = null): int
    {
        $query = static::forItem($type, $id);

        if ($interactionType !== null) {
            $query->where('type', $interactionType);
        }

        return $query->count();
    }
}
