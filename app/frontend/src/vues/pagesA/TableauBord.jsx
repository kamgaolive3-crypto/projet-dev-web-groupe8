import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../services/auth";

// écrit un montant avec des espaces : 25000 devient "25 000 Fcfa"
const fcfa = (n) => (n ?? 0).toLocaleString("fr-FR") + " Fcfa"

export default function TableauBord() {
    // le rôle connecté décide des statistiques affichées
    const { user } = useAuth()
    const [ventes, setVentes] = useState(null)     // GET /api/stats/ventes-semaine (tout le personnel)
    const [dashboard, setDashboard] = useState(null) // GET /api/stats/dashboard (gerant + admin)
    const [erreur, setErreur] = useState("")

    // au premier affichage : les statistiques
    useEffect(() => {
        api.get("/stats/ventes-semaine")
            .then(setVentes)
            .catch((e) => setErreur(e.message))
        // le tableau de bord complet est réservé au gérant et à l admin
        if (user && user.role !== "employe") {
            api.get("/stats/dashboard").then(setDashboard).catch(() => setDashboard(null))
        }
    }, [])

    if (erreur) {
        return <p className="p-4 md:p-6 text-red-600">{erreur}</p>;
    }
    if (!ventes) {
        return <p className="p-4 md:p-6 text-gray-500">Chargement des statistiques...</p>;
    }

    // la barre la plus grande sert de référence (100 ')
    const nbMax = Math.max(1, ...ventes.par_jour.map((j) => j.nb_commandes));

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* ---------- TITRE ---------- */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h1 className="font-serif text-xl font-bold">Tableau de bord</h1>
                    <p className="text-xs text-gray-600">Semaine du {ventes.periode[0]} au {ventes.periode[1]}</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/Commandes" className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs">Suivi commandes</Link>
                    <Link to="/Livraisons" className="rounded-full border border-[#CFBD97] px-4 py-1 text-xs">Livraisons</Link>
                </div>
            </div>

            {/* ---------- CARTES CA (gerant / admin seulement) ---------- */}
            {dashboard && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-xs text-gray-500">Chiffre d affaires du jour</p>
                        <p className="mt-1 text-2xl font-bold text-[#b8862d]">{fcfa(dashboard.jour.ca)}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-xs text-gray-500">Sur la semaine</p>
                        <p className="mt-1 text-2xl font-bold text-[#b8862d]">{fcfa(dashboard.semaine.ca)}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-xs text-gray-500">Sur le mois</p>
                        <p className="mt-1 text-2xl font-bold text-[#b8862d]">{fcfa(dashboard.mois.ca)}</p>
                    </div>
                </div>
            )}

            {/* ---------- SEMAINE : COMMANDES PAR JOUR ---------- */}
            <section className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-baseline justify-between">
                    <h2 className="font-serif text-sm font-semibold">Commandes des 7 derniers jours</h2>
                    <span className="text-xs text-gray-500">{ventes.total_commandes} commandes · {fcfa(ventes.ca_total)}</span>
                </div>
                {/* une barre par jour : plus le jour a de commandes, plus la barre est large */}
                <div className="flex flex-col gap-2">
                    {ventes.par_jour.length === 0 && <p className="text-xs text-gray-500">Aucune commande cette semaine.</p>}
                    {ventes.par_jour.map((j) => (
                        <div key={j.jour} className="flex items-center gap-2 text-xs">
                            <span className="w-24 text-gray-500">{j.jour}</span>
                            <div className="flex-1 rounded-full bg-[#efe6d0]">
                                <div
                                    className="h-4 rounded-full bg-[#CFBD97]"
                                    style={{ width: Math.round((j.nb_commandes / nbMax) * 100) + "%" }}
                                />
                            </div>
                            <span className="w-28 text-right text-gray-600">{j.nb_commandes} cmd · {fcfa(j.chiffre_affaires)}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- DEUX COLONNES : STATUTS + TOP ARTICLES ---------- */}
            <div className="grid gap-4 md:grid-cols-2">
                <section className="rounded-xl bg-white p-4 shadow-sm">
                    <h2 className="mb-2 font-serif text-sm font-semibold">Commandes par statut (semaine)</h2>
                    <ul className="text-sm">
                        {ventes.par_statut.length === 0 && <li className="text-xs text-gray-500">Rien à afficher.</li>}
                        {ventes.par_statut.map((s) => (
                            <li key={s.statut_commande} className="flex justify-between border-b border-[#efe6d0] py-1.5">
                                <span>{s.statut_commande}</span>
                                <b>{s.total}</b>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="rounded-xl bg-white p-4 shadow-sm">
                    <h2 className="mb-2 font-serif text-sm font-semibold">Top 3 articles de la semaine</h2>
                    <ol className="text-sm">
                        {ventes.top_articles.length === 0 && <li className="text-xs text-gray-500">Aucune vente.</li>}
                        {ventes.top_articles.map((a, i) => (
                            <li key={a.nom_article} className="flex justify-between border-b border-[#efe6d0] py-1.5">
                                <span>{i + 1}. {a.nom_article}</span>
                                <b>{a.vendus} vendus</b>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </div>
    )
}
