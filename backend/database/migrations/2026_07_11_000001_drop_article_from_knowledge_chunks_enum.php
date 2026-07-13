<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Article source type removed (whole Article feature deleted).
     * Live table may still carry the enum value — widen only the MySQL column;
     * SQLite stores enum as freeform TEXT so nothing to alter there.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE knowledge_chunks MODIFY COLUMN source_type ENUM('news','event','project','faq') NOT NULL");
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE knowledge_chunks MODIFY COLUMN source_type ENUM('news','article','event','project','faq') NOT NULL");
        }
    }
};
