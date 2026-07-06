<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('engagement_interactions', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_id', 64);
            $table->string('interactable_type', 255);
            $table->unsignedBigInteger('interactable_id');
            $table->enum('type', ['love', 'save', 'seen']);
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['visitor_id', 'interactable_type', 'interactable_id', 'type'], 'unique_interaction');
            $table->index(['interactable_type', 'interactable_id']);
            $table->index('visitor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_interactions');
    }
};
