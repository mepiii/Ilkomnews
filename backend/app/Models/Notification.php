<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $fillable = ['tracking_id', 'project_id', 'type', 'title', 'message', 'read'];

    protected $casts = ['read' => 'boolean'];

    public function project()
    {
        return $this->belongsTo(ProjectSubmission::class, 'project_id');
    }

    protected static function booted(): void
    {
        static::created(function ($notif) {
            if ($notif->tracking_id) {
                \App\Notifications\SseRegistry::push($notif->tracking_id, $notif);
            }
        });
    }
}
