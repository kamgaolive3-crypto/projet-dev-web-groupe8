// src/modeles/Article.js
// Un plat du menu.
// Les champs commencent par # : ils sont PRIVÉS (encapsulation).
// De l'extérieur, on les lit avec les "getters" (article.nom, article.prix...).
export default class Article {
  #id;
  #nom;
  #prix;
  #description;
  #image;

  constructor({ id, nom, prix, description = "", image = "" }) {
    if (!nom || nom.trim() === "") {
      throw new Error("Un article doit avoir un nom");
    }
    if (typeof prix !== "number" || prix < 0) {
      throw new Error("Le prix d'un article doit être un nombre positif");
    }
    this.#id = id;
    this.#nom = nom.trim();
    this.#prix = prix;
    this.#description = description;
    this.#image = image;
  }

  get id() {
    return this.#id;
  }
  get nom() {
    return this.#nom;
  }
  get prix() {
    return this.#prix;
  }
  get description() {
    return this.#description;
  }
  get image() {
    return this.#image;
  }

  // Transforme l'article en simple objet (pour le sauvegarder ou l'envoyer à l'API).
  // JSON.stringify() appelle cette méthode automatiquement.
  toJSON() {
    return {
      id: this.#id,
      nom: this.#nom,
      prix: this.#prix,
      description: this.#description,
      image: this.#image,
    };
  }

  // Recrée un Article à partir d'un simple objet.
  static depuisJSON(donnees) {
    return new Article(donnees);
  }
}
