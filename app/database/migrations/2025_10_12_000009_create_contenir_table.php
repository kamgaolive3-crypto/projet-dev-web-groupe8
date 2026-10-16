<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contenir', function (Blueprint $table) {
            $table->unsignedBigInteger('id_commande');
            $table->unsignedBigInteger('id_article');
            $table->unsignedInteger('quantite');
            $table->unsignedBigInteger('prix_unitaire'); // Prix figé au moment de la commande (CFA)
            $table->text('notes')->nullable(); // Instructions spéciales (ex: sans oignon)
            $table->timestamps();

            // Clé primaire composée
            $table->primary(['id_commande', 'id_article']);

            // Foreign keys
            $table->foreign('id_commande')
                ->references('id_commande')->on('commandes')
                ->onDelete('cascade');

            $table->foreign('id_article')
                ->references('id_article')->on('articles_menu')
                ->onDelete('restrict');

            $table->index('id_article');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contenir');
    }
};