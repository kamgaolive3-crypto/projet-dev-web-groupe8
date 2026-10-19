

import { FaCartShopping, FaStopwatch, FaKitchenSet, FaCircleCheck, FaMagnifyingGlass, FaRegCalendar, FaChevronDown } from "react-icons/fa6";
// useState : mémorise la liste des commandes (pour que les statuts puissent changer).
import { useState } from "react";
// Les deux flèches de bas de tableau (composant partagé par les 3 pages de tableau).
import Pagination from "../../composantEmp/Pagination";
// Hook partagé : gère la recherche, les filtres et la pagination (voir hooks/useRecherchePagination.js).
import useRecherchePagination from "../../hooks/useRecherchePagination";
const cartes = [
    {
        titre: "Total commandes",
        statut: null,
        detail: "En cours de traitement",
        Icone: FaCartShopping,
        fond: "bg-emp-commande-carre",     // fond de la carte
        fondIcone: "bg-emp-commande-rond", // petit carré derrière l'icône
        couleurIcone: "text-primary",      // couleur de l'icône
    },
    {
        titre: "En attente",
        statut: "En attente",
        detail: "À préparer",
        Icone: FaStopwatch,
        fond: "bg-emp-attente-carre",
        fondIcone: "bg-emp-attente-rond",
        couleurIcone: "text-emp-attente-emoji",
    },
    {
        titre: "En préparation",
        statut: "En préparation",
        detail: "En cuisine",
        Icone: FaKitchenSet,
        fond: "bg-emp-bleu-carre",
        fondIcone: "bg-emp-bleu-rond",
        couleurIcone: "text-emp-bleu-emoji",
    },
    {
        titre: "Prêtes",
        statut: "À valider", // commande terminée, en attente d'être servie
        detail: "À livrer / Servir",
        Icone: FaCircleCheck,
        fond: "bg-emp-vert-carre",
        fondIcone: "bg-emp-vert-rond",
        couleurIcone: "text-emp-vert-emoji",
    },
];

// Les titres de colonnes du tableau (écrits une seule fois, utilisés dans <thead>).
const colonnes = ["N° commande", "Étudiant", "Heure", "Type", "Plats", "Montant", "Statut", "Actions"];

// Commandes de test issues de la maquette. À remplacer par les données du backend.
// Chaque commande a un `statut` qui doit exister dans `etapes` et `stylesStatut` plus bas.
const commandes = [
    { numero: "CMD-00125", etudiant: "Reine Meni Dom", heure: "12:15", type: "Sur place", plat: "Poulet braisé", montant: 2500, statut: "En attente" },
    { numero: "CMD-011", etudiant: "Junior Tamibe", heure: "12:08", type: "Livraison", plat: "Spaghetti sauté", montant: 2000, statut: "En attente" },
    { numero: "CMD-00123", etudiant: "Olive Kamga", heure: "11:55", type: "Sur place", plat: "Poisson grillé", montant: 2500, statut: "En préparation" },
    { numero: "CMD-00122", etudiant: "Diana Fossap", heure: "11:48", type: "Livraison", plat: "L'okok salé", montant: 2000, statut: "À valider" },
    { numero: "CMD-00121", etudiant: "Emery Tagne", heure: "11:30", type: "Sur place", plat: "Riz sauté", montant: 1000, statut: "Servie" },
];

// Couleurs de la pastille de chaque statut (fond + texte).
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

