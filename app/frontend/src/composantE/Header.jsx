import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../services/auth";

// lien de nav : texte noir Inter 25px (maquette) ; la page active porte
// une pill beige #CFBD97 ronde (radius 25px) avec le texte or #C49E4C
export function LienNav({ to, fin, children }) {
    return (
        <NavLink
            to={to}
            end={fin}
            className={({ isActive }) =>
                isActive
                    ? "rounded-[25px] bg-or-clair px-7 py-3 font-sans text-lg text-or md:text-[22px]"
                    : "px-7 py-3 font-sans text-lg text-black hover:text-or-deep md:text-[22px]"
            }
        >
            {children}
        </NavLink>
    );
}

export default function Header() {
    // le header affiche Deconnexion (nom) ou connexion selon l utilisateur
    const { user, deconnexion } = useAuth();
    const [menuOuvert, setMenuOuvert] = useState(false);
    const location = useLocation();

    // nom de la page courante : affiche au centre sur mobile (maquette mobile)
    const pages = {
        "/": "Accueil",
        "/Menu": "Menu",
        "/Panier": "Panier",
        "/Fideliter": "Fidélité",
        "/Reclamation": "Réclamation",
        "/Historique": "Historiques",
    };
    const pageActive = pages[location.pathname] || "Mon Miam Miam";

    const fermerMenu = () => setMenuOuvert(false);

    return (
        <header className="relative z-40 w-full bg-band">
            <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-2 px-4 py-4 md:px-8">
                {/* logo image + nom Instrument Serif (maquette : 15px sous le bloc) */}
                <Link to="/" className="flex flex-col gap-2">
                    <img
                        src={logo}
                        alt="logo Mon Miam Miam"
                        className="h-14 w-14 rounded-[20px] object-cover md:h-16 md:w-16"
                    />
                    <span className="whitespace-nowrap font-instrument text-sm text-black md:text-[15px]">
                        Mon Miam Miam
                    </span>
                </Link>

                {/* titre de page centrale — visible sur mobile uniquement */}
                <span className="absolute left-1/2 -translate-x-1/2 font-inria text-[15px] text-black md:hidden">
                    {pageActive}
                </span>

                {/* navigation desktop : pills Inter (maquette desktop) */}
                <div className="hidden items-center gap-1 md:flex">
                    <LienNav to="/" fin>Accueil</LienNav>
                    <LienNav to="/Menu">Menu</LienNav>
                    <LienNav to="/Panier">Panier</LienNav>
                    <LienNav to="/Fideliter">Fidélité</LienNav>
                </div>

                {/* droite : connexion / deconnexion + nom (Inter 27px) */}
                {user ? (
                    <div className="hidden items-center gap-6 md:flex">
                        <button
                            type="button"
                            onClick={async () => {
                                await deconnexion();
                                window.location.href = "/";
                            }}
                            className="font-sans text-[22px] text-black hover:text-or-deep"
                        >
                            Deconnexion
                        </button>
                        <span className="font-sans text-[22px] text-encre">
                            {user.prenom} {user.nom}
                        </span>
                    </div>
                ) : (
                    <Link
                        to="/page_connexion"
                        className="hidden rounded-[25px] bg-or-clair px-7 py-3 font-sans text-[22px] text-or md:block"
                    >
                        connexion
                    </Link>
                )}

                {/* burger mobile — 3 lignes simples (maquette) */}
                <button
                    type="button"
                    onClick={() => setMenuOuvert(!menuOuvert)}
                    className="flex h-10 w-10 flex-col items-center justify-center gap-[7px] md:hidden"
                    aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={menuOuvert}
                    aria-controls="menu-mobile"
                >
                    {menuOuvert ? (
                        <span className="text-3xl leading-none text-black">×</span>
                    ) : (
                        <>
                            <span className="h-[3px] w-7 bg-black" />
                            <span className="h-[3px] w-7 bg-black" />
                            <span className="h-[3px] w-7 bg-black" />
                        </>
                    )}
                </button>
            </nav>

            {/* tiroir mobile */}
            {menuOuvert && (
                <div
                    id="menu-mobile"
                    className="absolute top-full left-0 z-50 w-full border-b border-filet bg-band shadow-lg md:hidden"
                >
                    <ul className="flex flex-col gap-1 p-4">
                        <li onClick={fermerMenu}><LienNav to="/" fin>Accueil</LienNav></li>
                        <li onClick={fermerMenu}><LienNav to="/Menu">Menu</LienNav></li>
                        <li onClick={fermerMenu}><LienNav to="/Panier">Panier</LienNav></li>
                        <li onClick={fermerMenu}><LienNav to="/Fideliter">Fidélité</LienNav></li>
                        <li className="mt-2 border-t border-filet pt-3">
                            {user ? (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await deconnexion();
                                        window.location.href = "/";
                                    }}
                                    className="block w-full rounded-[15px] bg-or-clair py-2 text-center font-sans text-base text-black"
                                >
                                    Deconnexion ({user.prenom} {user.nom})
                                </button>
                            ) : (
                                <Link
                                    to="/page_connexion"
                                    onClick={fermerMenu}
                                    className="block w-full rounded-[15px] bg-or-clair py-2 text-center font-sans text-base text-or"
                                >
                                    connexion
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
