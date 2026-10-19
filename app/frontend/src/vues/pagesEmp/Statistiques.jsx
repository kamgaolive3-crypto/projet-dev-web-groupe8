// Statistiques.jsx : page « Statistiques » de l'espace Employé (route /Statistiques).
// Filtres, 3 cartes, graphique en barres, donut, meilleur jour. Données provisoires (backend à venir).
import { useState } from "react";
import { FaChartColumn, FaCartShopping, FaGlobe, FaBagShopping, FaArrowUp, FaClipboardList, FaChevronDown, FaArrowRight, FaTrophy } from "react-icons/fa6";

// Cartes de résumé : valeurs écrites à la main (TODO : calculer avec le backend)
const cartes = [
    { titre: "Total commandes", valeur: "267", variation: "+12%", Icone: FaCartShopping },
    { titre: "Ventes (x1000)", valeur: "267 500", variation: "+12%", Icone: FaGlobe },
    { titre: "Panier moyen", valeur: "2150 FCFA", variation: "+8%", Icone: FaBagShopping },
];
// 7 jours de la semaine (valeurs estimées sur l'échelle 0 à MAX)
const jours = [
    { jour: "Lun", date: "12/10", commandes: 10, ventes: 18 },
    { jour: "Mar", date: "13/10", commandes: 10, ventes: 17 },
    { jour: "Mer", date: "14/10", commandes: 20, ventes: 24 },
    { jour: "Jeu", date: "15/10", commandes: 12, ventes: 22 },
    { jour: "Ven", date: "16/10", commandes: 20, ventes: 29 },
    { jour: "Sam", date: "17/10", commandes: 38, ventes: 42 },
    { jour: "Dim", date: "18/10", commandes: 24, ventes: 30 },
];

const categories = [
    { nom: "Plat principal", pourcent: 50, couleur:"var(--color-emp-donut-principal)" },
    { nom: "Dessert", pourcent: 15, couleur: "var(--color-emp-donut-dessert)" },
    { nom: "Boisson", pourcent: 20, couleur:"var(--color-emp-donut-boisson)" },
    { nom: "Accompagnements", pourcent: 10, couleur: "var( --color-emp-pab)" },
];
// Ordre d'affichage de la légende (différent de celui du disque)
const ordreLegende = ["Plat principal", "Accompagnements", "Dessert", "Boisson"];
// Graduations de l'axe (haut vers bas) et valeur max : servent à calculer les hauteurs en %
const graduations = [50, 40, 30, 20, 10, 0];
const MAX = 50;

