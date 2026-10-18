//importe un hook qui permet de memoriser une valeur
import { useState } from "react"
//importe l'outil qui gère le panier (partagé entre toutes les pages)
import usePanier from "../../composantE/usePanier"
//importe le composant qui affiche une carte de plat (image, nom, prix, bouton)
import CartePlat from "../../composantE/CartePlat"

//les catégories affichées en haut (boutons de filtre)
const categories = ["Plats", "Boissons", "Accompagnements"]

export default function Menu() {
    //récupère la fonction "ajouter" de l'outil panier
    const { ajouter } = usePanier()

    //---------------- DONNEES (valeurs de test pour l'instant) ----------------
    //plus tard : ces valeurs viendront de l'API PHP (c'est le gérant qui les modifie)
    const [plats] = useState([
        { id: 4, nom: "Ndolé royal", prix: 1000, categorie: "Plats", image: "/ndolé.webp" },
        { id: 5, nom: "Eru", prix: 1000, categorie: "Plats", image: "/eru.jpg" },
        { id: 1, nom: "Okok", prix: 1000, categorie: "Plats", image: "/okok salé.jpg" },
        { id: 3, nom: "Poulet pané", prix: 2000, categorie: "Plats", image: "/poulet pané.jpg" },
        { id: 6, nom: "Boulette + riz", prix: 1500, categorie: "Plats", image: "/boulette.jpg" },
        { id: 2, nom: "Poisson braisé", prix: 2000, categorie: "Plats", image: "/poisson braisé.jpg" },
        //-----------Boissons---------
        {id: 7, nom: "folere", prix: 500, categorie: "Boissons", image: "/foléré.webp"},
        {id: 8, nom: "citronnade", prix: 500, categorie: "Boissons", image: "/citronnade.webp"},
        {id: 9, nom: "jus d'ananas", prix: 500, categorie: "Boissons", image: "/jus d'ananas.jpg"},
        //--------Accompagnements------
        {id: 10, nom: "plantain", prix: 500, categorie: "Accompagnements", image: "/plantain.webp"},
        {id: 11, nom: "manioc", prix: 500, categorie: "Accompagnements", image: "/manioc.webp"},
        {id: 12, nom: "baton", prix: 500, categorie: "Accompagnements", image: "/baton.jpg"},
        
        
    ])

    //---------------- ETATS DE LA PAGE ----------------
    //la catégorie choisie (au départ : Plats)
    const [categorie, setCategorie] = useState("Plats")
    //l'id du plat qui vient d'être ajouté (pour afficher "Ajouté ✓" un instant)
    const [ajouteId, setAjouteId] = useState(null)

    //garde seulement les plats de la catégorie choisie
    const platsAffiches = plats.filter((p) => p.categorie === categorie)

    //fonction appellée quand on clique sur "Ajouter"
    const ajouterAuPanier = (plat) => {
        ajouter(plat) // met le plat dans le panier
        setAjouteId(plat.id)
        setTimeout(() => setAjouteId(null), 1500) // "Ajouté ✓" disparait après 1,5 seconde
    }

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            {/* ---------- TITRE ---------- */}
            <div>
                <h1 className="font-serif text-xl font-bold">Notre menu</h1>
                <p className="text-xs text-gray-600">
                    Chaque tranche de 1 000 F vous rapporte 1 point de fidélité
                </p>
            </div>

            {/* ---------- BOUTONS DE FILTRE ---------- */}
            {/* flex-wrap : si l'écran est étroit, les boutons passent à la ligne */}
            <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategorie(c)}
                        className={
                            "rounded-full border border-[#CFBD97] px-4 py-1 text-xs " +
                            (c === categorie ? "bg-[#CFBD97] text-white" : "bg-white text-gray-800")
                        }
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* ---------- LISTE DES PLATS ---------- */}
            {/* si la catégorie est vide, on affiche un message au lieu de la grille */}
            {platsAffiches.length === 0 ? (
                <p className="text-sm text-gray-600">Aucun article dans cette catégorie pour le moment.</p>
            ) : (
                /* 1 colonne sur téléphone, 2 colonnes sur ordinateur */
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* .map() fabrique une carte pour chaque plat */}
                    {platsAffiches.map((plat) => (
                        <div key={plat.id} className="rounded-xl border border-[#CFBD97] bg-white p-3">
                            <img
                                src={plat.image}
                                alt={plat.nom}
                                className="h-44 w-full rounded-lg object-cover md:h-52"
                            />

                            {/* nom à gauche, prix à droite */}
                            <div className="mt-2 flex items-center justify-between border-b border-[#efe6d0] pb-1 text-sm">
                                <span>{plat.nom}</span>
                                <span className="font-semibold text-[#b8862d]">{plat.prix} Fcfa</span>
                            </div>

                            <button
                                onClick={() => ajouterAuPanier(plat)}
                                className="mx-auto mt-3 block w-3/5 rounded-full bg-[#CFBD97] py-1 text-sm text-white"
                            >
                                {ajouteId === plat.id ? "Ajouté ✓" : "Ajouter"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}