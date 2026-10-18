// src/composantE/fidelite/TableauPoints.jsx
// "Points gagnés par commande" : les 3 dernières lignes, puis "Voir plus".
import { useState } from "react";
import CarteFidelite from "./CarteFidelite.jsx";
import CompteFidelite from "../../modeles/CompteFidelite.js";
import { formaterFrancs } from "../../utils/formaterPrix.js";

export default function TableauPoints({ historique }) {
  const [toutVoir, setToutVoir] = useState(false);
  const lignes = toutVoir ? historique : historique.slice(0, 3);

  return (
    <CarteFidelite titre="Points gagnés par commande">
      <table className="w-full text-sm text-secondary">
        <thead>
          <tr className="text-left text-secondary/60">
            <th className="pb-2 font-normal">Date · Montant</th>
            <th className="pb-2 text-right font-normal">Points</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => (
            <tr key={ligne.id} className="border-t border-grey-300">
              <td className="py-2">
                {ligne.date} · {formaterFrancs(ligne.montant)}
              </td>
              <td className="py-2 text-right font-semibold text-primary-800">
                +{CompteFidelite.pointsGagnes(ligne.montant)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {historique.length > 3 && (
        <button
          type="button"
          onClick={() => setToutVoir(!toutVoir)}
          className="self-end rounded-full bg-primary px-4 py-1 text-xs font-medium text-secondary transition hover:bg-primary-700"
        >
          {toutVoir ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </CarteFidelite>
  );
}
