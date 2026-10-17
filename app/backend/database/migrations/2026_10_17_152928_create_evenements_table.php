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
        if (Schema::hasTable('evenement')) {
            return;
        }
        Schema::create('evenement', function (Blueprint $table) {
            $table->string('Id_evenement', 7)->primary();
            $table->text('affiche_evenement'); //chemin ou url de l'affiche
            $table->dateTime('debut_evenement');
            $table->dateTime('fin_evenement');
            $table->string('type_evenement',20);
            $table->unsignedInteger('points_evenement')->default(0);
            $table->unsignedTinyInteger('taux_reduction')->nullable();
            $table->text('description_evenement');
            $table->string('Id_utilisateur',10);
            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('administrateur')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evenement');
    }
};
