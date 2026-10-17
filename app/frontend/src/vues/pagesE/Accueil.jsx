//importe un hook qui permet de memoriser une valeur
import { useState } from "react";
//importe link : permet de changer de page sans recharger le navigateur
import {Link} from "react-router-dom"

export default function Accueil() {
    //memorise le plat du jour (valeurs de test pour l'instant)
//plus tard : ces valeurs viendront du gérant, via l'API PHP
const [platDuJour] = useState({
    nom: "Salade carter à la sauce pepiaisie",
    prix: 2500,
    image: "/plat_du_jour.jpg"
})
//memorise la liste des promotions (valeurs de test pour l'instant)
//"lien" est optionnel : s'il n'y en a pas, il n' aura pas de bouton
const [promotions] = useState([
    {
        id: 1,
        type: "Promotion :",
        image: "/promo1.png",
        texte: "SPÉCIALEMENT AUJOURD'HUI : -30% SUR TOUTES LES COMMANDES À PARTIR DE 3000Fcfa",
    },
    {
        id:2,
        type:"Évènements :",
        image: "/promo2.png",
        texte: "POUR CE SAMEDI 14 FÉVRIER, VENEZ PROFITER DE L'AMOUR. LE ZEDUC FERA UN BUFFET COMPLET POUR LA MODIQUE SOMME DE 3000 Fcfa L'ENTRÉE"

    }
])
//memorise la liste des plats du menu du jour (valeurs de test pour l'instant)
//plus tard : le gérant pourra ajouter, modifier ou supprimer ces plats
const [menuDuJour] = useState([
    {id: 1, nom: "okok salé", prix: 1000, image:"/okok salé.jpg"},
    {id: 2, nom: "poisson braisé", prix: 2000, image:"/poisson braisé.jpg"},
    {id: 3, nom: "poulet pané", prix: 2000, image:"/poulet pané.jpg"}
])
    return(
         <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* si un plat du jour existe, on l'affiche, sinon on affiche un message */}
            {platDuJour ? (
                <section className="flex flex-col overflow-hidden rounded-xl border-[#CFBD97] bg-white md:flex-row">
                    {/* "relative" permet de poser le texte par-dessus l'image */}
                    <div className="relative w-full md:w-2/3">
                    <img src={platDuJour.image} alt={platDuJour.nom} className="h-56 w-full object-cover md:h-72" />
                    {/* "absolute" place le texte en haut à gauche de la photo */}
                    <span className="absolute left-4 top-4 text-2xl text-white">Plat du jour :</span>
                </div>

                    <div className="flex w-full flex-col justify-center gap-3 p-4 md:w-1/3 md:p-6">
                    <h2 className="text-sm font-bold uppercase">Découvrez notre plat du jour :</h2>
                    <p className="font-semibold text-[#b8862d]">{platDuJour.nom}</p>
                    <p className="text-sm">{platDuJour.prix} Fcfa</p>
                    <button className="rounded-full bg-[#CFBD97] py-2 text-sm font-medium">
                        Ajouter au panier
                        </button>
                        </div>
                        </section>
            ) : (
                <p>Aucun plat du jour pour le moment</p>
            )}
                        {/* ---------- PROMOTIONS ---------- */}
            {/* .map() répète ce bloc pour chaque promotion du tableau */}
            {promotions.map((promo) => (
                <section
                    key={promo.id}
                    className="flex overflow-hidden rounded-xl border border-black bg-gray-200"
                >
                    {/* image à gauche */}
                    <img src={promo.image} alt={promo.type} className="w-1/4 object-cover" />

                    {/* texte à droite */}
                    <div className="flex flex-1 flex-col justify-center gap-2 p-4">
                        <span className="text-xs">{promo.type}</span>
                        <p className="font-serif text-sm font-bold">{promo.texte}</p>

                        {/* bouton affiché sur chaque promotion, aligné à droite */}
                        <div className="flex justify-end">
                            <button className="rounded-md bg-[#CFBD97] px-4 py-1 font-serif text-sm">
                                Je participe
                            </button>
                        </div>
                    </div>
                </section>
            ))}
                        {/* ---------- MENU DU JOUR ---------- */}
            <section>
                <h2 className="mb-4 text-xl font-semibold">Menu du jour</h2>

                {/* 2 colonnes sur téléphone, 3 colonnes à partir de md (ordinateur) */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                    {/* .map() fabrique une carte pour chaque plat du tableau */}
                    {menuDuJour.map((plat) => (
                        <div
                            key={plat.id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            <img src={plat.image} alt={plat.nom} className="h-40 w-full object-cover md:h-56" />

                            {/* nom à gauche, prix à droite */}
                            <div className="flex items-center justify-between px-3 pt-2 text-xs md:text-sm">
                                <span>{plat.nom}</span>
                                <span className="font-semibold text-[#b8862d]">{plat.prix} Fcfa</span>
                            </div>

                            <div className="p-3">
                                <button className="w-full rounded-full bg-[#CFBD97] py-2 text-xs font-medium md:text-sm">
                                     Ajouter au panier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            </div>
    )
}