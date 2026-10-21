import { useState } from "react";
import { FiX } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/* 1. CONSTANTES ET DONNÉES DE TEST                                   */
/* ------------------------------------------------------------------ */

const STATUTS = {
  attente: { label: "En attente", classe: "bg-primary/30 text-secondary" },
  proposee: { label: "Réponse proposée", classe: "bg-blue-100 text-blue-800" },
  validee: { label: "Validée", classe: "bg-green-100 text-green-800" },
  rejetee: { label: "Rejetée", classe: "bg-red-100 text-red-800" },
};

const CARTES = [
  { label: "En attente", statuts: ["attente"] },
  { label: "Réponses à valider", statuts: ["proposee"] },
  { label: "Traitées", statuts: ["validee", "rejetee"] },
];

const RECLAMATIONS_INITIALES = [
  {
    id: "RCL-013",
    etudiant: "Brice Tchoua",
    commande: "Ndolé royal",
    motif: "Erreur de commande",
    message: "J'avais commandé un ndolé royal et on m'a livré un okok salé.",
    reponse: "Nous nous excusons pour cette erreur. Le plat commandé vous sera remis gratuitement.",
    statut: "proposee",
  },
  {
    id: "RCL-012",
    etudiant: "Jean Dupont",
    commande: "Poulet braisé",
    motif: "Plat froid à la livraison",
    message: "Mon plat est arrivé froid, je n'ai pas pu le manger.",
    reponse: "",
    statut: "attente",
  },
  {
    id: "RCL-011",
    etudiant: "Aïssatou Diallo",
    commande: "Spaghetti sauté",
    motif: "Commande incomplète",
    message: "Il manquait la boisson de mon menu.",
    reponse: "Nous nous excusons. Une boisson de votre choix vous sera offerte à la prochaine commande.",
    statut: "proposee",
  },
  {
    id: "RCL-010",
    etudiant: "Paul Ndongo",
    commande: "Poisson grillé",
    motif: "Retard de livraison",
    message: "La livraison a eu 45 minutes de retard.",
    reponse: "Nous nous excusons pour ce retard et en tenons compte pour améliorer notre service.",
    statut: "validee",
  },
  {
    id: "RCL-009",
    etudiant: "Marie Eboa",
    commande: "Riz sauté",
    motif: "Erreur de montant",
    message: "On m'a facturé 3000 Fcfa au lieu de 2500 Fcfa.",
    reponse: "Le montant facturé correspond au prix affiché au menu.",
    statut: "rejetee",
  },
];

// Classes des boutons d'action
const BOUTON_BASE =
  "rounded-md border px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40";
const BOUTON_CLAIR = `${BOUTON_BASE} border-grey-300 bg-white enabled:hover:bg-grey`;
const BOUTON_BEIGE = `${BOUTON_BASE} border-primary bg-primary enabled:hover:bg-primary-700`;

/* ------------------------------------------------------------------ */
/* 2. COMPOSANTS RÉUTILISABLES                                        */
/* ------------------------------------------------------------------ */

