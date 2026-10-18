import { useState, useEffect } from "react";
import { api } from "../../services/api";

// libellés lisibles pour les statuts de la base
const libelles = {
    en_attente: "En attente",
    validee: "Validée",
    en_preparation: "En préparation",
    prete: "Prête",
    en_livraison: "En livraison",
    servie: "Servie",
    annulee: "Annulée",
};

// transitions possibles : les MEMES règles que le backend (changerStatut)
const transitions = {
    en_attente: ["validee", "annulee"],
    validee: ["en_preparation", "annulee"],
    en_preparation: ["prete"],
    prete: ["en_livraison", "servie"],
    en_livraison: ["servie"],
};

export default function Commandes() {
    const [commandes, setCommandes] = useState([])
    const [filtre, setFiltre] = useState("")
    const [erreur, setErreur] = useState("")
    const [message, setMessage] = useState("")

    // chargement des commandes (le personnel voit TOUTES les commandes)
    const charger = () => {
        api.get("/commande")
            .then((liste) => setCommandes(Array.isArray(liste) ? liste : liste.data || []))
            .catch((e) => setErreur(e.message))
    }
    useEffect(charger, [])

    // valider une commande en attente : POST /api/commande/{id}/valider
    const valider = async (id) => {
        setMessage(""); setErreur("")
        try {
            await api.post("/commande/" + encodeURIComponent(id) + "/valider", {})
            setMessage("Commande " + id + " validée.")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    // changer le statut : POST /api/commande/{id}/statut
    const changerStatut = async (id, statut) => {
        setMessage(""); setErreur("")
        try {
            await api.post("/commande/" + encodeURIComponent(id) + "/statut", { statut_commande: statut })
            setMessage("Commande " + id + " : statut mis à " + (libelles[statut] || statut).toLowerCase() + ".")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    // filtre statut + tri récent en premier (le backend trie déjà)
    const commandesAffichees = filtre
        ? commandes.filter((c) => c.statut_commande === filtre)
        : commandes

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            <div>
                <h1 className="font-serif text-xl font-bold">Suivi des commandes</h1>
                <p className="text-xs text-gray-600">Valider les attestations en attente puis suivre le service (US-026)</p>
            </div>

            {message && <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">{message}</p>}
            {erreur && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{erreur}</p>}

            {/* ---------- FILTRES ---------- */}
            <div className="flex flex-wrap gap-2">
                <button onClick={() => setFiltre("")}
                    className={"rounded-full border border-[#CFBD97] px-4 py-1 text-xs " + (filtre === "" ? "bg-[#CFBD97] text-white" : "bg-white text-gray-800")}>
                    Toutes
                </button>
                {Object.keys(transitions).map((s) => (
                    <button key={s} onClick={() => setFiltre(s)}
                        className={"rounded-full border border-[#CFBD97] px-4 py-1 text-xs " + (filtre === s ? "bg-[#CFBD97] text-white" : "bg-white text-gray-800")}>
                        {libelles[s]}
                    </button>
                ))}
            </div>

            {/* ---------- LISTE ---------- */}
            {commandesAffichees.length === 0 ? (
                <p className="text-sm text-gray-600">Aucune commande pour ce filtre.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {commandesAffichees.map((c) => (
                        <div key={c.Id_commande} className="rounded-xl bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="font-semibold">{c.Id_commande}
                                        <span className="ml-2 rounded-full bg-[#f5f1e6] px-2 py-0.5 text-xs">{libelles[c.statut_commande] || c.statut_commande}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(c.date_commande || "").slice(0, 16).replace("T", " ")} · {c.mode_service === "livraison" ? "livraison" : "sur place"}{c.heure_recup ? " · " + c.heure_recup : ""}
                                    </p>
                                </div>
                                <p className="font-bold text-[#b8862d]">{(c.montant_total ?? 0).toLocaleString("fr-FR")} Fcfa</p>
                            </div>

                            {/* les articles de la commande */}
                            <p className="mt-2 text-xs text-gray-600">
                                {(c.articles || []).map((a) => (a.pivot?.quantite ?? a.quantite ?? 1) + "x " + a.nom_article).join(", ") || "Aucun article."}
                            </p>

                            {/* actions selon le statut : valider ou changer de statut */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {c.statut_commande === "en_attente" && (
                                    <button onClick={() => valider(c.Id_commande)}
                                        className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs text-white hover:brightness-95">
                                        Valider la commande
                                    </button>
                                )}
                                {(transitions[c.statut_commande] || []).map((s) => (
                                    <button key={s} onClick={() => changerStatut(c.Id_commande, s)}
                                        className="rounded-full border border-[#CFBD97] px-3 py-1 text-xs hover:bg-[#f5f1e6]">
                                        {s === "annulee" ? "Annuler" : "Passer à " + (libelles[s] || s).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
