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
        //evite l;erreur si la table existe deja dans mysql
        if(Schema::hasTable('article_menu')){
            return;
        }
        Schema::create('article_menu', function (Blueprint $table) {
            $table->string('Id_article',6)->primary();
            $table->string('nom_article',150);
            $table->string('image_article',255)->nullable();// chemin ou url (facultatif)
            $table->text('description')->nullable();
            $table->bigInteger('prix_article'); // montant CFA (dictionnaire : BIGINT)
            $table->string('categories_article',255);
            $table->boolean('disponibilite_article')->default(1);
            $table->boolean('Menu_du_jour')->default(0);
            $table->string('Id_restaurant', 5);
            $table->foreign('Id_restaurant')->references('Id_restaurant')->on('restaurant')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_menu');
    }
};
