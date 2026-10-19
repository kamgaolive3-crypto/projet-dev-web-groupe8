// Page Menu reproduisant la maquette :
// titre "Notre menu" Inria Bold 36px ; note du programme de fidelite ;
// chips de categories (active = or #C49E4C, autres blanches, r29) ;
// grille de cartes blanches r30 (photo, nom Inria 24px, prix or, bouton "Ajouter")
import { useState, useEffect } from "react"
import usePanier from "../../composantE/usePanier"
import { api } from "../../services/api"
import platMaquette from "../../../public/maq/maq_plat.jpg";

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
                    image: a.image_article || platMaquette,
                    description: a.description || "",
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
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-8 md:px-8">
            {/* ---------- TITRE ---------- */}
            <h1 className="font-inria text-2xl font-bold text-black md:text-[36px]">
                Notre menu
            </h1>
            <p className="mt-1 font-inria text-sm text-black md:text-base">
                Chaque tranche de 1 000 F vous rapporte 1 point de fidélité
            </p>

            {/* message d'erreur du chargement */}
            {erreur && (
                <p className="mt-4 rounded-[10px] bg-red-100 px-4 py-2 text-sm text-red-700">
                    {erreur}
                </p>
            )}

            {/* ---------- CHIPS DE FILTRE (maquette : pills r29) ---------- */}
            <div className="mt-5 flex flex-wrap gap-3">
                {categories.map((c) => (
                    <button
                        key={c.valeur}
                        type="button"
                        onClick={() => setCategorie(c.valeur)}
                        className={
                            "rounded-[29px] px-6 py-2 font-inria text-base transition-colors md:text-lg " +
                            (c.valeur === categorie
                                ? "bg-or text-black"
                                : "bg-white text-black hover:bg-creme-d")
                        }
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* ---------- LISTE DES PLATS ---------- */}
            {/* si la catégorie est vide, on affiche un message au lieu de la grille */}
            {platsAffiches.length === 0 ? (
                <p className="mt-8 font-inria text-encre">
                    Aucun article dans cette catégorie pour le moment.
                </p>
            ) : (
                /* 1 colonne sur téléphone, 2 colonnes sur grand écran (maquette 2 col) */
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* .map() fabrique une carte pour chaque plat */}
                    {platsAffiches.map((plat) => (
                        <article
                            key={plat.id}
                            className="flex flex-col items-center rounded-[30px] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <img
                                src={plat.image}
                                alt={plat.nom}
                                className="h-52 w-full rounded-[20px] object-cover md:h-[280px]"
                            />

                            {/* nom + prix (maquette : Inria 24px, prix or) */}
                            <div className="mt-4 flex w-full items-center justify-between gap-3">
                                <span className="font-inria text-lg text-black md:text-[24px]">
                                    {plat.nom}
                                </span>
                                <span className="font-inria text-lg text-or md:text-[24px]">
                                    {plat.prix}Fcfa
                                </span>
                            </div>

                            {/* bouton "Ajouter" : pill or r30 (maquette 199x32) */}
                            <button
                                type="button"
                                onClick={() => ajouterAuPanier(plat)}
                                disabled={!plat.disponible}
                                className={
                                    "mt-4 w-full max-w-[240px] rounded-[30px] bg-or py-2 font-inria text-lg text-black transition-colors hover:bg-or-deep hover:text-white disabled:opacity-50 md:text-xl " +
                                    (plat.disponible ? "" : "opacity-50")
                                }
                            >
                                {ajouteId === plat.id ? "Ajouté ✓" : plat.disponible ? "Ajouter" : "Épuisé"}
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
