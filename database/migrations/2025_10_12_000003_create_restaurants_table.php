<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id('id_restaurant');
            $table->string('nom_restaurant', 150);
            $table->text('adresse_restaurant');
            $table->string('telephone_restaurant', 30)->nullable();
            $table->string('email_restaurant', 255)->nullable();
            $table->time('heure_ouverture');
            $table->time('heure_fermeture');
            $table->boolean('livraison_active')->default(true);
            $table->enum('statut_restaurant', ['actif', 'inactif'])->default('actif');
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamps();

            // Contraintes MySQL (CHECK supporté depuis 8.0.16)
            // Note: Les CHECK constraints nommés sont préférés
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};