<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            if (! Schema::hasColumn('project_submissions', 'creator_nidn')) {
                $table->string('creator_nidn', 50)->nullable()->after('creator_nim');
            }

            if (! Schema::hasColumn('project_submissions', 'creator_jabatan')) {
                $table->string('creator_jabatan', 255)->nullable()->after('creator_nidn');
            }
        });
    }

    public function down(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            if (Schema::hasColumn('project_submissions', 'creator_jabatan')) {
                $table->dropColumn('creator_jabatan');
            }

            if (Schema::hasColumn('project_submissions', 'creator_nidn')) {
                $table->dropColumn('creator_nidn');
            }
        });
    }
};

