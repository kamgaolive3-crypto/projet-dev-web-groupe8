// src/composantE/panier/ArticlePanier.jsx
// Affiche UNE ligne du panier : photo, nom, prix et boutons - / +.
import { FiMinus, FiPlus } from "react-icons/fi";
import { formaterPrix } from "../../utils/formaterPrix.js";

export default function ArticlePanier({ ligne, onChangerQuantite }) {
  const { article, quantite } = ligne;

  return (
    <article className="flex items-center gap-4 rounded-xl border border-grey-300 bg-white p-3 shadow-sm">
      {article.image ? (
        <img
          src={article.image}
          alt={article.nom}
          className="h-20 w-20 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="h-20 w-20 shrink-0 rounded-lg bg-grey" aria-hidden="true" />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate font-medium text-secondary">{article.nom}</span>
        <span className="font-semibold text-primary-800">
          {formaterPrix(ligne.sousTotal)}
        </span>
        <span className="text-xs text-secondary/60">
          {formaterPrix(article.prix)} l'unité
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Retirer un ${article.nom}`}
          onClick={() => onChangerQuantite(quantite - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-grey-300 bg-white text-secondary hover:bg-grey"
        >
          <FiMinus aria-hidden="true" />
        </button>
        <span className="w-6 text-center font-medium text-secondary" aria-live="polite">
          {quantite}
        </span>
        <button
          type="button"
          aria-label={`Ajouter un ${article.nom}`}
          onClick={() => onChangerQuantite(quantite + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-grey-300 bg-white text-secondary hover:bg-grey"
        >
          <FiPlus aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}