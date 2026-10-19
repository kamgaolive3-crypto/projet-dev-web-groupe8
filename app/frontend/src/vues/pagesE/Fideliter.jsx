// Page Fidelite reproduisant la maquette :
// titres Inria Bold ; bande creme #FFFDF8 r29 (reduction + mes points + barre) ;
// cartes blanches r30 : points par commande / parrainage ; grande carte top 10
import { useState, useEffect } from "react"
import { api } from "../../services/api"
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
                    statut: f.recompense_attribuee ? "inscrite" : "en attente",
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
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-8 md:px-8">
            {/* ---------- TITRE ---------- */}
            <h1 className="font-inria text-2xl font-bold text-black md:text-[36px]">
                Programme de fidélité
            </h1>
            <p className="mt-1 font-inria text-sm font-bold text-black md:text-base">
                {fcfa(FCFA_PAR_POINT)} dépensés = 1 point &nbsp;.&nbsp; {POINTS_PAR_REDUCTION} points = {fcfa(VALEUR_REDUCTION)} de réduction
            </p>

            {/* pas connecté : message + lien connexion */}
            {erreur && (
                <p className="mt-4 rounded-[10px] bg-red-100 px-4 py-3 text-sm text-red-700">
                    {erreur}{" "}
                    {!user && (
                        <a href="/page_connexion" className="font-semibold underline">
                            Se connecter
                        </a>
                    )}
                </p>
            )}

            {/* ---------- BANDE REDUCTION + MES POINTS (creme r29) ---------- */}
            <section className="mt-6 flex flex-col gap-6 rounded-[29px] bg-creme-d p-6 md:flex-row md:items-center md:p-8">
                {/* gauche : la reduction */}
                <div className="flex-1">
                    <p className="font-inria text-lg font-bold text-black md:text-xl">
                        Réduction disponible
                    </p>
                    <p className="mt-2 font-inria text-3xl font-bold text-black md:text-[40px]">
                        {fcfa(reduction)}
                    </p>
                    <button
                        type="button"
                        onClick={utiliserPoints}
                        className="mt-4 rounded-[29px] bg-or px-7 py-2.5 font-inria text-base text-black transition-colors hover:bg-or-deep hover:text-white md:text-xl"
                    >
                        Utiliser mes points
                    </button>
                    {message && (
                        <p className="mt-2 font-inria text-sm text-or-deep">{message}</p>
                    )}
                </div>

                {/* filet vertical sur desktop (maquette) */}
                <span className="hidden h-40 w-px bg-bmie md:block" />

                {/* droite : mes points + barre de progression */}
                <div className="flex-1">
                    <p className="font-inria text-lg font-bold text-black md:text-xl">
                        Mes points
                    </p>
                    <p className="mt-2 font-inria text-3xl font-bold text-black md:text-[40px]">
                        {solde} pts
                    </p>
                    {/* piste claire #F5F0E9 + remplissage or */}
                    <div className="mt-3 h-5 w-full rounded-full bg-piste">
                        <div
                            className="h-5 rounded-full bg-or"
                            style={{ width: pourcentage + "%" }}
                        />
                    </div>
                    <p className="mt-2 font-inria text-sm font-bold text-black md:text-xl">
                        {pointsVersReduction}/{POINTS_PAR_REDUCTION} points vers la prochaine réduction
                    </p>
                </div>
            </section>

            {/* ---------- POINTS PAR COMMANDE + PARRAINAGE ---------- */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Points gagnés par commande : carte blanche r30 */}
                <section className="rounded-[30px] bg-white p-5 md:p-6">
                    <h2 className="font-inria text-lg font-bold text-black md:text-xl">
                        Points gagnés par commande
                    </h2>
                    <table className="mt-3 w-full font-inria text-sm font-bold text-black md:text-[15px]">
                        <thead>
                            <tr className="text-left text-encre">
                                <th className="py-1 pr-2 font-bold">Date &nbsp;.&nbsp; Montant</th>
                                <th className="text-right font-bold">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* .map() fabrique une ligne pour chaque mouvement de points */}
                            {commandesAffichees.map((c) => (
                                <tr key={c.id} className="border-t border-ligne">
                                    <td className="py-2">
                                        {c.date ? c.date.slice(8, 10) + "/" + c.date.slice(5, 7) : "—"} . {c.montant === null ? "—" : fcfa(c.montant)}
                                    </td>
                                    <td className="text-right text-or-deep">+{c.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {commandes.length === 0 && (
                        <p className="mt-3 font-inria text-sm text-encre">
                            Aucun mouvement de points pour le moment.
                        </p>
                    )}
                    {/* le bouton existe seulement s'il y a plus de 3 commandes */}
                    {commandes.length > 3 && (
                        <div className="mt-3 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setCommandesToutes(!commandesToutes)}
                                className="rounded-[30px] bg-or px-5 py-1.5 font-inria text-sm text-black transition-colors hover:bg-or-deep hover:text-white"
                            >
                                {commandesToutes ? "Voir moins" : "Voir plus"}
                            </button>
                        </div>
                    )}
                </section>

                {/* Parrainage : carte blanche r30 */}
                <section className="rounded-[30px] bg-white p-5 md:p-6">
                    <h2 className="font-inria text-lg font-bold text-black md:text-xl">
                        Parrainage
                    </h2>

                    {/* le code de parrainage dans sa chip beie + Copier */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[30px] bg-bmie px-5 py-2">
                        <span className="font-inria text-base font-bold text-black md:text-base">
                            Votre code:&nbsp;&nbsp;<span className="tracking-wide">{codeParrain || "non disponible"}</span>
                        </span>
                        <button
                            type="button"
                            onClick={copierCode}
                            className="rounded-[30px] bg-or px-5 py-1 font-inria text-sm text-black transition-colors hover:bg-or-deep hover:text-white"
                        >
                            {copie ? "Copié !" : "Copier"}
                        </button>
                    </div>

                    <table className="mt-3 w-full font-inria text-sm font-bold text-black md:text-base">
                        <thead>
                            <tr className="text-left text-gris-pa">
                                <th className="py-1 pr-2 font-bold">Filleul . Statut</th>
                                <th className="text-right font-bold">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filleulsAffiches.map((f) => (
                                <tr key={f.id} className="border-t border-ligne">
                                    <td className="py-2">{f.nom} . {f.statut}</td>
                                    <td className="text-right text-or-deep">
                                        {f.points > 0 ? "+" + f.points : "0"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filleuls.length === 0 && (
                        <p className="mt-3 font-inria text-sm text-encre">
                            Aucun filleul pour le moment.
                        </p>
                    )}
                    {filleuls.length > 2 && (
                        <div className="mt-3 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setFilleulsTous(!filleulsTous)}
                                className="rounded-[30px] bg-or px-5 py-1.5 font-inria text-sm text-black transition-colors hover:bg-or-deep hover:text-white"
                            >
                                {filleulsTous ? "Voir moins" : "Voir plus"}
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* ---------- TOP 10 ---------- */}
            <section className="mt-6 rounded-[30px] bg-white p-5 md:p-6">
                <h2 className="font-inria text-lg font-bold text-black md:text-xl">
                    Top 10 des meilleurs clients
                </h2>
                {/* ordinateur : 2 colonnes de 5 (1 à 5 à gauche, 6 à 10 à droite) ; téléphone : 1 colonne */}
                <ol className="mt-2 grid gap-x-12 md:grid-flow-col md:grid-rows-5">
                    {/* i = la position dans la liste (0, 1, 2...), donc le rang est i + 1 */}
                    {classement.map((c, i) => (
                        <li
                            key={c.id}
                            className={
                                "flex justify-between border-b border-creme-d py-2.5 font-inria text-base font-bold text-black md:text-xl " +
                                (c.moi ? "text-or-deep" : "")
                            }
                        >
                            <span>
                                {i + 1} {c.moi ? "Vous" : c.nom}
                            </span>
                            <span>{c.points} pts</span>
                        </li>
                    ))}
                </ol>
                {classement.length === 0 && (
                    <p className="mt-2 font-inria text-sm text-encre">
                        Classement indisponible pour le moment.
                    </p>
                )}
            </section>
        </div>
    )
}
