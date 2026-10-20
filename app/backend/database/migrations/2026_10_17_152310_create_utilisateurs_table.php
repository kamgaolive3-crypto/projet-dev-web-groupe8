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
        if (Schema::hasTable('utilisateur')) {
            return;
        }
        Schema::create('utilisateur', function (Blueprint $table) {
            $table->string('Id_utilisateur', 10)->primary();
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('email', 255)->unique();
            $table->string('mot_de_passe', 255); // hash uniquement (bcrypt/argon2)
            $table->dateTime('date_inscription')->useCurrent();
            $table->string('statut_compte', 20)->default('actif');
            $table->char('telephone', 9);
            $table->rememberToken();
            $table->timestamps();

            $table->index('telephone');
            $table->index('statut_compte');
        });

        // Contraintes CHECK non disponibles en SQLite (tests) : appliquées seulement sur MySQL/MariaDB
        if (in_array(DB::connection()->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `utilisateur` ADD CONSTRAINT `chk_user_statut` CHECK (`statut_compte` IN ('actif','inactif'))");
            DB::statement("ALTER TABLE `utilisateur` ADD CONSTRAINT `chk_user_tel` CHECK (`telephone` REGEXP '^6[0-9]{8}$')");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateur');
    }
};
