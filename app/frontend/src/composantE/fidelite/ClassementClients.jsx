// src/composantE/fidelite/ClassementClients.jsx
// Top 10 des clients ayant le plus de commandes, avec filtre jour / semaine / mois (cahier des charges).
import CarteFidelite from "./CarteFidelite.jsx";

const PERIODES = [
  { valeur: "jour", libelle: "Jour" },
  { valeur: "semaine", libelle: "Semaine" },
  { valeur: "mois", libelle: "Mois" },
];

export default function ClassementClients({ classement, periode, onChangerPeriode }) {
  // Deux colonnes : les rangs 1 à 5, puis 6 à 10
  const colonnes = [classement.slice(0, 5), classement.slice(5, 10)];

  return (
    <CarteFidelite titre="Top 10 des meilleurs clients">
      <div className="flex gap-2">
        {PERIODES.map((p) => (
          <button
            key={p.valeur}
            type="button"
            aria-pressed={periode === p.valeur}
            onClick={() => onChangerPeriode(p.valeur)}
            className={`rounded-full border px-4 py-1 text-xs font-medium transition ${
              periode === p.valeur
                ? "border-primary bg-primary text-secondary"
                : "border-grey-300 bg-white text-secondary hover:bg-grey"
            }`}
          >
            {p.libelle}
          </button>
        ))}
      </div>

      <div className="grid gap-x-10 md:grid-cols-2">
        {colonnes.map((groupe, g) => (
          <ol key={g} className="flex flex-col text-sm text-secondary">
            {groupe.map((client, i) => (
              <li key={client.nom} className="flex justify-between border-b border-grey-300 py-2">
                <span>
                  {g * 5 + i + 1}. {client.nom}
                </span>
                <span className="font-semibold">
                  {client.commandes} commande{client.commandes > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ol>
        ))}
      </div>
    </CarteFidelite>
  );
}
