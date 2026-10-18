//importe un hook qui permet de memoriser une valeur
import { useState, useEffect } from "react";
//importe link : permet de changer de page sans recharger le navigateur
import {Link} from "react-router-dom"
// importe l'outil qui gère le panier (partagé entre toutes les pages)
import usePanier from "../../composantE/usePanier"
//importe le composant qui affiche une carte de plat (image, nom, prix, bouton)
import CartePlat from "../../composantE/CartePlat"
//cliente de l API : tout le contenu affiché vient du backend
import { api } from "../../services/api"
//auth : pour participer aux événements (il faut être connecté)
import { useAuth } from "../../services/auth";

//transforme un article de la base en carte de plat utilisable par la page
const versPlat = (a) => ({
    id: a.Id_article,
    nom: a.nom_article,
    prix: a.prix_article,
    image: a.image_article || "/plat_du_jour.jpg",
    restaurant: a.Id_restaurant, // necessaire au panier (un seul restaurant)
});

export default function Accueil() {
    //le plat du jour : menu_du_jour = 1 et categorie = plat (GET /api/article_menu-du-jour/plat)
    const [platDuJour, setPlatDuJour] = useState(null)
    //les promotions en cours depuis GET /api/promotions/actives
    const [promotions, setPromotions] = useState([])
    //le menu du jour complet (GET /api/article_menu-du-jour)
    const [menuDuJour, setMenuDuJour] = useState([])
    //message affiché après un clic sur "Je participe"
    const [message, setMessage] = useState("")
    //recupère l'utilisateur connecté (pour participer aux événements)
    const { user } = useAuth()
//récupère la fonction "ajouter" de l'outil panier, et la renomme ajouterAuPanier
const { ajouter: ajouterAuPanier } = usePanier()

    //au premier affichage : les 3 chargements d'un coup
    useEffect(() => {
        api.get("/article_menu-du-jour/plat") // menu du jour de la categorie plat
            .then((liste) => setPlatDuJour(liste[0] ? versPlat(liste[0]) : null))
            .catch(() => setPlatDuJour(null))

        api.get("/promotions/actives")
            .then((liste) => setPromotions(liste.map((e) => ({
                id: e.Id_evenement,
                type: e.type_evenement === "mini_jeu" ? "Mini-jeu :" : e.type_evenement === "promotion" ? "Promotion :" : "Événement :",
                image: e.affiche_evenement || "/promo1.png",
                texte: e.description_evenement || (e.taux_reduction ? "Réduction de " + e.taux_reduction + "%" : "Points à gagner : " + e.points_evenement),
                points: e.points_evenement,
            }))))
            .catch(() => setPromotions([]))

        api.get("/article_menu-du-jour") // tous les articles du menu du jour
            .then((liste) => setMenuDuJour(liste.map(versPlat)))
            .catch(() => setMenuDuJour([]))
    }, [])

    //participer a un mini-jeu/evenement : POST /api/evenement/{id}/participer
    const participer = async (id) => {
        if (!user) {
            setMessage("Connectez-vous pour participer.")
            return
        }
        try {
            const reponse = await api.post("/evenement/" + id + "/participer")
            setMessage("Participation enregistrée ! Points crédités : " + reponse.points_gagnes)
        } catch (e) {
            setMessage(e.message)
        }
    }

    return(
         <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* si un plat du jour existe, on l'affiche, sinon on affiche un message */}
            {platDuJour ? (
                <section className="flex flex-col overflow-hidden rounded-xl border border-[#CFBD97] bg-white md:flex-row">
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
                    <button
                        onClick={() => ajouterAuPanier(platDuJour)}
                        className="rounded-full bg-[#CFBD97] py-2 text-sm font-medium"
                    >
                        Ajouter au panier
                        </button>
                        </div>
                        </section>
            ) : (
                <p>Le plat du jour n est pas encore publié — revenez bientôt !</p>
            )}
                        {/* ---------- PROMOTIONS ---------- */}
                        {/* le message de participation s affiche ici */}
                        {message && <p className="rounded-md bg-[#fffdf5] px-3 py-2 text-sm text-[#b8862d]">{message}</p>}
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
                            <button
                                onClick={() => participer(promo.id)}
                                className="rounded-md bg-[#CFBD97] px-4 py-1 font-serif text-sm"
                            >
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
                       <CartePlat
                       key={plat.id}
                       plat={plat}
                       onAjouter={ajouterAuPanier}
    />
))}  
                </div>
            </section>
            </div>
    )
}
