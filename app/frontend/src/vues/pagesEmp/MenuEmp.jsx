// useState : mémorise l'onglet choisi.
import { useState } from "react";
// FaUtensils : icône de couverts. FaPlus : le « + » du bouton.
import { FaUtensils, FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import eru from "../../assets/plats/eru.png";
import okok from "../../assets/plats/okok.png";
import taro from "../../assets/plats/taro.png";
import ndole from "../../assets/plats/ndole.png";
import jus from "../../assets/plats/jus.png";
import frites from "../../assets/plats/frites.png";
import Pagination from "../../composantEmp/Pagination";
import useRecherchePagination from "../../hooks/useRecherchePagination";

// Les 4 onglets, écrits une seule fois.
const onglets = ["Tous", "Plats principaux", "Accompagnements", "Boissons"];
// Relie le nom d'un onglet à la catégorie écrite dans les plats.
const categorieParOnglet = {
    "Plats principaux": "Plat principal",
    "Accompagnements": "Accompagnement",
    "Boissons": "Boisson",
};
// Les colonnes du tableau.
const colonnes = ["Image", "Nom du plat", "Catégorie", "Prix", "Disponibilité", "Action"];
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
    // ongletActif : l'onglet sélectionné. Au départ : "Tous".
    const [ongletActif, setOngletActif] = useState("Tous");
    // liste : les plats affichés. setListe : pour les modifier.
    // page : numéro de la page affichée (0 = première).

const [liste, setListe] = useState(plats);
const {
    recherche, changerRecherche,
    changerFiltre,
    page, setPage, nombrePages,
    elementsPage: platsPage,
} = useRecherchePagination(liste, ["nom"], PAR_PAGE);

// Inverse la disponibilité du plat cliqué.
function basculer(id) {
    setListe(
        liste.map((plat) =>
            // Pour le bon plat, on copie tout et on inverse "disponible".
            plat.id === id ? { ...plat, disponible: !plat.disponible } : plat
        )
    );
}

    
    return (
        <div className="p-4 md:p-6">

            {/* BLOC 1 : en-tête */}
            <div className="flex items-start gap-4 mb-6">
                <FaUtensils size={28} className="text-primary mt-1" />
                <div>
                    <h2 className="font-bold">Gestion du menu</h2>
                    <p className="text-sm text-secondary">
                        Modifier temporairement la disponibilité des plats et mettez à jour le menu.
                    </p>
                </div>
            </div>

            {/* BLOC 2 : les onglets.
                grid-cols-2 : 2 par ligne sur mobile. md:grid-cols-4 : 4 sur ordinateur. */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {onglets.map((onglet) => (
                    <button
    key={onglet}
    type="button"
    onClick={() => {
        setOngletActif(onglet);
        // "Tous" n'est pas une catégorie : on envoie "Tous" pour retirer le filtre.
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
            {/* BLOC 3 : recherche + bouton Ajouter.
    flex-col : empilés sur mobile. md:flex-row : côte à côte sur ordinateur. */}
<div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">

    {/* Champ de recherche : relative sert de repère pour placer la loupe */}
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

    {/* Bouton Ajouter un plat : doré, avec le « + » devant */}
    <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-md bg-primary-700 px-12 py-3 text-sm font-semibold text-secondary cursor-pointer hover:bg-primary-800  md:w-56 md:shrink-0"
    >
        <FaPlus size={12} />
        Ajouter un plat
    </button>
</div>
{/* BLOC 4 : le tableau des plats */}
<div className="mt-6 overflow-x-auto rounded-xl border border-grey-300 bg-emp-carre">
    <table className="w-full min-w-[700px] text-left text-sm">

        {/* En-tête */}
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
            {platsPage.length === 0 && (
    <tr>
        <td colSpan={6} className="px-4 py-8 text-center">
            Aucun plat trouvé.
        </td>
    </tr>
)}
            {platsPage.map((plat) => (
                <tr key={plat.id} className="border-t border-emp-type">

                    {/* Image : carré provisoire */}
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

                    {/* Disponibilité : interrupteur + texte dessous */}
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
                                {/* Le rond blanc : à droite si disponible, à gauche sinon */}
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

                    {/* Action : bouton Voir */}
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
    )
}