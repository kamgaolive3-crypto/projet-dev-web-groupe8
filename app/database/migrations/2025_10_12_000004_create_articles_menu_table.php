<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles_menu', function (Blueprint $table) {
            $table->id('id_article');
            $table->string('nom_article', 150);
            $table->text('description')->nullable();
            $table->unsignedBigInteger('prix_article'); // En francs CFA (entier)
            $table->string('categories_article', 255); // 'plat,boisson,dessert,autre' - peut être multiple
            $table->boolean('disponibilite_article')->default(true);
            $table->boolean('menu_du_jour')->default(false);
            $table->string('image_url', 500)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->json('metadata')->nullable(); // Infos suppl.: allergènes, temps prépa, etc.
            $table->unsignedBigInteger('id_restaurant');
            $table->timestamps();
            $table->softDeletes();

            // Foreign key
            $table->foreign('id_restaurant')
                ->references('id_restaurant')->on('restaurants')
                ->onDelete('cascade');

            // Index
            $table->index(['id_restaurant', 'disponibilite_article']);
            $table->index(['id_restaurant', 'menu_du_jour']);
            $table->index('categories_article');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles_menu');
    }
};