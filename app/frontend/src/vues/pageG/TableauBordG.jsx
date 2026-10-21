import { FaRegCalendar, FaBowlFood,FaUsers, FaUtensils, FaTag, FaTrophy, FaArrowTrendDown, FaLeaf  } from "react-icons/fa6";
import taro from "../../assets/plats/taro.png";
import ndole from "../../assets/plats/ndole.png";
import eru from "../../assets/plats/eru.png";
import okok from "../../assets/plats/okok.png";
import frites from "../../assets/plats/frites.png";
import jus from "../../assets/plats/jus.png";
// 4 cartes de chiffres (valeurs provisoires, à remplacer par le backend)
const cartes = [
    { titre: "Commandes traitées", valeur: "1128", unite: "", Icone: FaUtensils, fondIcone: "bg-emp-commande-carre", couleurIcone: "text-emp-commande-rond" },
    { titre: "Clients actifs", valeur: "432", unite: "", Icone: FaUsers, fondIcone: "bg-emp-attente-rond", couleurIcone: "text-emp-attente-emoji" },
    { titre: "Volume cuisine", valeur: "2 450", unite: "plats",Icone: FaBowlFood, fondIcone: "bg-emp-bleu-rond", couleurIcone: "text-emp-bleu-emoji" },
];
// Top 3 employés (valeurs provisoires, à remplacer par le backend)
const topEmployes = [
    {nom: "Meni Dom Reine",tel: "+237 690 12 34 56" },
    {nom: "Ndjao Kamga Olive",tel: "+237 655 78 90 12" },
    {nom: "Fossap Folack Diana",tel: "+237 677 45 89 21" },
];

// Top 3 clients
const topClients = [
    {nom: "Mpangala Dina",tel: "+237 694 55 11 22" },
    {nom: "Tamibe junior",tel: "+237 671 22 44 66" },
    {nom: "Soume Ngah",tel: "+237 690 33 77 88" },
];
// Top 3 plats les plus commandés (plats du menu ; chiffres provisoires, backend à venir)
const meilleursPlats = [
    { rang: 1, nom: "Taro",prix: "2 500 FCFA",image: taro },
    { rang: 2, nom: "Ndolè",prix: "2 500 FCFA",image: ndole },
    { rang: 3, nom: "L'okok salé",prix: "2 500 FCFA",image: okok },
];

