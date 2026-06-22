<?php

namespace App\Models;

use App\Traits\Publishable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory, Publishable;

    protected $fillable = [
        'title', 'slug', 'summary', 'content', 'category',
        'date', 'author', 'image', 'read_time', 'tags', 'published',
    ];

    protected $casts = [
        'tags' => 'array',
        'date' => 'date',
        'published' => 'boolean',
    ];
}
