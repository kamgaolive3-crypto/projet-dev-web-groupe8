<?php

namespace Database\Factories;

use App\Models\ArticleMenu;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleMenuFactory extends Factory
{
    public function definition(): array
    {
        return [
            'Id_article' => strtoupper(Str::random(3)) . random_int(100, 999),
            'nom_article' => fake()->word(),
            'description' => fake()->sentence(),
            'prix_article' => random_int(500, 5000),
            'categories_article' => fake()->randomElement(['plat', 'boisson', 'dessert', 'accompagnement', 'autre']),
            'disponibilite_article' => true,
            'Menu_du_jour' => false,
            'Id_restaurant' => Restaurant::factory(),
        ];
    }
}