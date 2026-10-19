// Carte de plat (grille "Menu du jours" de l accueil) — style maquette
// raffine : coins souples, ombre ambiante, photo au ratio 4/3 qui zoome
// legerement au survol, apparition en cascade (delai passe par le parent)
export default function CartePlat({ plat, onAjouter, ajoute, delai = 0 }) {
    return (
        <article
            className="miam-carte group flex flex-col overflow-hidden p-3"
            style={{ animation: "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both", animationDelay: delai + "ms" }}
        >
            <div className="overflow-hidden rounded-xl">
                <img
                    src={plat.image}
                    alt={plat.nom}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
            </div>

            <div className="flex flex-col items-center px-1 pb-1 pt-3.5">
                <p className="font-inria text-[15px] text-black">{plat.nom}</p>
                <p className="mt-0.5 font-inria text-[17px] font-bold tracking-tight text-or-deep">
                    {plat.prix}Fcfa
                </p>

                <span className="miam-filet mt-3" />

                <button
                    type="button"
                    onClick={() => onAjouter(plat)}
                    className="miam-cta mt-3 w-full max-w-[260px] active:scale-[0.97]"
                >
                    {ajoute ? "Ajouté ✓" : "Ajouter au panier"}
                </button>
            </div>
        </article>
    )
}
