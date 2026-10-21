# Plan de gestion des risques — Mon Miam Miam

Projet : plateforme de commande & fidélité pour le restaurant ZeDuc@Space (UCAC-ICAM Yaoundé).
Méthode : revue hebdomadaire d'équipe ; chaque risque a un responsable et un plan de réponse.

| # | Risque | Probabilité | Impact | Prévention / réponse | Responsable |
|---|--------|-------------|--------|----------------------|-------------|
| 1 | Retard dans le développement (charge de cours) | Élevée | Élevé | Backlog priorisé (MoSCoW), jalons hebdomadaires, périmètre bonus réduit (paiement mobile non obligatoire au CDC §271) | Chef de projet |
| 2 | Indisponibilité d'un membre (examens, maladie) | Moyenne | Moyen | Code sur Git avec revues croisées ; documentation d'installation pour que n'importe qui puisse prendre le relais | Chef de projet |
| 3 | Perte de code / erreur de manipulation Git | Faible | Élevé | Dépôt GitHub + branches feature + pull request avant fusion dans main ; historique complet | Équipe dev |
| 4 | Fuite de données personnelles (RGPD) | Faible | Critique | Mots de passe hachés (bcrypt), tokens révocables, consentement cookies enregistré (US-004), accès par rôle côté serveur | Responsable sécurité |
| 5 | Incohérence base de données ↔ code | Moyenne | Élevé | Schéma de référence app/database/schema.sql vérifié par des tests de structure automatisés (MigrationStructure*Test) | Responsable BDD |
| 6 | Serveur / réseau indisponible lors de la démo | Moyenne | Élevé | Démo en local (Laragon + Vite), jeu de données de démo (php artisan migrate:fresh --seed) | Équipe dev |
| 7 | Doubles dépenses de points / commandes falsifiées | Faible | Élevé | Toute la logique métier revalidée côté serveur (prix, disponibilité, solde, transitions de statut) dans des transactions SQL | Responsable backend |
| 8 | Abandon des étudiants utilisateurs (complexité) | Moyenne | Moyen | Interface simple (2 clics pour commander), parcours testé avec de vrais étudiants, réclamations en 1 formulaire | Responsable frontend |
| 9 | Dépassement du budget / temps sur les bonus | Moyenne | Moyen | Bonus (paiement mobile CinetPay, notifications) planifiés après les user stories obligatoires | Chef de projet |
| 10 | Conflits de fusion entre branches | Moyenne | Faible | Découpage par modules (backend / frontend), commits petits et fréquents, une seule personne par fichier à la fois | Équipe dev |

## Suivi

- Revue des risques à chaque réunion d'équipe : probabilité et impact réévalués.
- Un risque qui se réalise devient un problème : action immédiate + mise à jour du plan.
- Journal des décisions conservé dans les messages du groupe et les commits Git.
