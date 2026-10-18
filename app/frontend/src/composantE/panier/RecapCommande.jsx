// src/composantE/panier/RecapCommande.jsx
// Colonne de droite : choix du mode, heure d'arrivée, récapitulatif et bouton Confirmer.
// Ce composant ne calcule rien : il affiche ce que l'objet Commande lui donne.
import { FiChevronRight } from "react-icons/fi";
import { formaterPrix } from "../../utils/formaterPrix.js";

// Le "!" à la fin des classes force le style : index.css contient des règles h2 par défaut.
const TITRE = "m-0! text-lg! font-serif! font-semibold! text-secondary!";

export default function RecapCommande({
  commande,
  modes,
  mode,
  onChangerMode,
  heure,
  onChangerHeure,
  compte,
  utiliserPoints,
  onChangerUtiliserPoints,
  onConfirmer,
}) {
  return (
    <aside className="flex h-fit flex-col gap-5 rounded-xl border border-grey-300 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3">
        <h2 className={TITRE}>Finalisation de la commande</h2>

        <div className="flex flex-col gap-3 rounded-lg bg-grey p-4">
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
      </div>

      <div className="flex flex-col gap-3">
        <h2 className={TITRE}>Récapitulatif de la commande</h2>

        {/* Cahier des charges : l'étudiant peut utiliser ses points pour réduire le montant */}
        {compte?.peutUtiliserPoints && (
          <label className="flex cursor-pointer items-center gap-3 text-sm text-secondary">
            <input
              type="checkbox"
              checked={utiliserPoints}
              onChange={(e) => onChangerUtiliserPoints(e.target.checked)}
              className="accent-primary-800"
            />
            Utiliser mes points (jusqu'à - {formaterPrix(compte.reductionDisponible)})
          </label>
        )}

        <dl className="flex flex-col gap-2 rounded-lg bg-grey p-4 text-secondary">
          <div className="flex justify-between text-sm">
            <dt>Sous-total</dt>
            <dd className="font-semibold">{formaterPrix(commande.sousTotal)}</dd>
          </div>
          {/* La maquette affiche toujours cette ligne, même à 0 */}
          <div className="flex justify-between text-sm">
            <dt>Frais de livraison</dt>
            <dd className="font-semibold">{formaterPrix(commande.fraisLivraison)}</dd>
          </div>
          {commande.reduction > 0 && (
            <div className="flex justify-between text-sm">
              <dt>Réduction</dt>
              <dd className="font-semibold">- {formaterPrix(commande.reduction)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-grey-300 pt-3 text-sm">
            <dt className="font-semibold">Total</dt>
            <dd className="font-bold">{formaterPrix(commande.total)}</dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={onConfirmer}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-secondary transition hover:bg-primary-700"
      >
        Confirmer la commande
        <FiChevronRight aria-hidden="true" />
      </button>
    </aside>
  );
}
