<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add critical indexes for frequently queried columns to improve performance.
     */
    public function up(): void
    {
        // News table indexes
        if (!Schema::hasIndex('news', 'news_published_date_index')) {
            Schema::table('news', function (Blueprint $table) {
                $table->index(['published', 'date'], 'news_published_date_index');
            });
        }
        if (!Schema::hasIndex('news', 'news_category_index')) {
            Schema::table('news', function (Blueprint $table) {
                $table->index('category', 'news_category_index');
            });
        }

        // Events table indexes
        if (!Schema::hasIndex('events', 'events_published_date_index')) {
            Schema::table('events', function (Blueprint $table) {
                $table->index(['published', 'date'], 'events_published_date_index');
            });
        }
        if (!Schema::hasIndex('events', 'events_category_index')) {
            Schema::table('events', function (Blueprint $table) {
                $table->index('category', 'events_category_index');
            });
        }

        // Project submissions indexes
        if (!Schema::hasIndex('project_submissions', 'project_submissions_status_index')) {
            Schema::table('project_submissions', function (Blueprint $table) {
                $table->index('status', 'project_submissions_status_index');
            });
        }
        if (!Schema::hasIndex('project_submissions', 'project_submissions_category_index')) {
            Schema::table('project_submissions', function (Blueprint $table) {
                $table->index('category', 'project_submissions_category_index');
            });
        }

        // Chat messages optimization
        if (!Schema::hasIndex('chat_messages', 'chat_messages_conversation_created_index')) {
            Schema::table('chat_messages', function (Blueprint $table) {
                $table->index(['conversation_id', 'created_at'], 'chat_messages_conversation_created_index');
            });
        }

        // Notifications optimization
        if (!Schema::hasIndex('notifications', 'notifications_tracking_id_index')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->index('tracking_id', 'notifications_tracking_id_index');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropIndex('news_published_date_index');
            $table->dropIndex('news_category_index');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('events_published_date_index');
            $table->dropIndex('events_category_index');
        });

        Schema::table('project_submissions', function (Blueprint $table) {
            $table->dropIndex('project_submissions_status_index');
            $table->dropIndex('project_submissions_category_index');
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropIndex('chat_messages_conversation_created_index');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('notifications_tracking_id_index');
        });
    }
};
