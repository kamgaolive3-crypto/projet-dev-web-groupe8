// src/modeles/donneesTest.js
// TEMPORAIRE : quelques articles pour voir la page Panier avant que la page Menu soit prête.
// À supprimer quand le Menu ajoute de vrais articles au panier.
import Article from "./Article.js";
import Panier from "./Panier.js";

export function panierDeTest() {
  return new Panier()
    .ajouter(new Article({ id: 1, nom: "Ndolé", prix: 2500 }))
    .ajouter(new Article({ id: 2, nom: "Poulet pané", prix: 2000 }), 2)
    .ajouter(new Article({ id: 3, nom: "Jus de bissap", prix: 500 }));
}