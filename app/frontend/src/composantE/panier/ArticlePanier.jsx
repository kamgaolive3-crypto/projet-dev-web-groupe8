// src/composantE/panier/ArticlePanier.jsx
// Affiche UNE ligne du panier comme sur les maquettes (desktop et mobile).
//
// Les 4 éléments sont placés dans une grille à 3 colonnes :
//  - téléphone (< 640 px)  : ligne 1 = photo + nom/description
//                            ligne 2 = prix (à gauche) + boutons (à droite)
//  - à partir de "sm"      : photo | nom, description, prix | boutons   (une seule ligne)
import { FiImage, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { formaterPrix } from "../../utils/formaterPrix.js";

export default function ArticlePanier({ ligne, onChangerQuantite, onRetirer }) {
  const { article, quantite } = ligne;

  return (
    <article className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl bg-grey p-3 sm:gap-x-4 sm:gap-y-1">
      {/* 1) Photo : la vraie photo si l'article en a une, sinon une pastille dorée */}
      {article.image ? (
        <img
          src={article.image}
          alt={article.nom}
          className="col-start-1 row-start-1 h-16 w-16 rounded-lg object-cover sm:row-span-2 sm:h-20 sm:w-20"
        />
      ) : (
        <div
          className="col-start-1 row-start-1 flex h-16 w-16 items-center justify-center rounded-lg border border-primary bg-primary/20 text-primary-800 sm:row-span-2 sm:h-20 sm:w-20"
          aria-hidden="true"
        >
          <FiImage size={24} />
        </div>
      )}

      {/* 2) Nom + description */}
      <div className="col-span-2 col-start-2 row-start-1 flex min-w-0 flex-col gap-1 self-start sm:col-span-1 sm:self-end">
        <span className="font-serif font-semibold text-secondary">{article.nom}</span>
        {article.description && (
          <span className="text-xs text-secondary/60">{article.description}</span>
        )}
      </div>

      {/* 3) Prix d'UNE unité (la quantité est à côté, comme sur la maquette) */}
      <span className="col-span-2 col-start-1 row-start-2 font-serif text-lg font-bold text-secondary sm:col-span-1 sm:col-start-2 sm:self-start">
        {formaterPrix(article.prix)}
      </span>

      {/* 4) Boutons - / + et corbeille */}
      <div className="col-start-3 row-start-2 flex items-center justify-end gap-2 sm:row-span-2 sm:row-start-1">
        <button
          type="button"
          aria-label={`Retirer un ${article.nom}`}
          disabled={quantite <= 1}
          onClick={() => onChangerQuantite(quantite - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-secondary transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40 sm:h-7 sm:w-7"
        >
          <FiMinus aria-hidden="true" />
        </button>
        <span className="w-5 text-center font-medium text-secondary" aria-live="polite">
          {quantite}
        </span>
        <button
          type="button"
          aria-label={`Ajouter un ${article.nom}`}
          onClick={() => onChangerQuantite(quantite + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-secondary transition hover:bg-primary-700 sm:h-7 sm:w-7"
        >
          <FiPlus aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Supprimer ${article.nom} du panier`}
          onClick={onRetirer}
          className="ml-1 text-primary-800 transition hover:text-red-600"
        >
          <FiTrash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
