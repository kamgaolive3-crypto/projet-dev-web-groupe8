import { useState } from "react";
import { FiX } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/* 1. CONSTANTES ET DONNÉES DE TEST                                   */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["Plats", "Boissons"];
const FILTRES = ["Tous", ...CATEGORIES];

const STATUTS = {
  disponible: { label: "Disponible", classe: "bg-green-300" },
  rupture: { label: "Rupture", classe: "bg-red-400" },
  masque: { label: "Masqué", classe: "bg-grey-300" },
};

const FORMULAIRE_VIDE = {
  nom: "",
  categorie: "Plats",
  prix: "",
  statut: "disponible",
};

// Classes communes aux cases de saisie et aux listes déroulantes.
const STYLE_CHAMP =
  "rounded bg-grey px-3 py-2 text-base font-normal outline-none focus:ring-2 focus:ring-primary";

const PLATS_INITIAUX = [
  { id: 1, nom: "Ndolé royal", categorie: "Plats", prix: 1000, statut: "disponible" },
  { id: 2, nom: "Poulet pané", categorie: "Plats", prix: 2000, statut: "disponible" },
  { id: 3, nom: "Okok salé", categorie: "Plats", prix: 1000, statut: "rupture" },
  { id: 4, nom: "Jus de fruit", categorie: "Boissons", prix: 1000, statut: "masque" },
];

// 1000 devient "1 000 Fcfa"
function formaterPrix(prix) {
  return `${Number(prix).toLocaleString("fr-FR")} Fcfa`;
}

