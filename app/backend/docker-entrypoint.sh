#!/bin/sh
# Amorcage du backend Mon Miam Miam :
#  - ecoute sur $PORT si defini (Render assigne un port, sinon 80 en local)
#  - cree le fichier SQLite s il manque, migre le schema, recharge les donnees
#    de demonstration (seeds 100 % idempotents : updateOrCreate partout)
set -e

PORT="${PORT:-80}"
if [ "$PORT" != "80" ]; then
    sed -ri "s/^Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
fi

echo "[entrypoint] Preparation de la base SQLite..."
touch database/database.sqlite 2>/dev/null || true

echo "[entrypoint] Migrations..."
php artisan migrate --force

echo "[entrypoint] Seeds de demonstration (idempotents)..."
php artisan db:seed --force || echo "[entrypoint] Seed deja en place, on continue."

echo "[entrypoint] Pret sur le port ${PORT}."
exec "$@"
