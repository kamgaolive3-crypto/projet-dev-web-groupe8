import { useState } from "react";

// bouton flottant (bas droite, present sur toutes les pages) : bascule
// clair / sombre. Le choix est memorise (localStorage "miam_theme") et
// applique au demarrage dans main.jsx (aucun flash de theme).
export default function BasculeTheme() {
    const [sombre, setSombre] = useState(() =>
        document.documentElement.classList.contains("dark"));

    const basculer = () => {
        const nouveau = !sombre;
        setSombre(nouveau);
        document.documentElement.classList.toggle("dark", nouveau);
        localStorage.setItem("miam_theme", nouveau ? "dark" : "light");
    };

    return (
        <button
            type="button"
            onClick={basculer}
            aria-label={sombre ? "Passer en mode clair" : "Passer en mode sombre"}
            title={sombre ? "Mode clair" : "Mode sombre"}
            className="fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-[#CFBD97] text-black shadow-hover transition-transform duration-150 hover:scale-105 active:scale-95"
        >
            {sombre ? (
                /* soleil : mode sombre actif -> cliquer pour revenir au clair */
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" />
                    <path d="M12 2.5v2.5M12 19v2.5M2.5 12h2.5M19 12h2.5M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" />
                </svg>
            ) : (
                /* lune : mode clair actif -> cliquer pour le sombre */
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5 8.6 8.6 0 1 0 20.5 14.6Z" />
                </svg>
            )}
        </button>
    );
}
