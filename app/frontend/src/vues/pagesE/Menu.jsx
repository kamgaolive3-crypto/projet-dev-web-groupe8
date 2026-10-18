//importe un hook qui permet de memoriser une valeur
import { useState, useEffect } from "react"
//importe l'outil qui gère le panier (partagé entre toutes les pages)
import usePanier from "../../composantE/usePanier"
//importe le client API (le vrai menu vient du backend Laravel)
import { api } from "../../services/api"

//les catégories affichées en haut (boutons de filtre)
//a gauche : libellé affiché, a droite : valeur en base (table article_menu)
const categories = [
    { label: "Plats", valeur: "plat" },
    { label: "Boissons", valeur: "boisson" },
    { label: "Accompagnements", valeur: "accompagnement" },
    { label: "Desserts", valeur: "dessert" },
]

export default function Menu() {
    //récupère la fonction "ajouter" de l'outil panier
    const { ajouter } = usePanier()

    //---------------- DONNEES DU BACKEND ----------------
    //le menu complet vient de GET /api/article_menu (créé/modifié par le staff)
    const [plats, setPlats] = useState([])
    //message d'erreur s'il y a eu un problème de chargement
    const [erreur, setErreur] = useState("")

    //au premier affichage de la page, on va chercher le menu
    useEffect(() => {
        api.get("/article_menu")
            .then((liste) => {
                //on transforme les champs de la base (Id_article, nom_article...)
                //en champs utilisés par la page (id, nom, prix, categorie, image)
                setPlats(liste.map((a) => ({
                    id: a.Id_article,
                    nom: a.nom_article,
                    prix: a.prix_article,
                    categorie: a.categories_article,
                    image: a.image_article || "/plat_du_jour.jpg",
                    disponible: a.disponibilite_article,
                    restaurant: a.Id_restaurant, // le panier exige un seul restaurant
                })))
            })
            .catch((e) => setErreur(e.message))
    }, [])

    //---------------- ETATS DE LA PAGE ----------------
    //la catégorie choisie (au départ : Plats)
    const [categorie, setCategorie] = useState("plat")
    //l'id du plat qui vient d'être ajouté (pour afficher "Ajouté ✓" un instant)
    const [ajouteId, setAjouteId] = useState(null)

    //garde seulement les plats de la catégorie choisie
    const platsAffiches = plats.filter((p) => p.categorie === categorie)

    //fonction appellée quand on clique sur "Ajouter"
    const ajouterAuPanier = (plat) => {
        if (!plat.disponible) return // un article indisponible ne peut pas être ajouté
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

            {/* message d'erreur du chargement */}
            {erreur && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{erreur}</p>}

            {/* ---------- BOUTONS DE FILTRE ---------- */}
            {/* flex-wrap : si l'écran est étroit, les boutons passent à la ligne */}
            <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                    <button
                        key={c.valeur}
                        onClick={() => setCategorie(c.valeur)}
                        className={
                            "rounded-full border border-[#CFBD97] px-4 py-1 text-xs " +
                            (c.valeur === categorie ? "bg-[#CFBD97] text-white" : "bg-white text-gray-800")
                        }
                    >
                        {c.label}
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
                                disabled={!plat.disponible}
                                className={
                                    "mx-auto mt-3 block w-3/5 rounded-full bg-[#CFBD97] py-1 text-sm text-white " +
                                    (plat.disponible ? "" : "opacity-50")
                                }
                            >
                                {ajouteId === plat.id ? "Ajouté ✓" : plat.disponible ? "Ajouter" : "Épuisé"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
