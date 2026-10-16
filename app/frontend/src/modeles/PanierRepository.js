// src/modeles/PanierRepository.js
// Sauvegarde le panier dans le navigateur (localStorage) pour qu'il survive
// quand on change de page ou qu'on rafraîchit.
// La page Menu (un autre membre de l'équipe) utilisera la même classe pour ajouter des articles :
//   PanierRepository.sauvegarder(PanierRepository.charger().ajouter(article));
import Panier from "./Panier.js";

export default class PanierRepository {
  static #CLE = "mmm_panier";

  // Renvoie toujours un Panier (vide si rien n'est sauvegardé ou si les données sont abîmées).
  static charger() {
    try {
      const texte = localStorage.getItem(PanierRepository.#CLE);
      return texte ? Panier.depuisJSON(JSON.parse(texte)) : new Panier();
    } catch {
      return new Panier();
    }
  }

  static sauvegarder(panier) {
    try {
      localStorage.setItem(PanierRepository.#CLE, JSON.stringify(panier));
    } catch {
      // localStorage indisponible (navigation privée...) : on ignore, le panier reste en mémoire.
    }
  }

  static supprimer() {
    try {
      localStorage.removeItem(PanierRepository.#CLE);
    } catch {
      // rien à faire
    }
  }
}