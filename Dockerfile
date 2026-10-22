# --- Image de production COMPLETE Mon Miam Miam ---
# Etage 1 : build du frontend React (Vite)  ->  Etage 2 : Laravel 11 / PHP 8.2 / Apache
# Le bundle React est copie dans public/ : UNE SEULE URL sert le site ET l API
# (same-origin : pas de CORS, pas de proxy d images, une seule plateforme a heberger).
FROM node:20-slim AS front
WORKDIR /app/frontend
COPY app/frontend/package*.json ./
RUN npm ci
COPY app/frontend/ ./
RUN npm run build

FROM php:8.2-apache

# Extensions : l image officielle fournit deja pdo_sqlite/sqlite3/mbstring/curl/opcache.
# Il ne manque que zip (depots git/unzip pour composer)
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip pkg-config libzip-dev \
    && docker-php-ext-install zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# ServerName unique + DocumentRoot Laravel (public/) + .htaccess actif (routes /api et fallback SPA)
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Composer (image officielle)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Backend Laravel (le .dockerignore racine exclut .env, vendor, la DB locale...)
COPY app/backend/ .
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Frontend React : index.html + assets/ cohabitent avec index.php Laravel
# (index.html est servi a la racine, index.php reste le front controller de /api)
COPY --from=front /app/frontend/dist/ /var/www/html/public/

# Dossiers ecrivables a l execution (sessions, cache, uploads)
# (sans accolades : /bin/sh = dash n expande pas {a,b,c})
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views \
        storage/logs bootstrap/cache \
    && touch database/database.sqlite \
    && chown -R www-data: storage bootstrap/cache database

# Script d'amorcage : DB SQLite, migrations, seeds idempotents, puis Apache
COPY app/backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
