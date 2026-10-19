// NavLink : lien react-router qui sait s'il correspond à la page active.
import { NavLink } from "react-router-dom";
// Icônes : panier, couverts, bulle (réclamations), graphique, cloche.
import { FaCartShopping, FaUtensils, FaComment, FaChartColumn, FaBell } from "react-icons/fa6";
// Le logo se trouve dans src/assets (un niveau au-dessus de ce dossier).
import logo from "../assets/logo.png";

// Liste des liens écrite une seule fois : on évite de répéter 4 fois le même code.
const liens = [
    { chemin: "/Commandes", nom: "Commandes", Icone: FaCartShopping },
    { chemin: "/MenuEmp", nom: "Menu", Icone: FaUtensils },
    { chemin: "/Reclamations", nom: "Réclamations", Icone: FaComment },
    { chemin: "/Statistiques", nom: "Statistiques", Icone: FaChartColumn },
];

export default function Header() {
    // Style d'un lien : doré et gras si la page est active, noir sinon.
    const lienStyle = ({ isActive }) =>
        `flex items-center gap-2 text-sm transition-colors duration-200 ${
            isActive
                ? "text-primary font-semibold"
                : "text-secondary hover:text-primary-700"
        }`;

    return (
        <header className="w-full bg-grey border-b border-grey-300">
            <nav className="flex items-center justify-between px-6 py-1">

                {/* ===== GAUCHE : logo + nom du projet ===== */}
                <div className="flex flex-col items-center pt-4">
                    <img src={logo} alt="logo Mon Miam Miam" className="w-10 rounded-md" />
                    <p className="text-[10px] text-secondary">Mon Miam Miam</p>
                </div>

                {/* ===== CENTRE : les 4 liens avec icônes ===== */}
                <ul className="flex items-center gap-12">
                    {liens.map(({ chemin, nom, Icone }) => (
                        <li key={chemin}>
                            <NavLink to={chemin} className={lienStyle}>
                                <Icone size={14} />
                                {nom}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* ===== DROITE : cloche, nom, déconnexion ===== */}
                <div className="flex items-center gap-12">
                    {/* relative : sert de repère pour placer le point rouge */}
                    <div className="relative">
                        <FaBell size={20} />
                        {/* absolute : le point se pose par-dessus la cloche, en haut à droite */}
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-600" />
                    </div>

                    {/* flex-col : le nom passe AU-DESSUS du bouton */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs">Meni Dom Reine</span>
                        <button
                            type="button"
                            className="bg-primary text-secondary text-xs px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary-700"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>

            </nav>
        </header>
    );
}