import { FaChartColumn, FaCartShopping, FaGlobe, FaBagShopping, FaArrowUp, FaClipboardList, FaChevronDown, FaArrowRight, FaTrophy } from "react-icons/fa6";
const cartes = [
    { titre: "Total commandes", valeur: "267", variation: "+12%", Icone: FaCartShopping },
    { titre: "Ventes (x1000)", valeur: "267 500", variation: "+12%", Icone: FaGlobe },
    { titre: "Panier moyen", valeur: "2150 FCFA", variation: "+8%", Icone: FaBagShopping },
];
// Les 7 jours de ton design. commandes (beige) et ventes (noir), sur une échelle de 0 à 50.
const jours = [
    { jour: "Lun", date: "12/10", commandes: 10, ventes: 18 },
    { jour: "Mar", date: "13/10", commandes: 10, ventes: 17 },
    { jour: "Mer", date: "14/10", commandes: 20, ventes: 24 },
    { jour: "Jeu", date: "15/10", commandes: 12, ventes: 22 },
    { jour: "Ven", date: "16/10", commandes: 20, ventes: 29 },
    { jour: "Sam", date: "17/10", commandes: 38, ventes: 42 },
    { jour: "Dim", date: "18/10", commandes: 24, ventes: 30 },

];
// Les 4 parts du donut. Le total des pourcentages doit faire 100.
// Les noms de ta maquette sont tous « Plat principal » (copier-coller) : j'ai mis des noms logiques.
// Ordre = ordre des parts dans le disque (sens des aiguilles d'une montre, depuis le haut).
const categories = [
    { nom: "Plat principal", pourcent: 50, couleur: "#D1BF82" },
    { nom: "Dessert", pourcent: 15, couleur: "#121212" },
    { nom: "Boisson", pourcent: 20, couleur: "#D0BC96" },
    { nom: "Accompagnements", pourcent: 10, couleur: "#F2F2F2" },
];

// Ordre d'affichage de la légende, tel que dans ta maquette.
const ordreLegende = ["Plat principal", "Accompagnements", "Dessert", "Boisson"];

// Les graduations de l'axe, du haut vers le bas.
const graduations = [50, 40, 30, 20, 10, 0];

