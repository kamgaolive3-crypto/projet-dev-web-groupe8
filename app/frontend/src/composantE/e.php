
/*
 * IMPORTATIONS
 */

// useState permet de mémoriser l'état d'ouverture du menu mobile.
import { useState } from "react";

// Link permet de naviguer entre les pages sans recharger le site.
// NavLink permet aussi de savoir si un lien correspond à la page active.
// useLocation permet de récupérer l'URL de la page actuelle.
import { Link, NavLink, useLocation } from "react-router-dom";

// FaBars représente l'icône du menu burger.
// FaXmark représente l'icône de fermeture (croix).
import { FaBars, FaXmark } from "react-icons/fa6";

// Importation du logo depuis le dossier assets.
import logo from "../assets/logo.png";


/*
 * COMPOSANT HEADER
 */

export default function Header() {

    /*
     * GESTION DE L'ÉTAT DU MENU MOBILE
     */

    // menuOuvert indique si le menu déroulant est ouvert.
    // false signifie que le menu est fermé au départ.
    // setMenuOuvert permet de modifier cette valeur.
    const [menuOuvert, setMenuOuvert] = useState(false);


    /*
     * RÉCUPÉRATION DE LA PAGE ACTUELLE
     */

    // useLocation récupère les informations sur l'URL actuelle.
    const location = useLocation();

    // Cet objet associe chaque chemin à un nom de page.
    // La clé doit correspondre au chemin défini dans App.jsx.
    const pages = {
        "/": "Accueil",
        "/Menu": "Menu",
        "/Panier": "Panier",
        "/Fideliter": "Fidélité",
    };

    // Recherche le nom correspondant à l'URL actuelle.
    // Si l'URL n'est pas dans l'objet, affiche "Mon MiamMiam".
    const pageActive =
        pages[location.pathname] || "Mon MiamMiam";


    /*
     * STYLE DES LIENS DE NAVIGATION
     */

    // NavLink fournit isActive :
    // true si le lien correspond à la page active,
    // false dans le cas contraire.
    const lienStyle = ({ isActive }) =>
        `transition-colors duration-200 ${
            isActive
                ? "text-primary font-semibold"
                : "text-secondary hover:text-primary"
        }`;

    // Fonction qui ferme le menu mobile.
    const fermerMenu = () => setMenuOuvert(false);


    /*
     * AFFICHAGE DU HEADER
     */

    return (

        // header représente toute la barre de navigation.
        // relative sert de référence au positionnement du menu déroulant.
        // bg-grey définit le fond avec ta couleur personnalisée.
        // border-b ajoute une bordure en bas.
        <header className="relative w-full bg-grey border-b border-grey-300">

            {/* BARRE DE NAVIGATION */}

            <nav
                className="
                    flex
                    w-full
                    max-w-7xl
                    mx-auto
                    items-center
                    justify-between
                    px-3
                    py-2
                "
            >

                {/* LOGO ET NOM DU SITE */}

                {/* Link rend le logo cliquable et renvoie à l'accueil.
                    shrink-0 empêche le bloc de rétrécir excessivement. */}
                <Link
                    to="/"
                    className="flex flex-col items-center shrink-0"
                >

                    {/* Affichage du logo importé depuis assets. */}
                    <img
                        src={logo}
                        alt="Logo Mon Miam Miam"
                        className="
                            w-12
                            h-12
                            object-contain
                            rounded-[10px]
                        "
                    />

                    {/* Nom du site sous le logo. */}
                    <p className="text-secondary text-sm">
                        Mon MiamMiam
                    </p>

                </Link>


                {/* NOM DE LA PAGE ACTIVE SUR MOBILE */}

                {/* md:hidden signifie :
                    visible sur mobile,
                    caché à partir du breakpoint md (écran moyen). */}
                <span className="
                    md:hidden
                    text-primary
                    font-semibold
                ">
                    {/* Affiche Accueil, Menu, Panier ou Fidélité
                        selon l'URL actuelle. */}
                    {pageActive}
                </span>


                {/* NAVIGATION POUR ORDINATEUR */}

                {/* hidden masque la liste par défaut.
                    md:flex l'affiche sur les écrans moyens et grands.
                    items-center aligne les liens verticalement.
                    gap-5 espace les liens. */}
                <ul className="
                    hidden
                    md:flex
                    items-center
                    gap-5
                ">

                    <li>
                        {/* end évite que le lien Accueil soit actif
                            sur toutes les routes commençant par /. */}
                        <NavLink
                            to="/"
                            end
                            className={lienStyle}
                        >
                            Accueil
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/Menu"
                            className={lienStyle}
                        >
                            Menu
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/Panier"
                            className={lienStyle}
                        >
                            Panier
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/Fideliter"
                            className={lienStyle}
                        >
                            Fidélité
                        </NavLink>
                    </li>

                </ul>


                {/* BOUTON CONNEXION SUR ORDINATEUR */}

                {/* hidden masque le bouton sur mobile.
                    md:inline-flex l'affiche sur ordinateur.
                    bg-primary utilise ta couleur principale.
                    rounded-[10px] arrondit les coins.
                    hover:opacity-80 réduit l'opacité au survol. */}
                <Link
                    to="/page_connexion"
                    className="
                        hidden
                        md:inline-flex
                        bg-primary
                        text-secondary
                        px-5
                        py-2
                        rounded-[10px]
                        hover:opacity-80
                        transition
                    "
                >
                    Connexion
                </Link>


                {/* BOUTON BURGER SUR MOBILE */}

                {/* md:hidden masque ce bouton sur ordinateur.
                    onClick inverse l'état du menu à chaque clic.
                    aria-expanded indique si le menu est ouvert.
                    aria-controls associe le bouton au menu déroulant. */}
                <button
                    type="button"
                    onClick={() => setMenuOuvert(!menuOuvert)}
                    className="md:hidden p-2 text-secondary"
                    aria-label={
                        menuOuvert
                            ? "Fermer le menu"
                            : "Ouvrir le menu"
                    }
                    aria-expanded={menuOuvert}
                    aria-controls="menu-mobile"
                >

                    {/* Si menuOuvert vaut true, affiche la croix.
                        Sinon, affiche le burger. */}
                    {menuOuvert
                        ? <FaXmark size={24} />
                        : <FaBars size={24} />}

                </button>

            </nav>


            {/* MENU DÉROULANT POUR MOBILE */}

            {/* menuOuvert && signifie :
                si menuOuvert est true, affiche le menu ;
                s'il est false, ne l'affiche pas.

                absolute positionne le menu sous la barre.
                top-full le place juste après le header.
                left-0 l'aligne à gauche.
                z-50 le place au-dessus du contenu de la page.
                md:hidden le masque sur ordinateur. */}
            {menuOuvert && (

                <div
                    id="menu-mobile"
                    className="
                        absolute
                        top-full
                        left-0
                        z-50
                        w-full
                        bg-grey
                        border-b
                        border-grey-300
                        shadow-lg
                        md:hidden
                    "
                >

                    {/* Liste verticale des liens mobiles. */}
                    <ul className="flex flex-col gap-4 p-5">

                        {/* LIEN ACCUEIL */}
                        <li>
                            <NavLink
                                to="/"
                                end
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Accueil
                            </NavLink>
                        </li>

                        {/* LIEN MENU */}
                        <li>
                            <NavLink
                                to="/Menu"
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Menu
                            </NavLink>
                        </li>

                        {/* LIEN PANIER */}
                        <li>
                            <NavLink
                                to="/Panier"
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Panier
                            </NavLink>
                        </li>

                        {/* LIEN FIDÉLITÉ */}
                        <li>
                            <NavLink
                                to="/Fideliter"
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Fidélité
                            </NavLink>
                        </li>

                        {/* BOUTON CONNEXION DANS LE MENU MOBILE */}

                        {/* border-t ajoute une séparation au-dessus.
                            pt-4 ajoute un espace intérieur en haut. */}
                        <li className="
                            border-t
                            border-grey-300
                            pt-4
                        ">

                            <Link
                                to="/page_connexion"

                                // Ferme le menu après le clic.
                                onClick={fermerMenu}

                                className="
                                    block
                                    w-full
                                    bg-primary
                                    text-secondary
                                    text-center
                                    py-2
                                    rounded-[10px]
                                "
                            >
                                Connexion
                            </Link>

                        </li>

                    </ul>

                </div>

            )}

        </header>
    );
}
