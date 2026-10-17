<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //evite l'erreur si la table exite deja dans mysql
        if (Schema::hasTable('restaurant')){
            return;
        }
        Schema::create('restaurant', function (Blueprint $table) {
            $table->string('Id_restaurant', 5)->primary();
            $table->string('nom_restaurant', 150);
            $table->string('adresse_restaurant', 30);
            $table->string('telephone_restaurant', 30)->nullable();
            $table->string('email_restaurant', 255)->nullable();
            $table->time('heure_ouverture');
            $table->time('heure_fermeture');
            $table->boolean('livraison_active')->default(false);
            $table->dateTime('date_creation')->useCurrent();
            $table->string('statut_restaurant', 20)->default('actif');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant');
    }
};
