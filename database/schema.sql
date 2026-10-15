-- =====================================================================
-- Base de données : Mon Miam Miam
-- Description     : Schéma complet (13 tables, relations, contraintes, index)
-- Jeu de caractères: utf8mb4 / utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `mon_miam_miam`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `mon_miam_miam`;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. Table : utilisateurs (Table centrale d'authentification)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE `utilisateurs` (
  `id_utilisateur` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `mot_de_passe` VARCHAR(255) NOT NULL,
  `telephone` CHAR(9) NOT NULL,
  `date_inscription` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `statut_compte` ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
  `role` ENUM('etudiant', 'employe', 'gerant', 'administrateur') NOT NULL DEFAULT 'etudiant',
  `remember_token` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `uniq_utilisateurs_uuid` (`uuid`),
  UNIQUE KEY `uniq_utilisateurs_email` (`email`),
  UNIQUE KEY `uniq_utilisateurs_telephone` (`telephone`),
  INDEX `idx_utilisateurs_role_statut` (`role`, `statut_compte`),
  INDEX `idx_utilisateurs_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Table : etudiants (Héritage utilisateurs)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `etudiants`;
CREATE TABLE `etudiants` (
  `id_utilisateur` BIGINT UNSIGNED NOT NULL,
  `localisation` TEXT DEFAULT NULL,
  `code_parrainage` VARCHAR(8) DEFAULT NULL,
  `solde_point` INT UNSIGNED NOT NULL DEFAULT 0,
  `parrain_id` BIGINT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `uniq_etudiants_code_parrainage` (`code_parrainage`),
  INDEX `idx_etudiants_parrain_id` (`parrain_id`),
  CONSTRAINT `fk_etudiants_utilisateur` FOREIGN KEY (`id_utilisateur`)
    REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_etudiants_parrain` FOREIGN KEY (`parrain_id`)
    REFERENCES `etudiants` (`id_utilisateur`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table : restaurants
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
  `id_restaurant` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_restaurant` VARCHAR(150) NOT NULL,
  `adresse_restaurant` TEXT NOT NULL,
  `telephone_restaurant` VARCHAR(30) DEFAULT NULL,
  `email_restaurant` VARCHAR(255) DEFAULT NULL,
  `heure_ouverture` TIME NOT NULL,
  `heure_fermeture` TIME NOT NULL,
  `livraison_active` TINYINT(1) NOT NULL DEFAULT 1,
  `statut_restaurant` ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
  `date_creation` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_restaurant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Table : articles_menu
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `articles_menu`;
CREATE TABLE `articles_menu` (
  `id_article` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_article` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `prix_article` BIGINT UNSIGNED NOT NULL,
  `categories_article` VARCHAR(255) NOT NULL,
  `disponibilite_article` TINYINT(1) NOT NULL DEFAULT 1,
  `menu_du_jour` TINYINT(1) NOT NULL DEFAULT 0,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `metadata` JSON DEFAULT NULL,
  `id_restaurant` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_article`),
  INDEX `idx_articles_resto_dispo` (`id_restaurant`, `disponibilite_article`),
  INDEX `idx_articles_resto_menu_jour` (`id_restaurant`, `menu_du_jour`),
  INDEX `idx_articles_categories` (`categories_article`),
  CONSTRAINT `fk_articles_restaurant` FOREIGN KEY (`id_restaurant`)
    REFERENCES `restaurants` (`id_restaurant`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Table : employes
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `employes`;
CREATE TABLE `employes` (
  `id_utilisateur` BIGINT UNSIGNED NOT NULL,
  `poste` VARCHAR(100) DEFAULT NULL,
  `date_embauche` DATE DEFAULT NULL,
  `id_restaurant` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_utilisateur`),
  INDEX `idx_employes_restaurant` (`id_restaurant`),
  CONSTRAINT `fk_employes_utilisateur` FOREIGN KEY (`id_utilisateur`)
    REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_employes_restaurant` FOREIGN KEY (`id_restaurant`)
    REFERENCES `restaurants` (`id_restaurant`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Table : gerants
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `gerants`;
CREATE TABLE `gerants` (
  `id_utilisateur` BIGINT UNSIGNED NOT NULL,
  `date_nomination` DATE DEFAULT NULL,
  `id_restaurant` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_utilisateur`),
  INDEX `idx_gerants_restaurant` (`id_restaurant`),
  CONSTRAINT `fk_gerants_utilisateur` FOREIGN KEY (`id_utilisateur`)
    REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_gerants_restaurant` FOREIGN KEY (`id_restaurant`)
    REFERENCES `restaurants` (`id_restaurant`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Table : administrateurs
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `administrateurs`;
CREATE TABLE `administrateurs` (
  `id_utilisateur` BIGINT UNSIGNED NOT NULL,
  `date_nomination` DATE DEFAULT NULL,
  `id_restaurant` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_utilisateur`),
  INDEX `idx_administrateurs_restaurant` (`id_restaurant`),
  CONSTRAINT `fk_administrateurs_utilisateur` FOREIGN KEY (`id_utilisateur`)
    REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_administrateurs_restaurant` FOREIGN KEY (`id_restaurant`)
    REFERENCES `restaurants` (`id_restaurant`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Table : commandes
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `commandes`;
CREATE TABLE `commandes` (
  `id_commande` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_commande` VARCHAR(20) NOT NULL,
  `id_utilisateur` BIGINT UNSIGNED NOT NULL,
  `id_restaurant` BIGINT UNSIGNED NOT NULL,
  `statut` ENUM('en_attente', 'validee', 'en_preparation', 'prete', 'en_livraison', 'servie', 'annulee') NOT NULL DEFAULT 'en_attente',
  `mode_service` ENUM('sur_place', 'livraison') NOT NULL DEFAULT 'sur_place',
  `heure_recup` TIME DEFAULT NULL,
  `adresse_livraison` TEXT DEFAULT NULL,
  `sous_total` BIGINT UNSIGNED NOT NULL,
  `frais_livraison` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `reduction_points` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `points_utilises` INT UNSIGNED NOT NULL DEFAULT 0,
  `points_gagnes` INT UNSIGNED NOT NULL DEFAULT 0,
  `montant_total` BIGINT UNSIGNED NOT NULL,
  `statut_paiement` ENUM('unpaid', 'paid', 'refunded', 'partial') NOT NULL DEFAULT 'unpaid',
  `mode_paiement` VARCHAR(10) DEFAULT NULL,
  `reference_paiement` VARCHAR(150) DEFAULT NULL,
  `commentaire` TEXT DEFAULT NULL,
  `id_valideur` BIGINT UNSIGNED DEFAULT NULL,
  `date_validation` TIMESTAMP NULL DEFAULT NULL,
  `id_admin_valideur` BIGINT UNSIGNED DEFAULT NULL,
  `date_validation_admin` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_commande`),
  UNIQUE KEY `uniq_commandes_numero` (`numero_commande`),
  INDEX `idx_commandes_resto_statut` (`id_restaurant`, `statut`),
  INDEX `idx_commandes_user_statut` (`id_utilisateur`, `statut`),
  INDEX `idx_commandes_statut_paiement` (`statut_paiement`),
  INDEX `idx_commandes_date_validation` (`date_validation`),
  INDEX `idx_commandes_created_at` (`created_at`),
  CONSTRAINT `fk_commandes_etudiant` FOREIGN KEY (`id_utilisateur`)
    REFERENCES `etudiants` (`id_utilisateur`) ON DELETE RESTRICT,
  CONSTRAINT `fk_commandes_restaurant` FOREIGN KEY (`id_restaurant`)
    REFERENCES `restaurants` (`id_restaurant`) ON DELETE CASCADE,
  CONSTRAINT `fk_commandes_valideur` FOREIGN KEY (`id_valideur`)
    REFERENCES `employes` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_commandes_admin_valideur` FOREIGN KEY (`id_admin_valideur`)
    REFERENCES `administrateurs` (`id_utilisateur`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Table : contenir (Liaison commande - articles)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `contenir`;
CREATE TABLE `contenir` (
  `id_commande` BIGINT UNSIGNED NOT NULL,
  `id_article` BIGINT UNSIGNED NOT NULL,
  `quantite` INT UNSIGNED NOT NULL,
  `prix_unitaire` BIGINT UNSIGNED NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_commande`, `id_article`),
  INDEX `idx_contenir_article` (`id_article`),
  CONSTRAINT `fk_contenir_commande` FOREIGN KEY (`id_commande`)
    REFERENCES `commandes` (`id_commande`) ON DELETE CASCADE,
  CONSTRAINT `fk_contenir_article` FOREIGN KEY (`id_article`)
    REFERENCES `articles_menu` (`id_article`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. Table : paiements
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `paiements`;
CREATE TABLE `paiements` (
  `id_paiement` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_paiement` VARCHAR(150) NOT NULL,
  `id_commande` BIGINT UNSIGNED NOT NULL,
  `id_utilisateur` BIGINT UNSIGNED NOT NULL,
  `montant_paye` BIGINT UNSIGNED NOT NULL,
  `mode_paiement` ENUM('MOMO', 'OM', 'loyalty', 'mixed') NOT NULL,
  `statut` ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `gateway_response` JSON DEFAULT NULL,
  `date_paiement` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_paiement`),
  UNIQUE KEY `uniq_paiements_reference` (`reference_paiement`),
  INDEX `idx_paiements_commande_statut` (`id_commande`, `statut`),
  INDEX `idx_paiements_date` (`date_paiement`),
  CONSTRAINT `fk_paiements_commande` FOREIGN KEY (`id_commande`)
    REFERENCES `commandes` (`id_commande`) ON DELETE CASCADE,
  CONSTRAINT `fk_paiements_etudiant` FOREIGN KEY (`id_utilisateur`)
    REFERENCES `etudiants` (`id_utilisateur`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. Table : mvt_points (Fidélité & Parrainage)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `mvt_points`;
CREATE TABLE `mvt_points` (
  `id_mvt` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_utilisateur` BIGINT UNSIGNED NOT NULL,
  `id_commande` BIGINT UNSIGNED DEFAULT NULL,
  `type_mvt` ENUM('gain', 'utilisation', 'expiration', 'parrainage') NOT NULL,
  `nbre_points` INT NOT NULL,
  `solde_apres` INT UNSIGNED NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `date_expiration` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_mvt`),
  INDEX `idx_mvt_points_user_type` (`id_utilisateur`, `type_mvt`),
  INDEX `idx_mvt_points_user_expiration` (`id_utilisateur`, `date_expiration`),
  INDEX `idx_mvt_points_expiration` (`date_expiration`),
  CONSTRAINT `fk_mvt_points_etudiant` FOREIGN KEY (`id_utilisateur`)
    REFERENCES `etudiants` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_mvt_points_commande` FOREIGN KEY (`id_commande`)
    REFERENCES `commandes` (`id_commande`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. Table : reclamations
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `reclamations`;
CREATE TABLE `reclamations` (
  `id_reclamation` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_reclamation` VARCHAR(20) NOT NULL,
  `id_utilisateur` BIGINT UNSIGNED NOT NULL,
  `id_commande` BIGINT UNSIGNED NOT NULL,
  `motif` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `statut` ENUM('validee', 'observation', 'rejetee') NOT NULL DEFAULT 'observation',
  `reponse` TEXT DEFAULT NULL,
  `id_traitant` BIGINT UNSIGNED DEFAULT NULL,
  `date_traitement` TIMESTAMP NULL DEFAULT NULL,
  `id_gerant` BIGINT UNSIGNED DEFAULT NULL,
  `date_decision` TIMESTAMP NULL DEFAULT NULL,
  `decision` VARCHAR(50) DEFAULT NULL,
  `id_admin_traitant` BIGINT UNSIGNED DEFAULT NULL,
  `date_traitement_admin` TIMESTAMP NULL DEFAULT NULL,
  `id_admin_decideur` BIGINT UNSIGNED DEFAULT NULL,
  `date_decision_admin` TIMESTAMP NULL DEFAULT NULL,
  `decision_admin` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_reclamation`),
  UNIQUE KEY `uniq_reclamations_numero` (`numero_reclamation`),
  INDEX `idx_reclamations_user_statut` (`id_utilisateur`, `statut`),
  INDEX `idx_reclamations_commande_statut` (`id_commande`, `statut`),
  INDEX `idx_reclamations_statut` (`statut`),
  CONSTRAINT `fk_reclamations_etudiant` FOREIGN KEY (`id_utilisateur`)
    REFERENCES `etudiants` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_reclamations_commande` FOREIGN KEY (`id_commande`)
    REFERENCES `commandes` (`id_commande`) ON DELETE CASCADE,
  CONSTRAINT `fk_reclamations_traitant` FOREIGN KEY (`id_traitant`)
    REFERENCES `employes` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_reclamations_gerant` FOREIGN KEY (`id_gerant`)
    REFERENCES `gerants` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_reclamations_admin_traitant` FOREIGN KEY (`id_admin_traitant`)
    REFERENCES `administrateurs` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_reclamations_admin_decideur` FOREIGN KEY (`id_admin_decideur`)
    REFERENCES `administrateurs` (`id_utilisateur`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 13. Table : livraisons
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `livraisons`;
CREATE TABLE `livraisons` (
  `id_livraison` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_livraison` VARCHAR(20) NOT NULL,
  `id_commande` BIGINT UNSIGNED NOT NULL,
  `adresse_livraison` TEXT NOT NULL,
  `frais_livraison` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `statut_livraison` ENUM('en_attente', 'assignee', 'en_cours', 'livree', 'echouee') NOT NULL DEFAULT 'en_attente',
  `date_prevue` TIMESTAMP NULL DEFAULT NULL,
  `date_livraison` TIMESTAMP NULL DEFAULT NULL,
  `id_livreur` BIGINT UNSIGNED DEFAULT NULL,
  `notes_livreur` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id_livraison`),
  UNIQUE KEY `uniq_livraisons_numero` (`numero_livraison`),
  UNIQUE KEY `uniq_livraisons_commande` (`id_commande`),
  INDEX `idx_livraisons_statut_prevue` (`statut_livraison`, `date_prevue`),
  INDEX `idx_livraisons_livreur` (`id_livreur`),
  CONSTRAINT `fk_livraisons_commande` FOREIGN KEY (`id_commande`)
    REFERENCES `commandes` (`id_commande`) ON DELETE CASCADE,
  CONSTRAINT `fk_livraisons_livreur` FOREIGN KEY (`id_livreur`)
    REFERENCES `employes` (`id_utilisateur`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
