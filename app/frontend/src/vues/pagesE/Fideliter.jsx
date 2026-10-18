//importe un hook qui permet de memoriser une valeur
import { useState, useEffect } from "react"
//cliente API : le solde, les points, le parrainage viennent du backend
import { api } from "../../services/api"
//auth : tout ceci ne concerne que l utilisateur connecté
import { useAuth } from "../../services/auth"

//---------------- REGLES DU PROGRAMME ----------------
//On les écrit une seule fois ici : elles servent au texte ET aux calculs
const FCFA_PAR_POINT = 1000      // 1 000 F dépensés = 1 point
const POINTS_PAR_REDUCTION = 15  // 15 points = 1 réduction
const VALEUR_REDUCTION = 1000    // une réduction vaut 1 000 F

//écrit un nombre avec des espaces : 1850 devient "1 850 F"
const fcfa = (n) => n.toLocaleString("fr-FR") + " F"

export default function Fidelite() {
    //auth pour utiliser mes points (se passe dans le panier)
    const { user } = useAuth()
    //message d erreur (pas connecté, serveur en panne...)
    const [erreur, setErreur] = useState("")

    //---------------- DONNEES VENANT DU BACKEND ----------------
    //le solde de points : GET /api/fidelite/solde
    const [solde, setSolde] = useState(0)
    //les points gagnés par commande : GET /api/fidelite/historique
    const [commandes, setCommandes] = useState([])
    //mon code de parrainage : GET /api/parrainage/code
    const [codeParrain, setCodeParrain] = useState("")
    //mes filleuls : GET /api/parrainage/filleuls
    const [filleuls, setFilleuls] = useState([])
    //top 10 : GET /api/stats/top-clients
    const [classement, setClassement] = useState([])

    //au premier affichage : les 5 chargements
    useEffect(() => {
        if (!user) {
            setErreur("Connectez-vous pour voir votre programme de fidélité.")
            return
        }
        api.get("/fidelite/solde")
            .then((s) => setSolde(s.solde_point ?? s.points ?? 0))
            .catch((e) => setErreur(e.message))

        api.get("/fidelite/historique")
            .then((liste) => {
                setCommandes((Array.isArray(liste) ? liste : liste.data || []).map((m, i) => ({
                    id: m.Id_mvt ?? i,
                    date: (m.date_mvt || "").slice(0, 10),
                    montant: m.montant ?? null,
                    points: Math.abs(m.nbres_points ?? m.points ?? 0),
                })))
            })
            .catch(() => setCommandes([]))

        api.get("/parrainage/code")
            .then((r) => setCodeParrain(r.code_parrainage ?? r.code ?? ""))
            .catch(() => setCodeParrain(""))

        api.get("/parrainage/filleuls")
            .then((liste) => {
                setFilleuls((Array.isArray(liste) ? liste : liste.data || []).map((f, i) => ({
                    id: f.Id_utilisateur ?? i,
                    nom: f.nom ?? f.prenom ?? "Filleul",
                    statut: f.recompense_attribuee ? "inscrit(e)" : "en attente",
                    points: f.recompense_attribuee ? 3 : 0,
                })))
            })
            .catch(() => setFilleuls([]))

        api.get("/stats/top-clients")
            .then((liste) => {
                setClassement((Array.isArray(liste) ? liste : liste.data || []).slice(0, 10).map((c, i) => ({
                    id: c.Id_utilisateur ?? i,
                    nom: c.nom ?? c.nom_utilisateur ?? c.etudiant?.nom ?? "Client",
                    points: c.points ?? c.total_points ?? c.solde_point ?? 0,
                    moi: c.Id_utilisateur === user.Id_utilisateur,
                })))
            })
            .catch(() => setClassement([]))
    }, [])

    //---------------- ETATS DE LA PAGE ----------------
    //true = on affiche toutes les lignes, false = seulement les premières
    const [commandesToutes, setCommandesToutes] = useState(false)
    const [filleulsTous, setFilleulsTous] = useState(false)
    //true pendant 2 secondes après un clic sur "Copier"
    const [copie, setCopie] = useState(false)
    //message affiché sous le bouton "Utiliser mes points"
    const [message, setMessage] = useState("")

    //---------------- CALCULS ----------------
    //le reste vers la prochaine réduction
    const pointsVersReduction = solde % POINTS_PAR_REDUCTION
    //largeur de la barre de progression
    const pourcentage = (pointsVersReduction / POINTS_PAR_REDUCTION) * 100
    //la réduction disponible : 15 points valent 1000 F (meme règle que le panier)
    const reduction = Math.floor(solde / POINTS_PAR_REDUCTION) * VALEUR_REDUCTION
    //slice(0, 3) garde seulement les 3 premiers éléments de la liste
    const commandesAffichees = commandesToutes ? commandes : commandes.slice(0, 3)
    const filleulsAffiches = filleulsTous ? filleuls : filleuls.slice(0, 2)

    //---------------- ACTIONS ----------------
    //fonction appellée quand on clique sur "Copier"
    const copierCode = () => {
        navigator.clipboard.writeText(codeParrain) // copie le code
        setCopie(true)
        setTimeout(() => setCopie(false), 2000) // "Copié !" disparait après 2 secondes
    }

    //fonction appellée quand on clique sur "Utiliser mes points"
    const utiliserPoints = () => {
        if (reduction <= 0) {
            setMessage("Vous n'avez pas encore de réduction disponible.")
        } else {
            setMessage("Dépensez vos points au moment de confirmer votre commande (page Panier).")
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* ---------- TITRE ---------- */}
            <div>
                <h1 className="font-serif text-xl font-bold">Programme de fidélité</h1>
                <p className="text-xs text-gray-600">
                    {fcfa(FCFA_PAR_POINT)} dépensés = 1 point · {POINTS_PAR_REDUCTION} points = {fcfa(VALEUR_REDUCTION)} de réduction
                </p>
            </div>

            {/* pas connecté : message + lien connexion */}
            {erreur && (
                <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
                    {erreur}
                    {!user && (
                        <a href="/page_connexion" className="ml-2 font-semibold underline">
                            Se connecter
                        </a>
                    )}
                </p>
            )}

            {/* ---------- MES POINTS ---------- */}
            {/* flex-col sur téléphone (empilé), md:flex-row sur ordinateur (côte à côte) */}
            <section className="flex flex-col gap-6 rounded-xl border border-[#e3dac6] bg-[#fffdf5] p-5 md:flex-row md:items-center">
                {/* partie gauche : les points et la barre */}
                <div className="flex-1">
                    <h2 className="font-serif text-sm font-semibold">Mes points</h2>
                    <p className="mt-2 text-3xl font-bold">{solde} pts</p>

                    {/* la piste claire */}
                    <div className="mt-2 h-3 w-full rounded-full bg-[#efe6d0]">
                        {/* la partie dorée : sa largeur change avec le pourcentage */}
                        <div className="h-3 rounded-full bg-[#CFBD97]" style={{ width: pourcentage + "%" }} />
                    </div>
                    <p className="mt-2 text-xs">
                        {pointsVersReduction}/{POINTS_PAR_REDUCTION} points vers la prochaine réduction
                    </p>
                </div>

                {/* partie droite : la réduction (un trait doré la sépare de la gauche) */}
                <div className="flex flex-col items-center gap-2 border-t border-[#CFBD97] pt-4 md:w-1/3 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    <p className="font-serif text-sm font-semibold">Réduction disponible</p>
                    <p className="text-3xl font-bold">{fcfa(reduction)}</p>
                    <button
                        onClick={utiliserPoints}
                        className="rounded-full bg-[#CFBD97] px-5 py-1.5 text-sm text-white"
                    >
                        Utiliser mes points
                    </button>
                    {/* && : le message s'affiche seulement s'il n'est pas vide */}
                    {message && <p className="text-center text-xs text-[#b8862d]">{message}</p>}
                </div>
            </section>

            {/* ---------- COMMANDES + PARRAINAGE ---------- */}
            {/* 1 colonne sur téléphone, 2 colonnes sur ordinateur */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Points gagnés par commande */}
                <section className="rounded-xl border border-[#e3dac6] bg-white p-4">
                    <h2 className="mb-2 font-serif text-sm font-semibold">Points gagnés par commande</h2>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-1 font-normal">Date</th>
                                <th className="font-normal">Montant</th>
                                <th className="text-right font-normal">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* .map() fabrique une ligne pour chaque mouvement de points */}
                            {commandesAffichees.map((c) => (
                                <tr key={c.id} className="border-t border-[#efe6d0]">
                                    <td className="py-1.5">{c.date}</td>
                                    <td>{c.montant === null ? "—" : fcfa(c.montant)}</td>
                                    <td className="text-right font-semibold text-[#b8862d]">+{c.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {commandes.length === 0 && <p className="mt-2 text-xs text-gray-500">Aucun mouvement de points pour le moment.</p>}
                    {/* le bouton existe seulement s'il y a plus de 3 commandes */}
                    {commandes.length > 3 && (
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => setCommandesToutes(!commandesToutes)}
                                className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs text-white"
                            >
                                {commandesToutes ? "Voir moins" : "Voir plus"}
                            </button>
                        </div>
                    )}
                </section>

                {/* Parrainage */}
                <section className="rounded-xl border border-[#e3dac6] bg-white p-4">
                    <h2 className="mb-2 font-serif text-sm font-semibold">Parrainage</h2>

                    {/* le code de parrainage et le bouton Copier */}
                    <div className="mb-3 flex items-center justify-between rounded-md bg-[#e8dcc3] px-3 py-1.5 text-xs">
                        <span>
                            Votre code : <b>{codeParrain || "non disponible"}</b>
                        </span>
                        <button onClick={copierCode} className="rounded-full bg-[#CFBD97] px-3 py-0.5 text-white">
                            {copie ? "Copié !" : "Copier"}
                        </button>
                    </div>

                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-1 font-normal">Filleul</th>
                                <th className="font-normal">Statut</th>
                                <th className="text-right font-normal">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filleulsAffiches.map((f) => (
                                <tr key={f.id} className="border-t border-[#efe6d0]">
                                    <td className="py-1.5">{f.nom}</td>
                                    <td>{f.statut}</td>
                                    <td className="text-right font-semibold text-[#b8862d]">
                                        {f.points > 0 ? "+" + f.points : 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filleuls.length === 0 && <p className="mt-2 text-xs text-gray-500">Aucun filleul pour le moment.</p>}
                    {filleuls.length > 2 && (
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => setFilleulsTous(!filleulsTous)}
                                className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs text-white"
                            >
                                {filleulsTous ? "Voir moins" : "Voir plus"}
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* ---------- TOP 10 ---------- */}
            <section className="rounded-xl border border-[#e3dac6] bg-white p-4">
                <h2 className="mb-2 font-serif text-sm font-semibold">Top 10 des meilleurs clients</h2>
                {/* ordinateur : 2 colonnes de 5 (1 à 5 à gauche, 6 à 10 à droite) ; téléphone : 1 colonne */}
                <ol className="grid gap-x-10 md:grid-flow-col md:grid-rows-5">
                    {/* i = la position dans la liste (0, 1, 2...), donc le rang est i + 1 */}
                    {classement.map((c, i) => (
                        <li
                            key={c.id}
                            className={
                                "flex justify-between border-b border-[#efe6d0] py-2 text-sm " +
                                (c.moi ? "font-bold text-[#b8862d]" : "")
                            }
                        >
                            <span>
                                {i + 1} {c.moi ? " Vous" : " " + c.nom}
                            </span>
                            <span>{c.points} pts</span>
                        </li>
                    ))}
                </ol>
                {classement.length === 0 && <p className="text-xs text-gray-500">Classement indisponible pour le moment.</p>}
            </section>
        </div>
    )
}
