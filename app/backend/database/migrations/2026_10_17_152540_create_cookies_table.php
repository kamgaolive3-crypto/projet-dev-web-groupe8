<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('cookies')) {
            return;
        }
        Schema::create('cookies', function (Blueprint $table) {
            $table->string('Id_cookies', 10)->primary();
            $table->dateTime('date_cookies')->useCurrent();
            // choix enregistre par le bandeau RGPD (US-004)
            $table->string('choix_cookies', 20)->default('accepte');
            $table->string('version_politique', 30);
            // nullable : un simple visiteur (non connecte) peut consentir
            $table->string('Id_utilisateur', 10)->nullable();
            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('utilisateur')->nullOnDelete();
        });

        // CHECK uniquement sur MySQL (les tests tournent sous SQLite)
        if (in_array(DB::connection()->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `cookies` ADD CONSTRAINT `chk_cookies_choix` CHECK (`choix_cookies` IN ('accepte','refuse','personnalise'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cookies');
    }
};
