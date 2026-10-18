// src/vues/pagesE/Fideliter.jsx
// Page "Programme de fidélité" (route /Fideliter).
// La page charge les données via FideliteService et les passe aux composants.
import { useEffect, useState } from "react";
import FideliteService from "../../services/FideliteService.js";
import CarteSolde from "../../composantE/fidelite/CarteSolde.jsx";
import TableauPoints from "../../composantE/fidelite/TableauPoints.jsx";
import BlocParrainage from "../../composantE/fidelite/BlocParrainage.jsx";
import ClassementClients from "../../composantE/fidelite/ClassementClients.jsx";

export default function Fideliter() {
  const [donnees, setDonnees] = useState(null); // compte + historique + parrainage
  const [periode, setPeriode] = useState("mois");
  const [classement, setClassement] = useState([]);

  // Chargement unique des données du client
  useEffect(() => {
    Promise.all([
      FideliteService.compte(),
      FideliteService.historiquePoints(),
      FideliteService.parrainage(),
    ]).then(([compte, historique, parrainage]) => setDonnees({ compte, historique, parrainage }));
  }, []);

  // Le classement est rechargé à chaque changement de période
  useEffect(() => {
    FideliteService.topClients(periode).then(setClassement);
  }, [periode]);

  return (
    <section className="min-h-[70vh] bg-grey/50 px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          {/* Le "!" à la fin force le style : index.css contient des règles h1 par défaut */}
          <h1 className="m-0! text-2xl! font-serif! font-bold! tracking-normal! text-secondary!">
            Programme de fidélité
          </h1>
          <span className="text-xs text-secondary/70">
            1 000 F dépensés = 1 point · 15 points = 1 000 F de réduction
          </span>
        </div>

        {donnees ? (
          <>
            <CarteSolde compte={donnees.compte} />
            <div className="grid items-start gap-6 md:grid-cols-2">
              <TableauPoints historique={donnees.historique} />
              <BlocParrainage parrainage={donnees.parrainage} />
            </div>
            <ClassementClients
              classement={classement}
              periode={periode}
              onChangerPeriode={setPeriode}
            />
          </>
        ) : (
          <span className="text-secondary/70">Chargement…</span>
        )}
      </div>
    </section>
  );
}
