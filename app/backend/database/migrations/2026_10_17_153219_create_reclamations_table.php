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
        if (Schema::hasTable('reclamation')) {
            return;
        }
        Schema::create('reclamation', function (Blueprint $table) {
            $table->string('Id_reclamation', 10)->primary();
            $table->dateTime('date_reclamation')->useCurrent();
            $table->string('motif_reclamation', 255);
            $table->text('description_reclamation')->nullable();
            $table->string('statut_reclamation', 20)->default('en_attente');
            $table->text('reponse_reclamation')->nullable();
            $table->string('Id_utilisateur', 10); // étudiant (Déposer)
            $table->string('Id_commande', 8);    // Concerner
            $table->string('Id_traitant', 10)->nullable();       // employé (Traiter)
            $table->dateTime('date_traitement')->nullable();
            $table->string('Id_gerant', 10)->nullable();         // Gestion_reclamation
            $table->dateTime('date_decision')->nullable();
            $table->string('decision', 50)->nullable();
            $table->string('Id_admin_traitant', 10)->nullable(); // Traiter_admin
            $table->dateTime('date_traitement_admin')->nullable();
            $table->string('Id_admin_decideur', 10)->nullable(); // Gestion_reclamation_admin
            $table->dateTime('date_decision_admin')->nullable();
            $table->string('decision_admin', 50)->nullable();
            $table->timestamps();

            $table->index('Id_utilisateur');
            $table->index('Id_commande');
            $table->index('statut_reclamation');
            $table->index('date_reclamation');

            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('etudiant');
            $table->foreign('Id_commande')->references('Id_commande')->on('commande');
            $table->foreign('Id_traitant')->references('Id_utilisateur')->on('employe');
            $table->foreign('Id_gerant')->references('Id_utilisateur')->on('gerant');
            $table->foreign('Id_admin_traitant')->references('Id_utilisateur')->on('administrateur');
            $table->foreign('Id_admin_decideur')->references('Id_utilisateur')->on('administrateur');
        });

        if (in_array(DB::connection()->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `reclamation` ADD CONSTRAINT `chk_recl_statut` CHECK (`statut_reclamation` IN ('en_attente','observation','validee','rejetee'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reclamation');
    }
};
