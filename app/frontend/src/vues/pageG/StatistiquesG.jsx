//importe un hook qui permet de memoriser une valeur
import { useState } from "react";

// STATISTIQUES GENERALES (maquette Desktop · Principal) : ventes, commandes, fidelite et parrainage
// plus tard, quand le backend sera pret :
// donnees : GET /api/statistiques?periode=semaine

export default function Statistiques() {
    // donnees de test pour l'instant (plus tard : viendront de GET /api/statistiques)
    const donnees = {
        "Aujourd'hui": {
            ventes: 235000, commandes: 54, points: 280, parrainages: 4,
            ventesParJour: null,
            plats: [
                { nom: "Poulet braisé", total: 21 },
                { nom: "Spaghetti sauté", total: 14 },
                { nom: "Poisson grillé", total: 10 },
                { nom: "Riz sauté", total: 9 },
            ],
        },
        "Cette semaine": {
            ventes: 1425000, commandes: 342, points: 1850, parrainages: 28,
            ventesParJour: [
                { jour: "Lun", montant: 120000 },
                { jour: "Mar", montant: 190000 },
                { jour: "Mer", montant: 165000 },
                { jour: "Jeu", montant: 240000 },
                { jour: "Ven", montant: 310000 },
                { jour: "Sam", montant: 385000 },
                { jour: "Dim", montant: 215000 },
            ],
            plats: [
                { nom: "Poulet braisé", total: 128 },
                { nom: "Spaghetti sauté", total: 84 },
                { nom: "Poisson grillé", total: 65 },
                { nom: "Riz sauté", total: 51 },
            ],
        },
    }

    // periode choisie dans le menu deroulant
    const [periode, setPeriode] = useState("Cette semaine")
    const d = donnees[periode]

    // nombres au format francais : 1 425 000
    const fmt = (n) => n.toLocaleString("fr-FR")

    // les 4 cartes du haut
    const cartes = [
        ["Ventes (FCFA)", fmt(d.ventes)],
        ["Commandes", fmt(d.commandes)],
        ["Points de fidélité utilisés", fmt(d.points)],
        ["Parrainages validés", fmt(d.parrainages)],
    ]

    // la plus grande vente sert de reference pour la hauteur des barres
    const max = d.ventesParJour ? Math.max(...d.ventesParJour.map((v) => v.montant)) : 0

    return (
        <div className="flex flex-col gap-5 p-4 md:p-6">
            {/* ---------- TITRE ---------- */}
            <div>
                <h1 className="font-serif text-2xl font-bold">Statistiques générales</h1>
                <p className="text-xs text-gray-600">Ventes, commandes, fidélité et parrainage</p>
            </div>

            {/* ---------- CHOIX DE LA PERIODE ---------- */}
            <div className="flex text-xs">
                <select value={periode} onChange={(e) => setPeriode(e.target.value)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-2">
                    {Object.keys(donnees).map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* ---------- LES 4 CARTES ---------- */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cartes.map(([libelle, valeur]) => (
                    <div key={libelle} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs text-gray-600">{libelle}</p>
                        <p className="text-xl font-bold">{valeur}</p>
                    </div>
                ))}
            </div>

            {/* ---------- GRAPHIQUE + PLATS LES PLUS COMMANDES ---------- */}
            <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
                {/* ventes par jour */}
                <section className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="text-sm font-bold">Ventes par jour</h2>
                    {d.ventesParJour ? (
                        <div className="mt-4 flex h-48 items-end gap-3 md:gap-5">
                            {d.ventesParJour.map((v) => (
                                <div key={v.jour} className="flex h-full flex-1 flex-col justify-end gap-2">
                                    <div
                                        title={v.jour + " : " + fmt(v.montant) + " FCFA"}
                                        style={{ height: (v.montant / max) * 100 + "%" }}
                                        className="rounded-t-md bg-[#CFBD97] transition-colors hover:bg-[#C9A04A]"
                                    />
                                    <span className="text-center text-[10px] text-gray-600">{v.jour}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-xs text-gray-600">Le détail par jour est disponible pour « Cette semaine ».</p>
                    )}
                </section>

                {/* plats les plus commandes */}
                <section className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="text-sm font-bold">Plats les plus commandés</h2>
                    <ul className="mt-3">
                        {d.plats.map((p) => (
                            <li key={p.nom} className="flex justify-between border-b border-[#efe6d0] py-2.5 text-xs last:border-0">
                                <span>{p.nom}</span>
                                <span className="font-medium">{p.total}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    )
}