// src/modeles/donneesTest.js
// TEMPORAIRE : les 3 plats de la maquette Figma, pour voir la page Panier
// avant que la page Menu soit prête. À supprimer quand le Menu ajoute de vrais articles.
//
// Pour afficher de vraies photos : exporter les images depuis Figma dans
// src/assets/plats/, puis les importer ici :
//   import photoNdole from "../assets/plats/ndole.jpg";
//   ... new Article({ id: 1, ..., image: photoNdole })
import Article from "./Article.js";
import Panier from "./Panier.js";

export function panierDeTest() {
  return new Panier()
    .ajouter(
      new Article({
        id: 1,
        nom: "Ndolé royal avec crevettes",
        description: "Accompagné de plantain au choix",
        prix: 1500,
      })
    )
    .ajouter(
      new Article({
        id: 2,
        nom: "Poulet pané",
        description: "Accompagné de plantain frit ou de frites de pomme au choix",
        prix: 2000,
      }),
      2
    )
    .ajouter(
      new Article({
        id: 3,
        nom: "1L de folère",
        description: "Jus naturel et rafraîchissant",
        prix: 500,
      })
    );
}
