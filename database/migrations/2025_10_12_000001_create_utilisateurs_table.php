<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id('id_utilisateur'); // BIGINT UNSIGNED AUTO_INCREMENT
            $table->string('uuid', 36)->unique(); // Pour API publique
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('email', 255)->unique();
            $table->string('mot_de_passe', 255); // Hashé
            $table->char('telephone', 9)->unique(); // Format: 6XXXXXXXX
            $table->timestamp('date_inscription')->useCurrent();
            $table->enum('statut_compte', ['actif', 'inactif'])->default('actif');
            $table->enum('role', ['etudiant', 'employe', 'gerant', 'administrateur'])->default('etudiant');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            // Index pour performances
            $table->index(['role', 'statut_compte']);
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};