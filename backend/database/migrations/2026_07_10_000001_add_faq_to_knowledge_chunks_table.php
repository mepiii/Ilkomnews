<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite stores enum columns as freeform TEXT, so 'faq' is already
        // allowed there — only MySQL needs the column definition widened.
        // ponytail: without the driver guard the sqlite test DB (phpunit.xml)
        // would 0/88 the whole suite on a MySQL-only MODIFY COLUMN statement.
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE knowledge_chunks MODIFY COLUMN source_type ENUM('news','article','event','project','faq') NOT NULL");
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE knowledge_chunks MODIFY COLUMN source_type ENUM('news','article','event','project') NOT NULL");
        }
    }
};
