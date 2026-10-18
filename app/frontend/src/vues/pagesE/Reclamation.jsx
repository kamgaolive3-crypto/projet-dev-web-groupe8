//importe un hook qui permet de memoriser une valeur
import { useState } from "react"
//importe link : permet de changer de page sans recharger le navigateur
import { Link } from "react-router-dom"

export default function Reclamation() {
    //---------------- ETATS DE LA PAGE ----------------
    //ce que le client tape dans chaque champ
    const [idCommande, setIdCommande] = useState("")
    const [probleme, setProbleme] = useState("")
    //message d'erreur (vide = pas d'erreur)
    const [erreur, setErreur] = useState("")
    //true quand la réclamation vient d'être envoyée
    const [envoye, setEnvoye] = useState(false)

    //---------------- ACTIONS ----------------
    //fonction appellée quand on clique sur "Envoyer"
    const envoyer = () => {
        //trim() enlève les espaces au début et à la fin : "   " compte comme vide
        if (idCommande.trim() === "" || probleme.trim() === "") {
            setErreur("Veuillez remplir l'ID de la commande et décrire le problème.")
            setEnvoye(false)
            return // on s'arrête ici, rien n'est envoyé
        }

        //pour l'instant on affiche seulement une confirmation
        //plus tard : envoyer idCommande et probleme à l'API PHP
        setErreur("")
        setEnvoye(true)
        setIdCommande("")
        setProbleme("")
    }

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            {/* ---------- TITRE + FLECHE RETOUR ---------- */}
            <div className="flex items-center gap-2">
                {/* le chemin "/panier" est à adapter à tes routes */}
                <Link to="/panier" className="text-xl" aria-label="Retour au panier">
                    ←
                </Link>
                <h1 className="font-serif text-xl font-bold">⚠ Une réclamation ?</h1>
            </div>

            {/* ---------- FORMULAIRE ---------- */}
            <section className="flex flex-col gap-4 rounded-xl border border-[#CFBD97] bg-[#fffdf5] p-4 md:p-6">
                {/* champ : ID de la commande */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="idCommande" className="text-sm">
                        ID Commande :
                    </label>
                    <input
                        id="idCommande"
                        type="text"
                        value={idCommande}
                        onChange={(e) => setIdCommande(e.target.value)}
                        placeholder="ex : CMD001000"
                        className="rounded-md border border-[#CFBD97] bg-white px-3 py-2 text-sm md:w-1/2"
                    />
                    <p className="text-xs text-gray-500">
                        (retrouvez l'id de votre commande dans l'historique des commandes)
                    </p>
                </div>

                {/* champ : description du problème */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="probleme" className="text-sm">
                        Problème de la commande :
                    </label>
                    <textarea
                        id="probleme"
                        rows={5}
                        value={probleme}
                        onChange={(e) => setProbleme(e.target.value)}
                        className="rounded-md border border-[#CFBD97] bg-white px-3 py-2 text-sm"
                    />
                </div>

                {/* message d'erreur (affiché seulement s'il y en a un) */}
                {erreur && <p className="text-xs text-red-600">{erreur}</p>}

                {/* message de confirmation (affiché seulement après l'envoi) */}
                {envoye && (
                    <p className="rounded-md bg-green-100 px-3 py-2 text-xs text-green-800">
                        Votre réclamation a bien été envoyée. Nous reviendrons vers vous rapidement.
                    </p>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={envoyer}
                        className="rounded-full border border-[#CFBD97] bg-white px-6 py-1 text-sm"
                    >
                        Envoyer
                    </button>
                </div>
            </section>
        </div>
    )
}