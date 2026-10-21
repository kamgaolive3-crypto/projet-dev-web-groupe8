import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../services/auth";

export default function Parametre() {
    const { user } = useAuth();
    const [erreur, setErreur] = useState("");
    const [message, setMessage] = useState("");
    const [chargement, setChargement] = useState(false);
    
    // État unique pour toute la config JSON
    const [config, setConfig] = useState({
        nomResto: "Mon Miam Miam @UCAC-ICAM",
        adresse: "Campus UCAC-ICAM, Yaoundé",
        email: "contact@monmiammiam.cm",
        recompense_filleul: "50",
        duree_expiration_points: "12"
    });

    const charger = async () => {
        try {
            const liste = await api.get("/parametre");
            const conf = liste.find(p => p.cle === "CONFIG_RESTAURANT");
            if (conf) setConfig(JSON.parse(conf.valeur));
        } catch (e) { console.error("Erreur chargement:", e); }
    };

    useEffect(() => { charger(); }, []);

    const enregistrer = async () => {
        setChargement(true);
        setMessage(""); setErreur("");
        try {
            const liste = await api.get("/parametre");
            const conf = liste.find(p => p.cle === "CONFIG_RESTAURANT");
            const payload = {
                cle: "CONFIG_RESTAURANT",
                valeur: JSON.stringify(config),
                Id_utilisateur: user?.Id_utilisateur || "ADMI000001"
            };
            
            if (conf) {
                await api.put(`/parametre/${encodeURIComponent(conf.Id_parametre)}`, { ...payload, Id_parametre: conf.Id_parametre });
            } else {
                await api.post("/parametre", { ...payload, Id_parametre: "PR999" });
            }
            setMessage("Configuration sauvegardée en base !");
        } catch (e) { setErreur("Erreur enregistrement."); }
        setChargement(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-serif">Configuration Globale</h1>
            {message && <div className="bg-green-100 p-3 mb-4 rounded">{message}</div>}
            
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <div>
                    <label className="block text-sm font-medium">Nom du restaurant</label>
                    <input className="w-full p-2 border rounded" value={config.nomResto} onChange={e => setConfig({...config, nomResto: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium">Points parrainage (récompense filleul)</label>
                    <input type="number" className="w-full p-2 border rounded" value={config.recompense_filleul} onChange={e => setConfig({...config, recompense_filleul: e.target.value})} />
                </div>
                <button className="bg-[#CFBD97] text-white px-6 py-2 rounded-full font-bold" onClick={enregistrer} disabled={chargement}>
                    {chargement ? "Sauvegarde..." : "Enregistrer les modifications"}
                </button>
            </div>
        </div>
    );
}