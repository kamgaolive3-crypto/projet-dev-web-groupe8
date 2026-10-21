# Manuel utilisateur — Mon Miam Miam

## 1. Visiteur (non connecté)

- Consulter l'accueil (plat du jour, promotions actives, menu du jour) et le menu.
- Ajouter des articles au panier (mémorisé dans le navigateur).
- Répondre à la bannière cookies (accepter / refuser / personnaliser).
- Créer un compte via Inscription (le code de parrainage d'un ami est optionnel).

## 2. Étudiant

Se connecter : bouton Connexion en haut à droite, puis email + mot de passe.
Redirection automatique vers l'accueil.

Mot de passe oublié : lien sous le champ mot de passe, saisir l'email, recevoir un
code (valable 60 minutes ; en local il est dans storage/logs/laravel.log), puis saisir
le code + un nouveau mot de passe (8 caractères, 1 majuscule, 1 chiffre).

Commander :
1. Menu, bouton Ajouter sur chaque article (les articles épuisés sont bloqués).
2. Panier : vérifier, choisir Sur place (avec heure) ou Livraison.
3. Optionnel : dépenser des points (par tranches de 15 = 1 000 F de réduction).
4. Confirmer ma commande : le serveur revalide tout (prix, disponibilité, même restaurant).

Suivre et commenter : Historique, statut en direct (en attente, validée, en préparation,
prête, servie). Après service, laisser un commentaire sur une commande Servie (US-010).

Fidélité : solde de points, barre de progression vers la prochaine réduction
(1 000 F = 1 pt ; 15 pts = 1 000 F), points gagnés par commande, Top 10 des meilleurs
clients. Les points expirent après 12 mois.

Parrainage : copier mon code et le donner à un ami ; il le saisit à l'inscription,
je reçois 15 pts de bonus dès sa première commande, il gagne 3 pts par 1 000 F dépensés.

Réclamation : Panier, puis Faire une réclamation : ID de commande + description du problème.

## 3. Employé (cuisinier, livreur…)

Connexion, puis Tableau de bord (accès protégé par rôle).
- Suivi commandes : valider les commandes en attente, faire avancer les statuts
  (en préparation, prête, en livraison, servie), annuler si besoin.
- Livraisons : créer la livraison d'une commande en mode livraison, assigner un livreur
  (parmi les employés), démarrer, marquer Livrée ou Échec.
- Réclamations : niveau 1, écrire l'observation ; la réclamation passe au gérant.

## 4. Gérant

Tout l'espace employé, plus :
- Employés : créer les comptes de son équipe (poste, date d'embauche), désactiver/réactiver.
- Statistiques : chiffre d'affaires jour / semaine / mois, commandes par statut, top articles.
- Menu : créer / modifier les articles, basculer disponible/épuisé et menu du jour.
- Événements : gérer promotions, mini-jeux, voir les participations.
- Réclamations : niveau 2, décision validée / rejetée.

## 5. Administrateur

Tout l'espace gérant, plus :
- Suppression des comptes employés.
- Paramètres : clés/valeurs système (taux de points, durées…).
- Réclamations : niveau 3, réécriture de la réponse et décision administrative finale.
- Statistiques consolidées du restaurant.

## 6. Dépannage

| Problème | Solution |
|---|---|
| « Connectez-vous… » sur Panier/Fidélité | Se connecter ; le panier local est conservé |
| Erreur de validation à la commande | Lire le message affiché (article indisponible, restaurants mélangés, points non multiples de 15) |
| Le menu est vide | Le gérant doit créer les articles (page MenuA) |
| Email non reçu | En local : regarder app/backend/storage/logs/laravel.log |
