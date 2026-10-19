// La page d accueil reproduit la maquette "Accueil" :
// 1. grille "Menu du jours" (3 cartes blanches r30 + CTA beige)
// 2. hero "Plat du jour" (photo plein cadre + bandeau clair)
// 3. bandes Evenements / Promotions (#E8E8E8, r10)
// tout le contenu affiche vient du backend (articles, evenements)
import { useState, useEffect } from "react";
import usePanier from "../../composantE/usePanier"
import { api } from "../../services/api"
import { useAuth } from "../../services/auth";

// image de repli de la maquette quand un article n a pas de photo
import platMaquette from "../../../public/maq/maq_plat.jpg";
import heroMaquette from "../../../public/maq/maq_plat_du_jour.jpg";
import eventMaquette from "../../../public/maq/maq_evenement.jpg";
import promoMaquette from "../../../public/maq/maq_promo.jpg";

//transforme un article de la base en carte de plat utilisable par la page
const versPlat = (a) => ({
    id: a.Id_article,
    nom: a.nom_article,
    prix: a.prix_article,
    image: a.image_article || platMaquette,
    description: a.description || "",
    restaurant: a.Id_restaurant, // necessaire au panier (un seul restaurant)
});

// ---------- CARTE "MENU DU JOURS" (maquette : fond blanc r30, photo, prix or) ----------
function CartePlatAccueil({ plat, ajouterAuPanier, ajoute }) {
    return (
        <article className="flex flex-col items-center overflow-hidden rounded-[30px] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <img
                src={plat.image}
                alt={plat.nom}
                className="h-56 w-full rounded-[20px] object-cover md:h-[300px]"
            />
            <p className="mt-4 font-inria text-base text-black md:text-lg">{plat.nom}</p>
            <p className="mt-1 font-inria text-xl text-or-deep md:text-2xl">
                {plat.prix}Fcfa
            </p>
            <span className="mt-4 block h-[2px] w-11/12 bg-filet" />
            <button
                type="button"
                onClick={() => ajouterAuPanier(plat)}
                className="mt-4 block w-full max-w-[305px] rounded-[15px] bg-or-clair py-3 font-inria text-lg text-black transition-colors hover:bg-or md:text-xl"
            >
                {ajoute ? "Ajouté ✓" : "Ajouter au panier"}
            </button>
        </article>
    );
}

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
    //récupère la fonction "ajouter" de l'outil panier
    const { ajouter: ajouterAuPanier } = usePanier()
    //id du plat recemment ajoute (feedback "Ajouté ✓")
    const [ajouteId, setAjouteId] = useState(null)

    //au premier affichage : les 3 chargements d'un coup
    useEffect(() => {
        api.get("/article_menu-du-jour/plat") // menu du jour de la categorie plat
            .then((liste) => setPlatDuJour(liste[0] ? versPlat(liste[0]) : null))
            .catch(() => setPlatDuJour(null))

        api.get("/promotions/actives")
            .then((liste) => setPromotions(liste.map((e) => ({
                id: e.Id_evenement,
                // un evenement de type promotion alimente la bande "Promotions",
                // le reste (mini_jeu etc.) alimente la bande "Evenements"
                bande: e.type_evenement === "promotion" ? "promo" : "event",
                etiquette: e.type_evenement === "mini_jeu" ? "Mini-jeu :" : e.type_evenement === "promotion" ? "Promotions :" : "Evenements :",
                image: e.affiche_evenement || (e.type_evenement === "promotion" ? promoMaquette : eventMaquette),
                texte: e.description_evenement || (e.taux_reduction ? "Réduction de " + e.taux_reduction + "%" : "Points à gagner : " + e.points_evenement),
                points: e.points_evenement,
            }))))
            .catch(() => setPromotions([]))

        api.get("/article_menu-du-jour") // tous les articles du menu du jour
            .then((liste) => setMenuDuJour(liste.map(versPlat)))
            .catch(() => setMenuDuJour([]))
    }, [])

    //ajouter au panier depuis l accueil avec feedback
    const ajouter = (plat) => {
        ajouterAuPanier(plat)
        setAjouteId(plat.id)
        setTimeout(() => setAjouteId(null), 1500)
    }

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

    //les bandes affichees : evenements puis promotions (ordre de la maquette)
    const bandes = [...promotions.filter((p) => p.bande === "event"), ...promotions.filter((p) => p.bande === "promo")]

    return (
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-6 md:px-8">
            {/* message de participation / erreur */}
            {message && (
                <p className="mb-4 rounded-[15px] bg-creme-d px-4 py-3 text-center font-inria text-base text-or-deep">
                    {message}
                </p>
            )}

            {/* ---------- 1. MENU DU JOURS ---------- */}
            <section className="mt-2">
                <h2 className="font-sans text-3xl text-black md:text-[44px] md:leading-tight">
                    Menu du jours
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {menuDuJour.length === 0 ? (
                        <p className="font-inria text-encre">Le menu du jour n&apos;est pas encore publié — revenez bientôt !</p>
                    ) : (
                        menuDuJour.slice(0, 3).map((plat) => (
                            <CartePlatAccueil
                                key={plat.id}
                                plat={plat}
                                ajouterAuPanier={ajouter}
                                ajoute={plat.id === ajouteId}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* ---------- 2. PLAT DU JOUR (hero photo + bandeau clair) ---------- */}
            {platDuJour && (
                <section className="relative mt-12 overflow-hidden rounded-[30px]">
                    {/* photo de fond */}
                    <img
                        src={heroMaquette}
                        alt={platDuJour.nom}
                        className="h-72 w-full object-cover md:h-[460px]"
                    />
                    {/* etiquette blanche en haut a gauche (maquette : Inter 40px blanc) */}
                    <span className="absolute left-5 top-5 font-sans text-2xl font-medium text-white md:left-10 md:top-8 md:text-[38px]">
                        Plat du jour:
                    </span>
                    {/* bandeau d information au bas de la photo */}
                    <div className="absolute inset-x-3 bottom-3 rounded-[20px] bg-white/95 p-4 backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
                        <p className="font-inria text-lg font-bold text-black md:text-[26px]">
                            DECOUVREZ NOTRE PLAT DU JOUR:
                        </p>
                        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-inria text-xl font-bold text-or-deep md:text-[28px]">
                                    {platDuJour.nom}
                                </p>
                                <p className="font-inria text-lg font-bold text-or-deep md:text-2xl">
                                    {platDuJour.prix}Fcfa
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => ajouter(platDuJour)}
                                className="rounded-[15px] bg-or-clair px-8 py-4 font-inria text-lg text-black transition-colors hover:bg-or md:text-xl"
                            >
                                {platDuJour.id === ajouteId ? "Ajouté ✓" : "Ajouter au panier"}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* ---------- 3. BANDES EVENEMENTS / PROMOTIONS (#E8E8E8 r10) ---------- */}
            {bandes.map((promo) => (
                <section
                    key={promo.id}
                    className="mt-10 flex flex-col gap-4 rounded-[10px] bg-zone p-4 md:flex-row md:items-center md:gap-6 md:p-6"
                >
                    {/* affiche a gauche (maquette : image 176x118 / promo 175x96) */}
                    <img
                        src={promo.image}
                        alt={promo.etiquette}
                        className="h-40 w-full rounded-[10px] object-cover md:h-[118px] md:w-[176px]"
                    />
                    {/* textes : gros titre Inria Bold 28px + etiquette 15px #535353 */}
                    <div className="flex flex-1 flex-col gap-2">
                        <p className="font-inria text-xl font-bold leading-snug text-black md:text-[28px]">
                            {promo.texte}
                        </p>
                        <span className="font-inria text-sm font-bold text-encre md:text-[15px]">
                            {promo.etiquette}
                        </span>
                    </div>
                    {/* CTA "Je participe" (beige r10) */}
                    <button
                        type="button"
                        onClick={() => participer(promo.id)}
                        className="self-start rounded-[10px] bg-or-clair px-8 py-3 font-inria text-lg text-black transition-colors hover:bg-or md:self-auto md:text-xl"
                    >
                        Je participe
                    </button>
                </section>
            ))}
        </div>
    )
}
