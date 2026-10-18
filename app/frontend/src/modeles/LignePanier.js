// src/modeles/LignePanier.js
// Une ligne du panier = un article + une quantité.
// (C'est l'équivalent de l'association "Contenir" du MCD : quantité + prix unitaire.)
import Article from "./Article.js";

export default class LignePanier {
  #article;
  #quantite;

  constructor(article, quantite = 1) {
    if (!(article instanceof Article)) {
      throw new Error("Une ligne de panier doit contenir un Article");
    }
    if (!Number.isInteger(quantite) || quantite < 1) {
      throw new Error("La quantité doit être un entier supérieur ou égal à 1");
    }
    this.#article = article;
    this.#quantite = quantite;
  }

  get article() {
    return this.#article;
  }
  get quantite() {
    return this.#quantite;
  }

  // Prix de la ligne = prix de l'article x quantité
  get sousTotal() {
    return this.#article.prix * this.#quantite;
  }

  // Renvoie une NOUVELLE ligne avec une autre quantité.
  // On ne modifie jamais l'ancienne : c'est ce qui permet à React de voir le changement.
  avecQuantite(quantite) {
    return new LignePanier(this.#article, quantite);
  }

  toJSON() {
    return { article: this.#article.toJSON(), quantite: this.#quantite };
  }

  static depuisJSON(donnees) {
    return new LignePanier(Article.depuisJSON(donnees.article), donnees.quantite);
  }
}
