// src/modeles/Commande.js
// Une commande = un panier + un mode de service (+ heure, + réduction éventuelle).
// C'est ici qu'on calcule le total : la page React ne fait que l'afficher.
export default class Commande {
  #panier;
  #mode;
  #heureArrivee;
  #reduction;

  constructor(panier, mode, { heureArrivee = "", reduction = 0 } = {}) {
    this.#panier = panier;
    this.#mode = mode;
    this.#heureArrivee = heureArrivee;
    this.#reduction = reduction;
  }

  get panier() {
    return this.#panier;
  }
  get mode() {
    return this.#mode;
  }

  get sousTotal() {
    return this.#panier.sousTotal;
  }

  // Polymorphisme : on ne sait pas si c'est SurPlace ou Livraison, et on n'en a pas besoin.
  get fraisLivraison() {
    return this.#mode.fraisLivraison();
  }

  // La réduction ne peut pas dépasser le sous-total.
  get reduction() {
    return Math.min(this.#reduction, this.#panier.sousTotal);
  }

  get total() {
    return this.sousTotal + this.fraisLivraison - this.reduction;
  }

  // Ce qu'on enverra à l'API (POST /orders).
  // Les noms des champs sont PROVISOIRES : à valider avec l'équipe backend.
  toJSON() {
    return {
      mode_service: this.#mode.code,
      heure_recup: this.#heureArrivee || null,
      reduction_points: this.reduction,
      montant_total: this.total,
      lignes: this.#panier.lignes.map((ligne) => ({
        id_article: ligne.article.id,
        quantite: ligne.quantite,
        prix_unitaire: ligne.article.prix,
      })),
    };
  }
}