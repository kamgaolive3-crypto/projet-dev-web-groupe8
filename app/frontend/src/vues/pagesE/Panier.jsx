// Page Panier reproduisant la maquette :
// titre "Mon panier" (Inter Bold 40px) + pill "Historiques des commandes >" ;
// liste d articles (lignes #F4F4F4 r10 : photo, nom Inria Bold 24px,
// description 14px #535353, prix Inria Bold 32px, compteur beige/beiges) ;
// colonne Finalisation (mode, heure, points) + Recapitulatif + CTA or r15 ;
// bande "Apres commande" (#FFFDF8 r20) vers la reclamation
import { useState } from "react"
import { Link } from "react-router-dom"
import usePanier from "../../composantE/usePanier"
import { api } from "../../services/api"
import { useAuth } from "../../services/auth";

// valeur de test : le vrai montant sera donné par le gérant (API PHP)
const FRAIS_LIVRAISON = 1000

//écrit un nombre avec des espaces : 6000 devient "6 000 Fcfa"
const fcfa = (n) => n.toLocaleString("fr-FR") + " Fcfa"

export default function Panier() {
    //récupère ce dont on a besoin dans l outil panier
    const { panier, changerQuantite, retirer, vider, total } = usePanier()
    //auth : passer une commande exige d être connecté
    const { user } = useAuth()

    //---------------- ETATS DE LA PAGE ----------------
    //mode choisi : "surPlace" ou "livraison"
    const [mode, setMode] = useState("surPlace")
    //heure d'arrivée au format "17:00"
    const [heure, setHeure] = useState("17:00")
    //points de fidélité à dépenser (multiple de 15 = 1 réduction de 1000 F)
    const [points, setPoints] = useState(0)
    //message affiché après avoir confirmé la commande
    const [message, setMessage] = useState("")
    //message d'erreur (ex : requêtes refusées ou pas connecté)
    const [erreur, setErreur] = useState("")
    //true pendant l envoi à l API (pour désactiver le bouton)
    const [envoi, setEnvoi] = useState(false)

    //---------------- CALCULS ----------------
    //0 si on mange sur place, sinon les frais de livraison
    const frais = mode === "livraison" ? FRAIS_LIVRAISON : 0
    //réduction en F : 15 points => 1000 F (calc comme le backend)
    const reduction = Math.floor(points / 15) * 1000
    const totalFinal = Math.max(total + frais - reduction, 0)

    //---------------- ACTIONS ----------------
    //fonction appellée quand on clique sur "Confirmer ma commande"
    //POST /api/commande : le backend revalide TOUT (articles, prix, solde, même restaurant)
    const confirmer = async () => {
        if (!user) {
            setErreur("Connectez-vous pour passer commande.")
            return
        }
        //tous les articles du panier doivent venir du même restaurant
        const restaurants = [...new Set(panier.map((p) => p.restaurant))]
        if (restaurants.length > 1) {
            setErreur("Votre panier contient des articles de restaurants différents. Un panier = un restaurant.")
            return
        }
        //points : multiple de 15, jamais plus que ce qu on peut réduire ni que notre solde
        const pointsUtilises = Math.max(0, Math.round(points))
        if (pointsUtilises % 15 !== 0) {
            setErreur("Les points doivent être un multiple de 15 (1 tranche = 1000 F).")
            return
        }
        setEnvoi(true)
        setErreur("")
        try {
            //1. envoi réel : POST /api/commande
            const commande = await api.post("/commande", {
                items: panier.map((p) => ({ Id_article: p.id, quantite: p.quantite })),
                Id_restaurant: restaurants[0],
                mode_service: mode === "surPlace" ? "sur_place" : "livraison",
                heure_recup: mode === "surPlace" ? heure : null,
                points_utilises: pointsUtilises,
            })
            //2. on vide le panier
            vider()
            setPoints(0)
            //3. on affiche la confirmation avec le vrai numero de commande renvoyé par l API
            setMessage("Commande " + commande.Id_commande + " enregistrée ! Vous avez gagné des points.")
        } catch (e) {
            // validation Laravel : { Id_restaurant: [...], items.0.quantite: [...] }
            const detail = e.champs ? Object.values(e.champs).flat().join(" - ") : null
            setErreur(detail || e.message || "Commande refusée par le serveur")
        } finally {
            setEnvoi(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-14 pt-8 md:px-8">
            {/* ---------- TITRE + BOUTON HISTORIQUE ---------- */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="font-sans text-3xl font-bold text-black md:text-[40px]">
                        Mon panier
                    </h1>
                    <p className="mt-1 font-inria text-sm font-bold text-encre md:text-[14px]">
                        Verifiez vos plats avant de passer commande
                    </p>
                </div>
                {/* pill beige vers l historique (maquette 379x58 r15) */}
                <Link
                    to="/Historique"
                    className="inline-flex items-center rounded-[15px] bg-or-clair px-7 py-4 font-sans text-base text-black transition-colors hover:bg-or md:text-xl"
                >
                    Historiques des commandes &gt;
                </Link>
            </div>

            {/* messages (affichés seulement s'il y en a) */}
            {message && (
                <p className="mt-5 rounded-[15px] bg-green-100 px-4 py-3 text-center font-inria text-base text-green-800">
                    {message}
                </p>
            )}
            {erreur && (
                <p className="mt-5 rounded-[15px] bg-red-100 px-4 py-3 text-center font-inria text-base text-red-700">
                    {erreur}
                    {/* pas connecté : lien direct vers la connexion */}
                    {!user && (
                        <Link to="/page_connexion" className="ml-2 font-semibold underline">
                            Se connecter
                        </Link>
                    )}
                </p>
            )}

            {/* ---------- PANIER VIDE OU PANIER REMPLI ---------- */}
            {panier.length === 0 ? (
                <div className="mt-6 rounded-[20px] bg-white py-14 text-center">
                    <p className="font-inria text-2xl text-encre">Votre panier est vide</p>
                </div>
            ) : (
                //1 colonne sur téléphone, liste 2 parts + colonne 1 part à partir de lg
                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {/* ---------- LISTE DES ARTICLES (carte blanche r20) ---------- */}
                    <section className="flex flex-col gap-4 rounded-[20px] bg-white p-4 md:p-6 lg:col-span-2">
                        {/* une ligne = #F4F4F4 r10 (maquette 638x186) */}
                        {panier.map((article) => (
                            <div
                                key={article.id}
                                className="flex flex-wrap items-center gap-4 rounded-[10px] bg-ligne p-4"
                            >
                                <img
                                    src={article.image}
                                    alt={article.nom}
                                    className="h-20 w-28 rounded-[10px] object-cover md:h-24 md:w-32"
                                />

                                {/* nom Inria Bold 24px + description 14px */}
                                <div className="min-w-[180px] flex-1">
                                    <p className="font-inria text-lg font-bold text-black md:text-[24px]">
                                        {article.nom}
                                    </p>
                                    {article.description && (
                                        <p className="mt-0.5 font-inria text-xs font-bold text-encre md:text-sm">
                                            {article.description}
                                        </p>
                                    )}
                                </div>

                                {/* prix unitaire (Inria Bold 32px) */}
                                <p className="font-inria text-xl font-bold text-black md:text-[30px]">
                                    {article.prix}Fcfa
                                </p>

                                {/* compteur : chip beige (quantite) + boites -/+ beiges */}
                                <div className="flex items-center gap-2">
                                    <span className="min-w-9 rounded-full bg-beige px-3 py-1.5 text-center font-sans text-sm font-semibold text-black">
                                        {article.quantite}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => changerQuantite(article.id, article.quantite - 1)}
                                        aria-label="Retirer un"
                                        className="h-8 w-8 rounded-[5px] bg-band font-sans text-xl text-black hover:bg-filet"
                                    >
                                        −
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => changerQuantite(article.id, article.quantite + 1)}
                                        aria-label="Ajouter un"
                                        className="h-8 w-8 rounded-[5px] bg-band font-sans text-xl text-black hover:bg-filet"
                                    >
                                        +
                                    </button>
                                    {/* poubelle : retire l'article */}
                                    <button
                                        type="button"
                                        onClick={() => retirer(article.id)}
                                        aria-label="Retirer l'article"
                                        className="h-8 w-8 rounded-[5px] text-lg text-encre hover:text-red-600"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* rappel du programme (maquette sous la liste) */}
                        <p className="mt-1 font-inria text-xs font-bold text-encre md:text-sm">
                            Verifiez vos plats avant de passer commande
                        </p>
                    </section>

                    {/* ---------- COLONNE DE DROITE ---------- */}
                    <aside className="flex h-fit flex-col gap-5">
                        {/* finalisation : carte blanche r20 (maquette 459x686) */}
                        <div className="rounded-[20px] bg-white p-5 md:p-6">
                            <h2 className="font-inria text-lg font-bold text-black md:text-[24px]">
                                Finalisation de la commande
                            </h2>
                            <div className="mt-4 flex flex-col gap-3 rounded-[10px] bg-ligne p-4 font-sans text-sm text-encre md:text-base">
                                {/* mode de service */}
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={mode === "surPlace"}
                                        onChange={() => setMode("surPlace")}
                                        className="accent-[#C49E4C]"
                                    />
                                    Sur place
                                </label>
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={mode === "livraison"}
                                        onChange={() => setMode("livraison")}
                                        className="accent-[#C49E4C]"
                                    />
                                    Livraison
                                </label>
                                {/* heure d arrivee (sur place) */}
                                <label className="flex flex-col gap-1">
                                    heure d&apos;arrivee
                                    <input
                                        type="time"
                                        value={heure}
                                        onChange={(e) => setHeure(e.target.value)}
                                        className="w-full rounded-[10px] border border-filet bg-white px-3 py-2"
                                    />
                                </label>
                                {/* points a utiliser */}
                                <label className="flex flex-col gap-1">
                                    Points a utiliser (tranches de 15)
                                    <input
                                        type="number"
                                        min="0"
                                        step="15"
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        className="w-full rounded-[10px] border border-filet bg-white px-3 py-2"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* recapitulatif */}
                        <div className="rounded-[20px] bg-white p-5 md:p-6">
                            <h2 className="font-inria text-lg font-bold text-black md:text-[24px]">
                                Recapitulatif de la commande
                            </h2>
                            <div className="mt-4 flex flex-col gap-2 font-sans text-sm md:text-base">
                                <div className="flex justify-between text-encre">
                                    <span>Sous-total</span>
                                    <b className="text-black">{fcfa(total)}</b>
                                </div>
                                <div className="flex justify-between text-encre">
                                    <span>Réduction points</span>
                                    <b className="text-black">- {fcfa(reduction)}</b>
                                </div>
                                <div className="flex justify-between text-encre">
                                    <span>Frais de livraison</span>
                                    <b className="text-black">{fcfa(frais)}</b>
                                </div>
                                <div className="mt-2 flex justify-between border-t border-filet pt-3 text-encre">
                                    <span className="font-bold">Total</span>
                                    <b className="text-lg text-black">{fcfa(totalFinal)}</b>
                                </div>
                            </div>
                        </div>

                        {/* CTA commande : pill or r15 (maquette 394x79) */}
                        <button
                            type="button"
                            onClick={confirmer}
                            disabled={envoi}
                            className="rounded-[15px] bg-or py-5 font-inria text-lg text-black transition-colors hover:bg-or-deep disabled:opacity-50 md:text-xl"
                        >
                            {envoi ? "Envoi en cours..." : "Confirmer ma commande"}
                        </button>
                    </aside>
                </div>
            )}

            {/* ---------- APRES COMMANDE (toujours affiché) ---------- */}
            <section className="mt-12">
                <h2 className="font-sans text-2xl font-bold text-black md:text-[40px]">
                    Apres commande
                </h2>
                {/* carte creme #FFFDF8 r20 (maquette 901x265) */}
                <div className="mt-4 rounded-[20px] bg-creme-d p-6 md:p-8">
                    <h3 className="font-inria text-xl font-bold text-black md:text-[32px]">
                        Une reclamation?
                    </h3>
                    <p className="mt-2 max-w-3xl font-sans text-sm font-light text-encre md:text-xl">
                        Vous avez un probleme avec votre commande (erreur, plat manquant, hygiene, etc) ?
                        Faite une reclamation en un clic.
                    </p>
                    <div className="mt-5">
                        {/* pill blanche "Faire une reclamation >" (maquette 317x62 r15) */}
                        <Link
                            to="/Reclamation"
                            className="inline-flex items-center rounded-[15px] bg-white px-8 py-4 font-sans text-base text-or shadow-sm transition-colors hover:bg-or-clair/30 md:text-xl"
                        >
                            Faire une reclamation &gt;
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
