import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../services/auth";

// libellés des statuts de réclamation
const libelles = {
    en_attente: "En attente",
    observation: "Observation (gérant décide)",
    validee: "Validée",
    rejetee: "Rejetée",
};

export default function Reclamation() {
    const { user } = useAuth()
    const [liste, setListe] = useState([])
    const [erreur, setErreur] = useState("")
    const [message, setMessage] = useState("")
    // la réponse en cours d écriture (par réclamation)
    const [reponses, setReponses] = useState({})

    const charger = () => {
        api.get("/reclamation")
            .then((l) => setListe(Array.isArray(l) ? l : l.data || []))
            .catch((e) => setErreur(e.message))
    }
    useEffect(charger, [])

    const saisie = (id, valeur) => setReponses({ ...reponses, [id]: valeur })

    // PHASE 1 : l employé traite (POST .../traiter) ; l admin peut aussi retraiter
    const traiter = async (r) => {
        setMessage(""); setErreur("")
        try {
            await api.post("/reclamation/" + encodeURIComponent(r.Id_reclamation) + "/traiter",
                { reponse: reponses[r.Id_reclamation] || "" })
            setMessage("Réclamation passée en observation pour le gérant.")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    // PHASE 2 : le gérant (ou l admin) décide : validee / rejetee
    const decisionGerant = async (id, decision) => {
        setMessage(""); setErreur("")
        try {
            await api.post("/reclamation/" + encodeURIComponent(id) + "/decision-gerant", { decision })
            setMessage("Décision enregistrée : " + decision + " (gérant).")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    // PHASE ADMIN : retraiter la réponse (traiterAdmin)
    const traiterAdmin = async (r) => {
        setMessage(""); setErreur("")
        try {
            await api.post("/reclamation/" + encodeURIComponent(r.Id_reclamation) + "/traiter-admin",
                { reponse: reponses[r.Id_reclamation] || "" })
            setMessage("Réponse administrative enregistrée.")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    // PHASE 3 : décision administrative finale (decisionAdmin)
    const decisionAdmin = async (id, decision) => {
        setMessage(""); setErreur("")
        try {
            await api.post("/reclamation/" + encodeURIComponent(id) + "/decision-admin", { decision })
            setMessage("Décision admin enregistrée : " + decision + ".")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            <div>
                <h1 className="font-serif text-xl font-bold">Traitement des réclamations</h1>
                <p className="text-xs text-gray-600">
                    Étape 1 : employé · Étape 2 : gérant · Étape 3 : administrateur (US-021 / US-038)
                </p>
            </div>

            {message && <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">{message}</p>}
            {erreur && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{erreur}</p>}

            {liste.length === 0 ? (
                <p className="text-sm text-gray-600">Aucune réclamation.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {liste.map((r) => (
                        <div key={r.Id_reclamation} className="rounded-xl bg-white p-4 text-sm shadow-sm">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p className="font-semibold">
                                    {r.Id_reclamation} · commande {r.Id_commande}
                                    <span className="ml-2 rounded-full bg-[#f5f1e6] px-2 py-0.5 text-xs">{libelles[r.statut_reclamation] || r.statut_reclamation}</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(r.date_reclamation || "").slice(0, 16).replace("T", " ")} · {r.etudiant?.nom ?? ""} {r.etudiant?.prenom ?? ""}
                                </p>
                            </div>
                            <p className="mt-2 text-xs"><b>Motif :</b> {r.motif_reclamation}</p>
                            <p className="mt-1 text-xs text-gray-600"><b>Description :</b> {r.description_reclamation}</p>
                            {r.reponse_reclamation && (
                                <p className="mt-1 rounded bg-[#f5f1e6] text-xs"><b>Réponse déjà écrite :</b> {r.reponse_reclamation}</p>
                            )}

                            {/* zone de réponse partagée entre les étapes */}
                            {((r.statut_reclamation === "en_attente" && user?.role !== "etudiant")
                                || (user?.role === "administrateur" && r.statut_reclamation !== "validee" && r.statut_reclamation !== "rejetee")) && (
                                <textarea
                                    rows={2}
                                    placeholder="Écrire la réponse / observation"
                                    value={reponses[r.Id_reclamation] ?? ""}
                                    onChange={(e) => saisie(r.Id_reclamation, e.target.value)}
                                    className="mt-2 w-full rounded-md border border-[#CFBD97] px-2 py-1 text-xs"
                                />
                            )}

                            {/* boutons possibles selon le rôle + le statut */}
                            <div className="mt-2 flex flex-wrap gap-2">
                                {/* employé (ou admin sur une réclamation encore en attente) : traiter */}
                                {(r.statut_reclamation === "en_attente") && user?.role !== "etudiant" && (
                                    <button onClick={() => traiter(r)}
                                        className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs text-white">
                                        Traiter (étape employé)
                                    </button>
                                )}
                                {/* gérant / admin : décision sur une réclamation en observation */}
                                {(r.statut_reclamation === "observation") && (user?.role === "gerant" || user?.role === "administrateur") && (
                                    <>
                                        <button onClick={() => decisionGerant(r.Id_reclamation, "validee")}
                                            className="rounded-full bg-green-600 px-4 py-1 text-xs text-white">Gérant : valider</button>
                                        <button onClick={() => decisionGerant(r.Id_reclamation, "rejetee")}
                                            className="rounded-full bg-red-600 px-4 py-1 text-xs text-white">Gérant : rejeter</button>
                                    </>
                                )}
                                {/* admin : retraiter la réponse puis décision finale */}
                                {user?.role === "administrateur" && (
                                    <>
                                        <button onClick={() => traiterAdmin(r)}
                                            className="rounded-full border border-[#CFBD97] px-4 py-1 text-xs">Admin : réecrire la réponse</button>
                                        <button onClick={() => decisionAdmin(r.Id_reclamation, "validee")}
                                            className="rounded-full bg-green-700 px-4 py-1 text-xs text-white">Admin : valider</button>
                                        <button onClick={() => decisionAdmin(r.Id_reclamation, "rejetee")}
                                            className="rounded-full bg-red-700 px-4 py-1 text-xs text-white">Admin : rejeter</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
