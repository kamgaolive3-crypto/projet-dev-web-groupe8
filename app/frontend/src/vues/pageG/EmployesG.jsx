//importe un hook qui permet de memoriser une valeur
import { useState } from "react";

// GESTION DES EMPLOYES (maquette /page-12) : creer, modifier et desactiver les comptes de l equipe
// plus tard, quand le backend sera pret :
// donnees : GET /api/employes
// actions : POST /api/employes (gerant) · PUT /api/employes/{id} (poste / statut) · DELETE (admin)

export default function Employes() {
    // donnees de test pour l'instant (plus tard : viendront de GET /api/employes)
    const [liste, setListe] = useState([
        { Id_utilisateur: 1, prenom: "Marcelle", nom: "Fotso", email: "marcelle@zeduc.com", telephone: "+237 699 12 34 56", poste: "Cuisine", statut_compte: "actif", date_embauche: "2024-01-12" },
        { Id_utilisateur: 2, prenom: "Alain", nom: "Nono", email: "alain@zeduc.com", telephone: "+237 677 45 89 21", poste: "Service", statut_compte: "actif", date_embauche: "2024-02-05" },
        { Id_utilisateur: 3, prenom: "Ibrahim", nom: "Talla", email: "ibrahim@zeduc.com", telephone: "+237 655 78 90 12", poste: "Livraison", statut_compte: "actif", date_embauche: "2024-03-20" },
        { Id_utilisateur: 4, prenom: "Patrick", nom: "Kenmogne", email: "patrick@zeduc.com", telephone: "+237 691 34 56 78", poste: "Service", statut_compte: "inactif", date_embauche: "2023-11-10" },
    ])
    // faux utilisateur connecte (plus tard : viendra de la connexion)
    const user = { role: "administrateur" }

    const [erreur, setErreur] = useState("")
    const [message, setMessage] = useState("")
    // champs de la carte "Nouveau compte employe" : visibles apres clic sur "+ Ajouter un employe"
    const [formOuvert, setFormOuvert] = useState(false)
    const [form, setForm] = useState({
        nom: "", prenom: "", email: "", telephone: "",
        mot_de_passe: "", poste: "", date_embauche: "",
    })
    // recherche par nom
    const [recherche, setRecherche] = useState("")
    // filtre par poste : "Rôle : Tous"
    const [filtreRole, setFiltreRole] = useState("")
    // edition en ligne du poste : { id : valeur }
    const [edition, setEdition] = useState({})

    // creer un employe (local pour l'instant)
    const creer = () => {
        if (!formOuvert) { setFormOuvert(true); return }
        if (!form.email) { setMessage(""); setErreur("Renseignez au moins l'e-mail de l'employé."); return }
        setMessage(""); setErreur("")
        const nouveau = { ...form, Id_utilisateur: Date.now(), statut_compte: "actif" }
        setListe([...liste, nouveau])
        setMessage("Employé créé : " + form.email)
        setForm({ nom: "", prenom: "", email: "", telephone: "", mot_de_passe: "", poste: "", date_embauche: "" })
        setFormOuvert(false)
    }

    // changer le poste ou le statut du compte (local pour l'instant)
    const maj = (id, corps) => {
        setMessage(""); setErreur("")
        setListe(liste.map((e) => e.Id_utilisateur === id ? { ...e, ...corps } : e))
        setMessage("Employé mis à jour.")
    }

    // supprimer un employé (réservé à l administrateur)
    const supprimer = (id) => {
        setMessage(""); setErreur("")
        setListe(liste.filter((e) => e.Id_utilisateur !== id))
        setMessage("Employé supprimé.")
    }

    // postes distincts pour le filtre "Rôle"
    const postes = [...new Set(liste.map((e) => e.poste).filter(Boolean))]
    // filtre par poste ET par nom recherche
    const listeAffichee = liste
        .filter((e) => !filtreRole || e.poste === filtreRole)
        .filter((e) => ((e.prenom ?? "") + " " + (e.nom ?? "")).toLowerCase().includes(recherche.toLowerCase()))

    return (
        <div className="flex flex-col gap-5 p-4 md:p-6">
            {/* ---------- TITRE ---------- */}
            <div>
                <h1 className="font-serif text-2xl font-bold">Gestion des employés</h1>
                <p className="text-xs text-gray-600">Créer des comptes et attribuer les droits d accès</p>
            </div>

            {message && <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">{message}</p>}
            {erreur && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{erreur}</p>}

            {/* ---------- RECHERCHE + FILTRE ROLE + AJOUT ---------- */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <input
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher un employé..."
                    className="min-w-[200px] flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs"
                />
                <select value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-2">
                    <option value="">Rôle : Tous</option>
                    {postes.map((p) => (
                        <option key={p} value={p}>Rôle : {p}</option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={() => {
                        setFormOuvert(true)
                        document.getElementById("nouveau-compte").scrollIntoView({ behavior: "smooth" })
                    }}
                    className="rounded-md bg-[#CFBD97] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#C9A04A]"
                >
                    + Ajouter un employé
                </button>
            </div>

            {/* ---------- TABLEAU ---------- */}
            {listeAffichee.length === 0 ? (
                <p className="text-sm text-gray-600">Aucun employé trouvé.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-[#ece7dc] text-xs font-semibold">
                                <th className="px-4 py-3">Nom</th>
                                <th className="px-4 py-3">Téléphone</th>
                                <th className="px-4 py-3">Rôle</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3">Créé le</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listeAffichee.map((e) => {
                                const id = e.Id_utilisateur
                                const nomComplet = (e.prenom ?? "") + " " + (e.nom ?? "")
                                const actif = e.statut_compte === "actif"
                                // date au format français : 12 janv. 2024
                                const cree = e.date_embauche
                                    ? new Date(e.date_embauche).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                                    : ""
                                return (
                                    <tr key={id} className="border-b border-[#efe6d0] last:border-0">
                                        <td className="px-4 py-3">{nomComplet.trim() || id}</td>
                                        <td className="px-4 py-3">{e.telephone ?? "—"}</td>
                                        {/* ROLE : texte ou champ d edition */}
                                        <td className="px-4 py-3">
                                            {edition[id] !== undefined ? (
                                                <span className="flex items-center gap-1">
                                                    <input
                                                        value={edition[id]}
                                                        onChange={(ev) => setEdition({ ...edition, [id]: ev.target.value })}
                                                        className="w-24 rounded-md border border-[#CFBD97] px-2 py-1 text-xs"
                                                    />
                                                    <button
                                                        onClick={() => { maj(id, { poste: edition[id] }); setEdition({ ...edition, [id]: undefined }); }}
                                                        className="rounded-full bg-[#CFBD97] px-2 py-1 text-[10px] text-white transition-colors hover:bg-[#C9A04A]">
                                                        OK
                                                    </button>
                                                </span>
                                            ) : e.poste ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={"rounded-full px-3 py-1 text-xs " + (actif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                                {actif ? "Actif" : "Inactif"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs">{cree || "—"}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                <button
                                                    onClick={() => setEdition({ ...edition, [id]: e.poste ?? "" })}
                                                    className="rounded-md border border-gray-300 px-3 py-1 text-xs transition-colors hover:bg-[#C9A04A]">
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => maj(id, { statut_compte: actif ? "inactif" : "actif" })}
                                                    className="rounded-md border border-gray-300 px-3 py-1 text-xs transition-colors hover:bg-[#C9A04A]">
                                                    {actif ? "Désactiver" : "Réactiver"}
                                                </button>
                                                {user?.role === "administrateur" && (
                                                    <button onClick={() => supprimer(id)}
                                                        className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-700 hover:bg-red-50">
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ---------- NOUVEAU COMPTE EMPLOYE (toujours visible, champs au clic) ---------- */}
            <section id="nouveau-compte" className="max-w-xl rounded-xl border border-gray-200 bg-white p-5">
                {erreur && <p className="mt-2 text-sm text-red-700">{erreur}</p>}
                <h2 className="text-base font-bold">Nouveau compte employé</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Créez un nouveau compte pour Olive : renseignez nom, e-mail, téléphone, rôle et mot de passe temporaire (1 majuscule et 1 chiffre minimum).
                </p>

                {/* les champs apparaissent après un clic sur "+ Ajouter un employé" */}
                {formOuvert && (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {[
                            ["nom", "Nom"], ["prenom", "Prénom"], ["email", "E-mail"],
                            ["telephone", "Téléphone"], ["poste", "Rôle (ex : Cuisine)"], ["date_embauche", "Date d embauche (facultatif)"],
                        ].map(([champ, libelle]) => (
                            <div key={champ} className="flex flex-col gap-1 text-xs">
                                <label>{libelle}</label>
                                <input
                                    value={form[champ]}
                                    onChange={(e) => setForm({ ...form, [champ]: e.target.value })}
                                    type={champ === "date_embauche" ? "date" : "text"}
                                    className="rounded-md border border-gray-300 px-2 py-1"
                                />
                            </div>
                        ))}
                        <div className="flex flex-col gap-1 text-xs">
                            <label>Mot de passe temporaire</label>
                            <input
                                type="password"
                                value={form.mot_de_passe}
                                onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
                                className="rounded-md border border-gray-300 px-2 py-1"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => {
                            setForm({ nom: "", prenom: "", email: "", telephone: "", mot_de_passe: "", poste: "", date_embauche: "" })
                            setFormOuvert(false)
                        }}
                        className="rounded-md border border-gray-300 px-4 py-1.5 text-xs transition-colors hover:bg-[#C9A04A]">
                        Annuler
                    </button>
                    <button
                        onClick={creer}
                        className="rounded-md bg-[#CFBD97] px-5 py-1.5 text-xs text-black transition-colors hover:bg-[#C9A04A]">
                        Créer le compte
                    </button>
                </div>
            </section>
        </div>
    )
}