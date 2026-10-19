// Reclamations.jsx : page « Réclamations » de l'espace Employé (route /Reclamations).
// Cartes, recherche/filtres, tableau paginé. Données provisoires (backend à venir).
import { useState } from "react";
import { FaCommentDots, FaCertificate, FaComment, FaRotate, FaCircleCheck, FaChevronDown, FaMagnifyingGlass } from "react-icons/fa6";
import Pagination from "../../composantEmp/Pagination";
import useRecherchePagination from "../../hooks/useRecherchePagination";

// Cartes de résumé ; statut = statut à compter (null = toutes)
const cartes = [
    { titre: "Total", statut: null, Icone: FaCertificate, fond: "bg-emp-commande-carre", fondIcone: "bg-emp-commande-rond", couleurIcone: "text-primary", couleurTitre: "text-primary" },
    { titre: "Ouvertes", statut: "Ouverte", Icone: FaComment, fond: "bg-emp-attente-carre", fondIcone: "bg-emp-attente-rond", couleurIcone: "text-emp-attente-emoji", couleurTitre: "text-emp-attente-emoji" },
    { titre: "En cours", statut: "En cours", Icone: FaRotate, fond: "bg-emp-bleu-carre", fondIcone: "bg-emp-bleu-rond", couleurIcone: "text-emp-bleu-emoji", couleurTitre: "text-emp-bleu-emoji" },
    { titre: "Résolues", statut: "Résolue", Icone: FaCircleCheck, fond: "bg-emp-vert-carre", fondIcone: "bg-emp-vert-rond", couleurIcone: "text-emp-vert-emoji", couleurTitre: "text-emp-vert-emoji" },
];

// Réclamations de test (à remplacer par le backend)
const reclamations = [
    { numero: "RCL-012", sujet: "Plat froid", etudiant: "Reine Meni Dom", date: "07/10 12:20", statut: "En cours" },
    { numero: "RCL-011", sujet: "Qualité du plat", etudiant: "Junior Tamibe", date: "07/10 11:45", statut: "Ouverte" },
    { numero: "RCL-010", sujet: "Mauvaise commande", etudiant: "Olive Kamga", date: "06/10 18:30", statut: "En cours" },
    { numero: "RCL-009", sujet: "Retard de livraison", etudiant: "Soume Nga", date: "06/10 14:12", statut: "Résolue" },
    { numero: "RCL-008", sujet: "Problème de paiement", etudiant: "Emery Tagne", date: "06/10 10:05", statut: "Résolue" },
];
const colonnes = ["N°", "Sujet", "Étudiant", "Date", "Statut", "Actions"];

// Couleurs de la pastille de chaque statut
const stylesStatut = {
    "Ouverte": "bg-emp-attente-rond text-emp-attente-emoji",
    "En cours": "bg-emp-bleu-rond text-emp-bleu-emoji",
    "Résolue": "bg-emp-vert-rond text-emp-vert-emoji",
};
// Parcours : texte du bouton + statut suivant (null = fin)
const etapes = {
    "Ouverte": { bouton: "Traiter", suivant: "En cours" },
    "En cours": { bouton: "Traiter", suivant: "Résolue" },
    "Résolue": { bouton: "Voir", suivant: null },
};
const PAR_PAGE = 6;

