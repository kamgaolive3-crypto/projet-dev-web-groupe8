// ReclamationsG.jsx (gérant) : valide ou rejette les solutions proposées par les employés.
import { useState } from "react";
import { FaMagnifyingGlass, FaChevronDown } from "react-icons/fa6";
import Pagination from "../../composantEmp/Pagination";
import useRecherchePagination from "../../hooks/useRecherchePagination";
const cartes = [
    { titre: "En attente", statuts: ["En attente"] },
    { titre: "Réponses à valider", statuts: ["Réponse proposée"] },
    { titre: "Traitées", statuts: ["Validée", "Rejetée"] },
];
// Réclamations de test (à remplacer par le backend). « solution » vient de l'employé.
const reclamations = [
    { numero: "RCL-012", etudiant: "Jean Dupont", commande: "Poulet braisé", motif: "Plat froid à la livraison", statut: "En attente", solution: "" },
    { numero: "RCL-011", etudiant: "Aïssatou Diallo", commande: "Spaghetti sauté", motif: "Commande incomplète", statut: "Réponse proposée", solution: "Remboursement de la boisson manquante." },
    { numero: "RCL-010", etudiant: "Paul Ndongo", commande: "Poisson grillé", motif: "Retard de livraison", statut: "Validée", solution: "Réduction de 10 % sur la prochaine commande." },
    { numero: "RCL-009", etudiant: "Marie Eboa", commande: "Riz sauté", motif: "Erreur de montant", statut: "Rejetée", solution: "Aucun remboursement." },
];
const stylesStatut = {
    "En attente": "bg-emp-commande-rond  text-emp-valider",
    "Réponse proposée": "bg-emp-bleu-rond text-emp-bleu-emoji",
    "Validée": "bg-emp-vert-rond text-emp-vert-emoji",
    "Rejetée": "bg-emp-attente-rond text-emp-attente-emoji",
};
const PAR_PAGE = 6;
const colonnes = ["N°", "Étudiant", "Commande", "Motif", "Statut", "Actions"];
export default function ReclamationsG() {
    const [liste, setListe] = useState(reclamations);
    // Réclamation ouverte dans la fenêtre « Voir » (null = fenêtre fermée)
    const [choisie, setChoisie] = useState(null);
    const { recherche, changerRecherche, filtres, changerFiltre, page, setPage, nombrePages, elementsPage } =
        useRecherchePagination(liste, ["numero", "etudiant", "motif"], PAR_PAGE);

    // Compte les réclamations dont le statut est dans la liste donnée
    function compter(statuts) {
        return liste.filter((r) => statuts.includes(r.statut)).length;
    }
    // Le gérant tranche : nouveauStatut vaut "Validée" ou "Rejetée"
    function decider(numero, nouveauStatut) {
        setListe(liste.map((r) => (r.numero === numero ? { ...r, statut: nouveauStatut } : r)));
        setChoisie(null);
    }
        return (
        <div className="p-4 md:p-6">
            <h2 className="font-bold">Réclamations</h2>
            <p className="mb-6 text-sm text-secondary">Valider ou rejeter les réponses proposées par les employés</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {cartes.map((c) => (
                    <div key={c.titre} className="rounded-lg border border-grey-300 bg-white p-4">
                        <p className="text-xs text-secondary">{c.titre}</p>
                        <p className="mt-2 text-2xl font-bold">{compter(c.statuts)}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative min-w-0 flex-1">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                    <input
                        type="text"
                        value={recherche}
                        onChange={(e) => changerRecherche(e.target.value)}
                        placeholder="Rechercher une réclamation..."
                        className="w-full rounded-md border border-grey-300 bg-white py-3 pl-9 pr-3 text-sm outline-none"
                    />
                </div>
                <div className="relative md:w-44 md:shrink-0">
                    <select
                        value={filtres.statut || "Tous"}
                        onChange={(e) => changerFiltre("statut", e.target.value)}
                        className="w-full appearance-none rounded-md border border-grey-300 bg-white py-3 pl-4 pr-10 text-sm cursor-pointer"
                    >
                        <option value="Tous">Statut : Tous</option>
                        <option value="En attente">En attente</option>
                        <option value="Réponse proposée">Réponse proposée</option>
                        <option value="Validée">Validée</option>
                        <option value="Rejetée">Rejetée</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
            </div>
                        <div className="mt-6 overflow-x-auto rounded-xl border border-grey-300 bg-white">
                <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-grey">
                        <tr>{colonnes.map((c) => <th key={c} className="px-4 py-4 font-medium">{c}</th>)}</tr>
                    </thead>
                    <tbody>
                        {elementsPage.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-8 text-center">Aucune réclamation trouvée.</td></tr>
                        )}
                        {elementsPage.map((r) => (
                            <tr key={r.numero} className="border-t border-grey-300">
                                <td className="px-4 py-4">{r.numero}</td>
                                <td className="px-4 py-4">{r.etudiant}</td>
                                <td className="px-4 py-4">{r.commande}</td>
                                <td className="px-4 py-4">{r.motif}</td>
                                <td className="px-4 py-4">
                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${stylesStatut[r.statut]}`}>{r.statut}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => setChoisie(r)} className="rounded-md border border-grey-300 bg-white px-3 py-1.5 text-xs cursor-pointer hover:bg-grey">Voir</button>
                                        <button type="button" onClick={() => decider(r.numero, "Validée")} disabled={r.statut !== "Réponse proposée"} className="rounded-md bg-primary-700 px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40">Valider</button>
                                        <button type="button" onClick={() => decider(r.numero, "Rejetée")} disabled={r.statut !== "Réponse proposée"} className="rounded-md border border-grey-300 bg-white px-3 py-1.5 text-xs cursor-pointer hover:bg-grey disabled:cursor-not-allowed disabled:opacity-40">Rejeter</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination page={page} nombrePages={nombrePages} setPage={setPage} />
            </div>
                    {/* Fenêtre « Voir » : motif + solution proposée */}
            {choisie && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-5">
                        <h3 className="font-bold">{choisie.numero} · {choisie.etudiant}</h3>
                        <p className="mt-3 text-xs text-secondary">Motif</p>
                        <p className="text-sm">{choisie.motif}</p>
                        <p className="mt-3 text-xs text-secondary">Solution proposée par l'employé</p>
                        <p className="text-sm">{choisie.solution || "Aucune solution proposée pour le moment."}</p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button type="button" onClick={() => setChoisie(null)} className="rounded-md border border-grey-300 px-3 py-1.5 text-xs cursor-pointer">Fermer</button>
                            {choisie.statut === "Réponse proposée" && (
                                <>
                                    <button type="button" onClick={() => decider(choisie.numero, "Rejetée")} className="rounded-md border border-grey-300 px-3 py-1.5 text-xs cursor-pointer">Rejeter</button>
                                    <button type="button" onClick={() => decider(choisie.numero, "Validée")} className="rounded-md bg-primary-700 px-3 py-1.5 text-xs font-semibold cursor-pointer">Valider</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
    