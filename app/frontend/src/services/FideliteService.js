// src/services/FideliteService.js
// Fournit à l'interface les données du programme de fidélité.
//
// POUR L'INSTANT : données de démonstration (le backend n'est pas encore prêt).
// PLUS TARD : remplacer le contenu de chaque méthode par un appel à l'API avec fetch(), par exemple
//   compte()      -> GET  /users/{id}/points        (route du cahier des charges)
//   genererCode() -> POST /referral/generate        (route du cahier des charges)
// Les routes de l'historique, des filleuls et du classement ne sont pas définies
// dans le cahier : à convenir avec l'équipe backend.
import CompteFidelite from "../modeles/CompteFidelite.js";

const COMMANDES_PAR_PERIODE = {
  jour: [4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
  semaine: [9, 8, 8, 7, 6, 5, 5, 4, 3, 3],
  mois: [30, 27, 24, 21, 19, 17, 15, 12, 10, 8],
};
const NOMS = ["Olive", "Awa", "Paul", "Diana", "Junior", "Cindy", "Emerie", "Soume", "Yous", "Dina"];

export default class FideliteService {
  static async compte() {
    return new CompteFidelite(28);
  }

  static async historiquePoints() {
    return [
      { id: 1, date: "02/09/2026", montant: 5000 },
      { id: 2, date: "25/09/2026", montant: 12000 },
      { id: 3, date: "28/09/2026", montant: 8000 },
      { id: 4, date: "05/10/2026", montant: 3500 },
    ];
  }

  static async parrainage() {
    return {
      code: "MIAM-2026",
      filleuls: [
        { id: 1, nom: "Olive", statut: "Récompense attribuée", points: 5 },
        { id: 2, nom: "Diana", statut: "En attente de sa 1re commande", points: 0 },
      ],
    };
  }

  static async genererCode() {
    return "MIAM-2026";
  }

  // Classement par NOMBRE DE COMMANDES (cahier des charges), filtré par période.
  static async topClients(periode) {
    return NOMS.map((nom, i) => ({ nom, commandes: COMMANDES_PAR_PERIODE[periode][i] }));
  }
}
