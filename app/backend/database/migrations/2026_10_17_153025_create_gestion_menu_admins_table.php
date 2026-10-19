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
        if (Schema::hasTable('gestion_menu_admin')) {
            return;
        }
        Schema::create('gestion_menu_admin', function (Blueprint $table) {
            $table->string('Id_utilisateur',10); //administateur
            $table->string('Id_aticle',6);
            $table->dateTime('date_modification')->useCurrent();
            $table->string('nature_modification',255);

            $table->primary(['Id_utilisateur', 'Id_aticle']);
            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('administrateur')->onDelete('cascade');
            $table->foreign('Id_article')->references('Id_article')->on('article_menu')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gestion_menu_admin');
    }
};
