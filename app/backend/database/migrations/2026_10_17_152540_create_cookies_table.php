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
        if (Schema::hasTable('restaurant')){
            return;
        }
        Schema::create('cookies', function (Blueprint $table) {
            $table->string('Id_cookies',8)->primary();
            $table->dateTime('date_cookies');
            $table->dateTime('date_expiration');
            $table->boolean('utilise')->default(false);
            $table->string('Id_utilisateur',10);
            $table->foreign('Id_utilisateur')->references('Id_utilisateur')->on('Utilisateur')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cookies');
    }
};