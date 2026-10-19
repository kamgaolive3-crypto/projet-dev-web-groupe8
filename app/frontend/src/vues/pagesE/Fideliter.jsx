//importe un hook qui permet de memoriser une valeur
import { useState } from "react"

//---------------- REGLES DU PROGRAMME ----------------
//On les écrit une seule fois ici : elles servent au texte ET aux calculs
const FCFA_PAR_POINT = 1000      // 1 000 F dépensés = 1 point
const POINTS_PAR_REDUCTION = 15  // 15 points = 1 réduction
const VALEUR_REDUCTION = 1000    // une réduction vaut 1 000 F

//écrit un nombre avec des espaces : 1850 devient "1 850 F"
const fcfa = (n) => n.toLocaleString("fr-FR") + " F"

export default function Fidelite() {
    //---------------- DONNEES (valeurs de test pour l'instant) ----------------
    //plus tard : ces valeurs viendront de l'API PHP
    const [client] = useState({ points: 28, reduction: 1850, codeParrain: "MIAM-2026" })

    const [commandes] = useState([
        { id: 1, date: "30/09", montant: 5000, points: 5 },
        { id: 2, date: "28/09", montant: 12000, points: 12 },
        { id: 3, date: "26/09", montant: 9000, points: 9 },
        { id: 4, date: "20/09", montant: 3000, points: 3 },
        { id: 5, date: "15/09", montant: 7000, points: 7 },
    ])

    const [filleuls] = useState([
        { id: 1, nom: "Olive", statut: "inscrite", points: 3 },
        { id: 2, nom: "Diana", statut: "en attente", points: 0 },
        { id: 3, nom: "Paul", statut: "inscrit", points: 3 },
    ])

    const [classement] = useState([
        { nom: "Olive", points: 85 },
        { nom: "Awa", points: 72 },
        { nom: "Paul", points: 64 },
        { nom: "Diana", points: 51 },
        { nom: "Junior", points: 47 },
        { nom: "Cindy", points: 40 },
        { nom: "Emerie", points: 36 },
        { nom: "Soume", points: 31 },
        { nom: "Vous", points: 28 },
        { nom: "Dina", points: 22 },
    ])

    //---------------- ETATS DE LA PAGE ----------------
    //true = on affiche toutes les lignes, false = seulement les premières
    const [commandesToutes, setCommandesToutes] = useState(false)
    const [filleulsTous, setFilleulsTous] = useState(false)
    //true pendant 2 secondes après un clic sur "Copier"
    const [copie, setCopie] = useState(false)
    //message affiché sous le bouton "Utiliser mes points"
    const [message, setMessage] = useState("")

    //---------------- CALCULS ----------------
    //28 points : 28 % 15 = 13 -> il reste 13 points vers la prochaine réduction
    const pointsVersReduction = client.points % POINTS_PAR_REDUCTION
    //13 / 15 = 87 % -> largeur de la barre de progression
    const pourcentage = (pointsVersReduction / POINTS_PAR_REDUCTION) * 100
    //slice(0, 3) garde seulement les 3 premiers éléments de la liste
    const commandesAffichees = commandesToutes ? commandes : commandes.slice(0, 3)
    const filleulsAffiches = filleulsTous ? filleuls : filleuls.slice(0, 2)

    //---------------- ACTIONS ----------------
    //fonction appellée quand on clique sur "Copier"
    const copierCode = () => {
        navigator.clipboard.writeText(client.codeParrain) // copie le code
        setCopie(true)
        setTimeout(() => setCopie(false), 2000) // "Copié !" disparait après 2 secondes
    }

    //fonction appellée quand on clique sur "Utiliser mes points"
    //pour l'instant elle affiche seulement un message (le vrai calcul viendra avec le PHP)
    const utiliserPoints = () => {
        if (client.reduction <= 0) {
            setMessage("Vous n'avez pas encore de réduction disponible.")
        } else {
            setMessage("Votre réduction de " + fcfa(client.reduction) + " sera appliquée à votre prochain panier.")
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

            {/* ---------- MES POINTS ---------- */}
            {/* flex-col sur téléphone (empilé), md:flex-row sur ordinateur (côte à côte) */}
            <section className="flex flex-col gap-6 rounded-xl border border-[#e3dac6] bg-[#fffdf5] p-5 md:flex-row md:items-center">
                {/* partie gauche : les points et la barre */}
                <div className="flex-1">
                    <h2 className="font-serif text-sm font-semibold">Mes points</h2>
                    <p className="mt-2 text-3xl font-bold">{client.points} pts</p>

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
                    <p className="text-3xl font-bold">{fcfa(client.reduction)}</p>
                    <button
                        onClick={utiliserPoints}
                        className="rounded-full bg-[#CFBD97] px-5 py-1.5 text-sm text-black  transition-colors hover:bg-primary-700">
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
                            {/* .map() fabrique une ligne pour chaque commande de la liste */}
                            {commandesAffichees.map((c) => (
                                <tr key={c.id} className="border-t border-[#efe6d0]">
                                    <td className="py-1.5">{c.date}</td>
                                    <td>{fcfa(c.montant)}</td>
                                    <td className="text-right font-semibold text-[#b8862d]">+{c.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* le bouton existe seulement s'il y a plus de 3 commandes */}
                    {commandes.length > 3 && (
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => setCommandesToutes(!commandesToutes)}
                                className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs text-black  transition-colors hover:bg-primary-700"
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
                            Votre code : <b>{client.codeParrain}</b>
                        </span>
                        <button onClick={copierCode} className="rounded-full bg-[#CFBD97] px-3 py-0.5 text-black  transition-colors hover:bg-primary-700">
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
                    {filleuls.length > 2 && (
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => setFilleulsTous(!filleulsTous)}
                                className="rounded-full bg-[#CFBD97] px-4 py-1 text-xs text-black transition-colors hover:bg-primary-700"
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
                            key={c.nom}
                            className={
                                "flex justify-between border-b border-[#efe6d0] py-2 text-sm " +
                                (c.nom === "Vous" ? "font-bold text-[#b8862d]" : "")
                            }
                        >
                            <span>
                                {i + 1} {c.nom}
                            </span>
                            <span>{c.points} pts</span>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    )
}