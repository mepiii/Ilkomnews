<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_id', 36)->unique();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');

            // Project info
            $table->string('title');
            $table->string('category'); // web, mobile, uiux, game, ai
            $table->text('description');
            $table->string('thumbnail')->nullable();
            $table->json('tech_stack')->nullable();
            $table->string('live_demo')->nullable();
            $table->string('github_link')->nullable();
            $table->string('download_link')->nullable();
            $table->string('figma_link')->nullable();
            $table->json('screenshots')->nullable();

            // Creator info
            $table->string('creator_name');
            $table->string('creator_nim');
            $table->string('creator_major');
            $table->integer('creator_year');

            // Collaborators
            $table->json('collaborators')->nullable();

            // Admin notes
            $table->text('rejection_reason')->nullable();
            $table->string('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_submissions');
    }
};
