//importe l'avatar en image
import avatar from "../../assets/profil.png"
//importe un hook qui permet de memoriser une valeur
import { useState } from "react";
//importe la frame en glass et l'image de fond
import GlassCard from "../../Composant/GlassCard";
import GlassPage from "../../Composant/GlassPage";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //fonction appellée quand envoie le formulaire
    const handleSubmit = (e) => {
        e.preventDefault(); // empeche le rechargement de 
        console.log(email, password); //plus tard: envoi a ton API PHP 
    }

    return (
        <GlassPage>
            {}
            <GlassCard largeurMax="722px" hauteurMax="1000px">
                <h1 className="text-3xl font-bold text-center">
                    Bienvenue sur Mon Miam Miam 
                </h1>
                <div className="flex justify-center mt-0 p-0">
                    <img src={avatar} alt="Avatar" className="w-30 h-30" />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
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
                        <input id="pasword" type="password" required value ={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        className="w-full rounded-md bg-white/50 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-or"/>
                        <a href="#" className="self-end text-primary cursor-pointer hover:text-primary-700">
                            Mot de pase oublié?
                        </a>
                    </div>
                    <div className="flex flex-col gap-1">
                        <button type="submit" 
                        className="bg-primary text-secondary mx-auto w-full max-w-50 min-h-8 rounded-[10px] cursor-pointer hover:bg-primary-700">
                            Se connecter
                        </button>
                        <p className="text-secondary"> Vous n'avez pas de compte ? {" "}
                            <a href="#" className="text-primary cursor-pointer hover:text-primary-700">
                                Creer un nouveau compte
                            </a>
                        </p>
                    </div>
                </form>
            </GlassCard>
        </GlassPage>

    )
}
