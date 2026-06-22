<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('summary')->nullable();
            $table->text('content');
            $table->string('category'); // Conference, Hackathon, Workshop, Seminar, Webinar
            $table->date('date');
            $table->string('location')->nullable();
            $table->string('image')->nullable();
            $table->unsignedInteger('registered')->default(0);
            $table->unsignedInteger('capacity')->default(0);
            $table->string('duration')->nullable();
            $table->string('price')->default('Gratis');
            $table->boolean('published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
