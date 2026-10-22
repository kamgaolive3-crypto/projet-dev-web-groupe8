# 🚀 Guide de déploiement — Mon Miam Miam

> Livrable du CDC (section *B. Infrastructure et Déploiement* + *Documentation technique*) :
> code source sur GitHub, application **hébergée sur une plateforme cloud** et **CI/CD automatisé**.
> Vercel n'est pas requis : le CDC ne le mentionne que pour la maquette Figma, qui reste
> partageable par son lien de prototype.

## Architecture de production

```
┌──────────────────────────────────────────────────────────┐
│        UNE SEULE image Docker sur Render (gratuit)        │
│                                                          │
│   Apache + PHP 8.2                                       │
│   ├── public/index.html + assets/  → frontend React      │
│   ├── public/img/ …                → images (seed+upload)│
│   └── /api/* → index.php           → Laravel 11 + SQLite │
│                                                          │
│   https://mon-miam-miam.onrender.com                     │
└──────────────────────────────────────────────────────────┘
        ▲  git push (main)
┌───────┴──────────────────────────────────────────────────┐
│ GitHub + GitHub Actions : tests (98) → build React →     │
│ image Docker → publication GHCR → CD sur Render          │
└──────────────────────────────────────────────────────────┘
```

Points clés de cette architecture :

- **Une seule URL** en production : le bundle React est copié dans `public/` de Laravel
  (étages du `Dockerfile` racine). Le frontend appelle l'API en **relative** (`/api`) →
  **pas de CORS**, pas de proxy d'images, pas de configuration `VITE_API_URL` à maintenir.
- Le `.htaccess` (dans `app/backend/public/`) route `api`, `sanctum` et `up` vers Laravel,
  laisse passer les fichiers réels (bundle, images) et renvoie `index.html` pour tout le
  reste (SPA : rafraîchir `/Menu`, `/Panier`… fonctionne).
- L'entrée (`docker-entrypoint.sh`) crée la base SQLite, **migre**, puis **recharge les
  données de démonstration (seeds 100 % idempotents)** à chaque démarrage.

## 1. Installation et exécution en local

```bash
# Backend (port 8000)
cd app/backend
composer install
cp .env.example .env        # DB_CONNECTION=sqlite par défaut
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve           # http://127.0.0.1:8000

# Frontend (port 5173)
cd app/frontend
npm install
npm run dev                 # proxy /api → 127.0.0.1:8000
```

Comptes de démonstration (mot de passe `Password1`) :
`etudiant1@ucacicam.cm`, `employe@monmiammiam.cm`, `gerant@monmiammiam.cm`, `admin@monmiammiam.cm`.

### Variante conteneur (identique à la production)

Depuis la **racine du dépôt** (le build a besoin du frontend ET du backend) :

```bash
docker build -t mon-miam-miam .
docker run --rm -p 8080:80 mon-miam-miam
# Site + API sur http://localhost:8080  (accueil React, /api/evenement, /up)
```

## 2. Déploiement sur Render (une seule option, deux variantes)

Le service Render exécute l'image du `Dockerfile` racine : **le site et l'API sont sur la
même URL** (plan gratuit, `render.yaml` = blueprint prêt à l'emploi).

**Variante A — lien GitHub (recommandée si le compte GitHub relié à Render est bien celui
du dépôt `kamgaolive3-crypto`) :**

1. Render → **New + → Blueprint** → connecter le dépôt GitHub `kamgaolive3-crypto/projet-dev-web-groupe8`.
2. Render détecte `render.yaml` → service **`mon-miam-miam`** (Docker, plan free,
   `APP_KEY` générée automatiquement, health-check `/up`).
3. **Create Blueprint** → premier build (≈ 3-5 min). URL publique du type
   `https://mon-miam-miam.onrender.com` (vérifier `/up`, puis l'accueil React).
4. Chaque push sur `main` redéploie automatiquement.

**Variante B — sans lien GitHub (image GHCR) :**

1. La CI GitHub Actions publie déjà l'image :
   `ghcr.io/kamgaolive3-crypto/projet-dev-web-groupe8:latest`.
2. Si le package est privé : GitHub → *Packages → le package → Package settings →
   Change visibility → Public*.
3. Render → **New + → Web Service → Deploy an existing image** → coller l'URL de l'image.
   Render lit `render.yaml` pour l'environnement/le health-check.

⚠️ Plan gratuit Render : l'instance se met en veille après ~15 min sans activité
(première requête ≈ 30 s de réveil). Les données SQLite sont recréées au redéploiement
(seeds idempotents → l'état de démonstration est toujours restauré).

## 3. CI/CD (GitHub Actions)

Workflow `.github/workflows/ci.yml`, déclenché à chaque push/PR :

| Job | Rôle |
|---|---|
| `backend` | migrations + `php artisan test` (98 tests / 310 assertions) |
| `frontend` | `npm run build` |
| `docker` | `docker build` de l'image complète + publication sur **GHCR** (tag `latest` + SHA) |
| `deploy` | Après vert sur `main` : POST sur le deploy hook Render (secret repo) |

Configurer le secret (optionnel, l'intégration Git native déploie aussi) :
**Repo → Settings → Secrets and variables → Actions** →
`RENDER_DEPLOY_HOOK` : Render → service → *Continuous Deployment → Deploy Hook*.

## 4. Vérification post-déploiement (checklist de la soutenance)

- [ ] `https://mon-miam-miam.onrender.com/up` → `{"status":"ok"}`
- [ ] `https://mon-miam-miam.onrender.com/` → accueil React + bandeau cookies
- [ ] `https://mon-miam-miam.onrender.com/api/evenement` → JSON 200
- [ ] Connexion `admin@monmiammiam.cm` / `Password1` → Paramètres → Enregistrer (bandeau vert)
- [ ] Parcours complet : inscription → commande → paiement → validation → statistiques
- [ ] Upload d'une image (menu/événement) → image visible sur le site
- [ ] Push sur `main` → CI verte → déploiement Render déclenché

## 5. Maquette Figma (CDC)

La maquette reste hébergée sur Figma et se partage par son lien de prototype
(*Share → Prototype link*). L'application réelle déployée ci-dessus la dépasse en
démonstration : mêmes écrans, données réelles en base.
