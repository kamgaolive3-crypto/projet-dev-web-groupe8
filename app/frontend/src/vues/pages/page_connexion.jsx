// Page de connexion selon la maquette (raffinee) :
// titre "Bienvenue sur Mon Miam Miam" ; labels fins ; champs translucides
// avec focus or ; lien "Mot de passe oublié ?" ; CTA "Se connecter" beige
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../services/auth";
import AuthFond, { AuthCarte } from "../../composant/AuthFond";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();
    const { connexion } = useAuth();
    const regleMotDePasse = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    //fonction appellée quand envoie le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!regleMotDePasse.test(password)) {
            setErreur("Le mot de passe doit contenir 8 caractères, une majuscule et un chiffre");
            return;
        }
        setErreur("");
        try {
            const reponse = await connexion(email, password);
            // redirection selon le role : le staff va dans son espace, l etudiant a l accueil
            if (reponse.role && reponse.role !== "etudiant") {
                navigate("/TableauBord");
            } else {
                navigate("/");
            }
        } catch (err) {
            const detail = err.champs ? Object.values(err.champs).flat().join(" - ") : null;
            setErreur(detail || err.message || "Connexion echouee");
        }
    }

    return (
        <AuthFond>
            <AuthCarte erreur={!!erreur}>
                <h1 className="text-center font-sans text-[19px] font-bold tracking-tight text-black md:text-[22px]">
                    Bienvenue sur Mon Miam Miam
                </h1>

                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
                    {erreur && (
                        <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
                            {erreur}
                        </p>
                    )}

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="miam-etiquette">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="miam-champ"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="miam-etiquette">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                            title="Au moins 8 caractères, une majuscule et un chiffre"
                            onChange={(e) => setPassword(e.target.value)}
                            className="miam-champ"
                        />
                        {password && !regleMotDePasse.test(password) && (
                            <p className="text-[11.5px] text-red-700">
                                Au moins 8 caractères, une majuscule et un chiffre
                            </p>
                        )}
                        {/* lien maquette : or */}
                        <Link
                            to="/page_reset"
                            className="self-end font-sans text-[12.5px] font-semibold text-or transition-colors hover:text-or-deep hover:underline"
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>

                    {/* CTA Se connecter : pill beige (maquette) */}
                    <button
                        type="submit"
                        className="miam-cta mt-1 h-11 w-full text-[15px]"
                    >
                        Se connecter
                    </button>

                    <p className="text-center font-sans text-[13px] text-black">
                        Vous n&apos;avez pas de compte ?{" "}
                        <Link to="/page_inscription" className="font-medium text-or-deep hover:underline">
                            Créer un compte
                        </Link>
                    </p>
                </form>
            </AuthCarte>
        </AuthFond>
    )
}
