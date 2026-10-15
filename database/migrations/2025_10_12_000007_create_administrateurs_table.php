<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('administrateurs', function (Blueprint $table) {
            $table->unsignedBigInteger('id_utilisateur')->primary();
            $table->date('date_nomination')->nullable();
            $table->unsignedBigInteger('id_restaurant');
            $table->timestamps();

            $table->foreign('id_utilisateur')
                ->references('id_utilisateur')->on('utilisateurs')
                ->onDelete('cascade');

            $table->foreign('id_restaurant')
                ->references('id_restaurant')->on('restaurants')
                ->onDelete('cascade');

            $table->index('id_restaurant');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('administrateurs');
    }
};