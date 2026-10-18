// src/composantE/fidelite/BlocParrainage.jsx
// Code de parrainage (à copier ou à générer) + suivi des filleuls.
import { useState } from "react";
import CarteFidelite from "./CarteFidelite.jsx";
import FideliteService from "../../services/FideliteService.js";

export default function BlocParrainage({ parrainage }) {
  const [code, setCode] = useState(parrainage.code);
  const [copie, setCopie] = useState(false);
  const [toutVoir, setToutVoir] = useState(false);
  const filleuls = toutVoir ? parrainage.filleuls : parrainage.filleuls.slice(0, 3);

  async function generer() {
    setCode(await FideliteService.genererCode());
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(code);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // copie refusée par le navigateur : on ne fait rien
    }
  }

  return (
    <CarteFidelite titre="Parrainage">
      <div className="flex items-center justify-between gap-3 rounded-lg bg-grey px-4 py-2 text-sm text-secondary">
        {code ? (
          <>
            <span>
              Votre code : <strong>{code}</strong>
            </span>
            <button
              type="button"
              onClick={copier}
              className="rounded-full bg-primary px-3 py-1 text-xs font-medium transition hover:bg-primary-700"
            >
              {copie ? "Copié !" : "Copier"}
            </button>
          </>
        ) : (
          <>
            <span>Vous n'avez pas encore de code</span>
            <button
              type="button"
              onClick={generer}
              className="rounded-full bg-primary px-3 py-1 text-xs font-medium transition hover:bg-primary-700"
            >
              Générer mon code
            </button>
          </>
        )}
      </div>

      <table className="w-full text-sm text-secondary">
        <thead>
          <tr className="text-left text-secondary/60">
            <th className="pb-2 font-normal">Filleul · Statut</th>
            <th className="pb-2 text-right font-normal">Points</th>
          </tr>
        </thead>
        <tbody>
          {filleuls.map((f) => (
            <tr key={f.id} className="border-t border-grey-300">
              <td className="py-2">
                {f.nom} · {f.statut}
              </td>
              <td className="py-2 text-right font-semibold text-primary-800">+{f.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {parrainage.filleuls.length > 3 && (
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
