// Page d inscription selon la maquette (raffinee) :
// Nom et prenoms (Nom | prenom), Email, telephone, Localisation,
// Code de parrainage optionnel, Mot de passe, Confirmer ;
// CTA "Créer un compte" beige ; bas de carte "Connectez-vous"
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
            <AuthCarte erreur={!!erreur}>
                <h1 className="text-center font-sans text-[19px] font-bold tracking-tight text-black md:text-[22px]">
                    Bienvenue sur Mon Miam Miam
                </h1>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5">
                    {erreur && (
                        <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
                            {erreur}
                        </p>
                    )}

                    {/* nom + prenom cote a cote (maquette "Nom | prénom") */}
                    <div className="flex gap-2">
                        <div className="flex w-1/2 flex-col gap-1">
                            <label htmlFor="nom" className="miam-etiquette">Nom</label>
                            <input
                                id="nom"
                                type="text"
                                autoComplete="family-name"
                                required
                                placeholder="SOUME"
                                value={nom}
                                onChange={(e) => setnom(e.target.value)}
                                className="miam-champ"
                            />
                        </div>
                        <div className="flex w-1/2 flex-col gap-1">
                            <label htmlFor="prenom" className="miam-etiquette">Prenom</label>
                            <input
                                id="prenom"
                                type="text"
                                autoComplete="given-name"
                                required
                                placeholder="Louis"
                                value={prenom}
                                onChange={(e) => setprenom(e.target.value)}
                                className="miam-champ"
                            />
                        </div>
                    </div>

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
                        <label htmlFor="telephone" className="miam-etiquette">Numéro de téléphone</label>
                        <input
                            id="telephone"
                            type="tel"
                            inputMode="numeric"
                            pattern="6[0-9]{8}"
                            title="Le numéro doit commencer par 6 et contenir 9 chiffres"
                            required
                            value={telephone}
                            onChange={(e) => settelephone(e.target.value)}
                            className="miam-champ"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="location" className="miam-etiquette">Localisation</label>
                        <input
                            id="location"
                            type="text"
                            required
                            value={localisation}
                            onChange={(e) => setlocalisation(e.target.value)}
                            className="miam-champ"
                        />
                    </div>

                    {/* code de parrainage optionnel (le champ existe toujours dans la base) */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="code_parrainage" className="miam-etiquette">
                            Code de parrainage <span className="font-normal text-gris-pa">(optionnel)</span>
                        </label>
                        <input
                            id="code_parrainage"
                            type="text"
                            title="4 lettres majuscules suivi de 4 chiffres"
                            pattern="[A-Z]{4}[0-9]{4}"
                            value={codeParrainage}
                            onChange={(e) => setCodeParrainage(e.target.value.toUpperCase())}
                            className="miam-champ"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="miam-etiquette">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="miam-champ"
                        />
                        {password && !regleMotDePasse.test(password) && (
                            <p className="text-[11.5px] text-red-700">
                                Au moins 8 caractères, une majuscule et un chiffre
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirm" className="miam-etiquette">Confirmer le mot de passe</label>
                        <input
                            id="confirm"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="miam-champ"
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-[11.5px] text-red-700">Les mots de passe ne correspondent pas</p>
                        )}
                    </div>

                    {/* CTA Creer un compte : pill beige (maquette) */}
                    <button
                        type="submit"
                        className="miam-cta mt-1 h-11 w-full text-[15px]"
                    >
                        Créer un compte
                    </button>

                    <p className="text-center font-sans text-[13px] text-black">
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
