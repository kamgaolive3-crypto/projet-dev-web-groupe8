import { useState, useEffect } from "react";
import { api } from "../../services/api";

// les catégories possibles (mêmes valeurs que la base)
const categories = ["plat", "boisson", "dessert", "accompagnement", "autre"];

// formulaire vide (un article n existera pas encore)
const FORMULAIRE_VIDE = {
    Id_article: "",
    nom_article: "",
    description: "",
    prix_article: 1000,
    categories_article: "plat",
    disponibilite_article: true,
    Menu_du_jour: false,
    image_article: "",
};

export default function Menu() {
    const [articles, setArticles] = useState([])
    const [erreur, setErreur] = useState("")
    const [message, setMessage] = useState("")
    // le formulaire peut être en création (aucun id déjà rempli) ou en modification
    const [form, setForm] = useState(FORMULAIRE_VIDE)
    const [modeEdition, setModeEdition] = useState(false)

    const charger = () => {
        api.get("/article_menu")
            .then((liste) => setArticles(Array.isArray(liste) ? liste : liste.data || []))
            .catch((e) => setErreur(e.message))
    }
    useEffect(charger, [])

    // POST ou PUT selon le mode
    const enregistrer = async () => {
        setMessage(""); setErreur("")
        const corps = {
            ...form,
            prix_article: Number(form.prix_article),
            disponibilite_article: !!form.disponibilite_article,
            Menu_du_jour: !!form.Menu_du_jour,
            image_article: form.image_article.trim() || null,
            description: form.description.trim() || null,
        };
        try {
            if (modeEdition) {
                await api.put("/article_menu/" + encodeURIComponent(form.Id_article), corps)
                setMessage("Article " + form.Id_article + " modifié.")
            } else {
                await api.post("/article_menu", corps)
                setMessage("Article " + form.Id_article + " créé.")
            }
            setForm(FORMULAIRE_VIDE)
            setModeEdition(false)
            charger()
        } catch (e) {
            const detail = e.champs ? Object.values(e.champs).flat().join(" - ") : null
            setErreur(detail || e.message)
        }
    }

    // pré-remplir le formulaire avec un article existant
    const editer = (a) => {
        setModeEdition(true)
        setMessage(""); setErreur("")
        setForm({
            Id_article: a.Id_article,
            nom_article: a.nom_article,
            description: a.description ?? a.description_article ?? "",
            prix_article: a.prix_article,
            categories_article: a.categories_article,
            disponibilite_article: !!a.disponibilite_article,
            Menu_du_jour: !!a.Menu_du_jour,
            image_article: a.image_article ?? "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // bascule rapide : menu du jour / disponibilité (PUT partiel)
    const basculer = async (a, champ) => {
        setMessage(""); setErreur("")
        try {
            await api.put("/article_menu/" + encodeURIComponent(a.Id_article), {
                Id_article: a.Id_article,
                nom_article: a.nom_article,
                prix_article: a.prix_article,
                categories_article: a.categories_article,
                [champ]: !a[champ],
            })
            charger()
        } catch (e) { setErreur(e.message) }
    }

    // suppression
    const supprimer = async (a) => {
        setMessage(""); setErreur("")
        try {
            await api.del("/article_menu/" + encodeURIComponent(a.Id_article))
            setMessage("Article " + a.Id_article + " supprimé.")
            charger()
        } catch (e) { setErreur(e.message) }
    }

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            <div>
                <h1 className="font-serif text-xl font-bold">Gestion du menu</h1>
                <p className="text-xs text-gray-600">Créer / modifier les articles et le menu du jour (US-027)</p>
            </div>

            {message && <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">{message}</p>}
            {erreur && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{erreur}</p>}

            {/* ---------- FORMULAIRE ---------- */}
            <section className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2">
                <div className="flex flex-col gap-1 text-xs">
                    <label>ID article (3 majuscules + 3 chiffres, ex : PLT001)</label>
                    <input value={form.Id_article} disabled={modeEdition}
                        onChange={(e) => setForm({ ...form, Id_article: e.target.value.toUpperCase() })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1 disabled:bg-gray-100" />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                    <label>Nom</label>
                    <input value={form.nom_article} onChange={(e) => setForm({ ...form, nom_article: e.target.value })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1" />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                    <label>Prix (Fcfa)</label>
                    <input type="number" min="0" value={form.prix_article}
                        onChange={(e) => setForm({ ...form, prix_article: e.target.value })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1" />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                    <label>Catégorie</label>
                    <select value={form.categories_article}
                        onChange={(e) => setForm({ ...form, categories_article: e.target.value })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1">
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1 text-xs md:col-span-2">
                    <label>Image (chemin ou URL, facultatif)</label>
                    <input value={form.image_article} onChange={(e) => setForm({ ...form, image_article: e.target.value })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1" />
                </div>
                <div className="flex flex-col gap-1 text-xs md:col-span-2">
                    <label>Description (facultatif)</label>
                    <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="rounded-md border border-[#CFBD97] px-2 py-1" />
                </div>
                <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={!!form.disponibilite_article}
                        onChange={(e) => setForm({ ...form, disponibilite_article: e.target.checked })} />
                    Disponible à la vente
                </label>
                <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={!!form.Menu_du_jour}
                        onChange={(e) => setForm({ ...form, Menu_du_jour: e.target.checked })} />
                    Dans le menu du jour
                </label>
                <div className="flex gap-2 md:col-span-2">
                    <button onClick={enregistrer}
                        className="rounded-full bg-[#CFBD97] px-5 py-1.5 text-xs text-white">
                        {modeEdition ? "Enregistrer les modifications" : "Créer l article"}
                    </button>
                    {modeEdition && (
                        <button onClick={() => { setModeEdition(false); setForm(FORMULAIRE_VIDE) }}
                            className="rounded-full border border-[#CFBD97] px-4 py-1.5 text-xs">
                            Annuler
                        </button>
                    )}
                </div>
            </section>

            {/* ---------- LISTE ---------- */}
            <div className="flex flex-col gap-2">
                {articles.map((a) => (
                    <div key={a.Id_article} className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 text-xs shadow-sm">
                        <img src={a.image_article || "/plat_du_jour.jpg"} alt={a.nom_article}
                            className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1">
                            <p className="font-semibold">{a.Id_article} · {a.nom_article}</p>
                            <p className="text-gray-500">{a.categories_article} · {(a.prix_article ?? 0).toLocaleString("fr-FR")} Fcfa</p>
                        </div>
                        <button onClick={() => basculer(a, "disponibilite_article")}
                            className={"rounded-full px-3 py-1 " + (a.disponibilite_article ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600")}>
                            {a.disponibilite_article ? "Disponible" : "Épuisé"}
                        </button>
                        <button onClick={() => basculer(a, "Menu_du_jour")}
                            className={"rounded-full px-3 py-1 " + (a.Menu_du_jour ? "bg-[#CFBD97] text-white" : "bg-[#f5f1e6] text-gray-600")}>
                            {a.Menu_du_jour ? "Au menu du jour" : "Hors menu du jour"}
                        </button>
                        <button onClick={() => editer(a)}
                            className="rounded-full border border-[#CFBD97] px-3 py-1">Modifier</button>
                        <button onClick={() => supprimer(a)}
                            className="rounded-full border border-red-300 px-3 py-1 text-red-700">Supprimer</button>
                    </div>
                ))}
                {articles.length === 0 && <p className="text-sm text-gray-600">Aucun article — créez le premier ci-dessus.</p>}
            </div>
        </div>
    )
}
