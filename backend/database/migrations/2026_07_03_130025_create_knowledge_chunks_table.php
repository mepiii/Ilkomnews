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
        Schema::create('knowledge_chunks', function (Blueprint $table) {
            $table->id();
            $table->enum('source_type', ['news', 'event', 'project']);
            $table->unsignedBigInteger('source_id');
            $table->text('chunk_text');
            $table->text('summary')->nullable();
            $table->json('embedding')->nullable();
            $table->string('embedding_model', 64)->nullable();
            $table->integer('token_count')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->index(['source_type', 'source_id']);
            $table->index('embedding_model');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_chunks');
    }
};
