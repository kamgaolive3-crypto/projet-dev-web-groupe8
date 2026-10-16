// src/modeles/Panier.js
// Le panier de l'étudiant : toute la logique du panier est ICI,
// pas dans les composants React (abstraction : l'écran demande, le Panier calcule).
import LignePanier from "./LignePanier.js";

export default class Panier {
  #lignes;

  constructor(lignes = []) {
    this.#lignes = lignes;
  }

  // On renvoie une COPIE pour que personne ne modifie la liste interne (encapsulation).
  get lignes() {
    return [...this.#lignes];
  }

  get estVide() {
    return this.#lignes.length === 0;
  }

  // Nombre total d'articles (ex : 2 Ndolé + 1 Poulet = 3)
  get nombreArticles() {
    return this.#lignes.reduce((total, ligne) => total + ligne.quantite, 0);
  }

  // Somme des prix de toutes les lignes
  get sousTotal() {
    return this.#lignes.reduce((total, ligne) => total + ligne.sousTotal, 0);
  }

  // Les méthodes ci-dessous ne modifient pas ce panier : elles renvoient un NOUVEAU Panier.

  ajouter(article, quantite = 1) {
    const dejaLa = this.#lignes.some((l) => l.article.id === article.id);
    const lignes = dejaLa
      ? this.#lignes.map((l) =>
          l.article.id === article.id ? l.avecQuantite(l.quantite + quantite) : l
        )
      : [...this.#lignes, new LignePanier(article, quantite)];
    return new Panier(lignes);
  }

  // Si la quantité tombe à 0 (bouton "-"), l'article est retiré.
  modifierQuantite(idArticle, quantite) {
    if (quantite < 1) {
      return this.retirer(idArticle);
    }
    return new Panier(
      this.#lignes.map((l) =>
        l.article.id === idArticle ? l.avecQuantite(quantite) : l
      )
    );
  }

  retirer(idArticle) {
    return new Panier(this.#lignes.filter((l) => l.article.id !== idArticle));
  }

  vider() {
    return new Panier();
  }

  toJSON() {
    return { lignes: this.#lignes.map((l) => l.toJSON()) };
  }

  static depuisJSON(donnees) {
    const lignes = (donnees?.lignes ?? []).map((l) => LignePanier.depuisJSON(l));
    return new Panier(lignes);
  }
}