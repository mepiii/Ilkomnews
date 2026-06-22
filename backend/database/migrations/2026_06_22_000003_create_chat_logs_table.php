<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_logs', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 64)->index();
            $table->string('user_message', 200);
            $table->text('response');
            $table->string('status'); // success, rejected, topic_rejected, no_context, error
            $table->string('ip_address', 45);
            $table->timestamps();
            $table->index('created_at');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_logs');
    }
};
