// src/utils/formaterPrix.js
// Deux façons d'écrire un montant, comme sur les maquettes :
//   page Panier   : 6000 -> "6000 Fcfa"
//   page Fidélité : 1850 -> "1 850 F"
const avecEspaces = new Intl.NumberFormat("fr-FR");

export function formaterPrix(montant) {
  return `${montant} Fcfa`;
}

export function formaterFrancs(montant) {
  return `${avecEspaces.format(montant)} F`;
}
