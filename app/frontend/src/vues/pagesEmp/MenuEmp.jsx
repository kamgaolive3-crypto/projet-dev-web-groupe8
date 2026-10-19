/// MenuEmp.jsx : page « Gestion du menu » de l'espace Employé (route /MenuEmp).
// Onglets de catégories, recherche, tableau paginé, interrupteur de disponibilité.
// Données provisoires (à remplacer par le backend). « Voir » et « Ajouter » non branchés.
import { useState } from "react";
import { FaUtensils, FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import eru from "../../assets/plats/eru.png";
import okok from "../../assets/plats/okok.png";
import taro from "../../assets/plats/taro.png";
import ndole from "../../assets/plats/ndole.png";
import jus from "../../assets/plats/jus.png";
import frites from "../../assets/plats/frites.png";
import Pagination from "../../composantEmp/Pagination";
import useRecherchePagination from "../../hooks/useRecherchePagination";

const onglets = ["Tous", "Plats principaux", "Accompagnements", "Boissons"];
// Onglet (pluriel) -> catégorie écrite dans les plats (singulier)
const categorieParOnglet = {
    "Plats principaux": "Plat principal",
    "Accompagnements": "Accompagnement",
    "Boissons": "Boisson",
};
const colonnes = ["Image", "Nom du plat", "Catégorie", "Prix", "Disponibilité", "Action"];

// Plats de test : à remplacer par le backend
const plats = [
    { id: 1, nom: "Eru and Water", categorie: "Plat principal", prix: 2500, disponible: true, image: eru },
    { id: 2, nom: "Taro", categorie: "Plat principal", prix: 2500, disponible: false, image: taro },
    { id: 3, nom: "Frites", categorie: "Accompagnement", prix: 2500, disponible: true, image: frites },
    { id: 4, nom: "Ndolè", categorie: "Plat principal", prix: 2500, disponible: true, image: ndole },
    { id: 5, nom: "L'okok salé", categorie: "Plat principal", prix: 2500, disponible: true, image: okok },
    { id: 6, nom: "Jus naturel", categorie: "Boisson", prix: 1000, disponible: false, image: jus },
];
const PAR_PAGE = 6;

export default function MenuEmp() {
    const [ongletActif, setOngletActif] = useState("Tous");
    const [liste, setListe] = useState(plats);

    // Hook partagé : recherche (sur "nom"), filtres et pagination.
    // Les onglets passent par changerFiltre("categorie", ...).
    const {
        recherche, changerRecherche,
        changerFiltre,
        page, setPage, nombrePages,
        elementsPage: platsPage,
    } = useRecherchePagination(liste, ["nom"], PAR_PAGE);

    // Inverse la disponibilité du plat cliqué
    function basculer(id) {
        setListe(
            liste.map((plat) =>
                plat.id === id ? { ...plat, disponible: !plat.disponible } : plat
            )
        );
    }

    return (
        <div className="p-4 md:p-6">

            {/* En-tête */}
            <div className="flex items-start gap-4 mb-6">
                <FaUtensils size={28} className="text-primary mt-1" />
                <div>
                    <h2 className="font-bold">Gestion du menu</h2>
                    <p className="text-sm text-secondary">
                        Modifier temporairement la disponibilité des plats et mettez à jour le menu.
                    </p>
                </div>
            </div>

            {/* Onglets : filtrent le tableau par catégorie */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {onglets.map((onglet) => (
                    <button
                        key={onglet}
                        type="button"
                        onClick={() => {
                            setOngletActif(onglet);
                            // "Tous" n'est pas une catégorie : il retire le filtre
                            changerFiltre("categorie", categorieParOnglet[onglet] || "Tous");
                        }}
                        className={`rounded-lg border py-3 text-sm font-semibold cursor-pointer ${
                            onglet === ongletActif
                                ? "border-primary-700 bg-primary-700 text-secondary"
                                : "border-emp-trace-pab bg-emp-pab text-secondary hover:bg-emp-pab"
                        }`}
                    >
                        {onglet}
                    </button>
                ))}
            </div>

            {/* Recherche + bouton Ajouter (TODO : bouton non branché) */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1 min-w-0">
                    <FaMagnifyingGlass
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                        size={14}
                    />
                    <input
                        type="text"
                        value={recherche}
                        onChange={(e) => changerRecherche(e.target.value)}
                        placeholder="Recherche un plat..."
                        className="w-full rounded-md border border-primary bg-white py-3 pl-9 pr-3 text-sm outline-none"
                    />
                </div>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-md bg-primary-700 px-12 py-3 text-sm font-semibold text-secondary cursor-pointer hover:bg-primary-800 md:w-56 md:shrink-0"
                >
                    <FaPlus size={12} />
                    Ajouter un plat
                </button>
            </div>

            {/* Tableau des plats (défile horizontalement sur mobile) */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-grey-300 bg-emp-carre">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-emp-barre-carre">
                        <tr>
                            {colonnes.map((colonne) => (
                                <th key={colonne} className="px-4 py-4 font-medium">
                                    {colonne}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Message si aucun résultat */}
                        {platsPage.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center">
                                    Aucun plat trouvé.
                                </td>
                            </tr>
                        )}

                        {platsPage.map((plat) => (
                            <tr key={plat.id} className="border-t border-emp-type">
                                <td className="px-4 py-3">
                                    <img
                                        src={plat.image}
                                        alt={plat.nom}
                                        className="h-12 w-16 rounded-lg object-cover"
                                    />
                                </td>
                                <td className="px-4 py-3">{plat.nom}</td>
                                <td className="px-4 py-3">{plat.categorie}</td>
                                <td className="px-4 py-3">{plat.prix}</td>

                                {/* Interrupteur : vert à droite si disponible, gris à gauche sinon */}
                                <td className="px-4 py-3">
                                    <div className="flex flex-col items-start gap-1">
                                        <button
                                            type="button"
                                            onClick={() => basculer(plat.id)}
                                            aria-label="Changer la disponibilité"
                                            className={`relative h-6 w-11 rounded-full cursor-pointer transition-colors ${
                                                plat.disponible ? "bg-emp-vert-emoji" : "bg-grey-300"
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                                                    plat.disponible ? "left-5" : "left-0.5"
                                                }`}
                                            />
                                        </button>
                                        <span className="text-xs">
                                            {plat.disponible ? "Disponible" : "Indisponible"}
                                        </span>
                                    </div>
                                </td>

                                {/* TODO : « Voir » non branché */}
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        className="w-full max-w-40 rounded-md border border-emp-valider bg-emp-carre py-2 text-xs font-semibold text-emp-valider cursor-pointer hover:bg-emp-commande-rond"
                                    >
                                        Voir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination page={page} nombrePages={nombrePages} setPage={setPage} />
            </div>
        </div>
    );
}