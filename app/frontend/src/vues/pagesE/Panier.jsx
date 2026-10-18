//importe un hook qui permet de memoriser une valeur
import { useState } from "react"
//importe link : permet de changer de page sans recharger le navigateur
import { Link } from "react-router-dom"
//importe l'outil qui gère le panier (partagé entre toutes les pages)
import usePanier from "../../composantE/usePanier"
//importe les règles du programme de fidélité affichées sous le formulaire
import { api } from "../../services/api"
import { useAuth } from "../../services/auth";

//valeur de test : le vrai montant sera donné par le gérant (API PHP)
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
    //réduction en F : 15 points => 1000 F (calcs comme le backend)
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
        <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* ---------- TITRE + BOUTON HISTORIQUE ---------- */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-serif text-xl font-bold">🛒 Mon panier</h1>
                    <p className="text-xs text-gray-600">Vérifiez vos plats avant de passer commande</p>
                </div>
                {/* le chemin "/historique" est à adapter à tes routes */}
                <Link to="/Historique" className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs">
                    🕒 Historique des commandes
                </Link>
            </div>

            {/* messages (affichés seulement s'il y en a) */}
            {message && (
                <p className="rounded-md bg-green-100 px-3 py-2 text-center text-sm text-green-800">{message}</p>
            )}
            {erreur && (
                <p className="rounded-md bg-red-100 px-3 py-2 text-center text-sm text-red-700">
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
                <div className="rounded-xl border border-[#e3dac6] bg-white py-12">
                    <p className="text-center font-serif text-2xl">Votre panier est vide</p>
                </div>
            ) : (
                //1 colonne sur téléphone, 3 parts à partir de md : liste = 2 parts, colonne de droite = 1 part
                <div className="grid gap-6 md:grid-cols-3">
                    {/* ---------- LISTE DES ARTICLES ---------- */}
                    <section className="flex flex-col gap-3 rounded-xl border border-[#e3dac6] bg-white p-4 md:col-span-2">
                        {panier.map((article) => (
                            <div key={article.id} className="flex items-center gap-3 rounded-lg bg-[#f5f1e6] p-3">
                                <img
                                    src={article.image}
                                    alt={article.nom}
                                    className="h-16 w-16 rounded-lg object-cover md:h-20 md:w-20"
                                />

                                <div className="flex-1 text-sm">
                                    <p className="font-serif font-semibold">{article.nom}</p>
                                    <p className="font-bold">{fcfa(article.prix)}</p>
                                    <p className="text-xs text-gray-500">Restaurant : {article.restaurant}</p>
                                </div>

                                {/* - quantité + */}
                                <div className="flex items-center gap-1 text-sm">
                                    <button
                                        onClick={() => changerQuantite(article.id, article.quantite - 1)}
                                        className="h-6 w-6 rounded-full bg-[#CFBD97]"
                                    >
                                        -
                                    </button>
                                    <span className="w-6 text-center">{article.quantite}</span>
                                    <button
                                        onClick={() => changerQuantite(article.id, article.quantite + 1)}
                                        className="h-6 w-6 rounded-full bg-[#CFBD97]"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* poubelle : retire l'article */}
                                <button onClick={() => retirer(article.id)} aria-label="Retirer">
                                    🗑
                                </button>
                            </div>
                        ))}
                    </section>

                    {/* ---------- COLONNE DE DROITE ---------- */}
                    <aside className="flex h-fit flex-col gap-4 rounded-xl border border-[#e3dac6] bg-white p-4">
                        {/* finalisation */}
                        <div>
                            <h2 className="mb-2 text-center font-serif text-sm font-semibold">
                                Finalisation de la commande
                            </h2>
                            <div className="flex flex-col gap-2 rounded-md bg-[#f5f1e6] p-3 text-xs">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={mode === "surPlace"}
                                        onChange={() => setMode("surPlace")}
                                    />
                                    Sur place
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={mode === "livraison"}
                                        onChange={() => setMode("livraison")}
                                    />
                                    Livraison
                                </label>
                                <label className="flex items-center gap-2">
                                    Heure d'arrivée
                                    <input
                                        type="time"
                                        value={heure}
                                        onChange={(e) => setHeure(e.target.value)}
                                        className="rounded border border-[#CFBD97] px-1"
                                    />
                                </label>
                                <label className="flex flex-col gap-1">
                                    Points à utiliser (tanches de 15)
                                    <input
                                        type="number"
                                        min="0"
                                        step="15"
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        className="rounded border border-[#CFBD97] px-1"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* récapitulatif */}
                        <div>
                            <h2 className="mb-2 text-center font-serif text-sm font-semibold">
                                Récapitulatif de la commande
                            </h2>
                            <div className="flex flex-col gap-2 rounded-md bg-[#f5f1e6] p-3 text-xs">
                                <div className="flex justify-between">
                                    <span>Sous-total</span>
                                    <b>{fcfa(total)}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span>Réduction points</span>
                                    <b>- {fcfa(reduction)}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span>Frais de livraison</span>
                                    <b>{fcfa(frais)}</b>
                                </div>
                                <div className="flex justify-between border-t border-[#CFBD97] pt-2">
                                    <span>Total</span>
                                    <b>{fcfa(totalFinal)}</b>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={confirmer}
                            disabled={envoi}
                            className="rounded-full bg-[#CFBD97] py-2 text-sm font-medium disabled:opacity-50"
                        >
                            {envoi ? "Envoi en cours..." : "Confirmer ma commande >"}
                        </button>
                    </aside>
                </div>
            )}

            {/* ---------- APRES COMMANDE (toujours affiché) ---------- */}
            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">Après commande</h2>
                <div className="rounded-xl border border-[#CFBD97] bg-[#fffdf5] p-4">
                    <h3 className="font-serif font-semibold">⚠ Une réclamation ?</h3>
                    <p className="mt-1 text-xs text-gray-600">
                        Vous avez un problème avec votre commande (erreur, plat manquant, hygiène, etc.) ?
                        Faites une réclamation en un clic.
                    </p>
                    <div className="mt-3 flex justify-end">
                        {/* le chemin "/reclamation" est à adapter à tes routes */}
                        <Link
                            to="/Reclamation"
                            className="rounded-full border border-[#CFBD97] px-4 py-1 text-xs"
                        >
                            Faire une réclamation &gt;
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