export default function Commandes() {
    // ===== LOGIQUE =====

    // liste : les commandes affichées. setListe : fonction pour les modifier.
    // Au départ, liste contient les commandes de test écrites plus haut.
    const [liste, setListe] = useState(commandes);
    const {
        recherche, changerRecherche,
        filtres, changerFiltre,
        page, setPage, nombrePages,
        elementsPage: listeAffichee,
    } = useRecherchePagination(liste, ["numero", "etudiant", "plat"], PAR_PAGE);

    // Appelée au clic sur le bouton d'action d'une ligne :
    // passe la commande au statut suivant (voir `etapes`).
    function avancer(numero) {
        setListe(
            // On parcourt toutes les commandes...
            liste.map((commande) => {
                // ...on ne touche qu'à celle qui a le bon numéro
                // et qui a encore une étape suivante.
                if (commande.numero === numero && etapes[commande.statut].suivant) {
                    // On crée une copie avec le nouveau statut (on ne modifie jamais l'original).
                    return { ...commande, statut: etapes[commande.statut].suivant };
                }
                // Les autres restent identiques.
                return commande;
            })
        );
    }

    // Remet la liste dans son état de départ et revient à la première page.
    // Outil de TEST : à retirer avant la livraison.
    function reinitialiser() {
        setListe(commandes);
        setPage(0);
    }
    function compter(statut) {
        if (statut === null) {
            return liste.length;
        }
        return liste.filter((commande) => commande.statut === statut).length;
    }

    // ===== AFFICHAGE =====
    return (
        <div className="p-4 md:p-6">

            {/* BLOC 1 : en-tête (icône + titre + phrase) */}
            <div className="flex items-start gap-4 mb-6">
                <FaCartShopping size={28} className="text-primary mt-1" />
                <div>
                    <h2 className="font-bold">Commandes</h2>
                    <p className="text-sm text-secondary">
                        Consultez, préparez et validez les commandes des étudiants.
                    </p>
                </div>
            </div>

            {/* BLOC 2 : les 4 cartes de résumé.
                grid-cols-2 : 2 colonnes sur mobile. md:grid-cols-4 : 4 sur ordinateur. */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cartes.map((carte) => (
                    <div
                        key={carte.titre}
                        className={`flex items-center gap-3 rounded-lg p-4 ${carte.fond}`}
                    >
                        {/* Petit carré arrondi derrière l'icône */}
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${carte.fondIcone}`}>
                            <carte.Icone size={18} className={carte.couleurIcone} />
                        </div>
                        <div className="text-sm text-secondary">
                            <p>{carte.titre}</p>
                            {/* Nombre calculé à partir de la liste : il change quand un statut avance */}
                            <p>{compter(carte.statut)}</p>
                            <p className="text-xs">{carte.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* BLOC 3 : recherche + filtres.
                flex-col : empilés sur mobile. md:flex-row : côte à côte sur ordinateur. */}
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">

                {/* Champ de recherche : relative sert de repère pour placer la loupe.
                    La recherche porte sur le numéro, l'étudiant et le plat. */}
                <div className="relative flex-1 min-w-0">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                    <input
                        type="text"
                        value={recherche}
                        onChange={(e) => changerRecherche(e.target.value)}
                        placeholder="Recherche une commande..."
                        className="w-full rounded-md border border-primary bg-white py-3 pl-9 pr-3 text-sm outline-none"
                    />
                </div>

                {/* Filtre Type.
                    Les `value` des options doivent être IDENTIQUES aux données
                    (accents compris), sinon le filtre ne trouve rien.
                    changerFiltre("type", ...) : "type" est le nom du champ dans `commandes`. */}
                <div className="relative md:w-56 md:shrink-0">
                    <select
                        value={filtres.type || "Tous"}
                        onChange={(e) => changerFiltre("type", e.target.value)}
                        className="w-full appearance-none rounded-md bg-emp-type py-3 pl-4 pr-10 text-sm cursor-pointer"
                    >
                        <option value="Tous">Type : Tous</option>
                        <option value="Sur place">Sur place</option>
                        <option value="Livraison">Livraison</option>
                    </select>
                    {/* appearance-none retire la flèche du navigateur : on pose la nôtre par-dessus */}
                    <FaChevronDown
                        size={12}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
                    />
                </div>

                {/* Filtre Statut : mêmes règles que le filtre Type. */}
                <div className="relative md:w-56 md:shrink-0">
                    <select
                        value={filtres.statut || "Tous"}
                        onChange={(e) => changerFiltre("statut", e.target.value)}
                        className="w-full appearance-none rounded-md bg-emp-type py-3 pl-4 pr-10 text-sm cursor-pointer"
                    >
                        <option value="Tous">Statut : Tous</option>
                        <option value="En attente">En attente</option>
                        <option value="En préparation">En préparation</option>
                        <option value="À valider">À valider</option>
                        <option value="Servie">Servie</option>
                    </select>
                    <FaChevronDown
                        size={12}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
                    />
                </div>

                {/* Filtre Date : NON BRANCHÉ (les commandes n'ont pas de date, seulement une heure).
                    À brancher quand le backend enverra de vraies dates. */}
                <div className="relative md:w-56 md:shrink-0">
                    <FaRegCalendar
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                    />
                    <select className="w-full appearance-none rounded-md bg-emp-type py-3 pl-9 pr-4 text-sm cursor-pointer">
                        <option>Aujourd'hui</option>
                        <option>Cette semaine</option>
                        <option>Ce mois</option>
                    </select>
                    <FaChevronDown
                        size={12}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
                    />
                </div>
            </div>

            {/* Bouton de TEST : remet les statuts de départ. À supprimer avant la livraison. */}
            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={reinitialiser}
                    className="rounded-md border border-emp-valider bg-emp-carre px-4 py-2 text-xs font-semibold text-emp-valider cursor-pointer hover:bg-emp-commande-rond"
                >
                    Réinitialiser
                </button>
            </div>

            {/* BLOC 4 : le tableau.
                overflow-x-auto : sur mobile, le tableau défile horizontalement dans son cadre. */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-grey-300 bg-emp-carre">

                {/* min-w-[800px] : le tableau garde au moins 800 px de large pour que les 8 colonnes restent lisibles */}
                <table className="w-full min-w-[800px] text-left text-sm">

                    {/* En-tête : une cellule par titre de la liste `colonnes` */}
                    <thead className="bg-emp-barre-carre">
                        <tr>
                            {colonnes.map((colonne) => (
                                <th key={colonne} className="px-4 py-4 font-medium">
                                    {colonne}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Corps : une ligne par commande de la page courante */}
                    <tbody>
                        {/* Message affiché quand la recherche / les filtres ne donnent aucun résultat.
                            colSpan={8} : la cellule s'étend sur les 8 colonnes. */}
                        {listeAffichee.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center">
                                    Aucune commande trouvée.
                                </td>
                            </tr>
                        )}

                        {listeAffichee.map((commande) => (
                            <tr key={commande.numero} className="border-t border-emp-type">
                                <td className="px-4 py-5">{commande.numero}</td>
                                <td className="px-4 py-5">{commande.etudiant}</td>
                                <td className="px-4 py-5">{commande.heure}</td>
                                <td className="px-4 py-5">{commande.type}</td>
                                <td className="px-4 py-5">{commande.plat}</td>
                                <td className="px-4 py-5">{commande.montant}</td>

                                {/* Cellule du statut : pastille colorée selon `stylesStatut` */}
                                <td className="px-4 py-5">
                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${stylesStatut[commande.statut]}`}>
                                        {commande.statut}
                                    </span>
                                </td>

                                {/* Cellule des actions : Voir + bouton d'avancement */}
                                <td className="px-4 py-5">
                                    <div className="flex items-center gap-8">
                                        {/* TODO : « Voir » doit ouvrir le détail de la commande
                                            (plats, quantités, prix, étudiant). Aucune action pour l'instant. */}
                                        <button
                                            type="button"
                                            className="rounded-md border border-emp-valider bg-emp-carre px-4 py-1.5 text-xs font-semibold text-emp-valider cursor-pointer hover:bg-emp-commande-rond"
                                        >
                                            Voir
                                        </button>

                                        {/* Bouton d'action : Préparer / Terminer / Valider.
                                            Son texte vient de `etapes`. Désactivé (pâle) quand la commande
                                            est « Servie », car il n'y a plus d'étape suivante. */}
                                        <button
                                            type="button"
                                            onClick={() => avancer(commande.numero)}
                                            disabled={!etapes[commande.statut].suivant}
                                            className="w-36 rounded-md bg-emp-valider px-4 py-2 text-xs font-semibold text-secondary cursor-pointer hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary"
                                        >
                                            {etapes[commande.statut].bouton}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Flèches de bas de tableau (page précédente / suivante) */}
                <Pagination page={page} nombrePages={nombrePages} setPage={setPage} />
            </div>
        </div>
    );
}