import { useState } from "react";

const DONNEES = {
  jour: {
    commandes: 8,
    chiffreAffaires: "54 000",
    points: 54,
    nouveauxClients: 1,
    titreVentes: "Ventes du jour",
    ventes: [
      { label: "Matin", valeur: 6 },
      { label: "Midi", valeur: 22 },
      { label: "Après-midi", valeur: 10 },
      { label: "Soir", valeur: 16 },
    ],
    plats: [
      { nom: "Poulet pané", quantite: 9 },
      { nom: "Okok", quantite: 7 },
      { nom: "Boulettes", quantite: 4 },
      { nom: "Ndolet royal", quantite: 3 },
    ],
    statuts: { livrees: 6, enCours: 2, annulees: 0 },
  },
  semaine: {
    commandes: 42,
    chiffreAffaires: "312 000",
    points: 312,
    nouveauxClients: 5,
    titreVentes: "Vente de la semaine",
    ventes: [
      { label: "Lun", valeur: 32 },
      { label: "Mar", valeur: 25 },
      { label: "Mer", valeur: 43 },
      { label: "Jeu", valeur: 31 },
      { label: "Ven", valeur: 60 },
      { label: "Sam", valeur: 71 },
      { label: "Dim", valeur: 50 },
    ],
    plats: [
      { nom: "Okok", quantite: 58 },
      { nom: "Poulet pané", quantite: 47 },
      { nom: "Ndolet royal", quantite: 32 },
      { nom: "Boulettes", quantite: 20 },
    ],
    statuts: { livrees: 31, enCours: 8, annulees: 3 },
  },
  mois: {
    commandes: 168,
    chiffreAffaires: "1 248 000",
    points: 1248,
    nouveauxClients: 21,
    titreVentes: "Vente du mois",
    ventes: [
      { label: "Sem 1", valeur: 290 },
      { label: "Sem 2", valeur: 312 },
      { label: "Sem 3", valeur: 355 },
      { label: "Sem 4", valeur: 291 },
    ],
    plats: [
      { nom: "Okok", quantite: 230 },
      { nom: "Ndolet royal", quantite: 160 },
      { nom: "Poulet pané", quantite: 150 },
      { nom: "Boulettes", quantite: 90 },
    ],
    statuts: { livrees: 130, enCours: 25, annulees: 13 },
  },
};

const STATUTS = [
  { cle: "livrees", label: "Livrées", couleur: "bg-green-300" },
  { cle: "enCours", label: "En cours", couleur: "bg-grey-300" },
  { cle: "annulees", label: "Annulées", couleur: "bg-red-400" },
];

const PERIODES = [
  { cle: "jour", label: "Jour" },
  { cle: "semaine", label: "Semaine" },
  { cle: "mois", label: "Mois" },
];

function CarteStat({ titre, valeur }) {
  return (
    <div className="rounded-3xl border border-primary-700 bg-primary/10 px-5 py-4">
      <p className="text-sm">{titre}</p>
      <p className="mt-2 pl-3 text-2xl">{valeur}</p>
    </div>
  );
}

function Panneau({ titre, className = "", children }) {
  return (
    <div className={`rounded-3xl border border-primary-700 bg-primary/10 p-6 ${className}`}>
      <p className="mb-4 text-lg">{titre}</p>
      {children}
    </div>
  );
}

export default function TableauBord() {
  const [periode, setPeriode] = useState("semaine");
  const donnees = DONNEES[periode];
  const maxVente = Math.max(...donnees.ventes.map((v) => v.valeur));
  const maxPlat = Math.max(...donnees.plats.map((p) => p.quantite));

  return (
    <section className="bg-white px-6 py-10 text-secondary">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-end gap-3">
          {PERIODES.map((p) => (
            <button
              key={p.cle}
              type="button"
              onClick={() => setPeriode(p.cle)}
              aria-pressed={periode === p.cle}
              className={`rounded-full border border-primary-700 px-6 py-1 text-sm text-secondary ${
                periode === p.cle ? "bg-primary-700" : "bg-white hover:bg-primary/20"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="mb-8 mt-2 text-3xl">Statistiques</p>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <CarteStat titre="Commandes" valeur={donnees.commandes} />
          <CarteStat titre="Chiffre d'affaires" valeur={`${donnees.chiffreAffaires} Fcfa`} />
          <CarteStat titre="Points distribués" valeur={donnees.points} />
          <CarteStat titre="Nouveaux clients" valeur={donnees.nouveauxClients} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Panneau titre={donnees.titreVentes} className="lg:col-span-2">
            <div className="flex h-40 items-end gap-3">
              {donnees.ventes.map((v) => (
                <div
                  key={v.label}
                  className="flex-1 rounded-sm bg-primary-700"
                  style={{ height: `${(v.valeur / maxVente) * 100}%` }}
                  title={`${v.valeur} 000 Fcfa`}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-3">
              {donnees.ventes.map((v) => (
                <p key={v.label} className="flex-1 text-center text-xs">
                  {v.label}
                </p>
              ))}
            </div>
          </Panneau>

          <Panneau titre="Plats les plus vendus">
            <ul className="space-y-4">
              {donnees.plats.map((plat) => (
                <li key={plat.nom} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 text-sm">{plat.nom}</span>
                  <div
                    className="h-1.5 flex-1 rounded-full bg-primary/40"
                    title={`${plat.quantite} vendus`}
                  >
                    <div
                      className="h-full rounded-full bg-primary-700"
                      style={{ width: `${(plat.quantite / maxPlat) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panneau>
        </div>

        <Panneau titre="Commandes par statut" className="mt-6">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm">
            {STATUTS.map((statut) => (
              <div key={statut.cle} className="flex items-center gap-3">
                <span className={`rounded-full px-6 py-0.5 ${statut.couleur}`}>{statut.label}</span>
                <span>{donnees.statuts[statut.cle]}</span>
              </div>
            ))}
          </div>
        </Panneau>
      </div>
    </section>
  );
}