<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id('id_reclamation');
            $table->string('numero_reclamation', 20)->unique(); // Format: #RECLA0001
            $table->unsignedBigInteger('id_utilisateur'); // FK etudiants
            $table->unsignedBigInteger('id_commande');
            $table->string('motif', 255); // Liste contrôlée ou libre
            $table->text('description');
            $table->enum('statut', ['validee', 'observation', 'rejetee'])->default('observation');
            $table->text('reponse')->nullable(); // Réponse conservée dans la réclamation

            // Niveau 1: Employé traitant
            $table->unsignedBigInteger('id_traitant')->nullable(); // FK employes
            $table->timestamp('date_traitement')->nullable();

            // Niveau 2: Gérant décideur
            $table->unsignedBigInteger('id_gerant')->nullable(); // FK gerants
            $table->timestamp('date_decision')->nullable();
            $table->string('decision', 50)->nullable(); // Valeurs à confirmer

            // Niveau 3: Admin (escalade)
            $table->unsignedBigInteger('id_admin_traitant')->nullable(); // FK administrateurs
            $table->timestamp('date_traitement_admin')->nullable();
            $table->unsignedBigInteger('id_admin_decideur')->nullable(); // FK administrateurs
            $table->timestamp('date_decision_admin')->nullable();
            $table->string('decision_admin', 50)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('id_utilisateur')
                ->references('id_utilisateur')->on('etudiants')
                ->onDelete('cascade');

            $table->foreign('id_commande')
                ->references('id_commande')->on('commandes')
                ->onDelete('cascade');

            $table->foreign('id_traitant')
                ->references('id_utilisateur')->on('employes')
                ->onDelete('set null');

            $table->foreign('id_gerant')
                ->references('id_utilisateur')->on('gerants')
                ->onDelete('set null');

            $table->foreign('id_admin_traitant')
                ->references('id_utilisateur')->on('administrateurs')
                ->onDelete('set null');

            $table->foreign('id_admin_decideur')
                ->references('id_utilisateur')->on('administrateurs')
                ->onDelete('set null');

            $table->index(['id_utilisateur', 'statut']);
            $table->index(['id_commande', 'statut']);
            $table->index('statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reclamations');
    }
};