<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livraisons', function (Blueprint $table) {
            $table->id('id_livraison');
            $table->string('numero_livraison', 20)->unique(); // Format: LIV0001
            $table->unsignedBigInteger('id_commande')->unique(); // 1:1 avec commande
            $table->text('adresse_livraison'); // Adresse historique figée
            $table->unsignedBigInteger('frais_livraison')->default(0);
            $table->enum('statut_livraison', [
                'en_attente',
                'assignee',
                'en_cours',
                'livree',
                'echouee'
            ])->default('en_attente');
            $table->timestamp('date_prevue')->nullable();
            $table->timestamp('date_livraison')->nullable();
            $table->unsignedBigInteger('id_livreur')->nullable(); // FK employes (livreur)
            $table->text('notes_livreur')->nullable();
            $table->timestamps();

            $table->foreign('id_commande')
                ->references('id_commande')->on('commandes')
                ->onDelete('cascade');

            $table->foreign('id_livreur')
                ->references('id_utilisateur')->on('employes')
                ->onDelete('set null');

            $table->index(['statut_livraison', 'date_prevue']);
            $table->index('id_livreur');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livraisons');
    }
};