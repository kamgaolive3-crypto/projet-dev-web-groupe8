import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../services/auth";

export default function Parametre() {
    const { user } = useAuth()
    const [liste, setListe] = useState([])
    const [erreur, setErreur] = useState("")
    const [message, setMessage] = useState("")
    const [form, setForm] = useState({ Id_parametre: "", cle: "", valeur: "" })
    const [modeEdition, setModeEdition] = useState(false)

    const charger = () => {
        api.get("/parametre")
            .then((l) => setListe(Array.isArray(l) ? l : l.data || []))
            .catch((e) => setErreur(e.message))
    }
    useEffect(charger, [])

    // POST ou PUT ; Id_utilisateur = le compte administrateur connecté
    const enregistrer = async () => {
        setMessage(""); setErreur("")
        try {
            if (modeEdition) {
                await api.put("/parametre/" + encodeURIComponent(form.Id_parametre), {
                    Id_parametre: form.Id_parametre,
                    cle: form.cle,
                    valeur: form.valeur,
                    Id_utilisateur: user.Id_utilisateur,
                })
                setMessage("Paramètre modifié.")
            } else {
                await api.post("/parametre", {
                    Id_parametre: form.Id_parametre,
                    cle: form.cle,
                    valeur: form.valeur,
                    Id_utilisateur: user.Id_utilisateur,
                })
                setMessage("Paramètre créé.")
            }
            setForm({ Id_parametre: "", cle: "", valeur: "" })
            setModeEdition(false)
            charger()
        } catch (e) {
            const detail = e.champs ? Object.values(e.champs).flat().join(" - ") : null
            setErreur(detail || e.message)
        }
    }

    const editer = (p) => {
        setModeEdition(true)
        setForm({ Id_parametre: p.Id_parametre, cle: p.cle, valeur: p.valeur ?? p.Valeur_parametre ?? "" })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const supprimer = async (p) => {
        setMessage(""); setErreur("")
        try {
            await api.del("/parametre/" + encodeURIComponent(p.Id_parametre))
            setMessage("Paramètre supprimé.")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            <div>
                <h1 className="font-serif text-xl font-bold">Paramètres de l application</h1>
                <p className="text-xs text-gray-600">Clés / valeurs système gérées par l administrateur (US-035)</p>
            </div>

            {message && <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">{message}</p>}
            {erreur && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{erreur}</p>}

            {/* ---------- FORMULAIRE ---------- */}
            <section className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
                <div className="flex flex-col gap-1 text-xs">
                    <label>ID (2 majuscules + 3 chiffres, ex : PA001)</label>
                    <input value={form.Id_parametre} disabled={modeEdition}
                        onChange={(e) => setForm({ ...form, Id_parametre: e.target.value.toUpperCase() })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1 disabled:bg-gray-100" />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                    <label>Clé (unique)</label>
                    <input value={form.cle} onChange={(e) => setForm({ ...form, cle: e.target.value })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1" />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                    <label>Valeur</label>
                    <input value={form.valeur} onChange={(e) => setForm({ ...form, valeur: e.target.value })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1" />
                </div>
                <div className="flex gap-2 md:col-span-3">
                    <button onClick={enregistrer} className="rounded-full bg-[#CFBD97] px-5 py-1.5 text-xs text-white">
                        {modeEdition ? "Enregistrer" : "Créer"}
                    </button>
                    {modeEdition && (
                        <button onClick={() => { setModeEdition(false); setForm({ Id_parametre: "", cle: "", valeur: "" }) }}
                            className="rounded-full border border-[#CFBD97] px-4 py-1.5 text-xs">Annuler</button>
                    )}
                </div>
            </section>

            {/* ---------- LISTE ---------- */}
            <div className="flex flex-col gap-2">
                {liste.map((p) => (
                    <div key={p.Id_parametre} className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3 text-xs shadow-sm">
                        <div className="flex-1">
                            <p className="font-semibold">{p.Id_parametre} · clé : {p.cle}</p>
                            <p className="text-gray-500">valeur : {p.valeur ?? p.Valeur_parametre ?? "?"} · créé par {p.Id_utilisateur}</p>
                        </div>
                        <button onClick={() => editer(p)} className="rounded-full border border-[#CFBD97] px-3 py-1">Modifier</button>
                        <button onClick={() => supprimer(p)} className="rounded-full border border-red-300 px-3 py-1 text-red-700">Supprimer</button>
                    </div>
                ))}
                {liste.length === 0 && <p className="text-sm text-gray-600">Aucun paramètre enregistré.</p>}
            </div>
        </div>
    )
}