// Plats les moins vendus (plats du menu ; chiffres provisoires)
const moinsVendus = [
    { nom: "Eru and Water",prix:" 2 500 FCFA",image: eru },
    { nom: "Frites",prix: " 2 500 FCFA",image: frites },
    { nom: "Jus naturel",prix:" 1 000 FCFA",image: jus },
];
export default function TableauBordG(){
    return(
         <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="font-bold">Tableau de bord</h2>
                    <p className="text-sm text-secondary">
                        Aperçu global, classements d'excellence et indicateurs de performance
                    </p>
                    </div>
           <div className="flex gap-3">
                    <div className="relative">
                        <FaRegCalendar size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
                        <select className="appearance-none rounded-md border border-grey-300 bg-white py-2 pl-9 pr-9 text-sm cursor-pointer">
                            <option>Ce mois-ci</option>
                        </select>
                    </div>
                    </div>
                    </div>
                    {/* Les 4 cartes : 1 colonne sur mobile, 2 sur tablette, 4 sur ordinateur */}
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {cartes.map((carte) => (
        <div key={carte.titre} className="rounded-lg border border-grey-300 bg-white p-4">
            <div className="flex items-start justify-between">
                <p className="text-xs text-secondary">{carte.titre}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${carte.fondIcone}`}>
                    <carte.Icone size={14} className={carte.couleurIcone} />
                </div>
            </div>
            <p className="mt-2 text-2xl font-bold">
                {carte.valeur} <span className="text-xs font-normal">{carte.unite}</span>
            </p>
            
        </div>
    ))}
</div>
{/* Deux blocs côte à côte sur ordinateur, empilés sur mobile */}
<div className="mt-6 grid gap-4 lg:grid-cols-2">

    {/* Top 3 Meilleurs Employés */}
    <div className="rounded-lg border border-grey-300 bg-white p-4">
        <div className="flex items-center gap-2">
            <FaTrophy size={14} className="text-amber-600" />
            <h3 className="text-sm font-bold">Top 3 Meilleurs Employés</h3>
        </div>
        <p className="mb-3 text-xs text-secondary">Palmarès mensuel basé sur la performance et le service</p>
        <div className="flex flex-col gap-2">
            {topEmployes.map((p) => (
                <div key={p.nom} className="flex items-center gap-3 rounded-md bg-grey p-3">
                    <div className="min-w-0 flex-1 text-xs">
                        <p className="font-semibold">{p.nom} <span className="ml-1 rounded bg-emp-vert-carre px-1 text-[10px] text-emp-vert-emoji"></span></p>
                        
                        <p className="text-[10px] text-secondary">{p.tel}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>

    {/* Top 3 Meilleurs Clients */}
    <div className="rounded-lg border border-grey-300 bg-white p-4">
        <div className="flex items-center gap-2">
            <FaTag size={14} className="text-purple-600" />
            <h3 className="text-sm font-bold">Top 3 Meilleurs Clients</h3>
        </div>
        <p className="mb-3 text-xs text-secondary">Cercle VIP et plus fortes contributions du mois</p>
        <div className="flex flex-col gap-2">
            {topClients.map((p) => (
                <div key={p.nom} className="flex items-center gap-3 rounded-md bg-grey p-3">
                    <div className="min-w-0 flex-1 text-xs">
                        <p className="font-semibold">{p.nom} <span className="ml-1 rounded bg-emp-vert-carre px-1 text-[10px] text-emp-vert-emoji"></span></p>
                        <p className="text-[10px] text-secondary">{p.tel}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>
            {/* Deux blocs côte à côte sur ordinateur, empilés sur mobile */}
            <div className="mt-6 grid gap-4 lg:grid-cols-2">

                {/* ===== Top 3 Meilleurs Plats ===== */}
                <div className="rounded-lg border border-grey-300 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <FaLeaf size={14} className="text-green-600" />
                        <h3 className="text-sm font-bold">Top 3 Meilleurs Plats</h3>
                    </div>
                    <p className="mb-3 text-xs text-secondary">Les incontournables les plus commandés du restaurant</p>

                    <div className="flex flex-col gap-2">
                        {meilleursPlats.map((p) => (
                            <div key={p.nom} className="flex items-center gap-3 rounded-md bg-grey p-3">

                                {/* Photo + rang (se ferme AVANT le texte) */}
                                <div className="relative shrink-0">
                                    <img src={p.image} alt={p.nom} className="h-14 w-14 rounded-md object-cover" />
                                    <span className="absolute -left-1 -top-1 rounded bg-amber-500 px-1 text-[10px] font-bold text-white">#{p.rang}</span>
                                </div>
                                {/* Texte à droite de la photo */}
                                <div className="min-w-0 flex-1 text-xs">
                                    <p className="font-semibold">{p.nom}</p>
                                </div>
                                {/* Prix tout au bout à droite */}
                                <p className="shrink-0 self-start text-xs font-bold text-amber-700">{p.prix}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== Plats les moins vendus ===== */}
                <div className="rounded-lg border border-grey-300 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <FaArrowTrendDown size={14} className="text-red-600" />
                                <h3 className="text-sm font-bold">Plats les moins vendus</h3>
                            </div>
                            <p className="mb-3 text-xs text-secondary">Alertes sur la carte et recommandations d'optimisation</p>
                        </div>
                        <span className="shrink-0 rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">3 alertes actives</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {moinsVendus.map((p) => (
                            <div key={p.nom} className="flex items-center gap-3 rounded-md bg-grey p-3">
                                <img src={p.image} alt={p.nom} className="h-12 w-12 shrink-0 rounded-md object-cover" />
                                <div className="min-w-0 flex-1 text-xs">
                                    <p className="font-semibold">{p.nom}</p>
                                </div>
                                <p className="w-24 shrink-0 text-right text-xs font-bold text-amber-700">{p.prix}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}