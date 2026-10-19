// Carte de plat pour la page d accueil (grille "Menu du jours")
// reprend le style maquette : fond blanc, coins r30, CTA beige #CFBD97 r15
import platMaquette from "../../../public/maq/maq_plat.jpg";

export default function CartePlat({ plat, onAjouter, ajoute }) {
    return (
        <article className="flex flex-col items-center overflow-hidden rounded-[30px] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <img
                src={plat.image || platMaquette}
                alt={plat.nom}
                className="h-56 w-full rounded-[20px] object-cover md:h-[300px]"
            />

            <p className="mt-4 font-inria text-base text-black md:text-lg">{plat.nom}</p>
            <p className="mt-1 font-inria text-xl text-or-deep md:text-2xl">
                {plat.prix}Fcfa
            </p>

            <span className="mt-4 block h-[2px] w-11/12 bg-filet" />

            <button
                type="button"
                onClick={() => onAjouter(plat)}
                className="mt-4 block w-full max-w-[305px] rounded-[15px] bg-or-clair py-3 font-inria text-lg text-black transition-colors hover:bg-or md:text-xl"
            >
                {ajoute ? "Ajouté ✓" : "Ajouter"}
            </button>
        </article>
    )
}
