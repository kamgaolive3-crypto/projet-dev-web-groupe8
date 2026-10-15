<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mvt_points', function (Blueprint $table) {
            $table->id('id_mvt');
            $table->unsignedBigInteger('id_utilisateur'); // FK vers etudiants
            $table->unsignedBigInteger('id_commande')->nullable(); // Nullable: expiration, parrainage sans commande
            $table->enum('type_mvt', ['gain', 'utilisation', 'expiration', 'parrainage']);
            $table->integer('nbre_points'); // Positif pour gain/parrainage, négatif pour utilisation/expiration
            $table->unsignedInteger('solde_apres'); // Solde après ce mouvement (pour audit rapide)
            $table->string('description', 255)->nullable();
            $table->timestamp('date_expiration')->nullable(); // Pour type 'gain' et 'parrainage': +12 mois
            $table->timestamps();

            $table->foreign('id_utilisateur')
                ->references('id_utilisateur')->on('etudiants')
                ->onDelete('cascade');

            $table->foreign('id_commande')
                ->references('id_commande')->on('commandes')
                ->onDelete('set null');

            $table->index(['id_utilisateur', 'type_mvt']);
            $table->index(['id_utilisateur', 'date_expiration']);
            $table->index('date_expiration'); // Pour job nettoyage expirés
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mvt_points');
    }
};