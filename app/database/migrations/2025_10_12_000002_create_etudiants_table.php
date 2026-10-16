<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('etudiants', function (Blueprint $table) {
            // PK = FK vers utilisateurs (héritage)
            $table->unsignedBigInteger('id_utilisateur')->primary();
            $table->text('localisation')->nullable(); // Adresse GPS ou texte libre
            $table->string('code_parrainage', 8)->unique()->nullable(); // Format: ABCD1234
            $table->unsignedInteger('solde_point')->default(0);
            $table->unsignedBigInteger('parrain_id')->nullable(); // FK vers etudiants.id_utilisateur (auto-référence)
            $table->timestamps();

            // Foreign keys
            $table->foreign('id_utilisateur')
                ->references('id_utilisateur')->on('utilisateurs')
                ->onDelete('cascade');

            $table->foreign('parrain_id')
                ->references('id_utilisateur')->on('etudiants')
                ->onDelete('set null');

            // Index
            $table->index('code_parrainage');
            $table->index('parrain_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};