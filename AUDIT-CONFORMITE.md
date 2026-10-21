# Rapport d'audit de conformité — Mon Miam Miam (21/10/2026)

Audit réalisé axe par axe, dans l'ordre chronologique, avec vérification **en réel**
(base de données de démo, API vivante sur :8000, front sur :5173, navigateur avec
comptes réels). Verdict global : **le projet est terminé au sens du cahier de
charge côté fonctionnel ; il reste 3 actions de groupe à faire pour la livraison.**

---

## Axe 0 — Livraison git (⚠ action de groupe)

| Point | État |
|---|---|
| Suite de tests complète | ✅ **98/98 (310 assertions)** en local |
| Build frontend | ✅ `npm run build` sans erreur |
| CI GitHub Actions (branche `feat/completion-backend`) | ✅ tous les runs récents en `success` |
| PR #1 (backend complet + front branché) | ⚠️ **toujours ouverte, PAS mergée** → `main` reste cassé |
| PR #4 (membre3-commandes) | ⚠️ à **clôturer** (travail repris dans #1) |
| PR #6 d'Ash (StatistiqueController) | ⚠️ à **clôturer** : ses idées (filtre `du/au` + CA sur paiements « paye ») sont **déjà intégrées** dans notre contrôleur (commit `a502336`) ; merger son contrôle surchargerait le nôtre |
| Poussées directes sur `main` | ⚠️ Diana + Guydiane hier soir — à stopper, tout passe par PR |

## Axe 1 — Base de données (✅)

Les **21 tables métier du CDC** existent toutes (vérifié par `sqlite_master`) :
utilisateur + 4 sous-types, restaurant, article_menu, mise_a_jour_menu, gestion_menu_admin,
evenement, participation_evenement, commande, contenir, historique_statut, paiement,
livraison, mvt_points, parrainer, réclamation, réinitialisation_mdp, cookies, paramètre,
+ personal_access_tokens (Sanctum). Clés étrangères et CHECK (quantité > 0…) en place.

Données de démo crédibles : 5 comptes (les 4 rôles + 1 étudiant secondaire),
1 restaurant, 11 articles, 3 événements, 3 commandes, 2 paiements, 1 réclamation,
5 points de fidélité, 1 parrainage.

## Axe 2 — Exigences fonctionnelles du CDC (✅)

Vérifications vives de la semaine passée + re-contrôles du jour :

- **Étudiant** : accueil (événements/promos AVANT le menu avec fenêtre de dates) ✅,
  menu du jour avec badge « DU JOUR » ✅, panier + moyens MOMO/OM/CARTE + paiement
  enregistré (PA8802 vérifié en BD) ✅, fidélité (5 pts affichés = BD, 5/15, code
  parrain PARR0001) ✅, top 10 avec filtres jour/semaine/mois ✅, réclamation ✅,
  historique + **commentaire post-livraison validé de bout en bout** (#COM0448,
  texte en BD) ✅
- **Employé** : 4 pages branchées aux données réelles — Commandes (3, dont 2 en
  attente), Menu (disponibilité), Réclamations (1 « En cours »), Statistiques
  (ventes semaine + graphique) ✅ ; machine à états respectée (transitions
  illégales rejetées, testé)
- **Gérant/Admin** : Tableau de bord (7 650 F encaissés, 3 commandes, 2 clients
  actifs), Statistiques générales (ventes 7 jours, points émis, plats les plus
  commandés), Employés (US-031/034), MenuA + upload photo (US-027), Événements +
  upload affiche (US-033), Paramètres (US-035), Réclamations admin (US-021/038) ✅
- **Nouveauté du jour** : filtre de période `?du=&au=` sur le dashboard et les
  ventes-semaine + `ca_encaisse` calculé sur les paiements réellement « paye »
  (intégration de la proposition d'Ash, 4 nouveaux tests)

## Axe 3 — Cloisonnement des rôles (✅)

10 sondes API réelles avec tokens des 4 rôles, **10/10 conformes** :

| Sonde | Attendu | Réel |
|---|---|---|
| étudiant → dashboard / upload / article_menu / paramètres | 403 | 403 ✅ |
| étudiant → ses commandes | 200 | 200 ✅ |
| employé → écriture paramètres | 403 | 403 ✅ |
| gérant → lecture dashboard | 200 | 200 ✅ |
| gérant → écriture paramètres | 403 | 403 ✅ |
| admin → écriture paramètres | autorisé | 422 validation ✅ |
| anonyme → commandes | 401 | 401 ✅ |

Front : gardes `RouteStaff`/`RouteEtudiant` + redirections par rôle vérifiées en
live (le login emmène chaque rôle dans son espace).

## Axe 4 — Maquettes / front (✅, avec condition de démo)

Balayage navigateur : 6 pages étudiant + 4 pages employé + 7 pages admin,
**toutes rendent et sont branchées** (textes, compteurs, uploads, filtres).
Palette crème/or + Inria Serif + pills/certains badges « DU JOUR » conformes.

⚠️ **Condition impérative pour la démo** : le serveur de dev PHP sans opcache
mettait **1 à 3,4 s par appel API** (les pages semblaient vides pendant le
chargement — plusieurs membres de l'équipe risquent de croire à un bug).
Corrigé ce jour : relance de `php artisan serve` avec opcache + 8 workers →
**104–110 ms par appel (×10 plus rapide)**. À refaire lundi si la machine
redémarre (voir § Recommandations).

## Axe 5 — Parcours de bout en bout (✅)

Trois scénarios E2E validés en réel, avec preuve en base de données :
1. Commande → paiement → service → commentaire de l'étudiant (#COM0448)
2. Réclamation → « Proposer une solution » → statut « En cours » (#RECLA8001)
3. Paiement MOMO/OM/CARTE enregistré et rattaché à la commande (PA8802)

## Axe 6 — Tests & CI (✅)

- `php artisan test` : **98/98 (310 assertions)** — dont 7 RBAC, 4 statistiques/filtres, 3 upload
- `npm run build` ✅
- GitHub Actions sur la branche : success ✅

## Axe 7 — Finitions (✅)

- Double `##COM` dans l'historique : corrigé (id affiché tel quel)
- Zone commentaire post-livraison qui ne s'affichait jamais : corrigée
  (le libellé est passé à « Livrée », la condition testait encore « Servie »)
- Top 10 qui affichait « Client · 0 pts » (mauvais déballage de la réponse) : corrigé
- Images des plats servies via le proxy `/img` (HTTP 200) ✅
- Aucun BOM dans les fichiers modifiés récemment (8 contrôles) ✅
- Fichier de sonde opcache supprimé, arbre git propre ✅

---

## Les 3 actions restantes (toutes de groupe, pas de code)

1. **Merger la PR #1** → `main` ; puis clôturer #4 et #6 et vérifier le run Actions post-merge
2. Rappeler l'équipe : **plus aucune poussée directe sur `main`**, rester sur `feat/completion-backend` (pull avant de pousser)
3. Rappeler à Ash : ne pas pousser son `StatistiqueController` (PR #6) — ses idées sont intégrées

## Recommandations

- **Performance de démo** : si le serveur a été relancé sans optimisation, chaque
  appel API met ~1 s → les pages paraissent vides 1–2 s. Pour relancer vite :
  ```
  set PHP_CLI_SERVER_WORKERS=8
  php artisan serve --host=127.0.0.1 --port=8000 --no-reload
  ```
  (et idéalement avec opcache activé — cf. échanges de la session du 21/10)
- Absolument rien de cassé côté code ne bloque la démo du jour.