export default function Reclamations() {
    const [liste, setListe] = useState(reclamations);
    // Hook partagé : recherche, filtres (clé = champ des données), pagination
    const { recherche, changerRecherche, filtres, changerFiltre, page, setPage, nombrePages, elementsPage: listeAffichee } =
        useRecherchePagination(liste, ["numero", "sujet", "etudiant"], PAR_PAGE);

    // Compte sur la liste complète (null = tout)
    function compter(statut) {
        if (statut === null) return liste.length;
        return liste.filter((r) => r.statut === statut).length;
    }
    // Clic sur « Traiter » : passe au statut suivant
    function avancer(numero) {
        setListe(liste.map((r) =>
            r.numero === numero && etapes[r.statut].suivant ? { ...r, statut: etapes[r.statut].suivant } : r
        ));
    }
    return (
        <div className="p-4 md:p-6">
            {/* En-tête */}
            <div className="flex items-start gap-4 mb-6">
                <FaCommentDots size={28} className="text-primary mt-1" />
                <div>
                    <h2 className="font-bold">Réclamations</h2>
                    <p className="text-sm text-secondary">Consultez et traitez les réclamations des étudiants.</p>
                </div>
            </div>

            {/* Cartes (nombres calculés) */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {cartes.map((carte) => (
                    <div key={carte.titre} className={`flex items-center gap-3 rounded-lg p-4 ${carte.fond}`}>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${carte.fondIcone}`}>
                            <carte.Icone size={18} className={carte.couleurIcone} />
                        </div>
                        <div className="text-sm">
                            <p className={carte.couleurTitre}>{carte.titre}</p>
                            <p className="mt-2 text-secondary">{compter(carte.statut)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recherche + filtres */}
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1 min-w-0">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                    <input
                        type="text"
                        value={recherche}
                        onChange={(e) => changerRecherche(e.target.value)}
                        placeholder="Recherche une réclamation..."
                        className="w-full rounded-md border border-primary bg-white py-3 pl-9 pr-3 text-sm outline-none"
                    />
                </div>

                {/* Filtre Statut : les value doivent être identiques aux données (accents compris) */}
                <div className="relative md:w-56 md:shrink-0">
                    <select
                        value={filtres.statut || "Tous"}
                        onChange={(e) => changerFiltre("statut", e.target.value)}
                        className="w-full appearance-none rounded-md bg-emp-type py-3 pl-4 pr-10 text-sm cursor-pointer"
                    >
                        <option value="Tous">Statut : Tous</option>
                        <option value="Ouverte">Ouverte</option>
                        <option value="En cours">En cours</option>
                        <option value="Résolue">Résolue</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
                </div>

                {/* Filtre Date : NON BRANCHÉ */}
                <div className="relative md:w-56 md:shrink-0">
                    <select className="w-full appearance-none rounded-md bg-emp-type px-3 py-3 pr-10 text-sm cursor-pointer md:w-56 md:shrink-0">
                        <option>Date : Toutes</option>
                        <option>Aujourd'hui</option>
                        <option>Cette semaine</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
                </div>
            </div>
            {/* Tableau (défile horizontalement sur mobile) */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-grey-300 bg-emp-carre">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-emp-barre-carre">
                        <tr>
                            {colonnes.map((colonne) => (
                                <th key={colonne} className="px-4 py-4 font-medium">{colonne}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Message si aucun résultat */}
                        {listeAffichee.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-8 text-center">Aucune réclamation trouvée.</td></tr>
                        )}
                        {listeAffichee.map((r) => (
                            <tr key={r.numero} className="border-t border-emp-type">
                                <td className="px-4 py-5">{r.numero}</td>
                                <td className="px-4 py-5">{r.sujet}</td>
                                <td className="px-4 py-5">{r.etudiant}</td>
                                <td className="px-4 py-5">{r.date}</td>
                                {/* Pastille de statut */}
                                <td className="px-4 py-5">
                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${stylesStatut[r.statut]}`}>
                                        {r.statut}
                                    </span>
                                </td>
                                {/* Traiter (plein) ou Voir (contour) ; « Voir » : TODO non branché */}
                                <td className="px-4 py-5">
                                    <button
                                        type="button"
                                        onClick={() => avancer(r.numero)}
                                        className={`w-32 rounded-md py-2 text-xs font-semibold cursor-pointer ${
                                            etapes[r.statut].suivant
                                                ? "bg-primary-700 text-secondary hover:bg-primary-800"
                                                : "border border-emp-valider bg-emp-carre px-4 py-1.5 text-xs font-semibold text-emp-valider cursor-pointer hover:bg-emp-commande-rond"
                                        }`}
                                    >
                                        {etapes[r.statut].bouton}
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