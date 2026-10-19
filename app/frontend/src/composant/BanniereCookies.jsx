import { useState } from "react";
import { api } from "../services/api";

// la banniere RGPD reproduit la maquette /cookies :
// assombrissement plein ecran (noir 51%) + carte #F4F4F4 r35 centree ;
// texte Inter + deux boutons "Tout accepter" / "Tout refuser"
// un seul consentement par visiteur, memorise dans le navigateur
const CLE = "cookie-consentement";

export default function BanniereCookies() {
  // si une réponse existe déjà, on n'affiche rien
  const [cache, setCache] = useState(() => !!localStorage.getItem(CLE));

  if (cache) return null;

  // choisie = accepte | refuse | personnalise (mêmes valeurs que la CHECK SQL)
  const enregistrer = async (choix) => {
    localStorage.setItem(CLE, choix);
    setCache(true);
    try {
      // le visiteur non connecté fonctionne aussi : l API accepte Id_utilisateur null
      await api.post("/cookies", { choix_cookies: choix, version_politique: "v1" });
    } catch {
      // le consentement local reste enregistré meme si l API est en panne
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      {/* carte centrale #F4F4F4 r35 (maquette 899x491) */}
      <div className="w-full max-w-[760px] rounded-[35px] bg-ligne p-6 shadow-2xl md:p-10">
        <p className="font-sans text-lg leading-relaxed text-black md:text-[26px]">
          Ce site utilise des cookies afin d&apos;offrir une expérience optimale
          à ses visiteurs. Veuillez accepter les cookies pour une expérience
          optimale.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-end md:gap-6">
          {/* bouton maquette : pill beige r15 */}
          <button
            type="button"
            onClick={() => enregistrer("accepte")}
            className="rounded-[15px] bg-or-clair px-7 py-3 font-sans text-base text-black transition-colors hover:bg-or md:text-xl"
          >
            Tout accepter
          </button>
          {/* reponse "personnalise" possible : meme action qu un refus partiel */}
          <button
            type="button"
            onClick={() => enregistrer("personnalise")}
            className="rounded-[15px] bg-white px-7 py-3 font-sans text-base text-black shadow-sm transition-colors hover:bg-creme-d md:text-xl"
          >
            Personnaliser
          </button>
          <button
            type="button"
            onClick={() => enregistrer("refuse")}
            className="rounded-[15px] bg-white px-7 py-3 font-sans text-base text-black shadow-sm transition-colors hover:bg-creme-d md:text-xl"
          >
            Tout refuser
          </button>
        </div>
      </div>
    </div>
  );
}
