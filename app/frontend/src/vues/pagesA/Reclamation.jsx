import { useState } from "react";

/* ------------------------------------------------------------------ */
/* 1. CONSTANTES ET DONNÉES DE TEST                                   */
/* ------------------------------------------------------------------ */

const STATUTS = {
  attente: { label: "En attente", classe: "bg-grey-300" },
  cours: { label: "En cours", classe: "bg-primary" },
  resolue: { label: "Résolue", classe: "bg-green-300" },
  rejetee: { label: "Rejetée", classe: "bg-red-400" },
};

const CARTES = [
  { statut: "attente", label: "En attente" },
  { statut: "cours", label: "En cours" },
  { statut: "resolue", label: "Résolues" },
  { statut: "rejetee", label: "Rejetées" },
];

const RECLAMATIONS_INITIALES = [
  {
    id: 1,
    commande: "#CMD-1042",
    objet: "Plat manquant",
    message: "Le poulet pané commandé n'était pas dans le colis.",
    client: "Marie T.",
    date: "12 oct 2026, 13:20",
    montant: 2500,
    statut: "cours",
    reponse: "",
  },
  {
    id: 2,
    commande: "#CMD-1041",
    objet: "Erreur de commande",
    message: "J'ai reçu un plat de boulette à la place du Ndolé royal.",
    client: "Diana P.",
    date: "10 oct 2026, 18:20",
    montant: 3000,
    statut: "cours",
    reponse: "",
  },
  {
    id: 3,
    commande: "#CMD-1007",
    objet: "Hygiène",
    message: "La barquette était sale.",
    client: "Junior M.",
    date: "19 sept 2026, 13:20",
    montant: 1500,
    statut: "attente",
    reponse: "",
  },
  {
    id: 4,
    commande: "#CMD-1036",
    objet: "Plat manquant",
    message: "Il manquait le plantain avec mon poisson braisé.",
    client: "Aurélie F.",
    date: "8 oct 2026, 12:45",
    montant: 3500,
    statut: "attente",
    reponse: "",
  },
  {
    id: 5,
    commande: "#CMD-1020",
    objet: "Retard de livraison",
    message: "La commande est arrivée avec une heure de retard.",
    client: "Damien T.",
    date: "2 oct 2026, 20:10",
    montant: 2000,
    statut: "resolue",
    reponse: "Nous nous excusons pour ce retard. Un jus vous est offert à la prochaine commande.",
  },
  {
    id: 6,
    commande: "#CMD-1012",
    objet: "Erreur de commande",
    message: "Je voulais le menu étudiant, pas le menu complet.",
    client: "Marie T.",
    date: "28 sept 2026, 19:05",
    montant: 4000,
    statut: "rejetee",
    reponse: "La commande livrée correspond au bon de commande validé.",
  },
];

// 2500 devient "2 500 Fcfa"
function formaterMontant(montant) {
  return `${Number(montant).toLocaleString("fr-FR")} Fcfa`;
}

/* ------------------------------------------------------------------ */
/* 2. COMPOSANTS RÉUTILISABLES                                        */
/* ------------------------------------------------------------------ */

