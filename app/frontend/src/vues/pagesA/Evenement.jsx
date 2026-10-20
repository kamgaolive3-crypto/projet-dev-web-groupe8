import { useState } from "react";
import { FiEdit, FiImage, FiTag, FiTrash2 } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/* 1. FONCTIONS UTILITAIRES (dates et statut)                         */
/* ------------------------------------------------------------------ */

// Retourne une date au format "AAAA-MM-JJ", décalée de "jours" par rapport à aujourd'hui.
function dateRelative(jours) {
  const date = new Date();
  date.setDate(date.getDate() + jours);
  return date.toISOString().slice(0, 10);
}

// Transforme "2026-10-20" en "20 octobre".
function formaterDate(dateIso) {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

// Affiche "20 octobre" ou "Du 20 octobre au 25 octobre".
function formaterPeriode(debut, fin) {
  if (debut === fin) return formaterDate(debut);
  return `Du ${formaterDate(debut)} au ${formaterDate(fin)}`;
}

// Déduit le statut d'un événement à partir de ses dates et de son interrupteur.
function calculerStatut(evenement) {
  const aujourdhui = dateRelative(0);
  if (evenement.fin < aujourdhui) return "passee";
  if (!evenement.actif) return "brouillon";
  if (evenement.debut > aujourdhui) return "avenir";
  return "encours";
}

/* ------------------------------------------------------------------ */
/* 2. CONSTANTES ET DONNÉES DE TEST                                   */
/* ------------------------------------------------------------------ */

const TYPES = ["Promotion", "Événement", "Plat du jour"];

const STATUTS = {
  encours: { label: "en cours", classe: "bg-primary text-secondary" },
  avenir: { label: "à venir", classe: "bg-secondary text-white" },
  passee: { label: "passée", classe: "border border-secondary bg-white text-secondary" },
  brouillon: { label: "brouillon", classe: "border border-grey-300 bg-white text-secondary" },
};

const CARTES = [
  { statut: "encours", label: "Actives" },
  { statut: "avenir", label: "Programmée" },
  { statut: "passee", label: "Terminées" },
  { statut: "brouillon", label: "Brouillon" },
];

const FILTRES = [
  { cle: "toutes", label: "Toutes" },
  { cle: "encours", label: "en cours" },
  { cle: "avenir", label: "à venir" },
  { cle: "passee", label: "passée" },
];

const FORMULAIRE_VIDE = {
  type: "Promotion",
  titre: "",
  description: "",
  reduction: "",
  montantMin: "",
  debut: "",
  fin: "",
  image: "",
  actif: true,
};

// Classes communes aux listes déroulantes et aux zones de texte.
const STYLE_CHAMP =
  "w-full rounded-md border border-grey-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

const EVENEMENTS_INITIAUX = [
  {
    id: 1,
    type: "Promotion",
    titre: "-30% sur toutes les commandes",
    description: "À partir de 5000 Fcfa d'achat",
    reduction: "30",
    montantMin: "5000",
    debut: dateRelative(-1),
    fin: dateRelative(5),
    image: "",
    actif: true,
  },
  {
    id: 2,
    type: "Événement",
    titre: "Buffet complet de l'amour",
    description: "Entrée, plat, dessert pour 3000 Fcfa l'entrée",
    reduction: "",
    montantMin: "",
    debut: dateRelative(4),
    fin: dateRelative(4),
    image: "",
    actif: true,
  },
  {
    id: 3,
    type: "Plat du jour",
    titre: "Salade carter à la sauce poivrière",
    description: "Prix : 2500 Fcfa",
    reduction: "",
    montantMin: "",
    debut: dateRelative(0),
    fin: dateRelative(0),
    image: "",
    actif: true,
  },
  {
    id: 4,
    type: "Promotion",
    titre: "Dessert offert dès 4000 Fcfa",
    description: "Un dessert offert au choix",
    reduction: "",
    montantMin: "4000",
    debut: dateRelative(-20),
    fin: dateRelative(-15),
    image: "",
    actif: false,
  },
];

/* ------------------------------------------------------------------ */
/* 3. PETITS COMPOSANTS RÉUTILISABLES                                 */
/* ------------------------------------------------------------------ */

// Interrupteur (on/off)
function Interrupteur({ actif, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        actif ? "bg-primary" : "bg-grey-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
          actif ? "left-5.5" : "left-0.5"
        }`}
      />
    </button>
  );
}

// Champ de formulaire (étiquette + case de saisie + suffixe optionnel)
function Champ({ label, suffixe, className = "", ...reste }) {
  return (
    <label className={`flex flex-col gap-1 text-xs ${className}`}>
      {label}
      <span className="flex items-center rounded-md border border-grey-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-primary">
        <input {...reste} className="w-full min-w-0 bg-transparent text-sm outline-none" />
        {suffixe && <span className="ml-2 text-sm text-secondary/50">{suffixe}</span>}
      </span>
    </label>
  );
}

// Carte de chiffre (en haut de la page)
function CarteStat({ label, valeur }) {
  return (
    <div className="rounded-xl border border-primary bg-white px-4 py-3">
      <p className="text-2xl">{valeur}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}

// Une ligne de la liste des événements
function CarteEvenement({ evenement, onBasculer, onModifier, onSupprimer }) {
  const statut = STATUTS[calculerStatut(evenement)];

  return (
    <li className="flex items-start gap-4 rounded-lg bg-grey p-3">
      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-grey-300/50 text-secondary/60">
        {evenement.image ? (
          <img
            src={evenement.image}
            alt={`Affiche : ${evenement.titre}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <FiImage size={22} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-full border border-secondary px-2 text-[10px] leading-4">
          {evenement.type}
        </span>
        <p className="mt-1 text-sm font-medium">{evenement.titre}</p>
        <p className="text-xs">{evenement.description}</p>
        <p className="text-xs text-secondary/60">
          {formaterPeriode(evenement.debut, evenement.fin)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className={`rounded-full px-2 text-[10px] leading-4 ${statut.classe}`}>
          {statut.label}
        </span>
        <Interrupteur
          actif={evenement.actif}
          onChange={onBasculer}
          label={`Activer ou désactiver : ${evenement.titre}`}
        />
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onModifier}
            aria-label={`Modifier : ${evenement.titre}`}
            className="rounded-md border border-primary bg-white p-1.5 hover:bg-primary/20"
          >
            <FiEdit size={14} />
          </button>
          <button
            type="button"
            onClick={onSupprimer}
            aria-label={`Supprimer : ${evenement.titre}`}
            className="rounded-md border border-primary bg-white p-1.5 hover:bg-primary/20"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* 4. LA PAGE                                                         */
/* ------------------------------------------------------------------ */
export default function Evenement() {
  // --- Mémoire de la page ---
  const [evenements, setEvenements] = useState(EVENEMENTS_INITIAUX);
  const [filtre, setFiltre] = useState("toutes");
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [idEnEdition, setIdEnEdition] = useState(null); // null = on crée

  // Liste réellement affichée selon le filtre choisi
  const evenementsAffiches =
    filtre === "toutes"
      ? evenements
      : evenements.filter((evt) => calculerStatut(evt) === filtre);

  // --- Actions ---
  function basculerActif(id) {
    setEvenements(
      evenements.map((evt) => (evt.id === id ? { ...evt, actif: !evt.actif } : evt))
    );
  }

  function annulerEdition() {
    setFormulaire(FORMULAIRE_VIDE);
    setIdEnEdition(null);
  }

  function supprimer(id) {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      setEvenements(evenements.filter((evt) => evt.id !== id));
      if (idEnEdition === id) annulerEdition();
    }
  }

  function modifier(evenement) {
    setFormulaire(evenement);
    setIdEnEdition(evenement.id);
  }

  function gererChangement(e) {
    const { name, value } = e.target;
    setFormulaire({ ...formulaire, [name]: value });
  }

  function gererImage(e) {
    const fichier = e.target.files[0];
    if (fichier) {
      setFormulaire({ ...formulaire, image: URL.createObjectURL(fichier) });
    }
    e.target.value = ""; // permet de rechoisir le même fichier plus tard
  }

  function gererSoumission(e) {
    e.preventDefault();

    if (idEnEdition === null) {
      const nouvelId =
        evenements.length > 0 ? Math.max(...evenements.map((evt) => evt.id)) + 1 : 1;
      setEvenements([{ ...formulaire, id: nouvelId }, ...evenements]);
    } else {
      setEvenements(
        evenements.map((evt) => (evt.id === idEnEdition ? { ...evt, ...formulaire } : evt))
      );
    }

    annulerEdition();
    setFiltre("toutes");
  }

  // --- Affichage ---
  return (
    <section className="bg-grey px-6 py-8 text-secondary">
      <div className="mx-auto max-w-6xl">
        {/* En-tête */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FiTag size={22} />
              <p className="text-2xl">Gestion des événements</p>
            </div>
            <p className="mt-1 text-xs">
              Créez et programmez les promotions, événements et plats du jour
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFiltre("passee")}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs hover:bg-primary-700"
          >
            Historique des promotions &gt;
          </button>
        </div>

        {/* Cartes de chiffres */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CARTES.map((carte) => (
            <CarteStat
              key={carte.statut}
              label={carte.label}
              valeur={evenements.filter((evt) => calculerStatut(evt) === carte.statut).length}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Colonne de gauche : la liste */}
          <div className="rounded-xl border border-primary bg-white p-5 lg:col-span-2">
            <p className="text-lg">Liste des événements</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {FILTRES.map((f) => (
                <button
                  key={f.cle}
                  type="button"
                  onClick={() => setFiltre(f.cle)}
                  aria-pressed={filtre === f.cle}
                  className={`rounded-full border border-primary px-4 py-0.5 text-xs ${
                    filtre === f.cle ? "bg-primary font-medium" : "bg-white hover:bg-primary/20"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {evenementsAffiches.length === 0 ? (
              <p className="mt-6 text-center text-sm text-secondary/60">
                Aucun événement dans cette catégorie.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {evenementsAffiches.map((evt) => (
                  <CarteEvenement
                    key={evt.id}
                    evenement={evt}
                    onBasculer={() => basculerActif(evt.id)}
                    onModifier={() => modifier(evt)}
                    onSupprimer={() => supprimer(evt.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Colonne de droite : le formulaire */}
          <form
            onSubmit={gererSoumission}
            className="self-start rounded-xl border border-primary bg-white p-5"
          >
            <p className="text-lg">
              {idEnEdition === null ? "Nouvel événement" : "Modifier l'événement"}
            </p>

            <div className="mt-4 space-y-3">
              <label className="flex flex-col gap-1 text-xs">
                Type
                <select
                  name="type"
                  value={formulaire.type}
                  onChange={gererChangement}
                  className={STYLE_CHAMP}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <Champ
                label="Titre"
                name="titre"
                value={formulaire.titre}
                onChange={gererChangement}
                placeholder="Ex. -30% sur toutes les commandes"
                required
              />

              <label className="flex flex-col gap-1 text-xs">
                Description
                <textarea
                  name="description"
                  rows={3}
                  value={formulaire.description}
                  onChange={gererChangement}
                  className={STYLE_CHAMP}
                />
              </label>

              {formulaire.type === "Promotion" && (
                <div className="grid grid-cols-2 gap-3">
                  <Champ
                    label="Réduction"
                    name="reduction"
                    type="number"
                    min="0"
                    max="100"
                    suffixe="%"
                    value={formulaire.reduction}
                    onChange={gererChangement}
                    placeholder="30"
                  />
                  <Champ
                    label="Montant minimum"
                    name="montantMin"
                    type="number"
                    min="0"
                    suffixe="Fcfa"
                    value={formulaire.montantMin}
                    onChange={gererChangement}
                    placeholder="5000"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Champ
                  label="Date de début"
                  name="debut"
                  type="date"
                  value={formulaire.debut}
                  onChange={gererChangement}
                  required
                />
                <Champ
                  label="Date de fin"
                  name="fin"
                  type="date"
                  min={formulaire.debut}
                  value={formulaire.fin}
                  onChange={gererChangement}
                  required
                />
              </div>

              <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-primary-700 p-4 text-center text-xs focus-within:ring-2 focus-within:ring-primary hover:bg-primary/10">
                {formulaire.image ? (
                  <img
                    src={formulaire.image}
                    alt="Aperçu de l'affiche"
                    className="h-24 w-full rounded object-cover"
                  />
                ) : (
                  <FiImage size={22} />
                )}
                <span>{formulaire.image ? "Changer l'image" : "Ajouter une image (JPG, PNG)"}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={gererImage}
                  className="sr-only"
                />
              </label>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs">Afficher sur l'accueil</p>
                  <p className="text-[10px] text-secondary/60">Bannière visible par les clients</p>
                </div>
                <Interrupteur
                  actif={formulaire.actif}
                  onChange={() => setFormulaire({ ...formulaire, actif: !formulaire.actif })}
                  label="Afficher sur l'accueil"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm hover:bg-primary-700"
            >
              {idEnEdition === null ? "Publier l'événement >" : "Enregistrer les modifications >"}
            </button>

            {idEnEdition !== null && (
              <button
                type="button"
                onClick={annulerEdition}
                className="mt-2 w-full text-xs underline"
              >
                Annuler la modification
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
