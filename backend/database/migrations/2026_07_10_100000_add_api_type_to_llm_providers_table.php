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
        Schema::table('llm_providers', function (Blueprint $table) {
            // Prefix already added by the *add_prefix migration; add defensively
            // in case that migration has not been applied in this environment.
            if (!Schema::hasColumn('llm_providers', 'prefix')) {
                $table->string('prefix')->nullable()->after('model_id');
            }

            // api_type: 'chat' (Chat Completions) or 'raw' (raw endpoints).
            if (!Schema::hasColumn('llm_providers', 'api_type')) {
                $table->string('api_type')->nullable()->default('chat')->after('prefix');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('llm_providers', function (Blueprint $table) {
            if (Schema::hasColumn('llm_providers', 'api_type')) {
                $table->dropColumn('api_type');
            }

            // Only drop prefix here if it did not already exist before this
            // migration ran (i.e. added by the *add_prefix migration). We keep
            // it conservative and drop it only when present.
            if (Schema::hasColumn('llm_providers', 'prefix')) {
                $table->dropColumn('prefix');
            }
        });
    }
};
