import { useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

const EMPLOYES_INITIAUX = [
  { id: 1, nom: "NDJAO", prenom: "La Fortune", email: "", telephone: "", poste: "Cuisinière", sexe: "F", dateEmbauche: "" },
  { id: 2, nom: "FOSSAP", prenom: "Aurelie", email: "", telephone: "", poste: "Serveuse", sexe: "F", dateEmbauche: "" },
  { id: 3, nom: "SOUME", prenom: "Junior", email: "", telephone: "", poste: "Livreur", sexe: "M", dateEmbauche: "" },
  { id: 4, nom: "TAMIBE", prenom: "Damien", email: "", telephone: "", poste: "Cuisinier", sexe: "M", dateEmbauche: "" },
];
export default function Employes() {
    const [employes, setEmployes] = useState(EMPLOYES_INITIAUX);
    const [modalOuvert, setModalOuvert] = useState(false);

    function ouvrirAjout() {
        setModalOuvert(true);
    }

    function fermerModal() {
        setModalOuvert(false);
    }
    return(
        <section className= "bg-white px-6 py-10 text-secondary">
            <div className>
                <p className= "py-5 mb-6 text-center text-xl">Liste des employés</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-y border-grey-300 text-base">
                                <th className="px-3 py-3 font-medium">ID</th>
                                <th className="px-3 py-3 font-medium">Nom</th>
                                <th className="px-3 py-3 font-medium">Prénom</th>
                                <th className="px-3 py-3 font-medium">Sexe</th>
                                <th className="px-3 py-3 font-medium">Poste</th>
                                <th className="px-3 py-3"></th>
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
                                        <button type="button" aria-label={`Modifier ${emp.prenom} ${emp.nom}`} className="rounded p-2 hover:bg-grey">
                                            <FiEdit size={22} />
                                        </button>
                                        <button
                                        type="button" aria-label={`Supprimer ${emp.prenom} ${emp.nom}`}className="rounded border border-grey-300 bg-grey p-2 hover:bg-grey-300">
                                            <FiTrash2 size={22} />
                                        </button>
                                    </div>
                                    </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-14 flex justify-center">
                    <button
                        type="button"
                        onClick={ouvrirAjout}
                        className="w-full max-w-md rounded-lg bg-primary px-6 py-4 text-xl text-secondary hover:bg-primary-700">
                        Ajouter un employé
                    </button>
                </div>
            </div>
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
              Nouvel Employé
            </p>
          </div>
        </div>
      )} 
        </section>
    );
}