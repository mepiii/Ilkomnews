<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ponytail: uses portable Schema API (hasIndex + Blueprint) so the same
    // migration runs on MySQL (prod) and sqlite (tests). Raw ALTER TABLE +
    // information_schema queries are MySQL-only and break the test suite.

    public function up(): void
    {
        $indexes = [
            'news' => [
                'idx_news_published_expires_date' => ['published', 'expires_at', 'date'],
            ],
            'project_submissions' => [
                'idx_projects_status_category_created' => ['status', 'category', 'created_at'],
                'idx_projects_deleted_status_created' => ['deleted_at', 'status', 'created_at'],
                'idx_projects_tracking_status' => ['tracking_id', 'status'],
            ],
            'notifications' => [
                'idx_notifications_read_created' => ['read', 'created_at'],
                'idx_notifications_project_created' => ['project_id', 'created_at'],
                'idx_notifications_type_created' => ['type', 'created_at'],
                'idx_notifications_tracking_created' => ['tracking_id', 'created_at'],
            ],
            'audit_logs' => [
                'idx_audit_logs_action_created' => ['action', 'created_at'],
                'idx_audit_logs_user_created' => ['user_id', 'created_at'],
                'idx_audit_logs_entity_created' => ['entity_type', 'entity_id', 'created_at'],
            ],
            'chat_logs' => [
                'idx_chat_logs_status_created' => ['status', 'created_at'],
                'idx_chat_logs_ip_created' => ['ip_address', 'created_at'],
            ],
            'login_attempts' => [
                'idx_login_attempts_success_created' => ['success', 'created_at'],
                'idx_login_attempts_reason_created' => ['reason', 'created_at'],
            ],
            'users' => [
                'idx_users_is_admin_id' => ['is_admin', 'id'],
            ],
        ];

        foreach ($indexes as $table => $tableIndexes) {
            foreach ($tableIndexes as $name => $columns) {
                if (! Schema::hasIndex($table, $name)) {
                    Schema::table($table, function (Blueprint $table) use ($columns, $name) {
                        $table->index($columns, $name);
                    });
                }
            }
        }
    }

    public function down(): void
    {
        $indexes = [
            'news' => ['idx_news_published_expires_date'],
            'project_submissions' => [
                'idx_projects_status_category_created',
                'idx_projects_deleted_status_created',
                'idx_projects_tracking_status',
            ],
            'notifications' => [
                'idx_notifications_read_created',
                'idx_notifications_project_created',
                'idx_notifications_type_created',
                'idx_notifications_tracking_created',
            ],
            'audit_logs' => [
                'idx_audit_logs_action_created',
                'idx_audit_logs_user_created',
                'idx_audit_logs_entity_created',
            ],
            'chat_logs' => [
                'idx_chat_logs_status_created',
                'idx_chat_logs_ip_created',
            ],
            'login_attempts' => [
                'idx_login_attempts_success_created',
                'idx_login_attempts_reason_created',
            ],
            'users' => ['idx_users_is_admin_id'],
        ];

        foreach ($indexes as $table => $tableIndexes) {
            foreach ($tableIndexes as $name) {
                if (Schema::hasIndex($table, $name)) {
                    Schema::table($table, function (Blueprint $table) use ($name) {
                        $table->dropIndex($name);
                    });
                }
            }
        }
    }
};
