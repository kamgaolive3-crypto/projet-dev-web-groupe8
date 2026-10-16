// src/utils/formaterPrix.js
// Affiche un montant comme sur la maquette : 15000 -> "15 000 FCFA"
const formatNombre = new Intl.NumberFormat("fr-FR");

export function formaterPrix(montant) {
  return `${formatNombre.format(montant)} FCFA`;
}