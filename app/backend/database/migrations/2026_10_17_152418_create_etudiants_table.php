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
        if (Schema::hasTable('etudiant')) {
            return;
        }
        Schema::create('etudiant', function (Blueprint $table) {
            $table->string('Id_utilisateur', 10)->primary();
            $table->text('localisation')->nullable();
            $table->string('code_parrainage', 8)->unique();
            $table->integer('solde_point')->default(0);
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
        Schema::dropIfExists('etudiant');
    }
};
