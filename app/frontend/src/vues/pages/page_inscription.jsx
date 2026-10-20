import avatar from "../../assets/profil.png"
//importe un hook qui permet de memoriser une valeur
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//importe la frame en glass et l'image de fond
import GlassCard from "../../Composant/GlassCard";
import GlassPage from "../../Composant/GlassPage";


export default function Signin() {
    const [nom, setnom] = useState("");
    const [prenom, setprenom] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, settelephone] = useState("");
    const [localisation, setlocalisation] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const [chargement, setChargement] = useState(false);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
    const regleMotDePasse = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    //fonction appellée quand envoie le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault(); // empeche le rechargement de la page

        const formulaire = e.currentTarget;
        if (password !== confirmPassword) {
            setErreur("Les mots de passe ne correspondent pas");
            return;
        }

        if (!regleMotDePasse.test(password)) {
            setErreur("Le mot de passe doit contenir 8 caractères, une majuscule et un chiffre");
            return;
        }

        setErreur("");
        setChargement(true);

        try {
            const response = await fetch(`${API_URL}/auth/inscription`, {
                 method: "POST",
                 headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom,
                    prenom,
                    email,
                    telephone,
                    localisation,
                    mot_de_passe: password,
                    mot_de_passe_confirmation: confirmPassword,
                }),
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                const premiereErreur = data.errors
                ? Object.values(data.errors).flat()[0]
                : null;
                throw new Error(premiereErreur || data.message || "Inscription impossible.");
            }
            
            alert("Inscription réussie !");
            formulaire.reset();
            setnom("");
            setprenom("");
            setEmail("");
            settelephone("");
            setlocalisation("");
            setPassword("");
            setConfirmPassword("");

            localStorage.setItem("monmiammiam.token", data.token);
            localStorage.setItem(
                "monmiammiam.utilisateur",
                JSON.stringify({ ...data.utilisateur, role: "etudiant" })
            );

            navigate("/", { replace: true });
        } catch (error) {
            setErreur(error.message);
        } finally {
            setChargement(false);
        }
    };

    return (
        <GlassPage>
            {}
            <GlassCard largeurMax="722px" hauteurMax="1000px">
                <h1 className="text-3xl font-bold text-center mb-0">{/* titre  principal de la page*/}
                    Bienvenue sur Mon Miam Miam 
                </h1>
                <div className="flex flex-col gap-1 mt-0 p-0">
                    <img src={avatar} alt="avatar" className="w-30 h-30 mx-auto"/>
                    <p className="text-secondary text-xs text-center"> Vous avez deja un compte ? {" "}
                        <Link to="/page_connexion" className="text-primary cursor-pointer hover:text-primary-700">
                           connectez vous.
                        </Link>
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="nom" className="text-secondary">
                            Nom 
                        </label>
                        <input id="nom" type="text" autoComplete="family-name" required value={nom} onChange={(e)=> setnom(e.target.value)}
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        <label htmlFor="prenom" className="text-secondary">
                            Prenom 
                        </label>
                        <input id="prenom" type="text" autoComplete="given-name" required value={prenom} onChange={(e)=> setprenom(e.target.value)}
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        <label htmlFor="email" className="text-secondary">
                            Email 
                        </label>
                        <input id="email" type="email"  required value={email} onChange={(e)=> setEmail(e.target.value)}
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        <label htmlFor="telephone" className="text-secondary">
                            Numéro de téléphone 
                        </label>
                        <input id="telephone" type="tel" inputMode="numeric" pattern="6[0-9]{8}" 
                        title="Le numéro doit commencer par 6 et contenir 9 chiffres"required value={telephone} 
                        onChange={(e)=> settelephone(e.target.value)}
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        <label htmlFor="location" className="text-secondary">
                            Localisation 
                        </label>
                        <input id="location" type="text" required value={localisation} onChange={(e)=> setlocalisation(e.target.value)}
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        <label htmlFor="password" className="text-secondary">
                            Mot de passe
                        </label>
                        <input id="password" type="password" required value ={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        {password && !regleMotDePasse.test(password) && 
                        ( <p className="text-xs text-red-600"> 
                        Au moins 8 caractères, une majuscule et un chiffre</p>
                        )}
                        {password && regleMotDePasse.test(password) && 
                        ( <p className="text-xs text-green-600"> 
                        mot de passe correct</p>
                        )}
                        <label htmlFor="confirm" className="text-secondary">
                            Confirmation du mot de passe
                        </label>
                        <input id="confirm" type="password" required value ={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-600">Les mots de passe ne correspondent pas</p>
                        )}
                        <button type="submit"
                        className="bg-primary text-secondary mx-auto w-full max-w-50 min-h-8 rounded-[10px] cursor-pointer hover:bg-primary-700 mt-4">
                            Créer un compte
                        </button>
                    </div>
                </form>
            </GlassCard>
        </GlassPage>
    )
}