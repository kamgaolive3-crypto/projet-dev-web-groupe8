<?php

namespace Database\Factories;

use App\Models\Administrateur;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AdministrateurFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Id_utilisateur' => strtoupper(Str::random(4)) . random_int(100000, 999999),
            'date_nomination' => now(),
            'Id_restaurant' => null,
        ];
    }
}