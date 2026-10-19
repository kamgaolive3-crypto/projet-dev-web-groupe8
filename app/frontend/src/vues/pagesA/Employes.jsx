import { useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/* 1. DONNÉES DE DÉPART                                               */
/* Ce sont des données "de test". Plus tard, elles viendront du       */
/* backend (API). Pour l'instant on les écrit à la main.              */
/* ------------------------------------------------------------------ */
const EMPLOYES_INITIAUX = [
  { id: 1, nom: "NDJAO", prenom: "La Fortune", email: "", telephone: "", poste: "Cuisinière", sexe: "F", dateEmbauche: "" },
  { id: 2, nom: "FOSSAP", prenom: "Aurelie", email: "", telephone: "", poste: "Serveuse", sexe: "F", dateEmbauche: "" },
  { id: 3, nom: "SOUME", prenom: "Junior", email: "", telephone: "", poste: "Livreur", sexe: "M", dateEmbauche: "" },
  { id: 4, nom: "TAMIBE", prenom: "Damien", email: "", telephone: "", poste: "Cuisinier", sexe: "M", dateEmbauche: "" },
];

// Un formulaire "vide" : sert à remettre les champs à zéro.
const FORMULAIRE_VIDE = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  poste: "",
  sexe: "",
  dateEmbauche: "",
};

/* ------------------------------------------------------------------ */
/* 2. PETIT COMPOSANT RÉUTILISABLE : un champ de formulaire           */
/* Il évite de recopier 6 fois le même bloc (label + input).          */
/* ------------------------------------------------------------------ */
function Champ({ label, name, type = "text", value, onChange, className = "" }) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${className}`}>
      {label} :
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="rounded bg-grey px-3 py-2 text-base font-normal outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* 3. LA PAGE                                                         */
/* ------------------------------------------------------------------ */
export default function Employes() {
  // --- Les "états" : la mémoire de la page ---
  const [employes, setEmployes] = useState(EMPLOYES_INITIAUX); // la liste
  const [modalOuvert, setModalOuvert] = useState(false); // fenêtre visible ou non
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE); // ce qui est tapé
  const [idEnEdition, setIdEnEdition] = useState(null); // null = on ajoute

  // --- Les actions ---
  function ouvrirAjout() {
    setFormulaire(FORMULAIRE_VIDE);
    setIdEnEdition(null);
    setModalOuvert(true);
  }

  function ouvrirModification(employe) {
    setFormulaire(employe); // on pré-remplit avec les infos de l'employé
    setIdEnEdition(employe.id);
    setModalOuvert(true);
  }

  function fermerModal() {
    setModalOuvert(false);
  }

  // Appelée à chaque frappe dans un champ.
  function gererChangement(e) {
    const { name, value } = e.target;
    setFormulaire({ ...formulaire, [name]: value });
  }

  // Appelée quand on clique sur "Ajouter" / "Enregistrer".
  function gererSoumission(e) {
    e.preventDefault(); // empêche le rechargement de la page

    if (idEnEdition === null) {
      // AJOUT : on calcule un nouvel identifiant
      const nouvelId =
        employes.length > 0 ? Math.max(...employes.map((emp) => emp.id)) + 1 : 1;
      setEmployes([...employes, { ...formulaire, id: nouvelId }]);
    } else {
      // MODIFICATION : on remplace seulement l'employé concerné
      setEmployes(
        employes.map((emp) => (emp.id === idEnEdition ? { ...emp, ...formulaire } : emp))
      );
    }
    fermerModal();
  }

  function supprimer(id) {
    if (window.confirm("Voulez-vous vraiment supprimer cet employé ?")) {
      setEmployes(employes.filter((emp) => emp.id !== id));
    }
  }

  // --- Ce qui s'affiche ---
  return (
    <section className="bg-white px-6 py-10 text-secondary">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-center text-xl">Listes des employés</p>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-grey-300 text-base">
                <th className="px-3 py-3 font-medium">ID</th>
                <th className="px-3 py-3 font-medium">Nom</th>
                <th className="px-3 py-3 font-medium">Prénom</th>
                <th className="px-3 py-3 font-medium">Sexe</th>
                <th className="px-3 py-3 font-medium">Poste</th>
                <th className="px-3 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {employes.map((emp) => (
                <tr key={emp.id} className="border-b border-grey-300 text-sm">
                  <td className="px-3 py-4">{String(emp.id).padStart(2, "0")}</td>
                  <td className="px-3 py-4">{emp.nom}</td>
                  <td className="px-3 py-4">{emp.prenom}</td>
                  <td className="px-3 py-4">{emp.sexe}</td>
                  <td className="px-3 py-4">{emp.poste}</td>
                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => ouvrirModification(emp)}
                        aria-label={`Modifier ${emp.prenom} ${emp.nom}`}
                        className="rounded p-2 hover:bg-grey"
                      >
                        <FiEdit size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={() => supprimer(emp.id)}
                        aria-label={`Supprimer ${emp.prenom} ${emp.nom}`}
                        className="rounded border border-grey-300 bg-grey p-2 hover:bg-grey-300"
                      >
                        <FiTrash2 size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bouton principal */}
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={ouvrirAjout}
            className="w-full max-w-md rounded-lg bg-primary px-6 py-4 text-xl text-secondary hover:bg-primary-700"
          >
            Ajouter un employé
          </button>
        </div>
      </div>

      {/* Fenêtre (modal) : affichée seulement si modalOuvert est vrai */}
      {modalOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-modal"
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-8 shadow-xl"
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
              {idEnEdition === null ? "Nouvel Employé" : "Modifier l'employé"}
            </p>

            <form onSubmit={gererSoumission} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Champ label="Nom" name="nom" value={formulaire.nom} onChange={gererChangement} className="sm:col-span-2" />
              <Champ label="Prénom" name="prenom" value={formulaire.prenom} onChange={gererChangement} className="sm:col-span-2" />
              <Champ label="Email" name="email" type="email" value={formulaire.email} onChange={gererChangement} />
              <Champ label="Téléphone" name="telephone" type="tel" value={formulaire.telephone} onChange={gererChangement} />
              <Champ label="Poste" name="poste" value={formulaire.poste} onChange={gererChangement} />

              <label className="flex flex-col gap-1 text-sm font-medium">
                Sexe :
                <select
                  name="sexe"
                  value={formulaire.sexe}
                  onChange={gererChangement}
                  required
                  className="rounded bg-grey px-3 py-2 text-base font-normal outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choisir</option>
                  <option value="F">F</option>
                  <option value="M">M</option>
                </select>
              </label>

              <Champ label="Date d'embauche" name="dateEmbauche" type="date" value={formulaire.dateEmbauche} onChange={gererChangement} />

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
