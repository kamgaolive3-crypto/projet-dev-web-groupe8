# 🚀 Guide de déploiement — Mon Miam Miam

> Livrable du CDC (section *B. Infrastructure et Déploiement* + *Documentation technique*) :
> procédure de déploiement **backend sur plateforme cloud**, **frontend sur Vercel** et **CI/CD automatisé**.

## Architecture de production

```
┌─────────────────────────┐         ┌──────────────────────────────────┐
│  FRONTEND (React/Vite)  │  API    │  BACKEND (Laravel 11 / PHP 8.2)  │
│  Vercel (gratuit)       │ ──────► │  Render (gratuit, conteneur      │
│  https://mon-miam-      │  CORS * │  Docker)                          │
│  miam.vercel.app        │         │  https://mon-miam-miam-api.      │
│                         │ ◄────── │  onrender.com                     │
│  /img/* → proxy Render  │ images  │  SQLite (dans le conteneur)       │
└─────────────────────────┘         └──────────────────────────────────┘
        ▲                                     ▲
        └─────── GitHub (main) ───────────────┘
                    ▲
         GitHub Actions : tests + build + docker + CD
```

- **Vercel** héberge le frontend : build `npm run build`, SPA rewrite (voir `app/frontend/vercel.json`).
  Les images montées par le personnel (`/img/…`) sont **relayées vers le backend** (rewrite).
- **Render** héberge l'API : image Docker construite depuis `app/backend/Dockerfile`
  (Apache + PHP 8.2 + SQLite). L'entrée (`docker-entrypoint.sh`) crée la base, **migre**,
  puis **recharge les données de démonstration (seeds idempotents)** à chaque démarrage.
- **CI/CD** (`.github/workflows/ci.yml`) : à chaque push sur `main` →
  tests Laravel (98) → build React → validation de l'image Docker → **déclenchement des déploiements**
  Render et Vercel via *deploy hooks* (secrets GitHub `RENDER_DEPLOY_HOOK` / `VERCEL_DEPLOY_HOOK`).
  Si les secrets sont absents, les intégrations Git natives de Render/Vercel déploient quand même.

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

### Variante Docker (bonus conteneurisation)

```bash
cd app/backend
docker build -t mon-miam-miam-api .
docker run --rm -p 8080:80 -e APP_KEY="$(php artisan key:generate --show)" mon-miam-miam-api
# API testable sur http://127.0.0.1:8080/api/evenement
```

## 2. Déploiement — Backend sur Render

1. Render → **New + → Blueprint** → connecter le dépôt GitHub `kamgaolive3-crypto/projet-dev-web-groupe8`.
2. Render détecte `render.yaml` → service **`mon-miam-miam-api`** (runtime Docker, plan free,
   `APP_KEY` générée automatiquement, health-check `/up`).
3. **Create Blueprint** → premier build (≈ 3-5 min). L'URL publique est du type
   `https://mon-miam-miam-api.onrender.com` (vérifier `/up` et `/api/evenement`).
4. ⚠️ Plan gratuit Render : la instance se met en veille après ~15 min sans activé
   (première requête = ~30 s de réveil). Les données SQLite sont recréées au redéploiement
   (seeds idempotents → état de démo toujours restauré).

## 3. Déploiement — Frontend sur Vercel

1. Vercel → **Add New → Project** → importer le dépôt GitHub.
2. **Root Directory** : `app/frontend` · Framework : Vite (détection automatique).
3. Variable d'environnement de build :
   | Clé | Valeur |
   |---|---|
   | `VITE_API_URL` | `https://mon-miam-miam-api.onrender.com/api` |
4. **Deploy** → URL publique du type `https://mon-miam-miam.vercel.app`.
   Chaque push/PR crée une **préproduction** (livrable « version test/bêta » ✅).

> Si l'URL Render exacte diffère, mettre à jour la destination `/img/*` dans
> `app/frontend/vercel.json` **et** `VITE_API_URL` sur Vercel (2 endroits).

## 4. CI/CD (GitHub Actions)

Workflow `.github/workflows/ci.yml` :

| Job | Rôle |
|---|---|
| `backend` | `php artisan test` (98 tests / 310 assertions) + migrations |
| `frontend` | `npm run build` |
| `docker` | `docker build` du backend (validation du Dockerfile) |
| `deploy` | Après vert sur `main` : POST sur les deploy hooks Render + Vercel (secrets repo) |

Configurer les secrets (optionnel si intégrations Git connectées) :
**Repo → Settings → Secrets and variables → Actions** :
- `RENDER_DEPLOY_HOOK` : Render → service → *Continuous Deployment → Deploy Hook*
- `VERCEL_DEPLOY_HOOK` : Vercel → projet → *Settings → Git → Deploy Hooks*

## 5. Vérification post-déploiement (checklist de la soutenance)

- [ ] `https://<api>.onrender.com/up` → `{"status":"ok"}`
- [ ] `https://<api>.onrender.com/api/evenement` → JSON 200
- [ ] `https://<site>.vercel.app/` → accueil, bandeau cookies
- [ ] Connexion `admin@monmiammiam.cm` / `Password1` → Paramètres → Enregistrer (bandeau vert)
- [ ] Parcours complet : inscription → commande → paiement → validation → statistiques
- [ ] Push sur `main` → CI verte → déploiements auto déclenchés
