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
        // News table indexes
        Schema::table('news', function (Blueprint $table) {
            $table->index('published', 'idx_news_published');
            $table->index('category', 'idx_news_category');
            $table->index('date', 'idx_news_date');
            $table->index(['published', 'date'], 'idx_news_published_date');
        });

        // Articles table indexes
        Schema::table('articles', function (Blueprint $table) {
            $table->index('published', 'idx_articles_published');
            $table->index('category', 'idx_articles_category');
            $table->index('date', 'idx_articles_date');
            $table->index(['published', 'date'], 'idx_articles_published_date');
        });

        // Events table indexes
        Schema::table('events', function (Blueprint $table) {
            $table->index('published', 'idx_events_published');
            $table->index('category', 'idx_events_category');
            $table->index('date', 'idx_events_date');
            $table->index(['published', 'date'], 'idx_events_published_date');
        });

        // Careers table indexes
        Schema::table('careers', function (Blueprint $table) {
            $table->index('published', 'idx_careers_published');
            $table->index('position_type', 'idx_careers_position_type');
            $table->index('published_at', 'idx_careers_published_at');
            $table->index(['published', 'published_at'], 'idx_careers_published_published_at');
        });

        // Project submissions table indexes
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->index('status', 'idx_project_submissions_status');
            $table->index('user_id', 'idx_project_submissions_user_id');
            $table->index(['status', 'created_at'], 'idx_project_submissions_status_created_at');
        });
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

        // Articles table indexes
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex('idx_articles_published');
            $table->dropIndex('idx_articles_category');
            $table->dropIndex('idx_articles_date');
            $table->dropIndex('idx_articles_published_date');
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
            $table->dropIndex('idx_careers_position_type');
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
