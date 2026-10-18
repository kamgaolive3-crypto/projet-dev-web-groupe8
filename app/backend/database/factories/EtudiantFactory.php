<?php

namespace Database\Factories;

use App\Models\Etudiant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EtudiantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Id_utilisateur' => strtoupper(Str::random(4)) . random_int(100000, 999999),
            'localisation' => fake()->city(),
            'code_parrainage' => strtoupper(Str::random(4)) . random_int(1000, 9999),
            'solde_point' => random_int(0, 1000),
        ];
    }
}