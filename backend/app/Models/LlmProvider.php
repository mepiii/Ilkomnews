<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LlmProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'base_url',
        'api_key',
        'model_id',
        'priority',
        'is_active',
        'provider_type',
        'prefix',
        'api_type',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'priority' => 'integer',
        'api_key' => 'encrypted',
    ];
}
