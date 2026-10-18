//importe un hook qui permet de memoriser une valeur
import { useState } from "react"
//importe link : permet de changer de page sans recharger le navigateur
import { Link } from "react-router-dom"
//importe l'outil qui gère le panier (partagé entre toutes les pages)
import usePanier from "../../composantE/usePanier"
//importe l'outil qui garde les commandes passées (utilisé aussi par la page Historique)
import useCommandes from "../../composantE/useCommandes"

//valeur de test : le vrai montant sera donné par le gérant (API PHP)
const FRAIS_LIVRAISON = 1000

//écrit un nombre avec des espaces : 6000 devient "6 000 Fcfa"
const fcfa = (n) => n.toLocaleString("fr-FR") + " Fcfa"

export default function Panier() {
    //récupère ce dont on a besoin dans l'outil panier
    const { panier, changerQuantite, retirer, vider, total } = usePanier()
    //récupère la fonction qui enregistre une commande dans l'historique
    const { ajouterCommande } = useCommandes()

    //---------------- ETATS DE LA PAGE ----------------
    //mode choisi : "surPlace" ou "livraison"
    const [mode, setMode] = useState("surPlace")
    //heure d'arrivée au format "17:00"
    const [heure, setHeure] = useState("17:00")
    //message affiché après avoir confirmé la commande
    const [message, setMessage] = useState("")

    //---------------- CALCULS ----------------
    //0 si on mange sur place, sinon les frais de livraison
    const frais = mode === "livraison" ? FRAIS_LIVRAISON : 0
    const totalFinal = total + frais

    //---------------- ACTIONS ----------------
   //---------------- ACTIONS ----------------
//fonction appellée quand on clique sur "Confirmer ma commande"
//plus tard : la commande sera envoyée à l'API PHP (qui recalculera le total)
const confirmer = () => {
    //1. on enregistre la commande AVANT de vider (sinon le panier serait déjà vide)
    ajouterCommande({ articles: panier, total: totalFinal, mode, heure })
    //2. on vide le panier
    vider()
    //3. on affiche la confirmation
    setMessage("Votre commande a bien été enregistrée !")
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
                <Link to="/Hsistorique" className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs text-white transition-colors hover:bg-primary-700">
                    🕒 Historique des commandes
                </Link>
            </div>

            {/* message de confirmation (affiché seulement s'il y en a un) */}
            {message && (
                <p className="rounded-md bg-green-100 px-3 py-2 text-center text-sm text-green-800">{message}</p>
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
                                </div>

                                {/* - quantité + */}
                                <div className="flex items-center gap-1 text-sm">
                                    <button
                                        onClick={() => changerQuantite(article.id, article.quantite - 1)}
                                        className="h-6 w-6 rounded-full bg-[#CFBD97]  transition-colors hover:bg-primary-700"
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
                            className="rounded-full bg-[#CFBD97] py-2 text-sm font-medium  transition-colors hover:bg-primary-700"
                        >
                            Confirmer ma commande &gt;
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
                            to="/reclamation"
                            className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs text-white transition-colors hover:bg-primary-700"
                        >
                            Faire une réclamation &gt;
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}