function CarteStat({ label, valeur }) {
  return (
    <div className="rounded-xl border border-primary bg-white px-4 py-3">
      <p className="text-xl">{valeur}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}

// Une ligne "étiquette : valeur" du panneau de traitement
function LigneInfo({ label, valeur }) {
  return (
    <div className="flex justify-between gap-3 py-2">
      <dt>{label}</dt>
      <dd className="text-right">{valeur}</dd>
    </div>
  );
}

// Une réclamation dans la liste
function CarteReclamation({ reclamation, selectionnee, onTraiter }) {
  const statut = STATUTS[reclamation.statut];
  const traitable = reclamation.statut === "attente" || reclamation.statut === "cours";

  return (
    <li
      aria-current={selectionnee ? "true" : undefined}
      className={`flex items-start justify-between gap-4 rounded-lg border p-3 ${
        selectionnee ? "border-primary-700 bg-primary/20" : "border-transparent bg-grey"
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm">
          Commande {reclamation.commande} - {reclamation.objet}
        </p>
        <p className="mt-1 text-sm font-semibold">{reclamation.message}</p>
        <p className="mt-1 text-[10px] text-secondary/60">
          {reclamation.client} {reclamation.date}
        </p>
        {reclamation.reponse && (
          <p className="mt-1 text-xs text-secondary/70">Réponse : {reclamation.reponse}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className={`rounded-full px-3 py-0.5 text-[10px] ${statut.classe}`}>
          {statut.label}
        </span>
        {traitable && (
          <button
            type="button"
            onClick={onTraiter}
            aria-label={`Traiter la réclamation ${reclamation.commande} - ${reclamation.objet}`}
            className="rounded-full bg-primary px-3 py-0.5 text-[10px] hover:bg-primary-700"
          >
            Traiter &gt;
          </button>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* 3. LA PAGE                                                         */
/* ------------------------------------------------------------------ */
export default function Reclamation() {
  // --- Mémoire de la page ---
  const [reclamations, setReclamations] = useState(RECLAMATIONS_INITIALES);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [selectionId, setSelectionId] = useState(1); // réclamation ouverte à droite
  const [reponse, setReponse] = useState("");

  // La réclamation actuellement ouverte (ou undefined s'il n'y en a pas)
  const selection = reclamations.find((r) => r.id === selectionId);

  // La liste filtrée par la recherche ET par le statut
  const reclamationsAffichees = reclamations.filter((r) => {
    const texte = `${r.commande} ${r.objet} ${r.message} ${r.client}`.toLowerCase();
    const correspondRecherche = texte.includes(recherche.toLowerCase());
    const correspondStatut = filtreStatut === "tous" || r.statut === filtreStatut;
    return correspondRecherche && correspondStatut;
  });

  // --- Actions ---
  function traiter(id) {
    // Une réclamation "en attente" passe "en cours" dès qu'on la prend en charge.
    setReclamations(
      reclamations.map((r) =>
        r.id === id && r.statut === "attente" ? { ...r, statut: "cours" } : r
      )
    );
    setSelectionId(id);
    setReponse("");
  }

  function cloturer(nouveauStatut) {
    setReclamations(
      reclamations.map((r) =>
        r.id === selectionId ? { ...r, statut: nouveauStatut, reponse } : r
      )
    );
    setSelectionId(null);
    setReponse("");
  }

  function valider(e) {
    e.preventDefault();
    cloturer("resolue");
  }

  // --- Affichage ---
  return (
    <section className="bg-grey px-6 py-8 text-secondary">
      <div className="mx-auto max-w-6xl">
        <p className="text-3xl">Gestion des réclamations</p>
        <p className="mt-1 text-sm">Traitez les réclamations</p>

        {/* Cartes de chiffres */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CARTES.map((carte) => (
            <CarteStat
              key={carte.statut}
              label={carte.label}
              valeur={reclamations.filter((r) => r.statut === carte.statut).length}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          {/* Colonne de gauche : la liste */}
          <div className="rounded-xl bg-white p-5 lg:col-span-3">
            <p className="text-lg">Liste des réclamations</p>

            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex flex-col gap-1 text-[10px]">
                Rechercher
                <input
                  type="search"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="w-52 rounded-full border border-primary bg-white px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-1 text-[10px]">
                Statut
                <select
                  value={filtreStatut}
                  onChange={(e) => setFiltreStatut(e.target.value)}
                  className="w-52 rounded-full border border-primary bg-white px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="tous">Tous les statuts</option>
                  {Object.keys(STATUTS).map((cle) => (
                    <option key={cle} value={cle}>
                      {STATUTS[cle].label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {reclamationsAffichees.length === 0 ? (
              <p className="mt-6 text-center text-sm text-secondary/60">
                Aucune réclamation ne correspond à votre recherche.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {reclamationsAffichees.map((r) => (
                  <CarteReclamation
                    key={r.id}
                    reclamation={r}
                    selectionnee={r.id === selectionId}
                    onTraiter={() => traiter(r.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Colonne de droite : le traitement */}
          <div className="self-start rounded-xl bg-white p-5">
            <p className="text-sm font-semibold">Traitement de la réclamation</p>

            {selection ? (
              <form onSubmit={valider} className="mt-3 space-y-3">
                <dl className="divide-y divide-grey-300 rounded-lg bg-grey px-3 text-xs">
                  <LigneInfo label="Objet" valeur={selection.objet} />
                  <LigneInfo label="Client" valeur={selection.client} />
                  <LigneInfo label="ID commande" valeur={selection.commande} />
                  <LigneInfo label="Montant payé" valeur={formaterMontant(selection.montant)} />
                </dl>

                <div>
                  <p className="text-[10px]">Corps de la réclamation</p>
                  <p className="mt-1 rounded-lg border border-primary px-3 py-2 text-xs font-semibold">
                    {selection.message}
                  </p>
                </div>

                <label className="flex flex-col gap-1 text-[10px]">
                  Réponse au client
                  <textarea
                    rows={4}
                    required
                    value={reponse}
                    onChange={(e) => setReponse(e.target.value)}
                    className="rounded-lg border border-primary bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-2 text-xs hover:bg-primary-700"
                >
                  Valider la réclamation
                </button>
                <button
                  type="button"
                  onClick={() => cloturer("rejetee")}
                  className="w-full rounded-lg border border-primary bg-white py-2 text-xs hover:bg-primary/20"
                >
                  Rejeter
                </button>
              </form>
            ) : (
              <p className="mt-4 text-center text-xs text-secondary/60">
                Cliquez sur « Traiter » pour ouvrir une réclamation.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
