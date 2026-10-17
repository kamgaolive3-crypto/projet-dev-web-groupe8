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
        if (Schema::hasTable('participation_evenement')) {
            return;
        }
        Schema::create('participation_evenement', function (Blueprint $table) {
            $table->string('Id_utilisateur', 10);
            $table->string('Id_evenement', 7);
            $table->dateTime('date_participation')->useCurrent();
            $table->integer('points_gagnes')->default(0);
            $table->string('prix_gagne', 150)->nullable();
            $table->string('Id_mvt', 5)->nullable();          // colonne créée ici

            $table->primary(['Id_utilisateur', 'Id_evenement']);

            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('etudiant');
            $table->foreign('Id_evenement')->references('Id_evenement')->on('evenement');
            $table->foreign('Id_mvt')->references('Id_mvt')->on('mvt_points');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participation_evenement');
    }
};
