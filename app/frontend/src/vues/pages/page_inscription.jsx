// Page d inscription selon la maquette :
// "Nom et prenoms" (nom + prenom), Email, telephone, Localisation,
// Mot de passe, Confirmer ; CTA "Creer un compte" beige r15 ;
// bas de carte "Vous avez deja un compte ? Connectez-vous"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import AuthFond, { AuthCarte } from "../../composant/AuthFond";

export default function Signin() {
    const [nom, setnom] = useState("");
    const [prenom, setprenom] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, settelephone] = useState("");
    const [localisation, setlocalisation] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const [codeParrainage, setCodeParrainage] = useState("");
    const navigate = useNavigate();
    const { inscription } = useAuth();
    const regleMotDePasse = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    //style commun des champs (maquette : translucides r5px)
    const champ =
        "w-full rounded-[5px] bg-white/40 px-3 py-2.5 text-black outline-none focus:ring-2 focus:ring-or";
    const etiquette = "font-sans text-base text-black md:text-lg";

    //fonction appellée quand envoie le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault(); // empeche le rechargement
        if (password !== confirmPassword) {
            setErreur("Les mots de passe ne correspondent pas");
            return;
        }
        if (!regleMotDePasse.test(password)) {
            setErreur("Le mot de passe doit contenir 8 caractères, une majuscule et un chiffre");
            return;
        }
        setErreur("");
        try {
            await inscription({
                nom,
                prenom,
                email,
                telephone,
                localisation,
                mot_de_passe: password,
                mot_de_passe_confirmation: confirmPassword,
                code_parrainage: codeParrainage || null,
            });
            navigate("/");
        } catch (err) {
            const detail = err.champs ? Object.values(err.champs).flat().join(" - ") : null;
            setErreur(detail || err.message || "Inscription echouee");
        }
    }

    return (
        <AuthFond>
            <AuthCarte>
                <h1 className="text-center font-sans text-2xl font-bold text-black md:text-3xl">
                    Bienvenue sur Mon Miam Miam
                </h1>

                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                    {erreur && (
                        <p className="rounded-[10px] bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                            {erreur}
                        </p>
                    )}

                    <div className="flex flex-col gap-1">
                        <label htmlFor="nom" className={etiquette}>
                            Nom et prenoms
                        </label>
                        {/* la maquette propose "Nom | prénom" : deux champs cote a cote */}
                        <div className="flex gap-2">
                            <input
                                id="nom"
                                type="text"
                                autoComplete="family-name"
                                required
                                placeholder="Nom"
                                value={nom}
                                onChange={(e) => setnom(e.target.value)}
                                className={champ}
                            />
                            <input
                                id="prenom"
                                type="text"
                                autoComplete="given-name"
                                required
                                placeholder="prénom"
                                value={prenom}
                                onChange={(e) => setprenom(e.target.value)}
                                className={champ}
                            />
                        </div>

                        <label htmlFor="email" className={etiquette + " mt-1"}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={champ}
                        />

                        <label htmlFor="telephone" className={etiquette + " mt-1"}>
                            Numéro de téléphone
                        </label>
                        <input
                            id="telephone"
                            type="tel"
                            inputMode="numeric"
                            pattern="6[0-9]{8}"
                            title="Le numéro doit commencer par 6 et contenir 9 chiffres"
                            required
                            value={telephone}
                            onChange={(e) => settelephone(e.target.value)}
                            className={champ}
                        />

                        <label htmlFor="location" className={etiquette + " mt-1"}>
                            Localisation
                        </label>
                        <input
                            id="location"
                            type="text"
                            required
                            value={localisation}
                            onChange={(e) => setlocalisation(e.target.value)}
                            className={champ}
                        />

                        {/* code de parrainage optionnel (le champ existe toujours dans la base) */}
                        <label htmlFor="code_parrainage" className={etiquette + " mt-1"}>
                            Code de parrainage (optionnel)
                        </label>
                        <input
                            id="code_parrainage"
                            type="text"
                            title="4 lettres majuscules suivi de 4 chiffres"
                            pattern="[A-Z]{4}[0-9]{4}"
                            value={codeParrainage}
                            onChange={(e) => setCodeParrainage(e.target.value.toUpperCase())}
                            className={champ}
                        />

                        <label htmlFor="password" className={etiquette + " mt-1"}>
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={champ}
                        />
                        {password && !regleMotDePasse.test(password) && (
                            <p className="text-xs text-red-700">
                                Au moins 8 caractères, une majuscule et un chiffre
                            </p>
                        )}

                        <label htmlFor="confirm" className={etiquette + " mt-1"}>
                            Confirmer le mot de passe
                        </label>
                        <input
                            id="confirm"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={champ}
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-700">Les mots de passe ne correspondent pas</p>
                        )}
                    </div>

                    {/* CTA Creer un compte : pill beige r15 (maquette 293x53) */}
                    <button
                        type="submit"
                        className="mx-auto mt-3 block w-full max-w-[300px] rounded-[15px] bg-or-clair py-3 font-sans text-lg font-medium text-black transition-colors hover:bg-or md:text-[22px]"
                    >
                        Créer un compte
                    </button>

                    <p className="text-center font-sans text-xs text-black md:text-sm">
                        Vous avez déjà un compte ?{" "}
                        <Link to="/page_connexion" className="font-medium text-or-deep hover:underline">
                            Connectez-vous
                        </Link>
                    </p>
                </form>
            </AuthCarte>
        </AuthFond>
    )
}
