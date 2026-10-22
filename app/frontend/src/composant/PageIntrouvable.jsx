import { Link } from "react-router-dom";

// 404 : toute URL inconnue (ex : /Commandes tapee a la main) affiche une page
// utile au lieu d un ecran blanc
export default function PageIntrouvable() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="font-instrument text-[64px] leading-none text-or-deep">404</p>
            <h1 className="font-inria text-2xl font-bold">Page introuvable</h1>
            <p className="text-sm text-gray-600">
                Cette adresse n&apos;existe pas — le menu, votre panier et votre historique restent accessibles.
            </p>
            <Link to="/" className="miam-cta mt-2">Retour à l&apos;accueil</Link>
        </div>
    );
}
