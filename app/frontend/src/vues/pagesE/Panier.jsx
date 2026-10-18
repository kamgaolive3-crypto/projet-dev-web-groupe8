// src/vues/pagesE/Panier.jsx
// Page "Mon panier" (route /Panier).
// La page garde l'état (panier, mode, heure) et délègue :
//   - la logique aux classes (Panier, Commande, ModeService, PanierRepository)
//   - l'affichage aux composants (ArticlePanier, RecapCommande, BlocReclamation)
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiShoppingCart } from "react-icons/fi";
import PanierRepository from "../../modeles/PanierRepository.js";
import FideliteService from "../../services/FideliteService.js";
import Commande from "../../modeles/Commande.js";
import { SurPlace, Livraison } from "../../modeles/ModeService.js";
import { panierDeTest } from "../../modeles/donneesTest.js";
import ArticlePanier from "../../composantE/panier/ArticlePanier.jsx";
import RecapCommande from "../../composantE/panier/RecapCommande.jsx";
import BlocReclamation from "../../composantE/panier/BlocReclamation.jsx";

// Créés une seule fois, hors du composant.
const MODES = [new SurPlace(), new Livraison()];

export default function Panier() {
  const [panier, setPanier] = useState(() => PanierRepository.charger());
  const [mode, setMode] = useState(MODES[0]);
  const [heure, setHeure] = useState("");
  const [compte, setCompte] = useState(null); // points de fidélité de l'étudiant
  const [utiliserPoints, setUtiliserPoints] = useState(false);

  useEffect(() => {
    FideliteService.compte().then(setCompte);
  }, []);

  // À chaque changement : on met à jour l'écran ET la sauvegarde.
  function mettreAJour(nouveauPanier) {
    setPanier(nouveauPanier);
    PanierRepository.sauvegarder(nouveauPanier);
  }

  // La réduction n'existe que si l'étudiant coche "Utiliser mes points" (et a assez de points)
  const reduction = utiliserPoints && compte?.peutUtiliserPoints ? compte.reductionDisponible : 0;
  const commande = new Commande(panier, mode, { heureArrivee: heure, reduction });

  function confirmer() {
    // TODO (étape suivante) : envoyer la commande à l'API (POST /orders).
    console.log("Commande prête à être envoyée :", JSON.stringify(commande, null, 2));
  }

  return (
    <section className="min-h-[70vh] bg-grey/50 px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Titre + sous-titre + lien vers l'historique (comme sur la maquette) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 text-secondary">
            <FiShoppingCart size={32} aria-hidden="true" />
            <div className="flex flex-col">
              {/* Le "!" à la fin force le style : index.css contient des règles h1 par défaut */}
              <h1 className="m-0! text-2xl! font-bold! tracking-normal! text-secondary!">
                Mon panier
              </h1>
              <span className="text-xs text-secondary/70">
                Vérifiez vos plats avant de passer commande
              </span>
            </div>
          </div>

          {/* La route /Historique sera à ajouter dans App.jsx quand la page existera */}
          {/* Sur téléphone : seulement l'icône (comme la maquette mobile). Le texte revient dès "sm". */}
          <Link
            to="/Historique"
            aria-label="Historique des commandes"
            className="flex shrink-0 items-center gap-2 rounded-full bg-primary p-2.5 text-sm font-medium text-secondary transition hover:bg-primary-700 sm:px-4 sm:py-2"
          >
            <FiClock size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Historique des commandes</span>
          </Link>
        </div>

        {panier.estVide ? (
          <>
            <div className="flex flex-col items-center gap-4 rounded-xl border border-grey-300 bg-white px-6 py-14 text-center shadow-sm">
              <span className="font-serif text-3xl font-medium text-secondary">
                Votre panier est vide
              </span>
              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={() => mettreAJour(panierDeTest())}
                  className="text-sm text-secondary/60 underline"
                >
                  [Test] Remplir avec les plats de la maquette
                </button>
              )}
            </div>
            <div className="lg:w-2/3">
              <BlocReclamation />
            </div>
          </>
        ) : (
          // Ordre dans le code = ordre sur mobile : plats, récapitulatif, réclamation.
          // Sur ordinateur (lg), plats et réclamation vont à gauche, le récapitulatif à droite.
          <div className="grid items-start gap-x-6 gap-y-8 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-3 rounded-xl border border-grey-300 bg-white p-4 shadow-sm lg:col-start-1">
              {panier.lignes.map((ligne) => (
                <ArticlePanier
                  key={ligne.article.id}
                  ligne={ligne}
                  onChangerQuantite={(quantite) =>
                    mettreAJour(panier.modifierQuantite(ligne.article.id, quantite))
                  }
                  onRetirer={() => mettreAJour(panier.retirer(ligne.article.id))}
                />
              ))}
            </div>

            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <RecapCommande
                commande={commande}
                modes={MODES}
                mode={mode}
                onChangerMode={setMode}
                heure={heure}
                onChangerHeure={setHeure}
                onChangerUtiliserPoints={setUtiliserPoints}
                compte={compte}
                utiliserPoints={utiliserPoints}
                onConfirmer={confirmer}
              />
            </div>

            <div className="lg:col-start-1">
              <BlocReclamation />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
