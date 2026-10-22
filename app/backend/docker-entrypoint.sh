#!/bin/sh
# Amorcage du backend Mon Miam Miam :
#  - ecoute sur $PORT si defini (Render assigne un port, sinon 80 en local)
#  - cree le fichier SQLite s il manque, migre le schema, recharge les donnees
#    de demonstration (seeds 100 % idempotents : updateOrCreate partout)
set -e

PORT="${PORT:-80}"
if [ "$PORT" != "80" ]; then
    # Render (et tout cloud) assigne un port explicite : il faut changer
    # ECOUTE (Listen) ET le vhost, sinon Apache ignore le vhost et retombe
    # sur le DocumentRoot global /var/www/html (403/404 partout).
    sed -ri "s/^Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
    sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf
fi

echo "[entrypoint] Preparation de la base SQLite..."
touch database/database.sqlite 2>/dev/null || true

echo "[entrypoint] Migrations..."
php artisan migrate --force

echo "[entrypoint] Seeds de demonstration (idempotents)..."
php artisan db:seed --force || echo "[entrypoint] Seed deja en place, on continue."

echo "[entrypoint] Pret sur le port ${PORT}."
exec "$@"