// Petite pastille de statut (utilisée dans le tableau et dans la fenêtre)
function BadgeStatut({ statut }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-medium ${STATUTS[statut].classe}`}
    >
      {STATUTS[statut].label}
    </span>
  );
}

// Une ligne "étiquette : valeur"
function LigneInfo({ label, valeur }) {
  return (
    <div className="flex justify-between gap-3 py-2">
      <dt className="text-secondary/60">{label}</dt>
      <dd className="text-right">{valeur}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. LA PAGE                                                         */
/* ------------------------------------------------------------------ */
export default function ReclamationsG() {
  // --- Mémoire de la page ---
  const [reclamations, setReclamations] = useState(RECLAMATIONS_INITIALES);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [voirId, setVoirId] = useState(null); // réclamation affichée dans la fenêtre

  // La réclamation ouverte dans la fenêtre (undefined s'il n'y en a pas)
  const reclamationVue = reclamations.find((r) => r.id === voirId);

  // La liste filtrée par la recherche ET par le statut
  const reclamationsAffichees = reclamations.filter((r) => {
    const texte = `${r.id} ${r.etudiant} ${r.commande} ${r.motif}`.toLowerCase();
    const correspondRecherche = texte.includes(recherche.toLowerCase());
    const correspondStatut = filtreStatut === "tous" || r.statut === filtreStatut;
    return correspondRecherche && correspondStatut;
  });

  // --- Actions ---
  function decider(id, nouveauStatut) {
    const verbe = nouveauStatut === "validee" ? "valider" : "rejeter";
    if (window.confirm(`Voulez-vous vraiment ${verbe} cette réponse ?`)) {
      setReclamations(
        reclamations.map((r) => (r.id === id ? { ...r, statut: nouveauStatut } : r))
      );
      setVoirId(null);
    }
  }

  // --- Affichage ---
  return (
    <section className="bg-white px-6 py-8 text-secondary">
      <div className="mx-auto max-w-6xl">
        <p className="text-3xl font-bold">Réclamations</p>
        <p className="mt-1 text-sm text-secondary/60">
          Valider ou rejeter les réponses proposées par les employés
        </p>

        {/* Cartes de chiffres */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {CARTES.map((carte) => (
            <div
              key={carte.label}
              className="flex h-32 flex-col justify-between rounded-2xl border border-grey-300 bg-white p-5"
            >
              <p className="text-sm text-secondary/70">{carte.label}</p>
              <p className="text-3xl font-bold">
                {reclamations.filter((r) => carte.statuts.includes(r.statut)).length}
              </p>
            </div>
          ))}
        </div>

        {/* Recherche et filtre */}
        <div className="mt-6 flex flex-wrap gap-4">
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher une réclamation..."
            aria-label="Rechercher une réclamation"
            className="min-w-56 flex-1 rounded-xl border border-grey-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            aria-label="Filtrer par statut"
            className="w-52 rounded-xl border border-grey-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="tous">Statut : Tous</option>
            {Object.keys(STATUTS).map((cle) => (
              <option key={cle} value={cle}>
                Statut : {STATUTS[cle].label}
              </option>
            ))}
          </select>
        </div>

        {/* Tableau */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-grey-300">
          <table className="w-full min-w-[46rem] text-left text-xs">
            <thead>
              <tr className="bg-primary/30">
                <th className="px-5 py-4 font-medium">N°</th>
                <th className="px-5 py-4 font-medium">Étudiant</th>
                <th className="px-5 py-4 font-medium">Commande</th>
                <th className="px-5 py-4 font-medium">Motif</th>
                <th className="px-5 py-4 text-center font-medium">Statut</th>
                <th className="px-5 py-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reclamationsAffichees.map((r) => {
                const peutDecider = r.statut === "proposee";
                return (
                  <tr key={r.id} className="border-t border-grey-300">
                    <td className="px-5 py-4">{r.id}</td>
                    <td className="px-5 py-4">{r.etudiant}</td>
                    <td className="px-5 py-4">{r.commande}</td>
                    <td className="px-5 py-4">{r.motif}</td>
                    <td className="px-5 py-4 text-center">
                      <BadgeStatut statut={r.statut} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setVoirId(r.id)}
                          aria-label={`Voir la réclamation ${r.id}`}
                          className={BOUTON_CLAIR}
                        >
                          Voir
                        </button>
                        <button
                          type="button"
                          onClick={() => decider(r.id, "validee")}
                          disabled={!peutDecider}
                          aria-label={`Valider la réponse de la réclamation ${r.id}`}
                          className={BOUTON_BEIGE}
                        >
                          Valider
                        </button>
                        <button
                          type="button"
                          onClick={() => decider(r.id, "rejetee")}
                          disabled={!peutDecider}
                          aria-label={`Rejeter la réponse de la réclamation ${r.id}`}
                          className={BOUTON_CLAIR}
                        >
                          Rejeter
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {reclamationsAffichees.length === 0 && (
            <p className="border-t border-grey-300 py-8 text-center text-sm text-secondary/60">
              Aucune réclamation ne correspond à votre recherche.
            </p>
          )}
        </div>
      </div>

      {/* Fenêtre de détail */}
      {reclamationVue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-modal"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setVoirId(null)}
              aria-label="Fermer"
              className="absolute right-3 top-3 rounded p-1 hover:bg-grey"
            >
              <FiX size={24} />
            </button>

            <div className="flex flex-wrap items-center gap-3 pr-8">
              <p id="titre-modal" className="text-xl font-bold">
                Réclamation {reclamationVue.id}
              </p>
              <BadgeStatut statut={reclamationVue.statut} />
            </div>

            <dl className="mt-4 divide-y divide-grey-300 rounded-lg bg-grey px-4 text-sm">
              <LigneInfo label="Étudiant" valeur={reclamationVue.etudiant} />
              <LigneInfo label="Commande" valeur={reclamationVue.commande} />
              <LigneInfo label="Motif" valeur={reclamationVue.motif} />
            </dl>

            <div className="mt-4">
              <p className="text-xs text-secondary/60">Message de l'étudiant</p>
              <p className="mt-1 rounded-lg border border-grey-300 px-3 py-2 text-sm">
                {reclamationVue.message}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xs text-secondary/60">Réponse proposée par l'employé</p>
              {reclamationVue.reponse ? (
                <p className="mt-1 rounded-lg border border-primary px-3 py-2 text-sm">
                  {reclamationVue.reponse}
                </p>
              ) : (
                <p className="mt-1 text-sm text-secondary/60">
                  Aucune réponse proposée pour le moment.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {reclamationVue.statut === "proposee" ? (
                <>
                  <button
                    type="button"
                    onClick={() => decider(reclamationVue.id, "rejetee")}
                    className={BOUTON_CLAIR}
                  >
                    Rejeter
                  </button>
                  <button
                    type="button"
                    onClick={() => decider(reclamationVue.id, "validee")}
                    className={BOUTON_BEIGE}
                  >
                    Valider
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setVoirId(null)} className={BOUTON_CLAIR}>
                  Fermer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
