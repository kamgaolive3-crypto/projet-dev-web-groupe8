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
        if (Schema::hasTable('parametre')) {
            return;
        }
        Schema::create('parametre', function (Blueprint $table) {
            $table->string('Id_parametre',5)->primary();
            $table->string('cle',100);
            $table->text('valeur');
            $table->string('Id_utilisateur',10)->nullable(); // dernier modificateur (facultatif, dictionnaire)
            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('administrateur')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parametre');
    }
};
