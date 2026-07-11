<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // TTL: null = permanent; timestamp = auto-delete after this moment.
        Schema::table('news', function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('published');
        });
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });
    }
};
