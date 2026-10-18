# Rapport de tests — Mon Miam Miam

## 1. Tests automatisés (Laravel — php artisan test)

| Suite | Contenu |
|---|---|
| AuthTest | inscription (validation téléphone, mot de passe 8+ majuscule+chiffre, regex code de parrainage), connexion, rôles renvoyés |
| MigrationStructureBaseTest | présence et types des tables/colonnes du dictionnaire (restaurant, utilisateur, article_menu, commande…) |
| MigrationStructureComplementTest | contraintes CHECK (statuts, téléphone 6xxxxxxxx), clés étrangères, valeurs par défaut |
| ArticleMenuControllerTest | CRUD menu réservé au personnel, validation des catégories |
| EvenementControllerTest | CRUD événements (admin), participations aux mini-jeux, points crédités |
| PanierParrainageFlowTest | parcours complet : commande, points, réduction (multiple de 15), parrainage (3 pts/1000 F filleul, bonus parrain) |
| RestaurantControllerTest | lecture publique, écriture protégée |

Commande : cd app/backend && php artisan test — la CI exécute aussi migrate:fresh --seed
sur SQLite pour valider la structure à chaque push (pipeline dans docs/CI.yaml).

## 2. Procédure de recette manuelle (à dérouler en démo)

| # | Scénario | Résultat attendu |
|---|---|---|
| R1 | Inscription étudiant avec 6XXXXXXXX + mot de passe faible | Rejet avec message clair |
| R2 | Inscription avec code de parrainage PARR0001 | Compte créé, lien filleul visible côté parrain |
| R3 | Connexion étudiant / gérant / admin | Redirection accueil / tableau de bord selon rôle |
| R4 | Mot de passe oublié | Code en log (60 min) ; réinitialisation possible une seule fois (token usage unique) |
| R5 | Visiteur ajoute au panier et commande sans être connecté | Invitation à se connecter, panier conservé |
| R6 | Panier avec articles de 2 restaurants | Refus (message un panier = un restaurant) |
| R7 | Commande avec 15 points | Réduction 1 000 F appliquée, solde décrémenté, mouvement de points créé |
| R8 | Commande avec 10 points (non multiple de 15) | Refus 422 avec message |
| R9 | Employé valide puis fait avancer la commande | Historique des statuts visible côté étudiant |
| R10 | Étudiant commente une commande Servie | Commentaire enregistré (US-010) |
| R11 | Livraison : création, assignation, démarrage, livrée | Statuts respectent la machine à états |
| R12 | Réclamation 3 niveaux | en_attente, observation (employé), validee/rejetee (gérant), décision admin |
| R13 | Bannière cookies | Choix mémorisé, plus de réaffichage, ligne en base (même visiteur) |
| R14 | Points expirés (POST /fidelite/expiration) | Points de plus de 12 mois retirés du solde |
| R15 | Top 10 clients | Leaderboard cohérent avec les points gagnés |

## 3. Résultats

- Dernière exécution automatisée : pipeline CI (docs/CI.yaml à activer dans .github/workflows/ci.yml).
- Recette manuelle R1 à R15 : à dérouler par chaque membre avant la soutenance (comptes de démo dans le README).
