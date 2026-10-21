// Commandes.jsx (gérant) : supervision des commandes. Statuts comme l'espace employé.
import { useState } from "react";
import { FaMagnifyingGlass, FaChevronDown, FaRegCalendar } from "react-icons/fa6";
import Pagination from "../../composantEmp/Pagination";
import useRecherchePagination from "../../hooks/useRecherchePagination";
// Cartes : statut = statut à compter (null = toutes)
const cartes = [
    { titre: "En attente", statut: "En attente", detail: "À préparer" },
    { titre: "En préparation", statut: "En préparation", detail: "En cuisine" },
    { titre: "Prêtes", statut: "À valider", detail: "À livrer / servir" },
    { titre: "Commandes du jour", statut: null, detail: "Total cumulé" },
];
const colonnes = ["Heure", "Type", "Plat(s)", "Montant (FCFA)", "Statut", "Actions"];
// Commandes de test (à remplacer par le backend)
const commandes = [
    { id: 1, heure: "12:15", type: "Sur place", plat: "Poulet braisé", montant: 2500, statut: "En attente" },
    { id: 2, heure: "12:08", type: "Livraison", plat: "Spaghetti sauté", montant: 2500, statut: "En attente" },
    { id: 3, heure: "11:55", type: "Sur place", plat: "Poisson grillé", montant: 2500, statut: "En préparation" },
    { id: 4, heure: "11:40", type: "Livraison", plat: "L'eau salé", montant: 2500, statut: "À valider" },
    { id: 5, heure: "11:20", type: "Sur place", plat: "Riz sauté", montant: 1000, statut: "Servie" },
];
const stylesStatut = {
    "En attente": "bg-emp-attente-rond text-emp-attente-emoji",
    "En préparation": "bg-emp-bleu-rond text-emp-bleu-emoji",
    "À valider": "bg-emp-commande-rond text-emp-valider",
    "Servie": "bg-emp-vert-rond text-emp-vert-emoji",
};
const etapes = {
    "En attente": { bouton: "Préparer", suivant: "En préparation" },
    "En préparation": { bouton: "Terminer", suivant: "À valider" },
    "À valider": { bouton: "Valider", suivant: "Servie" },
    "Servie": { bouton: "Valider", suivant: null },
};

// Nombre de commandes affichées par page.
const PAR_PAGE = 6;

export default function CommandesG(){
    
    const [liste, setListe] = useState(commandes);
    const { recherche, changerRecherche, filtres, changerFiltre, page, setPage, nombrePages, elementsPage } =
        useRecherchePagination(liste, ["plat", "heure"], PAR_PAGE);

    // Compte sur la liste complète (null = tout)
    function compter(statut) {
        if (statut === null) return liste.length;
        return liste.filter((c) => c.statut === statut).length;
    }
    // Clic sur le bouton d'action : passe au statut suivant
    function avancer(id) {
        setListe(liste.map((c) =>
            c.id === id && etapes[c.statut].suivant ? { ...c, statut: etapes[c.statut].suivant } : c
        ));
    }
    return(
        <div className="p-4 md:p-6">
            <h2 className="font-bold">Supervision des commandes</h2>
            <p className="mb-6 text-sm text-secondary">Suivi en temps réel des commandes des étudiants</p>

            {/* 4 cartes : 2 colonnes sur mobile, 4 sur ordinateur */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {cartes.map((carte) => (
                    <div key={carte.titre} className="rounded-lg border border-grey-300 bg-white p-4">
                        <p className="text-xs text-secondary">{carte.titre}</p>
                        <p className="my-1 text-2xl font-bold">{compter(carte.statut)}</p>
                        <p className="text-xs text-secondary">{carte.detail}</p>
                    </div>
                ))}
            </div>
                        {/* Recherche + filtres */}
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative min-w-0 flex-1">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                    <input
                        type="text"
                        value={recherche}
                        onChange={(e) => changerRecherche(e.target.value)}
                        placeholder="Rechercher une commande..."
                        className="w-full rounded-md border border-grey-300 bg-white py-3 pl-9 pr-3 text-sm outline-none"
                    />
                </div>
                <div className="relative md:w-44 md:shrink-0">
                    <select
                        value={filtres.type || "Tous"}
                        onChange={(e) => changerFiltre("type", e.target.value)}
                        className="w-full appearance-none rounded-md border border-grey-300 bg-white py-3 pl-4 pr-10 text-sm cursor-pointer"
                    >
                        <option value="Tous">Type : Tous</option>
                        <option value="Sur place">Sur place</option>
                        <option value="Livraison">Livraison</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <div className="relative md:w-44 md:shrink-0">
                    <select
                        value={filtres.statut || "Tous"}
                        onChange={(e) => changerFiltre("statut", e.target.value)}
                        className="w-full appearance-none rounded-md border border-grey-300 bg-white py-3 pl-4 pr-10 text-sm cursor-pointer"
                    >
                        <option value="Tous">Statut : Tous</option>
                        <option value="En attente">En attente</option>
                        <option value="En préparation">En préparation</option>
                        <option value="À valider">À valider</option>
                        <option value="Servie">Servie</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                {/* Filtre Date : NON BRANCHÉ (les commandes n'ont pas encore de date) */}
<div className="relative md:w-44 md:shrink-0">
    <FaRegCalendar size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
    <select className="w-full appearance-none rounded-md border border-grey-300 bg-white py-3 pl-9 pr-10 text-sm cursor-pointer">
        <option>Aujourd'hui</option>
        <option>Cette semaine</option>
        <option>Ce mois</option>
    </select>
    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
</div>
            </div>
                        {/* Tableau */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-grey-300 bg-white">
                <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-grey">
                        <tr>
                            {colonnes.map((c) => (
                                <th key={c} className="px-4 py-4 font-medium">{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {elementsPage.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-8 text-center">Aucune commande trouvée.</td></tr>
                        )}
                        {elementsPage.map((c) => (
                            <tr key={c.id} className="border-t border-grey-300">
                                <td className="px-4 py-4">{c.heure}</td>
                                <td className="px-4 py-4">{c.type}</td>
                                <td className="px-4 py-4">{c.plat}</td>
                                <td className="px-4 py-4">{c.montant}</td>
                                <td className="px-4 py-4">
                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${stylesStatut[c.statut]}`}>
                                        {c.statut}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => avancer(c.id)}
                                            disabled={!etapes[c.statut].suivant}
                                            className="w-24 rounded-md bg-primary-700 px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-primary-800 disabled:opacity-40"
                                        >
                                            {etapes[c.statut].bouton}
                                        </button>
                                    </div>
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
    