// Valeur maximale de l'axe : sert à calculer les hauteurs en pourcentage.
const MAX = 50;
export default function Statistiques() {
    // Fabrique le dégradé circulaire : « noir 0% 55%, beige 55% 75%, ... ».
// Pour chaque part, on additionne les pourcentages des parts PRÉCÉDENTES.
const degrade = categories
    .map((c, i) => {
        // slice(0, i) = toutes les catégories avant celle-ci
        // reduce additionne leurs pourcentages : c'est le début de cette part.
        const debut = categories
            .slice(0, i)
            .reduce((somme, autre) => somme + autre.pourcent, 0);
        const fin = debut + c.pourcent;
        return `${c.couleur} ${debut}% ${fin}%`;
    })
    .join(", ");
        return (
        <div className="p-4 md:p-6">

            {/* BLOC 1 : en-tête */}
            <div className="flex items-start gap-4 mb-6">
                <FaChartColumn size={28} className="text-primary mt-1" />
                <div>
                    <h2 className="font-bold">Statistiques</h2>
                    <p className="text-sm text-secondary">
                        Consultez les performances de la semaine.
                    </p>
                </div>
            </div>

            {/* BLOC 2 : filtres */}
            <div className="mb-6 flex flex-wrap gap-3 md:justify-end">
                <div className="relative md:w-64">
                    <FaClipboardList size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                    <select className="w-full appearance-none rounded-md bg-[#EFE8E8] py-3 pl-9 pr-10 text-sm cursor-pointer">
                        <option>12 Oct. - 18 Oct. 2026</option>
                        <option>5 Oct. - 11 Oct. 2026</option>
                        <option>28 Sept. - 4 Oct. 2026</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
                </div>
                <div className="relative md:w-48">
                    <select className="w-full appearance-none rounded-md bg-[#EFE8E8] py-3 pl-4 pr-10 text-sm cursor-pointer">
                        <option>Ventes</option>
                        <option>Commandes</option>
                    </select>
                    <FaChevronDown size={12} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
                </div>
            </div>

            {/* BLOC 3 : les 3 cartes */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {cartes.map((carte) => (
                    <div
                        key={carte.titre}
                        className="flex items-center gap-4 rounded-lg border border-emp-trace-pab bg-emp-pab p-4"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0E2B8]">
                            <carte.Icone size={18} className="text-[#C49E4C]" />
                        </div>
                        <div>
                            <p className="text-xs text-secondary">{carte.titre}</p>
                            <p className="text-lg font-semibold text-secondary">{carte.valeur}</p>
                            <p className="flex items-center gap-1 text-xs font-semibold text-[#0AAF39]">
                                <FaArrowUp size={10} />
                                {carte.variation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {/* ↑ La boucle et la grille sont FERMÉES ici */}

            
            {/* BLOC 4 : graphique (2/3) + donut (1/3) côte à côte sur grand écran */}
<div className="mt-6 grid gap-4 lg:grid-cols-3">

    {/* ===== GRAPHIQUE EN BARRES ===== */}
    <div className="rounded-lg border border-grey-300 bg-[#FAFAFA] p-3 lg:col-span-2">

        {/* Légende alignée à droite */}
        <div className="flex justify-end gap-4 text-[11px]">
            <span className="flex items-center gap-2">
                <span className="h-2.5 w-4 rounded-full bg-[#CFBF9B]" /> commandes
            </span>
            <span className="flex items-center gap-2">
                <span className="h-2.5 w-4 rounded-full bg-black" /> Ventes (x1000)
            </span>
        </div>

        <h3 className="text-xs font-bold">Évolution des ventes</h3>

        <div className="overflow-x-auto">
            <div className="min-w-[320px]">

                {/* relative : repère pour placer les lignes. ml-8 : place pour les nombres. h-36 : hauteur. */}
                <div className="relative ml-8 mt-4 h-36">

                    {/* Une ligne par graduation, placée en % depuis le haut */}
                    {graduations.map((g) => (
                        <div
                            key={g}
                            className="absolute left-0 right-0"
                            style={{ top: `${((MAX - g) / MAX) * 100}%` }}
                        >
                            {/* Le nombre, à gauche de la ligne, centré dessus */}
                            <span className="absolute -left-8 top-0 w-6 -translate-y-1/2 text-right text-[11px] font-semibold">
                                {g}
                            </span>
                            {/* La ligne qui va jusqu'au bout */}
                            <div className="border-t border-grey-300" />
                        </div>
                    ))}

                    {/* Les barres, posées PAR-DESSUS les lignes (7 colonnes égales) */}
                    <div className="absolute inset-0 grid grid-cols-7">
                        {jours.map((j) => (
                            <div key={j.jour} className="flex h-full items-end justify-center gap-1">
                                <div className="w-3 bg-[#CFBF9B]" style={{ height: `${(j.commandes / MAX) * 100}%` }} />
                                <div className="w-3 bg-black" style={{ height: `${(j.ventes / MAX) * 100}%` }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Libellés : mêmes 7 colonnes égales, donc alignés sous les barres */}
                <div className="ml-8 mt-2 grid grid-cols-7 text-center text-[11px]">
                    {jours.map((j) => (
                        <div key={j.jour}>
                            <p>{j.jour}</p>
                            <p>{j.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>

    {/* ===== DONUT ===== */}
    <div className="flex flex-col rounded-lg border border-grey-300 bg-[#FAFAFA] p-3">
    <h3 className="text-xs font-bold">Répartition des ventes par catégorie</h3>

        <div className="flex flex-1 items-center justify-center gap-6">

            {/* relative : repère pour le trou central */}
            <div
                className="relative h-28 w-28 shrink-0 rounded-full"
                style={{ background: `conic-gradient(${degrade})` }}
            >
                {/* Le trou : un cercle de la couleur du fond, posé au centre */}
                <div className="absolute inset-7 rounded-full bg-[#FAFAFA]" />
            </div>

            {/* Légende : pastille + nom + pourcentage */}
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

{/* BLOC 5 : meilleur jour de la semaine */}
<div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[#CFBF9B] p-4">
    <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F0E2B8]">
            <FaTrophy size={20} className="text-[#C49E4C]" />
        </div>
        <div className="text-xs">
            <p className="font-bold">Meilleur jour de la semaine</p>
            <p>Samedi ( 17/10 )</p>
            <p>Ventes : 46 600 FCFA</p>
        </div>
    </div>

    <button
        type="button"
        className="flex items-center gap-3 rounded-lg bg-black px-5 py-3 text-xs font-semibold text-white cursor-pointer hover:bg-[#333]"
    >
        Voir le détail
        <FaArrowRight size={14} />
    </button>
</div>
                </div>
            

            );    
    
}