/* ------------------------------------------------------------------ */
/* 2. COMPOSANT RÉUTILISABLE : un champ de formulaire                 */
/* ------------------------------------------------------------------ */
function Champ({ label, className = "", ...reste }) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${className}`}>
      {label} :
      <input {...reste} className={STYLE_CHAMP} />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* 3. LA PAGE                                                         */
/* ------------------------------------------------------------------ */
export default function GestionMenu() {
  // --- Mémoire de la page ---
  const [plats, setPlats] = useState(PLATS_INITIAUX);
  const [filtre, setFiltre] = useState("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [idEnEdition, setIdEnEdition] = useState(null); // null = on ajoute

  const platsAffiches =
    filtre === "Tous" ? plats : plats.filter((plat) => plat.categorie === filtre);

  // --- Actions ---
  function ouvrirAjout() {
    setFormulaire(FORMULAIRE_VIDE);
    setIdEnEdition(null);
    setModalOuvert(true);
  }

  function ouvrirModification(plat) {
    setFormulaire(plat);
    setIdEnEdition(plat.id);
    setModalOuvert(true);
  }

  function fermerModal() {
    setModalOuvert(false);
  }

  function gererChangement(e) {
    const { name, value } = e.target;
    setFormulaire({ ...formulaire, [name]: value });
  }

  function gererSoumission(e) {
    e.preventDefault();

    // Le champ "prix" fournit du texte : on le convertit en nombre.
    const plat = { ...formulaire, prix: Number(formulaire.prix) };

    if (idEnEdition === null) {
      const nouvelId =
        plats.length > 0 ? Math.max(...plats.map((p) => p.id)) + 1 : 1;
      setPlats([...plats, { ...plat, id: nouvelId }]);
    } else {
      setPlats(plats.map((p) => (p.id === idEnEdition ? { ...p, ...plat } : p)));
    }
    fermerModal();
  }

  function supprimer(id) {
    if (window.confirm("Voulez-vous vraiment supprimer ce plat ?")) {
      setPlats(plats.filter((plat) => plat.id !== id));
    }
  }

  // --- Affichage ---
  return (
    <section className="bg-white px-6 py-10 text-secondary">
      <div className="mx-auto max-w-5xl">
        {/* En-tête : titre + filtres à gauche, bouton à droite */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-3xl">Gestion des menus</p>
            <div className="mt-3 flex gap-2">
              {FILTRES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFiltre(f)}
                  aria-pressed={filtre === f}
                  className={`rounded-full border border-primary-700 px-4 py-0.5 text-xs ${
                    filtre === f ? "bg-primary-700 font-medium" : "bg-white hover:bg-primary/20"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={ouvrirAjout}
            className="rounded-full bg-primary-700 px-5 py-1 text-sm hover:bg-primary-800 hover:text-white"
          >
            + Ajouter un plat
          </button>
        </div>

        {/* Tableau */}
        <div className="mt-6 overflow-x-auto rounded-3xl border border-primary/50 bg-white px-6 py-4">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-primary-700">
                <th className="px-3 py-3 font-normal">Plats</th>
                <th className="px-3 py-3 text-center font-normal">Catégories</th>
                <th className="px-3 py-3 font-normal">Prix</th>
                <th className="px-3 py-3 text-center font-normal">Statut</th>
                <th className="px-3 py-3 text-center font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {platsAffiches.map((plat) => (
                <tr key={plat.id} className="border-b border-primary/40 last:border-b-0">
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-lg bg-primary-700" />
                      {plat.nom}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">{plat.categorie}</td>
                  <td className="px-3 py-4">{formaterPrix(plat.prix)}</td>
                  <td className="px-3 py-4 text-center">
                    <span
                      className={`inline-block min-w-24 rounded-full px-3 py-0.5 text-xs ${STATUTS[plat.statut].classe}`}
                    >
                      {STATUTS[plat.statut].label}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => ouvrirModification(plat)}
                        aria-label={`Modifier ${plat.nom}`}
                        className="rounded-full border border-primary-700 px-4 py-0.5 text-xs hover:bg-primary/20"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => supprimer(plat.id)}
                        aria-label={`Supprimer ${plat.nom}`}
                        className="text-xs text-secondary/50 hover:text-secondary hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {platsAffiches.length === 0 && (
            <p className="py-6 text-center text-sm text-secondary/60">
              Aucun plat dans cette catégorie.
            </p>
          )}
        </div>
      </div>

      {/* Fenêtre d'ajout / de modification */}
      {modalOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-modal"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-8 shadow-xl"
          >
            <button
              type="button"
              onClick={fermerModal}
              aria-label="Fermer"
              className="absolute right-3 top-3 rounded p-1 hover:bg-grey"
            >
              <FiX size={26} />
            </button>

            <p id="titre-modal" className="mb-6 text-center text-2xl text-primary-700">
              {idEnEdition === null ? "Nouveau plat" : "Modifier le plat"}
            </p>

            <form onSubmit={gererSoumission} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Champ
                label="Nom du plat"
                name="nom"
                value={formulaire.nom}
                onChange={gererChangement}
                required
                className="sm:col-span-2"
              />

              <label className="flex flex-col gap-1 text-sm font-medium">
                Catégorie :
                <select
                  name="categorie"
                  value={formulaire.categorie}
                  onChange={gererChangement}
                  className={STYLE_CHAMP}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <Champ
                label="Prix (Fcfa)"
                name="prix"
                type="number"
                min="0"
                value={formulaire.prix}
                onChange={gererChangement}
                required
              />

              <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
                Statut :
                <select
                  name="statut"
                  value={formulaire.statut}
                  onChange={gererChangement}
                  className={STYLE_CHAMP}
                >
                  {Object.keys(STATUTS).map((cle) => (
                    <option key={cle} value={cle}>
                      {STATUTS[cle].label}
                    </option>
                  ))}
                </select>
              </label>
                  
              <div className="mt-4 flex justify-center sm:col-span-2">
                <button
                  type="submit"
                  className="w-full max-w-xs rounded-lg bg-primary px-6 py-3 text-lg text-secondary hover:bg-primary-700"
                >
                  {idEnEdition === null ? "Ajouter" : "Enregistrer"}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
