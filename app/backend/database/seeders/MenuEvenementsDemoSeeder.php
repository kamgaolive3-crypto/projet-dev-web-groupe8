<?php

namespace Database\Seeders;

use App\Models\ArticleMenu;
use App\Models\Evenement;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

// Contenu de demonstration supplementaire (menu complet + evenements actifs).
// Idempotent : updateOrCreate partout, re-executable sans doublons.
// Appele par DatabaseSeeder ; lanceable seul :
//   php artisan db:seed --class=MenuEvenementsDemoSeeder
class MenuEvenementsDemoSeeder extends Seeder
{
    public function run(): void
    {
        // --- Articles supplementaires (photos distinctes, Unsplash libres) ---
        $articles = [
            // plats
            ['Id_article' => 'PLA002', 'nom_article' => 'Kondré', 'description' => 'Bouillon d\'arachide onctueux, viande tendre', 'prix_article' => 3000, 'categories_article' => 'plat', 'Menu_du_jour' => false, 'image_article' => '/img/plats/kondre.jpg'],
            ['Id_article' => 'PLA003', 'nom_article' => 'Poisson braisé', 'description' => 'Carpe grillée, sauce piment doux', 'prix_article' => 4000, 'categories_article' => 'plat', 'Menu_du_jour' => true, 'image_article' => '/img/plats/poisson-braise.jpg'],
            // boissons
            ['Id_article' => 'BOI002', 'nom_article' => 'Jus de bissap', 'description' => 'Hibiscus glacé, menthe fraîche', 'prix_article' => 600, 'categories_article' => 'boisson', 'Menu_du_jour' => false, 'image_article' => '/img/plats/jus-bissap.jpg'],
            // accompagnements (aucun en base jusqu\'ici)
            ['Id_article' => 'ACC001', 'nom_article' => 'Alloco', 'description' => 'Bananes plantains dorées, sauce piment', 'prix_article' => 800, 'categories_article' => 'accompagnement', 'Menu_du_jour' => false, 'image_article' => '/img/plats/alloco.jpg'],
            ['Id_article' => 'ACC002', 'nom_article' => 'Riz sauté', 'description' => 'Riz sauté légumes, oignon vert', 'prix_article' => 1500, 'categories_article' => 'accompagnement', 'Menu_du_jour' => false, 'image_article' => '/img/plats/riz-saute.jpg'],
            // desserts
            ['Id_article' => 'DES002', 'nom_article' => 'Crème de mangue', 'description' => 'Mangue mûre vanillée, servi frais', 'prix_article' => 800, 'categories_article' => 'dessert', 'Menu_du_jour' => false, 'image_article' => '/img/plats/creme-mangue.jpg'],
        ];
        foreach ($articles as $a) {
            ArticleMenu::updateOrCreate(
                ['Id_article' => $a['Id_article']],
                [
                    'nom_article'           => $a['nom_article'],
                    'description'           => $a['description'],
                    'prix_article'          => $a['prix_article'],
                    'categories_article'    => $a['categories_article'],
                    'disponibilite_article' => true,
                    'Menu_du_jour'          => $a['Menu_du_jour'],
                    'image_article'         => $a['image_article'],
                    'Id_restaurant'         => 'RS001',
                ]
            );
        }

        // petit filet de sécurité : les 3 articles de base gardent leurs photos
        foreach ([
            'PLA001' => '/img/plats/poulet-dg.jpg',
            'BOI001' => '/img/plats/jus-gingembre.jpg',
            'DES001' => '/img/plats/beignets-farcis.jpg',
        ] as $id => $image) {
            ArticleMenu::where('Id_article', $id)->update(['image_article' => $image]);
        }

        // --- Evenements de demonstration (affiches = maquettes du site) ---
        $maintenant = Carbon::now();

        // promotion ACTIVE des maintenant (bande "Promotions" de l'accueil)
        Evenement::updateOrCreate(
            ['Id_evenement' => 'PRMO0001'],
            [
                'type_evenement'        => 'promotion',
                'debut_evenement'       => $maintenant->copy()->subDays(2),
                'fin_evenement'         => $maintenant->copy()->addDays(7),
                'taux_reduction'        => 15,
                'points_evenement'      => 0,
                'description_evenement' => '-15 % sur toute commande servie sur place cette semaine',
                'affiche_evenement'     => '/maq/maq_promo.jpg',
                'Id_utilisateur'        => 'ADMI000001',
            ]
        );

        // mini-jeu ACTIVE des maintenant (bande "Evenements" de l accueil, "Je participe")
        Evenement::updateOrCreate(
            ['Id_evenement' => 'MINJ0001'],
            [
                'type_evenement'        => 'mini_jeu',
                'debut_evenement'       => $maintenant->copy()->subDays(1),
                'fin_evenement'         => $maintenant->copy()->addDays(3),
                'points_evenement'      => 50,
                'description_evenement' => 'Mini-jeu client : 50 points a remporter chaque soir',
                'affiche_evenement'     => '/maq/maq_evenement.jpg',
                'Id_utilisateur'        => 'ADMI000001',
            ]
        );

        // evenement a venir (visible pour le gerant, pas encore dans les bandes)
        Evenement::updateOrCreate(
            ['Id_evenement' => 'EVEN0001'],
            [
                'type_evenement'        => 'evenement',
                'debut_evenement'       => $maintenant->copy()->addDays(5),
                'fin_evenement'         => $maintenant->copy()->addDays(5)->setTime(22, 0),
                'points_evenement'      => 20,
                'description_evenement' => 'Soirée tasting : menu découverte du chef',
                'affiche_evenement'     => '/maq/maq_evenement.jpg',
                'Id_utilisateur'        => 'ADMI000001',
            ]
        );
    }
}
