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
        if (Schema::hasTable('mise_a_jour_menu')) {
            return;
        }
        Schema::create('mise_a_jour_menu', function (Blueprint $table) {
            $table->string('Id_utilisateur',10); //employe
            $table->string('Id_article',6);
            $table->dateTime('date_modification')->useCurrent();
            $table->string('nature_modification',255);

            $table->primary(['Id_utilisateur', 'Id_article', 'date_modification']);
            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('employe')->onDelete('cascade');
            $table->foreign('Id_article')->references('Id_article')->on('article_menu')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mise_a_jour_menu');
    }
};
