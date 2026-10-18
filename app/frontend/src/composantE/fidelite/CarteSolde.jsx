// src/composantE/fidelite/CarteSolde.jsx
// Haut de la page : "Mes points" (avec barre de progression) et "Réduction disponible".
import { Link } from "react-router-dom";
import CompteFidelite from "../../modeles/CompteFidelite.js";
import { formaterFrancs } from "../../utils/formaterPrix.js";

export default function CarteSolde({ compte }) {
  const tranche = CompteFidelite.POINTS_PAR_TRANCHE;

  return (
    <section className="grid gap-6 rounded-xl border border-grey-300 bg-white p-5 shadow-sm md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <span className="text-sm text-secondary/70">Mes points</span>
        <span className="font-serif text-4xl font-bold text-secondary">{compte.points} pts</span>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-grey"
          role="progressbar"
          aria-label="Progression vers la prochaine réduction"
          aria-valuemin={0}
          aria-valuemax={tranche}
          aria-valuenow={compte.pointsVersProchaineTranche}
        >
          <div
            className="h-full rounded-full bg-primary-700"
            style={{ width: `${compte.progression * 100}%` }}
          />
        </div>
        <span className="text-sm text-secondary/70">
          {compte.pointsVersProchaineTranche}/{tranche} points vers la prochaine réduction
        </span>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-center md:border-l md:border-grey-300 md:text-center">
        <span className="text-sm text-secondary/70">Réduction disponible</span>
        <span className="font-serif text-4xl font-bold text-secondary">
          {formaterFrancs(compte.reductionDisponible)}
        </span>
        {compte.peutUtiliserPoints ? (
          <Link
            to="/Panier"
            className="rounded-full bg-primary px-6 py-2 font-medium text-secondary transition hover:bg-primary-700"
          >
            Utiliser mes points
          </Link>
        ) : (
          <>
            <span className="rounded-full bg-grey px-6 py-2 font-medium text-secondary/40">
              Utiliser mes points
            </span>
            <span className="text-xs text-secondary/60">
              Minimum {CompteFidelite.SEUIL_UTILISATION} points
            </span>
          </>
        )}
      </div>
    </section>
  );
}
