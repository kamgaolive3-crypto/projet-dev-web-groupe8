// src/composantE/fidelite/CarteFidelite.jsx
// Carte blanche avec un titre : réutilisée par les 3 blocs de la page Fidélité.
export default function CarteFidelite({ titre, children }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-grey-300 bg-white p-5 shadow-sm">
      {/* Le "!" à la fin force le style : index.css contient des règles h2 par défaut */}
      <h2 className="m-0! text-base! font-serif! font-semibold! text-secondary!">{titre}</h2>
      {children}
    </section>
  );
}
