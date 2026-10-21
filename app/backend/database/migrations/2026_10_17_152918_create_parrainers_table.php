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
        if (Schema::hasTable('parrainer')) {
            return;
        }
        Schema::create('parrainer', function (Blueprint $table) {
            $table->string('Id_filleul', 10)->primary(); // un filleul n'a qu'un seul parrain
            $table->string('Id_parrain', 10);
            $table->dateTime('date_parrainage')->useCurrent();
            $table->boolean('recompense_attribuee')->default(0);
            $table->timestamps();

            $table->index('Id_parrain');

            $table->foreign('Id_filleul')->references('Id_utilisateur')->on('etudiant');
            $table->foreign('Id_parrain')->references('Id_utilisateur')->on('etudiant');
        });

        if (in_array(DB::connection()->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `parrainer` ADD CONSTRAINT `chk_parr_distinct` CHECK (`Id_parrain` <> `Id_filleul`)");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parrainer');
    }
};
