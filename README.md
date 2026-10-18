# Mon Miam Miam 🍽️

Application web de commande et de fidélité pour le restaurant **ZeDuc@Space** (sommet de la terrasse, Résidence la Terrasse, Yaoundé), destinée aux étudiants de l'UCAC-ICAM.

- **Backend** : Laravel 12 + Sanctum (API REST, tokens personnels) — `app/backend`
- **Frontend** : React 19 + Vite + Tailwind 4 + react-router 7 — `app/frontend`
- **Base de données** : MySQL (schéma de référence : `app/database/schema.sql`)

## 1. Installation du backend (Laravel)

Prérequis : PHP 8.2+, Composer, MySQL (Laragon ou XAMPP recommandé).

```bash
cd app/backend
composer install
copy .env.example .env          # (Linux/mac : cp .env.example .env)
php artisan key:generate
```

Dans `.env`, configurer MySQL puis créer la base :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mon_miam_miam
DB_USERNAME=root
DB_PASSWORD=
```

```sql
CREATE DATABASE mon_miam_miam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Créer les tables + données de démonstration :

```bash
php artisan migrate:fresh --seed
```

Démarrer l'API :

```bash
php artisan serve
```

> Le mail fonctionne **sans serveur SMTP** en local : `MAIL_MAILER=log` écrit les emails
> dans `storage/logs/laravel.log` (utile pour tester la réinitialisation de mot de passe, US-003).

## 2. Installation du frontend (React)

Prérequis : Node 18+ (Node 20 recommandé).

```bash
cd app/frontend
npm install
npm run dev
```

Le serveur Vite démarre sur http://localhost:5173 et le **proxy intégré** transmet
tous les appels `/api/...` vers Laravel (http://127.0.0.1:8000) : aucun CORS à gérer.
En production, définir `VITE_API_URL` (ex : `https://mon-domaine.cm/api`).

## 3. Comptes de démonstration (créés par le seeder)

| Rôle           | Email                   | Mot de passe |
|----------------|-------------------------|--------------|
| Administrateur | admin@monmiammiam.cm    | Password1    |
| Gérant         | gerant@monmiammiam.cm   | Password1    |
| Employé        | employe@monmiammiam.cm  | Password1    |
| Étudiant 1 (parrain) | etudiant1@ucacicam.cm | Password1 (code parrainage `PARR0001`) |
| Étudiant 2 (filleul) | etudiant2@ucacicam.cm | Password1 |

Articles de démo : `PLA001` Poulet DG (3 500 F, menu du jour), `BOI001` Jus de gingembre (500 F), `DES001` Beignets farcis (1 000 F) — restaurant `RS001`.

## 4. Tests

```bash
cd app/backend
php artisan test
```

La structure de la base est vérifiée par `MigrationStructureBaseTest` / `MigrationStructureComplementTest`,
le parcours panier → commande → points → parrainage par `PanierParrainageFlowTest` (voir `docs/rapport-tests.md`).

## 5. Intégration continue (CI)

Le pipeline GitHub Actions (tests Laravel + build React) est prêt dans **`docs/CI.yaml`** :
copier ce fichier vers `.github/workflows/ci.yml` depuis l'interface GitHub (le chemin
est protégé en écriture via API).

## 6. Documentation

- `docs/API.md` — toutes les routes de l'API (méthodes, rôles, corps de requête)
- `docs/manuel-utilisateur.md` — manuel par rôle (visiteur, étudiant, employé, gérant, administrateur)
- `docs/plan-risques.md` — plan de gestion des risques du projet
- `docs/rapport-tests.md` — rapport de tests

## 7. Fonctionnalités (extrait du CDC)

Commande avec panier (sur place / livraison), menu du jour, programme de fidélité
(1 000 F = 1 pt, 15 pts = 1 000 F, expiration 12 mois), parrainage filleul → parrain
(1 000 F = 3 pts pour le filleul, 15 pts de bonus parrain), mini-jeux & promotions,
réclamations en 3 niveaux (employé → gérant → administrateur), gestion du menu et des
événements par le gérant, comptes employés, statistiques de ventes et top 10 clients,
consentement cookies RGPD (US-004), réinitialisation de mot de passe (US-003).
