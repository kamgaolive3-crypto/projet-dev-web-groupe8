import { useState } from "react";
import { api } from "../services/api";

// la banniere RGPD : un seul consentement par visiteur, mémorisé dans le navigateur
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
    <div className="fixed inset-x-3 bottom-3 z-50 flex flex-col gap-3 rounded-2xl border border-[#CFBD97] bg-white/95 p-4 shadow-2xl md:flex-row md:items-center md:justify-between">
      <p className="text-xs text-black md:text-sm">
        Nous utilisons des cookies pour améliorer votre expérience (panier, session, statistiques anonymisées).
        Voulez-vous les accepter ? Vous pouvez changer d avis à tout moment.
      </p>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => enregistrer("accepte")}
          className="rounded-full bg-[#CFBD97] px-4 py-1.5 text-xs font-semibold hover:brightness-95">
          Tout accepter
        </button>
        <button onClick={() => enregistrer("personnalise")}
          className="rounded-full border border-[#CFBD97] px-4 py-1.5 text-xs hover:bg-[#CFBD97]/20">
          Personnaliser
        </button>
        <button onClick={() => enregistrer("refuse")}
          className="rounded-full border border-black px-4 py-1.5 text-xs hover:bg-gray-100">
          Refuser
        </button>
      </div>
    </div>
  );
}
