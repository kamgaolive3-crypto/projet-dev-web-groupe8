import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../services/auth";

export default function Parametre() {
    const { user } = useAuth();
    const [ongletActif, setOngletActif] = useState("infos");
    const [erreur, setErreur] = useState("");
    const [message, setMessage] = useState("");
    const [chargement, setChargement] = useState(false);

    const [config, setConfig] = useState({
        nomResto: "Mon Miam Miam @UCAC-ICAM",
        adresse: "Campus UCAC-ICAM, Yaoundé",
        contact: "658425185 / 698254204",
        email: "contact@monmiammiam.cm",
        horaires: {
            Lundi: { actif: true, debut: "08:00", fin: "22:00" },
            Mardi: { actif: true, debut: "08:00", fin: "22:00" },
            Mercredi: { actif: true, debut: "08:00", fin: "22:00" },
            Jeudi: { actif: true, debut: "08:00", fin: "22:00" },
            Vendredi: { actif: true, debut: "08:00", fin: "22:00" },
            Samedi: { actif: true, debut: "08:00", fin: "22:00" },
            Dimanche: { actif: false, debut: "08:00", fin: "22:00" },
        },
        commandeSurPlace: true,
        livraison: true,
        commentaireApresLivraison: true,
        momo: true,
        om: true,
        cash: true,
        pointFidelite: true,
        depenseParPoint: "1000",
        valeurPoints: "1000",
        validitePoints: "12",
        recompense_filleul: "50"
    });

    // Charger les paramètres depuis l'API
    const charger = async () => {
        try {
            const liste = await api.get("/parametre");
            const conf = liste.find(p => p.cle === "CONFIG_RESTAURANT");
            if (conf) {
                setConfig(prev => ({ ...prev, ...JSON.parse(conf.valeur) }));
            }
        } catch (e) { console.error("Erreur chargement:", e); }
    };

    useEffect(() => { charger(); }, []);

    const enregistrer = async () => {
        setChargement(true);
        setMessage(""); setErreur("");
        try {
            // Étape 1 : On vérifie l'état RÉEL en base juste avant de décider (évite les conflits d'ID)
            const liste = await api.get("/parametre");
            const confExistante = liste.find(p => p.cle === "CONFIG_RESTAURANT");
            
            const payload = {
                cle: "CONFIG_RESTAURANT",
                valeur: JSON.stringify(config),
                Id_utilisateur: user?.Id_utilisateur || "ADMI000001"
            };
            
            if (confExistante) {
                // On met à jour l'existant
                await api.put(`/parametre/${encodeURIComponent(confExistante.Id_parametre)}`, {
                    ...payload,
                    Id_parametre: confExistante.Id_parametre
                });
            } else {
                // On crée une nouvelle ligne avec un ID unique
                const newId = "CF" + Math.floor(1000 + Math.random() * 8999);
                await api.post("/parametre", {
                    ...payload,
                    Id_parametre: newId
                });
            }
            setMessage("Configuration sauvegardée avec succès !");
            await charger(); // Rafraîchir l'état local
        } catch (e) {
            const detail = e.champs ? Object.values(e.champs).flat().join(" - ") : null;
            setErreur(detail || e.message || "Erreur lors de la sauvegarde.");
        }
        setChargement(false);
    };

    const Toggle = ({ label, valeur, onChange }) => (
        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-sm text-gray-700">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!valeur)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${valeur ? "bg-[#CFBD97]" : "bg-gray-200"}`}
            >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${valeur ? "translate-x-5" : "translate-x-0"}`} />
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto min-h-screen">
            <div>
                <h1 className="font-serif text-3xl font-bold text-gray-900">Paramètre de l'application</h1>
                <p className="text-sm text-gray-600 mt-1">Configurer les réglages du restaurant</p>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setOngletActif("infos")}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${ongletActif === "infos" ? "bg-[#CFBD97] text-white shadow-sm" : "bg-white text-gray-700 border border-[#CFBD97]/30"}`}
                >
                    Informations et heures
                </button>
                <button
                    onClick={() => setOngletActif("services")}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${ongletActif === "services" ? "bg-[#CFBD97] text-white shadow-sm" : "bg-white text-gray-700 border border-[#CFBD97]/30"}`}
                >
                    Service de livraison et fidélités
                </button>
            </div>

            {message && <div className="rounded-lg bg-green-50 p-4 border border-green-200 text-green-800 text-sm font-bold animate-pulse">{message}</div>}
            {erreur && <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700 text-sm font-bold">{erreur}</div>}

            {ongletActif === "infos" && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Informations du restaurant</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Nom du restaurant", key: "nomResto" },
                                { label: "Adresse", key: "adresse" },
                                { label: "Contact(s)", key: "contact" },
                                { label: "Email", key: "email" }
                            ].map(f => (
                                <div key={f.key} className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500">{f.label}</label>
                                    <input
                                        type="text"
                                        value={config[f.key]}
                                        onChange={e => setConfig({...config, [f.key]: e.target.value})}
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Heures d'ouverture</h2>
                        <div className="flex flex-col gap-3">
                            {Object.entries(config.horaires).map(([jour, cfg]) => (
                                <div key={jour} className="flex items-center justify-between border-b border-gray-50 pb-2">
                                    <div className="flex items-center gap-4 w-32">
                                        <button
                                            type="button"
                                            onClick={() => setConfig({...config, horaires: {...config.horaires, [jour]: {...cfg, actif: !cfg.actif}}})}
                                            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${cfg.actif ? "bg-[#CFBD97]" : "bg-gray-200"}`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${cfg.actif ? "translate-x-5" : "translate-x-0"}`} />
                                        </button>
                                        <span className={`text-sm ${cfg.actif ? "text-gray-800 font-medium" : "text-gray-400"}`}>{jour}</span>
                                    </div>
                                    {cfg.actif ? (
                                        <div className="flex items-center gap-2">
                                            <input type="text" value={cfg.debut} onChange={e => setConfig({...config, horaires: {...config.horaires, [jour]: {...cfg, debut: e.target.value}}})} className="w-20 rounded border border-gray-200 px-2 py-1 text-xs text-center" />
                                            <span className="text-xs text-gray-400">à</span>
                                            <input type="text" value={cfg.fin} onChange={e => setConfig({...config, horaires: {...config.horaires, [jour]: {...cfg, fin: e.target.value}}})} className="w-20 rounded border border-gray-200 px-2 py-1 text-xs text-center" />
                                        </div>
                                    ) : <span className="text-xs text-gray-400 italic">Fermé</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {ongletActif === "services" && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Service de livraison</h2>
                        <Toggle label="Commande sur place" valeur={config.commandeSurPlace} onChange={v => setConfig({...config, commandeSurPlace: v})} />
                        <Toggle label="Livraison" valeur={config.livraison} onChange={v => setConfig({...config, livraison: v})} />
                        <Toggle label="Commentaire après livraison" valeur={config.commentaireApresLivraison} onChange={v => setConfig({...config, commentaireApresLivraison: v})} />
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Mode de paiement</h2>
                        <Toggle label="Mobile Money" valeur={config.momo} onChange={v => setConfig({...config, momo: v})} />
                        <Toggle label="Orange Money" valeur={config.om} onChange={v => setConfig({...config, om: v})} />
                        <Toggle label="Cash" valeur={config.cash} onChange={v => setConfig({...config, cash: v})} />
                        <Toggle label="Point de fidélité" valeur={config.pointFidelite} onChange={v => setConfig({...config, pointFidelite: v})} />
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Parrainage & Fidélité</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Dépense pour 1 point", key: "depenseParPoint", unit: "FCFA" },
                                { label: "Valeur de 15 points", key: "valeurPoints", unit: "FCFA" },
                                { label: "Validité des points", key: "validitePoints", unit: "mois" },
                                { label: "Points de parrainage", key: "recompense_filleul", unit: "pts" }
                            ].map(f => (
                                <div key={f.key} className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500">{f.label}</label>
                                    <div className="flex items-center">
                                        <input type="number" value={config[f.key]} onChange={e => setConfig({...config, [f.key]: e.target.value})} className="w-full rounded-l-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]" />
                                        <span className="bg-gray-50 border border-l-0 border-gray-200 px-3 py-2 text-xs text-gray-500 rounded-r-lg">{f.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-4">
                <button
                    onClick={enregistrer}
                    disabled={chargement}
                    className="cursor-pointer rounded-full bg-[#CFBD97] px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#bfa97e] transition-all disabled:opacity-50 active:scale-95"
                >
                    {chargement ? "Sauvegarde en cours..." : "Enregistrer les modifications"}
                </button>
            </div>
        </div>
    );
}
