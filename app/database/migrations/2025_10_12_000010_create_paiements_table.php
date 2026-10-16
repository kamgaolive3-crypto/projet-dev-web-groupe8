<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id('id_paiement');
            $table->string('reference_paiement', 150)->unique(); // Référence agrégateur (CinetPay, etc.)
            $table->unsignedBigInteger('id_commande');
            $table->unsignedBigInteger('id_utilisateur'); // Étudiant payeur
            $table->unsignedBigInteger('montant_paye'); // CFA
            $table->enum('mode_paiement', ['MOMO', 'OM', 'loyalty', 'mixed']); // Mobile Money MTN, Orange Money, Points, Mixte
            $table->enum('statut', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            $table->json('gateway_response')->nullable(); // Réponse brute de l'API paiement
            $table->timestamp('date_paiement')->nullable();
            $table->timestamps();

            $table->foreign('id_commande')
                ->references('id_commande')->on('commandes')
                ->onDelete('cascade');

            $table->foreign('id_utilisateur')
                ->references('id_utilisateur')->on('etudiants')
                ->onDelete('restrict');

            $table->index(['id_commande', 'statut']);
            $table->index('reference_paiement');
            $table->index('date_paiement');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};