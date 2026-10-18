export default function CartePlat({ plat, onAjouter, ajoute }) {
    return (
        <div className="rounded-xl border border-[#CFBD97] bg-white p-3">
            <img
                src={plat.image}
                alt={plat.nom}
                className="h-44 w-full rounded-lg object-cover md:h-52"
            />

            <div className="mt-2 flex items-center justify-between border-b border-[#efe6d0] pb-1 text-sm">
                <span>{plat.nom}</span>
                <span className="font-semibold text-[#b8862d]">{plat.prix} Fcfa</span>
            </div>

            <button
                onClick={() => onAjouter(plat)}
                className="mx-auto mt-3 block w-3/5 rounded-full bg-[#CFBD97] py-1 text-sm text-white"
            >
                {ajoute ? "Ajouté ✓" : "Ajouter"}
            </button>
        </div>
    )
}