import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import logo from "../assets/logo.png";
import { useAuth } from "../services/auth";

// EN-TETE DE L ESPACE GERANT :
const pages = {
    "/TableauBordG": "Tableau de bord",
    "/CommandesG" : "Commandes",
    "/Employes": "Employés",
    "/ReclamationA": "Réclamations",
    "/Statistiques": "Statistiques",
};

const liens = [
    ["/TableauBordG", "Tableau de bord"],
    ["/CommandesG", "Commandes"],
    ["/Employes", "Employés"],
    ["/ReclamationA", "Réclamations"],
    ["/Statistiques", "Statistiques"],
];

export default function Header() {
    const { user, deconnexion } = useAuth();
    const [menuOuvert, setMenuOuvert] = useState(false);
    const location = useLocation();

    const pageActive = pages[location.pathname] || "Mon MiamMiam";

    const lienStyle = ({ isActive }) =>
        "rounded-full px-3 py-1 text-xs transition-colors duration-200 " +
        (isActive
            ? "bg-[#CFBD97] font-semibold text-white"
            : "text-secondary hover:bg-[#f5f1e6]");

    const fermerMenu = () => setMenuOuvert(false);
    const initiale = (user?.prenom || user?.nom || "S").charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-grey-300 bg-grey">
            <nav className="mx-auto flex w-full items-center justify-between gap-3 px-4 py-2">
                <Link to="/TableauBordG" className="flex flex-col gap-1">
                    <img src={logo} alt="logo mon miam miam" className="m-3 mb-0 w-15 rounded-[10px]" />
                    <p className="px-1 text-sm text-secondary">Mon MiamMiam</p>
                </Link>

                <ul className="hidden items-center gap-1 lg:flex">
                    {liens.map(([chemin, libelle]) => (
                        <li key={chemin}>
                            <NavLink to={chemin} end={chemin === "/TableauBordG"} className={lienStyle}>
                                {libelle}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-2 lg:flex">
                    {user && (
                        <span className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f1e6] text-xs font-bold text-[#b8862d]">
                                {initiale}
                            </span>
                            <span className="text-xs">
                                {user.prenom || user.nom || user.email}
                                <span className="ml-1 text-gray-500">· {user.role}</span>
                            </span>
                        </span>
                    )}
                    <button
                        type="button" 
                        onClick={async () => { await deconnexion(); window.location.href = "/"; }}
                        className="cursor-pointer rounded-[10px] bg-primary px-5 py-2 text-secondary hover:bg-primary-700"
                    >
                        Deconnexion
                    </button>
                </div>

                <span className="text-sm font-semibold text-primary lg:hidden">{pageActive}</span>
                <button
                    type="button"
                    onClick={() => setMenuOuvert(!menuOuvert)}
                    className="p-2 text-secondary lg:hidden"
                >
                    {menuOuvert ? <FaXmark size={24} /> : <FaBars size={24} />}
                </button>
            </nav>
            {menuOuvert && (
                <div className="absolute left-0 top-full z-50 w-full border-b border-grey-300 bg-grey shadow-lg lg:hidden">
                    <ul className="flex flex-col gap-3 p-5">
                        {liens.map(([chemin, libelle]) => (
                            <li key={chemin}>
                                <NavLink to={chemin} end={chemin === "/TableauBordG"} className={lienStyle} onClick={fermerMenu}>
                                    {libelle}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}
