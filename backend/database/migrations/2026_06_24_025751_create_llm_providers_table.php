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
        Schema::create('llm_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "GitHub Models", "OpenAI"
            $table->string('base_url'); // e.g. "https://models.github.ai/inference"
            $table->text('api_key'); // encrypted
            $table->string('model_id'); // e.g. "deepseek/DeepSeek-V3-0324"
            $table->integer('priority')->default(0); // Lower number = higher priority
            $table->boolean('is_active')->default(true);
            $table->string('provider_type')->default('openai'); // 'openai' or 'anthropic' format
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('llm_providers');
    }
};
