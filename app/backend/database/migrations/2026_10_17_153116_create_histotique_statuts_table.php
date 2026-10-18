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
        if (Schema::hasTable('historique_statut')) {
            return;
        }
        Schema::create('historique_statut', function (Blueprint $table) {
            $table->string('Id_historique', 8)->primary();
            $table->string('nouveau_statut', 30);
            $table->dateTime('date_changement')->useCurrent();
            $table->string('Id_commande', 8);
            $table->string('Id_utilisateur', 10); // employé, gérant ou administrateur
            $table->timestamps();

            $table->index(['Id_commande', 'date_changement']);
            $table->index('nouveau_statut');

            $table->foreign('Id_commande')->references('Id_commande')->on('commande');
            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('utilisateur');
        });

        if (in_array(DB::connection()->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `historique_statut` ADD CONSTRAINT `chk_hist_statut` CHECK (`nouveau_statut` IN ('en_attente','validee','en_preparation','prete','en_livraison','servie','annulee'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_statut');
    }
};
