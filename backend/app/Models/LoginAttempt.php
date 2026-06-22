<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginAttempt extends Model
{
    protected $fillable = [
        'email', 'ip_address', 'success', 'reason', 'user_agent',
    ];

    protected $casts = [
        'success' => 'boolean',
    ];
}
