<?php

namespace Tests\Feature;

use App\Models\ArticleMenu;
use App\Models\Restaurant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleMenuControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function on_peut_lister_tous_les_articles_menu(): void
    {
        ArticleMenu::factory()->count(4)->create();

        $reponse = $this->getJson('/api/article_menu');

        $reponse->assertStatus(200);
        $reponse->assertJsonCount(4);
    }

    /** @test */
    public function on_peut_creer_un_article_menu(): void
    {
        $restaurant = Restaurant::factory()->create();

        $donnees = [
            'Id_article' => 'PLA001',
            'nom_article' => 'Poulet Yassa',
            'description' => 'Poulet au citron et aux oignons',
            'prix_article' => 3500,
            'categories_article' => 'plat',
            'disponibilite_article' => true,
            'Menu_du_jour' => false,
            'Id_restaurant' => $restaurant->Id_restaurant,
        ];

        // l ecriture est protegee par auth:sanctum : un utilisateur du personnel est requis
        $reponse = $this->actingAs(\App\Models\Utilisateur::factory()->create(), 'sanctum')
            ->postJson('/api/article_menu', $donnees);

        $reponse->assertStatus(201);
        $this->assertDatabaseHas('article_menu', ['Id_article' => 'PLA001']);
    }

    /** @test */
    public function on_peut_recuperer_les_articles_du_menu_du_jour(): void
    {
        ArticleMenu::factory()->count(2)->create(['Menu_du_jour' => true]);
        ArticleMenu::factory()->count(3)->create(['Menu_du_jour' => false]);

        $reponse = $this->getJson('/api/article_menu-du-jour');

        $reponse->assertStatus(200);
        $reponse->assertJsonCount(2);
    }

    /** @test */
    public function on_peut_recuperer_les_plats_du_jour_par_categorie(): void
    {
        ArticleMenu::factory()->create(['Menu_du_jour' => true, 'categories_article' => 'plat']);
        ArticleMenu::factory()->create(['Menu_du_jour' => true, 'categories_article' => 'boisson']);

        $reponse = $this->getJson('/api/article_menu-du-jour/plat');

        $reponse->assertStatus(200);
        foreach ($reponse->json() as $article) {
            $this->assertSame('plat', $article['categories_article']);
        }
    }

    /** @test */
    public function on_peut_mettre_a_jour_un_article_menu(): void
    {
        $article = ArticleMenu::factory()->create();

        // l ecriture est protegee par auth:sanctum : un utilisateur du personnel est requis
        // la validation exige le payload complet (comme le formulaire du frontend)
        $reponse = $this->actingAs(\App\Models\Utilisateur::factory()->create(), 'sanctum')
            ->putJson('/api/article_menu/' . $article->Id_article, [
                'Id_article'            => $article->Id_article,
                'nom_article'           => 'Nouveau Nom',
                'image_article'         => $article->image_article,
                'description'           => $article->description,
                'prix_article'          => $article->prix_article,
                'categories_article'    => $article->categories_article,
                'disponibilite_article' => $article->disponibilite_article,
                'Menu_du_jour'          => $article->Menu_du_jour,
                'Id_restaurant'         => $article->Id_restaurant,
            ]);

        $reponse->assertStatus(200);
        $this->assertDatabaseHas('article_menu', [
            'Id_article' => $article->Id_article,
            'nom_article' => 'Nouveau Nom',
        ]);
    }

    /** @test */
    public function on_peut_supprimer_un_article_menu(): void
    {
        $article = ArticleMenu::factory()->create();

        // l ecriture est protegee par auth:sanctum : un utilisateur du personnel est requis
        $reponse = $this->actingAs(\App\Models\Utilisateur::factory()->create(), 'sanctum')
            ->deleteJson('/api/article_menu/' . $article->Id_article);

        $reponse->assertStatus(200);
        $this->assertDatabaseMissing('article_menu', ['Id_article' => $article->Id_article]);
    }
}