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
        if (Schema::hasTable('employe')) {
            return;
        }
        Schema::create('employe', function (Blueprint $table) {
            $table->string('Id_utilisateur', 10)->primary();
            $table->string('poste', 100)->nullable();
            $table->date('date_embauche')->nullable();
            $table->string('Id_restaurant', 5)->nullable();
            $table->string('Id_createur', 10)->nullable(); // gérant ou admin ayant créé le compte
            $table->foreign('Id_createur')->references('Id_utilisateur')->on('utilisateur')->nullOnDelete();
            $table->dateTime('date_creation_compte')->useCurrent();
            $table->timestamps();

            $table->foreign('Id_utilisateur')
                ->references('Id_utilisateur')->on('utilisateur')
                ->onDelete('cascade');
            $table->foreign('Id_restaurant')
                ->references('Id_restaurant')->on('restaurant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employe');
    }
};
