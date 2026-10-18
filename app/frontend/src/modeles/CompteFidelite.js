// src/modeles/CompteFidelite.js
// Les règles du programme de fidélité (cahier des charges, §2.1.2) :
//   1000 F dépensés = 1 point     |     15 points = 1000 F de réduction
// Toute la logique est ici ; les composants React ne font qu'afficher.
export default class CompteFidelite {
  static MONTANT_PAR_POINT = 1000; // F dépensés pour gagner 1 point
  static POINTS_PAR_TRANCHE = 15; // 15 points...
  static VALEUR_TRANCHE = 1000; // ... valent 1000 F
  static SEUIL_UTILISATION = 15; // minimum de points pour les utiliser (à confirmer avec l'équipe)
  static ARRONDI = 50; // la réduction est arrondie aux 50 F inférieurs (comme sur la maquette)

  #points;

  constructor(points) {
    this.#points = points;
  }

  get points() {
    return this.#points;
  }

  get peutUtiliserPoints() {
    return this.#points >= CompteFidelite.SEUIL_UTILISATION;
  }

  // Réduction proportionnelle : 28 points -> 1866 F -> arrondi à 1850 F
  get reductionDisponible() {
    if (!this.peutUtiliserPoints) return 0;
    const exact = (this.#points * CompteFidelite.VALEUR_TRANCHE) / CompteFidelite.POINTS_PAR_TRANCHE;
    return Math.floor(exact / CompteFidelite.ARRONDI) * CompteFidelite.ARRONDI;
  }

  // 28 points -> 13 points déjà gagnés vers la prochaine tranche de 15
  get pointsVersProchaineTranche() {
    return this.#points % CompteFidelite.POINTS_PAR_TRANCHE;
  }

  get progression() {
    return this.pointsVersProchaineTranche / CompteFidelite.POINTS_PAR_TRANCHE;
  }

  // Points gagnés pour une commande : 5000 F -> 5 points
  static pointsGagnes(montant) {
    return Math.floor(montant / CompteFidelite.MONTANT_PAR_POINT);
  }
}
