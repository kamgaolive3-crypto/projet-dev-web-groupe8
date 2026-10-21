# API Mon Miam Miam — référence des routes

Base : `http://127.0.0.1:8000/api` (dev, via le proxy Vite `/api`).
Authentification : **Bearer token Sanctum** — en-tête `Authorization: Bearer <token>`
(retourné par `POST /auth/connexion` et `POST /auth/inscription`).

## Authentification

| Méthode | Route | Auth | Rôle | Corps |
|---|---|---|---|---|
| POST | `/auth/inscription` | non | visiteur | `{nom, prenom, email, telephone, mot_de_passe, mot_de_passe_confirmation, localisation, code_parrainage?}` |
| POST | `/auth/connexion` | non | — | `{email, mot_de_passe}` → `{token, utilisateur, role}` |
| POST | `/auth/deconnexion` | oui | tous | — (révoque le token) |
| GET | `/auth/me` | oui | tous | — |
| POST | `/auth/mot-de-passe-oublie` | non | — | `{email}` — envoie le code (log en local), valide 60 min |
| POST | `/auth/mot-de-passe-reinitialiser` | non | — | `{token, mot_de_passe}` |

## Restaurant & menu

| Méthode | Route | Auth | Rôle | Notes |
|---|---|---|---|---|
| GET | `/restaurant` · `/restaurant/{id}` | non | tous | lecture publique |
| POST / PUT / DELETE | `/restaurant` | oui | staff | CRUD |
| GET | `/article_menu` | non | tous | liste complète |
| GET | `/article_menu-du-jour` | non | tous | menu du jour (toutes catégories) |
| GET | `/article_menu-du-jour/{categorie}` | non | tous | menu du jour par catégorie (plat, boisson…) |
| POST / PUT / DELETE | `/article_menu` | oui | staff | `{Id_article: 3 maj + 3 chiffres, nom_article, prix_article, categories_article, disponibilite_article, Menu_du_jour, image_article?, description?, Id_restaurant}` |

## Événements & promotions

| Méthode | Route | Auth | Rôle | Notes |
|---|---|---|---|---|
| GET | `/evenement` · `/evenement/{id}` | non | tous | |
| GET | `/promotions/actives` | non | tous | promotions / mini-jeux en cours |
| POST / PUT / DELETE | `/evenement` | oui | admin | `{Id_evenement: 3 maj + 4 chiffres, type_evenement: promotion\|evenement\|mini_jeu, debut_evenement, fin_evenement, points_evenement, taux_reduction?, Id_utilisateur}` |
| POST | `/evenement/{id}/participer` | oui | étudiant | crédite les points du mini-jeu |
| GET | `/evenement/{id}/participations` | oui | staff | liste des participants |

## Commandes (étudiant)

| Méthode | Route | Auth | Rôle | Corps |
|---|---|---|---|---|
| POST | `/commande` | oui | étudiant | `{items:[{Id_article, quantite}], Id_restaurant, mode_service: sur_place\|livraison, heure_recup?, points_utilises?, commentaire?}` |
| GET | `/commande` | oui | tous | étudiant = les siennes ; staff = toutes. Filtre `?statut=` |
| GET | `/commande/{id}` | oui | tous | détail + historique des statuts |
| POST | `/commande/{id}/commentaire` | oui | étudiant | `{commentaire}` (US-010, après service) |

## Actions staff (US-026)

| Méthode | Route | Rôle requis | Corps |
|---|---|---|---|
| POST | `/commande/{id}/valider` | staff (non étudiant) | — (en_attente → validee) |
| POST | `/commande/{id}/statut` | staff | `{statut_commande}` — transitions : en_attente→validee/annulee, validee→en_preparation/annulee, en_preparation→prete, prete→en_livraison/servie, en_livraison→servie |

## Livraisons (US-008 / US-026)

| Méthode | Route | Rôle requis | Corps |
|---|---|---|---|
| GET / POST | `/livraison` | staff (lecture étudiant : les siennes) | `{Id_commande, adresse_livraison?, frais_livraison?, date_prevue?}` |
| POST | `/livraison/{id}/assigner` | staff | `{Id_utilisateur}` (un employé) |
| POST | `/livraison/{id}/demarrer` | staff ou livreur assigné | — (assignee → en_cours) |
| POST | `/livraison/{id}/livrer` · `/echouer` | staff ou livreur | — (en_cours → livree / echouee) |

## Fidélité & parrainage (US-014 → US-020)

| Méthode | Route | Auth | Notes |
|---|---|---|---|
| GET | `/fidelite/solde` | oui | solde de points + gains bientôt expirés |
| GET | `/fidelite/historique` | oui | mouvements de points |
| POST | `/fidelite/expiration` | staff | applique l'expiration (>12 mois) |
| GET | `/parrainage/code` | oui | mon code de parrainage |
| POST | `/parrainage/utiliser` | oui | `{code_parrainage}` — rattache le filleul au parrain |
| GET | `/parrainage/filleuls` | oui | mes filleuls + récompenses |

## Réclamations (US-021 / US-022 / US-038)

| Méthode | Route | Rôle requis | Corps |
|---|---|---|---|
| POST | `/reclamation` | étudiant (sur ses commandes) | `{Id_commande, motif, description}` |
| GET | `/reclamation` · `/{id}` | tous authentifiés | étudiant = les siennes ; filtre `?statut=` |
| POST | `/reclamation/{id}/traiter` | staff | `{reponse}` — niveau 1 : en_attente → observation |
| POST | `/reclamation/{id}/decision-gerant` | gérant / admin | `{decision: validee\|rejetee}` — niveau 2 |
| POST | `/reclamation/{id}/traiter-admin` | admin | `{reponse}` — réécriture administrative |
| POST | `/reclamation/{id}/decision-admin` | admin | `{decision}` — niveau 3, décision finale |

## Comptes employés (US-031 / US-034)

| Méthode | Route | Rôle requis | Corps |
|---|---|---|---|
| GET / POST | `/employes` | gérant / admin | `{nom, prenom, email, telephone, mot_de_passe, poste, date_embauche?, Id_restaurant?}` |
| PUT | `/employes/{id}` | gérant / admin | `{poste?, date_embauche?, statut_compte: actif\|inactif}` |
| DELETE | `/employes/{id}` | admin | — |

## Paramètres & statistiques

| Méthode | Route | Rôle requis | Notes |
|---|---|---|---|
| GET / POST / PUT / DELETE | `/parametre` | staff | `{Id_parametre: 2 maj + 3 chiffres, cle, valeur, Id_utilisateur}` |
| GET | `/stats/ventes-semaine` | staff | CA, commandes/jour, répartition statuts, top 3 articles |
| GET | `/stats/dashboard` | gérant / admin | CA jour / semaine / mois + points fidélité |
| GET | `/stats/top-clients` | tous | top 10 clients (leaderboard) |

## Cookies RGPD (US-004)

| Méthode | Route | Auth | Corps |
|---|---|---|---|
| POST | `/cookies` | non (visiteur accepté) | `{choix_cookies: accepte\|refuse\|personnalise, version_politique}` |
| GET | `/cookies/moi` | oui | mon consentement |

### Codes d'erreur

- `422` : validation (corps `{message, errors: {champ: [..]}}`)
- `401` : non authentifié · `403` : rôle insuffisant · `404` : ressource absente
