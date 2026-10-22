# --- Image de production du backend Mon Miam Miam (Laravel 11 / PHP 8.2) ---
# Construite localement (docker build) et sur Render (runtime: docker dans render.yaml).
FROM php:8.2-apache

# Extensions : l image officielle fournit deja pdo_sqlite/sqlite3/mbstring/curl/opcache.
# Il ne manque que zip (depots git/unzip pour composer)
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip pkg-config libzip-dev \
    && docker-php-ext-install zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# ServerName unique (evite l'avertissement Apache au demarrage)
# + DocumentRoot Laravel (public/) + .htaccess actif (routes /api via rewrite)
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Composer (image officielle)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Dependances PHP (le .dockerignore exclut vendor/, .env, la DB locale...)
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Dossiers ecrivables a l execution (sessions, cache, uploads)
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && touch database/database.sqlite \
    && chown -R www-data: storage bootstrap/cache database

# Script d'amorcage : cree la DB, migre, seed (idempotent) puis lance Apache
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
