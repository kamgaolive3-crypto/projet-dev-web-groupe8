// src/composantE/panier/RecapCommande.jsx
// Colonne de droite : choix du mode, heure d'arrivée, récapitulatif et bouton Confirmer.
// Ce composant ne calcule rien : il affiche ce que l'objet Commande lui donne.
import { formaterPrix } from "../../utils/formaterPrix.js";

export default function RecapCommande({
  commande,
  modes,
  mode,
  onChangerMode,
  heure,
  onChangerHeure,
  onConfirmer,
}) {
  return (
    <aside className="flex h-fit flex-col gap-6 rounded-xl border border-grey-300 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3">
        {/* Le "!" à la fin force le style : index.css contient des règles h2 par défaut */}
        <h2 className="m-0! text-lg! font-semibold text-secondary!">
          Finalisation de la commande
        </h2>

        {modes.map((m) => (
          <label key={m.code} className="flex cursor-pointer items-center gap-3 text-secondary">
            <input
              type="radio"
              name="mode-service"
              checked={m.code === mode.code}
              onChange={() => onChangerMode(m)}
              className="accent-primary-800"
            />
            {m.libelle}
          </label>
        ))}

        {mode.demandeHeure() && (
          <label className="flex flex-col gap-1 text-sm text-secondary">
            Heure d'arrivée
            <input
              type="time"
              value={heure}
              onChange={(e) => onChangerHeure(e.target.value)}
              className="rounded-lg border border-grey-300 bg-white px-3 py-2 text-secondary"
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="m-0! text-lg! font-semibold text-secondary!">
          Récapitulatif de la commande
        </h2>
        <dl className="flex flex-col gap-2 text-secondary">
          <div className="flex justify-between">
            <dt>Sous-total</dt>
            <dd>{formaterPrix(commande.sousTotal)}</dd>
          </div>
          {commande.fraisLivraison > 0 && (
            <div className="flex justify-between">
              <dt>Frais de livraison</dt>
              <dd>{formaterPrix(commande.fraisLivraison)}</dd>
            </div>
          )}
          {commande.reduction > 0 && (
            <div className="flex justify-between">
              <dt>Réduction</dt>
              <dd>- {formaterPrix(commande.reduction)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-grey-300 pt-3 text-lg font-semibold">
            <dt>Total</dt>
            <dd>{formaterPrix(commande.total)}</dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={onConfirmer}
        className="rounded-lg bg-primary px-4 py-3 font-semibold text-secondary transition hover:bg-primary-700"
      >
        Confirmer la commande
      </button>
    </aside>
  );
}