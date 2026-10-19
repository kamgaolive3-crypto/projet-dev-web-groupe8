// Page de connexion selon la maquette :
// titre "Bienvenue sur Mon Miam Miam" (Inter Bold 30px) ;
// labels Inter Regular 20px ; champs translucides r5px ;
// lien "Mot de passe oublié ?" or ; CTA "Se connecter" beige r15px
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
            <AuthCarte>
                <h1 className="text-center font-sans text-2xl font-bold text-black md:text-3xl">
                    Bienvenue sur Mon Miam Miam
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    {erreur && (
                        <p className="rounded-[10px] bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                            {erreur}
                        </p>
                    )}

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-sans text-base text-black md:text-lg">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-[5px] bg-white/40 px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-or"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-sans text-base text-black md:text-lg">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                            title="Au moins 8 caractères, une majuscule et un chiffre"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-[5px] bg-white/40 px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-or"
                        />
                        {password && !regleMotDePasse.test(password) && (
                            <p className="text-xs text-red-700">
                                Au moins 8 caractères, une majuscule et un chiffre
                            </p>
                        )}
                        {/* lien maquette : Inter Bold 20px or */}
                        <Link
                            to="/page_reset"
                            className="self-end font-sans text-sm font-bold text-or-clair hover:underline md:text-lg"
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>

                    {/* CTA Se connecter : pill beige r15 (maquette 293x53, Inter Medium 24px) */}
                    <button
                        type="submit"
                        className="mx-auto mt-2 block w-full max-w-[300px] rounded-[15px] bg-or-clair py-3 font-sans text-lg font-medium text-black transition-colors hover:bg-or md:text-[22px]"
                    >
                        Se connecter
                    </button>

                    <p className="text-center font-sans text-sm text-black md:text-base">
                        Vous n&apos;avez pas de compte ?{" "}
                        <Link to="/page_inscription" className="font-medium text-or hover:underline">
                            Créer un nouveau compte
                        </Link>
                    </p>
                </form>
            </AuthCarte>
        </AuthFond>
    )
}
