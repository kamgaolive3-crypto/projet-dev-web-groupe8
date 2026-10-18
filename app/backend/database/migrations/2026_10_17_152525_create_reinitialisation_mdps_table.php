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
        if (Schema::hasTable('reinitialisation_mdp')) {
            return;
        }
        Schema::create('reinitialisation_mdp', function (Blueprint $table) {
            $table->string('Id_reset', 8)->primary();
            $table->string('token_hash', 255); // hash du jeton, jamais le jeton en clair
            $table->dateTime('date_demande')->useCurrent();
            $table->dateTime('date_expiration');
            $table->boolean('utilise')->default(0);
            $table->string('Id_utilisateur', 10);
            $table->timestamps();

            $table->foreign('Id_utilisateur')
                ->references('Id_utilisateur')->on('utilisateur')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reinitialisation_mdp');
    }
};
