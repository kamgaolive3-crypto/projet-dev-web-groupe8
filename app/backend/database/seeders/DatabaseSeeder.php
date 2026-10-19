<?php

namespace Database\Seeders;

use App\Models\Administrateur;
use App\Models\ArticleMenu;
use App\Models\Employe;
use App\Models\Etudiant;
use App\Models\Gerant;
use App\Models\Parrainer;
use App\Models\Parametre;
use App\Models\Restaurant;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Données de référence de l'application Mon Miam Miam.
     * Comptes de démonstration : mot de passe "Password1" partout.
     */
    public function run(): void
    {
        // d abord les donnees de reference (comptes, restaurant, menu de base)
        $this->contenuReference();

        // puis le contenu de demonstration supplementaire (menu complet, evenements)
        $this->call(MenuEvenementsDemoSeeder::class);
    }

    /**
     * Données de référence de l'application Mon Miam Miam.
     * Comptes de démonstration : mot de passe "Password1" partout.
     */
    private function contenuReference(): void
    {
        $mdp = 'Password1'; // 9 caractères, 1 majuscule, 1 chiffre (règle CDC)

        // --- Restaurant ZeDuc@Space (sommet de la terrasse) ---
        Restaurant::updateOrCreate(
            ['Id_restaurant' => 'RS001'],
            [
                'nom_restaurant'       => 'ZeDuc@Space',
                'adresse_restaurant'   => 'Sommet de la terrasse, Residence la Terrasse, Yaounde',
                'telephone_restaurant' => '677123456',
                'email_restaurant'     => 'zeduc@monmiammiam.cm',
                'heure_ouverture'      => '10:00',
                'heure_fermeture'      => '23:00',
                'livraison_active'     => true,
                'statut_restaurant'    => 'actif',
            ]
        );

        // --- Administrateur global (restaurant null = global) ---
        Utilisateur::updateOrCreate(
            ['Id_utilisateur' => 'ADMI000001'],
            [
                'nom'          => 'ZeDuc',
                'prenom'       => 'Direction',
                'email'        => 'admin@monmiammiam.cm',
                'mot_de_passe' => $mdp, // haché par le cast
                'telephone'    => '600000001',
                'statut_compte'=> 'actif',
            ]
        );
        Administrateur::updateOrCreate(
            ['Id_utilisateur' => 'ADMI000001'],
            ['Id_restaurant' => null]
        );

        // --- Gérant du restaurant ---
        Utilisateur::updateOrCreate(
            ['Id_utilisateur' => 'GERA000001'],
            [
                'nom' => 'Dupont', 'prenom' => 'Geraud',
                'email' => 'gerant@monmiammiam.cm',
                'mot_de_passe' => $mdp,
                'telephone' => '600000002',
                'statut_compte' => 'actif',
            ]
        );
        Gerant::updateOrCreate(
            ['Id_utilisateur' => 'GERA000001'],
            ['Id_restaurant' => 'RS001', 'date_nomination' => Carbon::now()->toDateString()]
        );

        // --- Employé (cuisinier) créé par le gérant (association Embaucher) ---
        Utilisateur::updateOrCreate(
            ['Id_utilisateur' => 'EMPL000001'],
            [
                'nom' => 'Mbappe', 'prenom' => 'Joseph',
                'email' => 'employe@monmiammiam.cm',
                'mot_de_passe' => $mdp,
                'telephone' => '600000003',
                'statut_compte' => 'actif',
            ]
        );
        Employe::updateOrCreate(
            ['Id_utilisateur' => 'EMPL000001'],
            [
                'poste'         => 'Cuisinier',
                'date_embauche' => Carbon::now()->toDateString(),
                'Id_restaurant' => 'RS001',
                'Id_createur'   => 'GERA000001',
            ]
        );

        // --- Perrains et filleuls de démonstration (US-019 testable en démo) ---
        Utilisateur::updateOrCreate(
            ['Id_utilisateur' => 'ETUD000001'],
            [
                'nom' => 'Aline', 'prenom' => 'Ngo Bassa',
                'email' => 'etudiant1@ucacicam.cm',
                'mot_de_passe' => $mdp,
                'telephone' => '600000004',
                'statut_compte' => 'actif',
            ]
        );
        Etudiant::updateOrCreate(
            ['Id_utilisateur' => 'ETUD000001'],
            [
                'localisation'    => 'Bloc A, chambre 12',
                'code_parrainage' => 'PARR0001',
                'solde_point'     => 0,
            ]
        );

        Utilisateur::updateOrCreate(
            ['Id_utilisateur' => 'ETUD000002'],
            [
                'nom' => 'Serge', 'prenom' => 'Bille',
                'email' => 'etudiant2@ucacicam.cm',
                'mot_de_passe' => $mdp,
                'telephone' => '600000005',
                'statut_compte' => 'actif',
            ]
        );
        Etudiant::updateOrCreate(
            ['Id_utilisateur' => 'ETUD000002'],
            [
                'localisation'    => 'Residence externe',
                'code_parrainage' => 'PERE0001',
                'solde_point'     => 0,
            ]
        );
        Parrainer::updateOrCreate(
            ['Id_filleul' => 'ETUD000002'],
            ['Id_parrain' => 'ETUD000001', 'date_parrainage' => now(), 'recompense_attribuee' => false]
        );

        // --- Articles de base (menu) ---
        $articles = [
            ['Id_article' => 'PLA001', 'nom_article' => 'Poulet DG', 'description' => 'Poulet braisé, plantain sauté', 'prix_article' => 3500, 'categories_article' => 'plat', 'Menu_du_jour' => true],
            ['Id_article' => 'BOI001', 'nom_article' => 'Jus de gingembre', 'description' => 'Jus frais du jour', 'prix_article' => 500, 'categories_article' => 'boisson'],
            ['Id_article' => 'DES001', 'nom_article' => 'Beignets farcis', 'description' => 'Haricots sauce tomate', 'prix_article' => 1000, 'categories_article' => 'dessert'],
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
                    'Menu_du_jour'          => $a['Menu_du_jour'] ?? false,
                    'Id_restaurant'         => 'RS001',
                ]
            );
        }

        // --- Paramètres administrables ---
        $params = [
            ['Id_parametre' => 'PR001', 'cle' => 'taux_comparaison_points', 'valeur' => '1000 F depenses = 1 point'],
            ['Id_parametre' => 'PR002', 'cle' => 'taux_reduction_points', 'valeur' => '15 points = 1000 F'],
            ['Id_parametre' => 'PR003', 'cle' => 'duree_validite_points', 'valeur' => '12 mois'],
            // cle numerique lue par CommandeController pour l'expiration des points
            ['Id_parametre' => 'PR004', 'cle' => 'duree_expiration_points', 'valeur' => '12'],
        ];
        foreach ($params as $p) {
            Parametre::updateOrCreate(
                ['Id_parametre' => $p['Id_parametre']],
                [
                    'cle'            => $p['cle'],
                    'valeur'         => $p['valeur'],
                    'Id_utilisateur' => 'ADMI000001',
                ]
            );
        }
    }
}