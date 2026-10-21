import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function CommandesG() {
    const [commandes, setCommandes] = useState([]);
    const [erreur, setErreur] = useState("");

    const charger = async () => {
        try {
            const data = await api.get("/commande");
            setCommandes(data);
        } catch (e) {
            setErreur("Erreur chargement des commandes.");
        }
    };

    useEffect(() => { charger(); }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 font-serif">Commandes du restaurant (Gérant)</h1>
            {erreur && <p className="text-red-500">{erreur}</p>}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Montant</th>
                            <th className="px-4 py-3">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandes.map(c => (
                            <tr key={c.Id_commande} className="border-b">
                                <td className="px-4 py-3">{c.Id_commande}</td>
                                <td className="px-4 py-3">{c.date_commande?.slice(0,16)}</td>
                                <td className="px-4 py-3">{c.montant_total} FCFA</td>
                                <td className="px-4 py-3 font-semibold text-primary">{c.statut_commande}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}