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
        Schema::table('news', function (Blueprint $table) {
            $table->integer('love_count')->default(0)->after('views');
            $table->integer('save_count')->default(0)->after('love_count');
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->integer('love_count')->default(0)->after('read_time');
            $table->integer('save_count')->default(0)->after('love_count');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->integer('love_count')->default(0)->after('capacity');
            $table->integer('save_count')->default(0)->after('love_count');
        });

        Schema::table('project_submissions', function (Blueprint $table) {
            $table->integer('love_count')->default(0)->after('github_link');
            $table->integer('save_count')->default(0)->after('love_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['love_count', 'save_count']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['love_count', 'save_count']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['love_count', 'save_count']);
        });

        Schema::table('project_submissions', function (Blueprint $table) {
            $table->dropColumn(['love_count', 'save_count']);
        });
    }
};
