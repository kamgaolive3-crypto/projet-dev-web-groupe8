// src/modeles/essai.js  --  fichier de TEST temporaire (à supprimer après).
// Lancer avec :  node essai.js
import Article from "./Article.js";
import Panier from "./Panier.js";

const ndole = new Article({ id: 1, nom: "Ndolé", prix: 5000 });
const poulet = new Article({ id: 2, nom: "Poulet pané", prix: 2500 });

let panier = new Panier();
console.log("Panier vide ?", panier.estVide); // true

panier = panier.ajouter(ndole);
panier = panier.ajouter(poulet, 2);
panier = panier.ajouter(ndole); // le Ndolé passe à 2
console.log("Nombre d'articles :", panier.nombreArticles); // 4
console.log("Sous-total :", panier.sousTotal); // 15000

panier = panier.modifierQuantite(2, 1); // poulet : 2 -> 1
console.log("Après modification :", panier.sousTotal); // 12500

panier = panier.retirer(1); // on enlève le Ndolé
console.log("Après retrait :", panier.sousTotal); // 2500

// Sauvegarde puis rechargement (utile pour le localStorage)
const texte = JSON.stringify(panier);
console.log("En texte :", texte);
const recharge = Panier.depuisJSON(JSON.parse(texte));
console.log("Rechargé, sous-total :", recharge.sousTotal); // 2500

// Test de la protection : un prix négatif doit provoquer une erreur
try {
  new Article({ id: 3, nom: "Erreur", prix: -100 });
} catch (e) {
  console.log("Erreur attendue :", e.message);
}