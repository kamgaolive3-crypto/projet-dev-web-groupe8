// La page d accueil reproduit la maquette "Accueil" :
// 1. grille "Menu du jours" (3 cartes raffinees + CTA beige)
// 2. hero "Plat du jour" (photo plein cadre + bandeau clair discret)
// 3. bandes Evenements / Promotions (#E8E8E8)
// tout le contenu affiche vient du backend (articles, evenements)
import { useState, useEffect } from "react";
import usePanier from "../../composantE/usePanier"
import CartePlat from "../../composantE/CartePlat"
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

export default function Accueil() {
    //le plat du jour : menu_du_jour = 1 et categorie = plat (GET /api/article_menu-du-jour/plat)
    const [platDuJour, setPlatDuJour] = useState(null)
    //les promotions et evenements : GET /api/promotions/actives
    const [promotions, setPromotions] = useState([])
    //le menu du jour complet (GET /api/article_menu-du-jour)
    const [menuDuJour, setMenuDuJour] = useState([])
    //message affiche apres un clic sur "Je participe"
    const [message, setMessage] = useState("")
    //recupere l'utilisateur connecte (pour participer aux evenements)
    const { user } = useAuth()
    //recupere la fonction "ajouter" de l'outil panier
    const { ajouter: ajouterAuPanier } = usePanier()
    //id du plat recemment ajoute (feedback "Ajoute ✓")
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
                etiquette: e.type_evenement === "mini_jeu" ? "Mini-jeu" : e.type_evenement === "promotion" ? "Promotions" : "Evenements",
                image: e.affiche_evenement || (e.type_evenement === "promotion" ? promoMaquette : eventMaquette),
                texte: e.description_evenement || (e.taux_reduction ? "Réduction de " + e.taux_reduction + "%" : "Points a gagner : " + e.points_evenement),
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
            setMessage("Participation enregistree ! Points credites : " + reponse.points_gagnes)
        } catch (e) {
            setMessage(e.message)
        }
    }

    //les bandes affichees : evenements puis promotions (ordre de la maquette)
    const bandes = [...promotions.filter((p) => p.bande === "event"), ...promotions.filter((p) => p.bande === "promo")]

    return (
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-14 pt-8 md:px-8">
            {/* message de participation / erreur (toast) */}
            {message && (
                <p
                    className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/85 px-5 py-2.5 text-center font-sans text-[13px] text-white shadow-hover"
                    style={{ animation: "toast-in 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                    {message}
                </p>
            )}

            {/* ---------- 1. MENU DU JOURS ---------- */}
            <section>
                <div className="flex items-baseline justify-between gap-3">
                    <h2 className="miam-titre">Menu du jours</h2>
                    <span className="hidden miam-eyebrow sm:block">Chaque jour, de nouveaux plats</span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {menuDuJour.length === 0 ? (
                        <p className="font-inria text-[14px] text-encre">
                            Le menu du jour n&apos;est pas encore publie — revenez bientot !
                        </p>
                    ) : (
                        menuDuJour.slice(0, 3).map((plat, i) => (
                            <CartePlat
                                key={plat.id}
                                plat={plat}
                                onAjouter={ajouter}
                                ajoute={plat.id === ajouteId}
                                delai={i * 80}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* ---------- 2. PLAT DU JOUR (hero photo + bandeau clair) ---------- */}
            {platDuJour && (
                <section
                    className="relative mt-10 overflow-hidden rounded-2xl shadow-soft"
                    style={{ animation: "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                    {/* photo de fond */}
                    <img
                        src={heroMaquette}
                        alt={platDuJour.nom}
                        className="h-64 w-full object-cover md:h-[400px]"
                    />
                    {/* etiquette blanche en haut a gauche (maquette) */}
                    <span className="absolute left-5 top-5 font-sans text-[20px] font-medium tracking-tight text-white drop-shadow-sm md:left-8 md:top-7 md:text-[26px]">
                        Plat du jour:
                    </span>
                    {/* bandeau d information au bas de la photo (verre clair discret) */}
                    <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2.5 rounded-xl bg-white/90 px-4 py-3 backdrop-blur md:inset-x-5 md:bottom-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
                        <div>
                            <p className="miam-eyebrow">Découvrez notre plat du jour</p>
                            <div className="mt-0.5 flex items-baseline gap-3">
                                <p className="font-inria text-[19px] font-bold text-black md:text-[22px]">
                                    {platDuJour.nom}
                                </p>
                                <p className="font-inria text-[17px] font-bold tracking-tight text-or-deep">
                                    {platDuJour.prix}Fcfa
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => ajouter(platDuJour)}
                            className="miam-cta self-start md:self-auto"
                        >
                            {platDuJour.id === ajouteId ? "Ajouté ✓" : "Ajouter au panier"}
                        </button>
                    </div>
                </section>
            )}

            {/* ---------- 3. BANDES EVENEMENTS / PROMOTIONS ---------- */}
            {bandes.map((promo) => (
                <section
                    key={promo.id}
                    className="mt-8 flex flex-col gap-4 rounded-xl bg-zone p-4 md:flex-row md:items-center md:gap-5"
                >
                    {/* affiche a gauche (maquette) */}
                    <img
                        src={promo.image}
                        alt={promo.etiquette}
                        className="h-32 w-full rounded-lg object-cover md:h-[104px] md:w-[150px]"
                    />
                    {/* textes : titre Inria Bold + petite etiquette */}
                    <div className="flex flex-1 flex-col gap-1.5">
                        <span className="miam-eyebrow">{promo.etiquette}</span>
                        <p className="font-inria text-[17px] font-bold leading-snug text-black md:text-[20px]">
                            {promo.texte}
                        </p>
                    </div>
                    {/* CTA "Je participe" */}
                    <button
                        type="button"
                        onClick={() => participer(promo.id)}
                        className="miam-cta self-start md:self-auto"
                    >
                        Je participe
                    </button>
                </section>
            ))}
        </div>
    )
}
