<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageHash extends Model
{
    protected $fillable = [
        'hash',
        'path',
        'reference_count',
    ];

    protected $casts = [
        'reference_count' => 'integer',
    ];
}