export default function Statistiques() {
    // Donnée affichée dans le graphique : "tout", "ventes" ou "commandes"
    const [donnee, setDonnee] = useState("ventes");
    // Dégradé du donut : chaque part commence où la précédente finit
    const degrade = categories
        .map((c, i) => {
            const debut = categories.slice(0, i).reduce((somme, autre) => somme + autre.pourcent, 0);
            return `${c.couleur} ${debut}% ${debut + c.pourcent}%`;
        })
        .join(", ");
    // Jour qui a le plus de ventes
    const meilleurJour = jours.reduce((meilleur, j) => (j.ventes > meilleur.ventes ? j : meilleur));

    return (
        <div className="p-4 md:p-6">
            {/* En-tête */}
            <div className="flex items-start gap-4 mb-6">
                <FaChartColumn size={28} className="text-primary mt-1" />
                <div>
                    <h2 className="font-bold">Statistiques</h2>
                    <p className="text-sm text-secondary">Consultez les performances de la semaine.</p>
                </div>
            </div>

            {/* Filtres : période (TODO non branché) et donnée du graphique */}
            <div className="mb-6 flex flex-wrap gap-3 md:justify-end">
                <div className="relative md:w-64">
                    <FaClipboardList size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                    <select className="w-full appearance-none rounded-md bg-emp-barre-carre py-3 pl-9 pr-10 text-sm cursor-pointer">
                        <option>12 Oct. - 18 Oct. 2026</option>
                        <option>5 Oct. - 11 Oct. 2026</option>
                        <option>28 Sept. - 4 Oct. 2026</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
                </div>
                <div className="relative md:w-48">
                    <select value={donnee} onChange={(e) => setDonnee(e.target.value)} className="w-full appearance-none rounded-md bg-emp-barre-carre py-3 pl-4 pr-10 text-sm cursor-pointer">
                        <option value="tout">Toutes</option>
                        <option value="ventes">Ventes</option>
                        <option value="commandes">Commandes</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
                </div>
            </div>

            {/* 3 cartes de chiffres */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {cartes.map((carte) => (
                    <div key={carte.titre} className="flex items-center gap-4 rounded-lg border border-emp-trace-pab bg-emp-pab p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emp-or-disque">
                            <carte.Icone size={18} className="text-primary-700" />
                        </div>
                        <div>
                            <p className="text-xs text-secondary">{carte.titre}</p>
                            <p className="text-lg font-semibold text-secondary">{carte.valeur}</p>
                            <p className="flex items-center gap-1 text-xs font-semibold text-emp-vert-emoji">
                                <FaArrowUp size={10} />
                                {carte.variation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Graphique (2/3) + donut (1/3) côte à côte sur grand écran */}
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {/* Graphique en barres */}
                <div className="rounded-lg border border-grey-300 bg-emp-fond-carte p-3 lg:col-span-2">
                    <div className="flex justify-end gap-4 text-[11px]">
                        <span className="flex items-center gap-2"><span className="h-2.5 w-4 rounded-full bg-emp-beige-barre" /> commandes</span>
                        <span className="flex items-center gap-2"><span className="h-2.5 w-4 rounded-full bg-black" /> Ventes (x1000)</span>
                    </div>
                    <h3 className="text-xs font-bold">Évolution des ventes</h3>
                    <div className="overflow-x-auto">
                        <div className="min-w-[320px]">
                            {/* relative : repère pour les lignes ; ml-8 : place pour les nombres de l'axe */}
                            <div className="relative ml-8 mt-4 h-36">
                                {/* Une ligne par graduation, placée en % depuis le haut */}
                                {graduations.map((g) => (
                                    <div key={g} className="absolute left-0 right-0" style={{ top: `${((MAX - g) / MAX) * 100}%` }}>
                                        <span className="absolute -left-8 top-0 w-6 -translate-y-1/2 text-right text-[11px] font-semibold">{g}</span>
                                        <div className="border-t border-grey-300" />
                                    </div>
                                ))}
                                {/* Barres par-dessus les lignes : hauteur = valeur / MAX en % */}
                                <div className="absolute inset-0 grid grid-cols-7">
                                    {jours.map((j) => (
                                        <div key={j.jour} className="flex h-full items-end justify-center gap-1">
                                            {donnee !== "ventes" && <div className="w-3 bg-emp-beige-barre" style={{ height: `${(j.commandes / MAX) * 100}%` }} />}
                                            {donnee !== "commandes" && <div className="w-3 bg-black" style={{ height: `${(j.ventes / MAX) * 100}%` }} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Libellés : mêmes 7 colonnes que les barres */}
                            <div className="ml-8 mt-2 grid grid-cols-7 text-center text-[11px]">
                                {jours.map((j) => (
                                    <div key={j.jour}><p>{j.jour}</p><p>{j.date}</p></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donut */}
                <div className="flex flex-col rounded-lg border border-grey-300 bg-emp-fond-carte p-3">
                    <h3 className="text-xs font-bold">Répartition des ventes par catégorie</h3>
                    <div className="flex flex-1 items-center justify-center gap-6">
                        {/* Disque en conic-gradient ; le trou est un cercle de la couleur du fond */}
                        <div className="relative h-28 w-28 shrink-0 rounded-full" style={{ background: `conic-gradient(${degrade})` }}>
                            <div className="absolute inset-7 rounded-full bg-emp-fond-carte" />
                        </div>
                        {/* Légende dans l'ordre de ordreLegende */}
                        <ul className="flex flex-col gap-2 text-[11px]">
                            {ordreLegende.map((nom) => categories.find((c) => c.nom === nom)).map((c) => (
                                <li key={c.nom} className="flex items-center gap-2">
                                    <span className="h-3 w-3 shrink-0 rounded-full border border-grey-300" style={{ background: c.couleur }} />
                                    <span>{c.nom}</span>
                                    <span className="ml-auto pl-2">{c.pourcent}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Meilleur jour (calculé) ; « Voir le détail » : TODO non branché */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-emp-beige-barre p-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emp-or-icone">
                        <FaTrophy size={20} className="text-primary-700" />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold">Meilleur jour de la semaine</p>
                        <p>{meilleurJour.jour} ( {meilleurJour.date} )</p>
                        <p>Ventes : {meilleurJour.ventes * 1000} FCFA</p>
                    </div>
                </div>
                <button type="button" className="flex items-center gap-3 rounded-lg bg-black px-5 py-3 text-xs font-semibold text-white cursor-pointer hover:bg-emp-noir-survol">
                    Voir le détail
                    <FaArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}