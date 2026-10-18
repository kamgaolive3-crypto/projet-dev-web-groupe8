import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../services/auth";

export default function Employes() {
    const { user } = useAuth()
    const [liste, setListe] = useState([])
    const [erreur, setErreur] = useState("")
    const [message, setMessage] = useState("")
    // formulaire de création (POST /api/employes)
    const [form, setForm] = useState({
        nom: "", prenom: "", email: "", telephone: "",
        mot_de_passe: "", poste: "", date_embauche: "",
    })

    const charger = () => {
        api.get("/employes")
            .then((l) => setListe(Array.isArray(l) ? l : l.data || []))
            .catch((e) => setErreur(e.message))
    }
    useEffect(charger, [])

    const creer = async () => {
        setMessage(""); setErreur("")
        try {
            await api.post("/employes", form)
            setMessage("Employé créé : " + form.email)
            setForm({ nom: "", prenom: "", email: "", telephone: "", mot_de_passe: "", poste: "", date_embauche: "" })
            charger()
        } catch (e) {
            const detail = e.champs ? Object.values(e.champs).flat().join(" - ") : null
            setErreur(detail || e.message)
        }
    }

    // changer le poste ou le statut du compte (PUT /api/employes/{id})
    const maj = async (id, corps) => {
        setMessage(""); setErreur("")
        try {
            await api.put("/employes/" + encodeURIComponent(id), corps)
            setMessage("Employé mis à jour.")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    // supprimer un employé (réservé à l administrateur)
    const supprimer = async (id) => {
        setMessage(""); setErreur("")
        try {
            await api.del("/employes/" + encodeURIComponent(id))
            setMessage("Employé supprimé.")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            <div>
                <h1 className="font-serif text-xl font-bold">Comptes employés</h1>
                <p className="text-xs text-gray-600">Le gérant crée et gère son équipe ; l administrateur a tous les droits (US-031/034)</p>
            </div>

            {message && <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">{message}</p>}
            {erreur && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{erreur}</p>}

            {/* ---------- CREATION ---------- */}
            <section className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
                {[
                    ["nom", "Nom"], ["prenom", "Prénom"], ["email", "Email"],
                    ["telephone", "Téléphone (6xxxxxxxx)"], ["poste", "Poste (ex : livreur)"], ["date_embauche", "Date d embauche (facultatif)"],
                ].map(([champ, libelle]) => (
                    <div key={champ} className="flex flex-col gap-1 text-xs">
                        <label>{libelle}</label>
                        <input value={form[champ]} onChange={(e) => setForm({ ...form, [champ]: e.target.value })}
                            type={champ === "date_embauche" ? "date" : "text"}
                            className="rounded-md border border-[#CFBD97] px-2 py-1" />
                    </div>
                ))}
                <div className="flex flex-col gap-1 text-xs">
                    <label>Mot de passe (8+ caractères, 1 majuscule, 1 chiffre)</label>
                    <input type="password" value={form.mot_de_passe} onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1" />
                </div>
                <div className="flex items-end">
                    <button onClick={creer} className="rounded-full bg-[#CFBD97] px-5 py-1.5 text-xs text-white">
                        Créer le compte
                    </button>
                </div>
            </section>

            {/* ---------- LISTE ---------- */}
            <div className="flex flex-col gap-2">
                {liste.map((e) => {
                    const id = e.Id_utilisateur
                    const nomComplet = (e.utilisateur?.nom ?? e.nom ?? "") + " " + (e.utilisateur?.prenom ?? e.prenom ?? "")
                    return (
                        <div key={id} className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3 text-xs shadow-sm">
                            <div className="flex-1">
                                <p className="font-semibold">{nomComplet} · {e.poste ?? "?"}</p>
                                <p className="text-gray-500">{e.utilisateur?.email ?? e.email ?? ""} · statut {e.statut_compte ?? "?"}</p>
                            </div>
                            {/* changer le poste : valider en cliquant ailleurs (onBlur) */}
                            <input
                                defaultValue={e.poste ?? ""}
                                onBlur={(ev) => ev.target.value !== (e.poste ?? "") && maj(id, { poste: ev.target.value })}
                                className="w-28 rounded-md border border-[#CFBD97] px-2 py-1"
                                title="Modifier le poste puis cliquer ailleurs" />
                            {/* actif / inactif */}
                            <button
                                onClick={() => maj(id, { statut_compte: e.statut_compte === "actif" ? "inactif" : "actif" })}
                                className={"rounded-full px-3 py-1 " + (e.statut_compte === "actif" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600")}>
                                {e.statut_compte === "actif" ? "Actif → désactiver" : "Inactif → réactiver"}
                            </button>
                            {/* suppression : administrateur seulement */}
                            {user?.role === "administrateur" && (
                                <button onClick={() => supprimer(id)}
                                    className="rounded-full border border-red-300 px-3 py-1 text-red-700">Supprimer</button>
                            )}
                        </div>
                    );
                })}
                {liste.length === 0 && <p className="text-sm text-gray-600">Aucun employé enregistré.</p>}
            </div>
        </div>
    )
}
