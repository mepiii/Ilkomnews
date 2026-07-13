<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds performance indexes to frequently queried columns in content tables.
     * These indexes significantly improve query performance for filtering, sorting, and published status checks.
     */
    public function up(): void
    {
        $tables = [
            'news' => [
                ['published', 'idx_news_published'],
                ['category', 'idx_news_category'],
                ['date', 'idx_news_date'],
                ['published, date', 'idx_news_published_date'],
            ],
            'events' => [
                ['published', 'idx_events_published'],
                ['category', 'idx_events_category'],
                ['date', 'idx_events_date'],
                ['published, date', 'idx_events_published_date'],
            ],
            'careers' => [
                ['published', 'idx_careers_published'],
                ['published_at', 'idx_careers_published_at'],
                ['published, published_at', 'idx_careers_published_published_at'],
            ],
            'project_submissions' => [
                ['status', 'idx_project_submissions_status'],
                ['user_id', 'idx_project_submissions_user_id'],
                ['status, created_at', 'idx_project_submissions_status_created_at'],
            ],
        ];

        foreach ($tables as $tableName => $indexes) {
            if (Schema::hasTable($tableName)) {
                foreach ($indexes as $index) {
                    try {
                        \Illuminate\Support\Facades\DB::statement("ALTER TABLE `{$tableName}` ADD INDEX `{$index[1]}` ({$index[0]})");
                    } catch (\Exception $e) {
                        // Ignore error if index already exists
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // News table indexes
        Schema::table('news', function (Blueprint $table) {
            $table->dropIndex('idx_news_published');
            $table->dropIndex('idx_news_category');
            $table->dropIndex('idx_news_date');
            $table->dropIndex('idx_news_published_date');
        });

        // Events table indexes
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('idx_events_published');
            $table->dropIndex('idx_events_category');
            $table->dropIndex('idx_events_date');
            $table->dropIndex('idx_events_published_date');
        });

        // Careers table indexes
        Schema::table('careers', function (Blueprint $table) {
            $table->dropIndex('idx_careers_published');
            $table->dropIndex('idx_careers_published_at');
            $table->dropIndex('idx_careers_published_published_at');
        });

        // Project submissions table indexes
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->dropIndex('idx_project_submissions_status');
            $table->dropIndex('idx_project_submissions_user_id');
            $table->dropIndex('idx_project_submissions_status_created_at');
        });
    }
};
