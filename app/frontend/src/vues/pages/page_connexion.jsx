//importe l'avatar en image
import avatar from "../../assets/profil.png"
//importe un hook qui permet de memoriser une valeur
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
//importe la frame en glass et l'image de fond
import GlassCard from "../../Composant/GlassCard";
import GlassPage from "../../Composant/GlassPage";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const [chargement, setChargement] = useState(false);
    const navigate = useNavigate();
    const regleMotDePasse = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    const API_URL = import.meta.env.VITE_API_URL

    //fonction appellée quand envoie le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur("");
        setChargement(true);

        try {
            const response = await fetch(`${API_URL}/auth/connexion`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    mot_de_passe: password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const premiereErreur = data.errors
                    ? Object.values(data.errors).flat()[0]
                    : null;

                throw new Error(premiereErreur || data.message || "Connexion impossible.");
            }

            localStorage.setItem("monmiammiam.token", data.token);
            localStorage.setItem(
                "monmiammiam.utilisateur",
                JSON.stringify({ ...data.utilisateur, role: data.role })
            );

            const destinations = {
                etudiant: "/",
                employe: "/Commandes",
               //gerant: "/",  chemin d'acces du gerant
                administrateur: "/TableauBord",
            };

            navigate(destinations[data.role] || "/", { replace: true });
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
                <h1 className="text-3xl font-bold text-center">{/* titre  principal de la page*/}
                    Bienvenue sur Mon Miam Miam 
                </h1>
                <div className="flex justify-center mt-0 p-0">
                    <img src={avatar} alt="Avatar" className="w-30 h-30" />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2"> {/*initialisation du formulaire*/}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-secondary">
                        Email:
                        </label>
                        <input id="email" type="email" required value ={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-secondary">
                            Mot de passe
                        </label>
                        <input id="password" 
                        type="password" 
                        required 
                        value ={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        <a href="#" className="self-end text-primary cursor-pointer  hover:text-primary-700">
                            Mot de pase oublié?
                        </a>
                    </div>

                    {erreur && (
                        <p role="alert" className="text-sm text-red-700">
                            {erreur}
                            </p>
                    )}

                    <div className="flex flex-col gap-1">
                        <button type="submit" 
                        disabled={chargement}
                        className="bg-primary text-secondary mx-auto w-full max-w-50 min-h-8 rounded-[10px] cursor-pointer hover:bg-primary-700">
                            {chargement ? "Connexion..." : "Se connecter"}
                        </button>
                        <p className="text-secondary"> Vous n'avez pas de compte ? {" "}
                            <Link to="/page_inscription" className="text-primary cursor-pointer hover:text-primary-700">
                                Creer un nouveau compte
                            </Link>
                        </p>
                    </div>
                </form>
            </GlassCard>
        </GlassPage>

    )
}
