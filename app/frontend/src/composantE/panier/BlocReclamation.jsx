// src/composantE/panier/BlocReclamation.jsx
// Bloc "Après commande : Une réclamation ?" de la maquette.
// Le lien mène vers /Reclamation : cette route doit être ajoutée dans App.jsx
// quand la page de réclamation de l'étudiant existera.
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiChevronRight } from "react-icons/fi";

export default function BlocReclamation() {
  return (
    <div className="flex flex-col gap-3">
      {/* Le "!" à la fin force le style : index.css contient des règles h2 par défaut */}
      <h2 className="m-0! text-xl! font-serif! font-bold! text-secondary!">
        Après commande
      </h2>

      <div className="flex flex-col gap-3 rounded-xl border border-primary bg-primary/5 p-5">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="shrink-0 text-primary-800" size={30} aria-hidden="true" />
          <span className="font-serif text-lg font-bold text-secondary">
            Une réclamation ?
          </span>
        </div>

        <span className="text-sm text-secondary/70">
          Vous avez un problème avec votre commande (erreur, plat manquant, hygiène,
          etc.) ? Faites une réclamation en un clic.
        </span>

        <Link
          to="/Reclamation"
          className="flex items-center gap-1 self-end rounded-lg border border-primary-800 px-4 py-1.5 text-sm font-medium text-primary-800 transition hover:bg-primary/30"
        >
          Faire une réclamation
          <FiChevronRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
