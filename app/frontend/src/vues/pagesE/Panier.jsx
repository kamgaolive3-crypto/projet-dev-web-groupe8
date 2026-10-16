// src/vues/pagesE/Panier.jsx
// Page "Mon panier" (route /Panier).
// La page garde l'état (panier, mode, heure) et délègue :
//   - la logique aux classes (Panier, Commande, ModeService, PanierRepository)
//   - l'affichage aux composants (ArticlePanier, RecapCommande)
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import PanierRepository from "../../modeles/PanierRepository.js";
import Commande from "../../modeles/Commande.js";
import { SurPlace, Livraison } from "../../modeles/ModeService.js";
import { panierDeTest } from "../../modeles/donneesTest.js";
import ArticlePanier from "../../composantE/panier/ArticlePanier.jsx";
import RecapCommande from "../../composantE/panier/RecapCommande.jsx";

// Créés une seule fois, hors du composant.
const MODES = [new SurPlace(), new Livraison()];

export default function Panier() {
  const [panier, setPanier] = useState(() => PanierRepository.charger());
  const [mode, setMode] = useState(MODES[0]);
  const [heure, setHeure] = useState("");

  // À chaque changement : on met à jour l'écran ET la sauvegarde.
  function mettreAJour(nouveauPanier) {
    setPanier(nouveauPanier);
    PanierRepository.sauvegarder(nouveauPanier);
  }

  const commande = new Commande(panier, mode, { heureArrivee: heure });

  function confirmer() {
    // TODO (étape suivante) : envoyer la commande à l'API (POST /orders).
    console.log("Commande prête à être envoyée :", JSON.stringify(commande, null, 2));
  }

  if (panier.estVide) {
    return (
      <section className="min-h-[70vh] bg-white px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-xl border border-grey-300 bg-grey px-6 py-16 text-center">
          <span className="text-xl font-medium text-secondary">Votre panier est vide</span>
          <span className="text-sm text-secondary/70">
            Ajoutez des plats depuis le menu pour passer commande.
          </span>
          <Link
            to="/Menu"
            className="rounded-lg bg-primary px-5 py-2 font-medium text-secondary transition hover:bg-primary-700"
          >
            Voir le menu
          </Link>
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => mettreAJour(panierDeTest())}
              className="text-sm text-secondary/60 underline"
            >
              [Test] Remplir avec des articles de test
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Le "!" à la fin force le style : index.css contient des règles h1 par défaut */}
        <h1 className="m-0! flex items-center gap-3 text-2xl! font-semibold tracking-normal! text-secondary!">
          <FiShoppingCart aria-hidden="true" />
          Mon panier
        </h1>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-4">
            {panier.lignes.map((ligne) => (
              <ArticlePanier
                key={ligne.article.id}
                ligne={ligne}
                onChangerQuantite={(quantite) =>
                  mettreAJour(panier.modifierQuantite(ligne.article.id, quantite))
                }
              />
            ))}
          </div>

          <RecapCommande
            commande={commande}
            modes={MODES}
            mode={mode}
            onChangerMode={setMode}
            heure={heure}
            onChangerHeure={setHeure}
            onConfirmer={confirmer}
          />
        </div>
      </div>
    </section>
  );
}