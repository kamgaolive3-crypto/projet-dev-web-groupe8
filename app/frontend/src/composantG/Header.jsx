import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import logo from "../assets/logo.png";

export default function Header() {
     // menuOuvert indique si le menu déroulant est ouvert.
    const [menuOuvert, setMenuOuvert] = useState(false);
    // useLocation récupère les informations sur l'URL actuelle.
    const location = useLocation();

    // Cet objet associe chaque chemin à un nom de page.
    const pages = {
        "/TableauBordG": "Tableau de bord",
        "/CommandesG": "Commandes",
        "/EmployesG": "Employés",
        "/ReclamationsG": "Réclamations",
        "/StatistiquesG": "Statistiques",
        
    };
    // Recherche le nom correspondant à l'URL actuelle.
    // Si l'URL n'est pas dans l'objet, affiche "Mon MiamMiam".
    const pageActive =
        pages[location.pathname] || "Mon MiamMiam";

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

    return(
        <header className="relative w-full bg-grey border-b border-grey-300">
            <nav className="flex w-full-xl mx-auto items-center justify-between">
                <div className="flex flex-col gap-1">
                    <img src={logo} alt="logo mon miam miam" className="w-15 m-5 mb-0 rounded-[10px]"/>
                    <p className="text-secondary text-sm px-1">Mon MiamMiam</p>
                </div>
                <span className="md:hidden text-primary font-semibold">
                    {/* Affiche Accueil, Menu, Panier ou Fidélité
                        selon l'URL actuelle. */}
                    {pageActive}
                </span>
                <ul className="hidden md:flex item-center gap-5">
                    <li><NavLink to="/TableauBordG" end className={lienStyle}>
                        Tableau de bord</NavLink></li>
                    <li><NavLink to="/EmployesG" end className={lienStyle}>
                        Employés</NavLink></li>
                    <li><NavLink to="/CommandesG" className={lienStyle}>
                        Commandes</NavLink></li>
                    <li><NavLink to="/ReclamationsG"className={lienStyle}>
                        Réclamations</NavLink></li>
                    <li><NavLink to="/StatistiquesG"className={lienStyle}>
                        Statistiques</NavLink></li>
                </ul>
                <div className="hidden md:flex flex-col items-center gap-1 mr-3">
    <span className="text-xs">Reine Cindy</span>
    <Link to="/page_connexion" className="bg-primary text-secondary text-xs px-5 py-1.5 rounded-[10px] cursor-pointer hover:bg-primary-700">
        Déconnexion
    </Link>
</div>
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
                                to="/TableauBordG"
                                end
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Tableau de bord
                            </NavLink>
                        </li>

                        {/* LIEN MENU */}
                        <li>
                            <NavLink
                                to="/CommandesG"
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Commandes  
                            </NavLink>
                        </li>

                        {/* LIEN PANIER */}
                        <li>
                            <NavLink
                                to="/EmployesG"
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Employés
                            </NavLink>
                        </li>

                        {/* LIEN FIDÉLITÉ */}
                        <li>
                            <NavLink
                                to="/ReclamationsG"
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Réclamations
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/StatistiquesG"
                                className={lienStyle}
                                onClick={fermerMenu}
                            >
                                Statistiques
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
                                    hover:bg-primary-700
                                "
                            >
                                Deconnexion
                            </Link>

                        </li>

                    </ul>

                </div>

            )}

        </header>
    )
    
}