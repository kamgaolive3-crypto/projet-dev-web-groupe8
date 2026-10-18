<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parrainer', function (Blueprint $table) {
                        $table->engine = 'InnoDB';

            $table->string('Id_filleul', 10);
            $table->string('Id_parrain', 10);
            $table->dateTime('date_parrainage')->useCurrent();
            $table->boolean('recompense_attribuee')->default(false);

            $table->primary('Id_filleul');

            $table->foreign('Id_filleul', 'fk_parr_filleul')
                  ->references('Id_utilisateur')->on('etudiant');
            $table->foreign('Id_parrain', 'fk_parr_parrain')
                  ->references('Id_utilisateur')->on('etudiant');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parrainer');
    }
};
