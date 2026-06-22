<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait Publishable
{
    /**
     * Boot the Publishable trait for a model.
     */
    protected static function bootPublishable(): void
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title);
            }
        });
    }

    /**
     * Scope a query to only include published records.
     */
    public function scopePublished($query)
    {
        return $query->where('published', true);
    }
}
