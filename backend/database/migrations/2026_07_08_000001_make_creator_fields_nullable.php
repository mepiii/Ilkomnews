<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->string('creator_nim', 50)->nullable()->change();
            $table->string('creator_major', 255)->nullable()->change();
            $table->integer('creator_year')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->string('creator_nim', 50)->nullable(false)->change();
            $table->string('creator_major', 255)->nullable(false)->change();
            $table->integer('creator_year')->nullable(false)->change();
        });
    }
};
