<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE knowledge_chunks MODIFY COLUMN source_type ENUM('news','article','event','project','faq') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE knowledge_chunks MODIFY COLUMN source_type ENUM('news','article','event','project') NOT NULL");
    }
};
