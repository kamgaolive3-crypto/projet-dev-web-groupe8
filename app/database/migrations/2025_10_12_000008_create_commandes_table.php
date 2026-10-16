<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id('id_commande');
            $table->string('numero_commande', 20)->unique(); // Format: #COM0001
            $table->unsignedBigInteger('id_utilisateur'); // FK vers etudiants
            $table->unsignedBigInteger('id_restaurant');
            $table->enum('statut', [
                'en_attente',
                'validee',
                'en_preparation',
                'prete',
                'en_livraison',
                'servie',
                'annulee'
            ])->default('en_attente');
            $table->enum('mode_service', ['sur_place', 'livraison'])->default('sur_place');
            $table->time('heure_recup')->nullable(); // Heure prévue si sur_place
            $table->text('adresse_livraison')->nullable(); // Si livraison
            $table->unsignedBigInteger('sous_total'); // CFA
            $table->unsignedBigInteger('frais_livraison')->default(0);
            $table->unsignedBigInteger('reduction_points')->default(0); // Montant réduction via points
            $table->unsignedInteger('points_utilises')->default(0);
            $table->unsignedInteger('points_gagnes')->default(0);
            $table->unsignedBigInteger('montant_total'); // CFA = sous_total + frais - réduction
            $table->enum('statut_paiement', ['unpaid', 'paid', 'refunded', 'partial'])->default('unpaid');
            $table->string('mode_paiement', 10)->nullable(); // MOMO, OM, loyalty, mixed
            $table->string('reference_paiement', 150)->nullable();
            $table->text('commentaire')->nullable(); // Commentaire client après livraison
            $table->unsignedBigInteger('id_valideur')->nullable(); // FK employes
            $table->timestamp('date_validation')->nullable();
            $table->unsignedBigInteger('id_admin_valideur')->nullable(); // FK administrateurs
            $table->timestamp('date_validation_admin')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('id_utilisateur')
                ->references('id_utilisateur')->on('etudiants')
                ->onDelete('restrict');

            $table->foreign('id_restaurant')
                ->references('id_restaurant')->on('restaurants')
                ->onDelete('cascade');

            $table->foreign('id_valideur')
                ->references('id_utilisateur')->on('employes')
                ->onDelete('set null');

            $table->foreign('id_admin_valideur')
                ->references('id_utilisateur')->on('administrateurs')
                ->onDelete('set null');

            // Index
            $table->index(['id_restaurant', 'statut']);
            $table->index(['id_utilisateur', 'statut']);
            $table->index('statut_paiement');
            $table->index('date_validation');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};