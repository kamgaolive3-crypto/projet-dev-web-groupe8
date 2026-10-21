import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../services/auth";

export default function Parametre() {
    const { user } = useAuth();
    const [ongletActif, setOngletActif] = useState("infos"); // "infos" ou "services"
    const [erreur, setErreur] = useState("");
    const [message, setMessage] = useState("");
    const [chargement, setChargement] = useState(false);

    // Paramètres restaurant (Onglet 1)
    const [nomResto, setNomResto] = useState("Mon Miam Miam @UCAC-ICAM");
    const [adresseResto, setAdresseResto] = useState("Campus UCAC-ICAM, Yaoundé");
    const [contactResto, setContactResto] = useState("658425185 / 698254204");
    const [emailResto, setEmailResto] = useState("contact@monmiammiam.cm");

    // Horaires (Lundi à Dimanche)
    const [horaires, setHoraires] = useState({
        Lundi: { actif: true, debut: "08:00", fin: "22:00" },
        Mardi: { actif: true, debut: "08:00", fin: "22:00" },
        Mercredi: { actif: true, debut: "08:00", fin: "22:00" },
        Jeudi: { actif: true, debut: "08:00", fin: "22:00" },
        Vendredi: { actif: true, debut: "08:00", fin: "22:00" },
        Samedi: { actif: true, debut: "08:00", fin: "22:00" },
        Dimanche: { actif: false, debut: "08:00", fin: "22:00" },
    });

    // Services et modes de paiement (Onglet 2)
    const [commandeSurPlace, setCommandeSurPlace] = useState(true);
    const [livraison, setLivraison] = useState(true);
    const [commentaireApresLivraison, setCommentaireApresLivraison] = useState(true);

    const [momo, setMomo] = useState(true);
    const [om, setOm] = useState(true);
    const [cash, setCash] = useState(true);
    const [pointFidelite, setPointFidelite] = useState(true);

    // Parrainage & Fidélité (Configurable en base)
    const [depenseParPoint, setDepenseParPoint] = useState("1000"); // 1000 FCFA = 1 pt
    const [valeurPoints, setValeurPoints] = useState("1000"); // 15 pts = 1000 FCFA
    const [validitePoints, setValiditePoints] = useState("12"); // 12 mois
    const [recompenseFilleul, setRecompenseFilleul] = useState("50"); // Points parrainage (modifiables !)

    // Identifiant existant en base pour la récompense parrainage
    const [idParamParrainage, setIdParamParrainage] = useState(null);

    // Charger les paramètres depuis l'API
    const charger = async () => {
        try {
            const liste = await api.get("/parametre");
            if (Array.isArray(liste)) {
                // Trouver le paramètre de récompense parrainage s'il existe
                const paramBonus = liste.find((p) => p.cle === "BONUS_PARRAIN" || p.cle === "recompense_filleul");
                if (paramBonus) {
                    setRecompenseFilleul(paramBonus.valeur);
                    setIdParamParrainage(paramBonus.Id_parametre);
                }

                const paramDuree = liste.find((p) => p.cle === "duree_expiration_points" || p.cle === "duree_validite_points");
                if (paramDuree) {
                    setValiditePoints(paramDuree.valeur);
                }
            }
        } catch (e) {
            console.error("Erreur chargement paramètres :", e);
        }
    };

    useEffect(() => {
        charger();
    }, []);

    // Enregistrer les modifications
    const enregistrer = async () => {
        setMessage("");
        setErreur("");
        setChargement(true);
        try {
            // Sauvegarder la récompense de parrainage (BONUS_PARRAIN)
            if (idParamParrainage) {
                await api.put(`/parametre/${encodeURIComponent(idParamParrainage)}`, {
                    Id_parametre: idParamParrainage,
                    cle: "recompense_filleul",
                    valeur: String(recompenseFilleul),
                    Id_utilisateur: user?.Id_utilisateur || "ADMI000001",
                });
            } else {
                // Créer le paramètre s'il n'existe pas encore
                const res = await api.post("/parametre", {
                    Id_parametre: "PR999",
                    cle: "recompense_filleul",
                    valeur: String(recompenseFilleul),
                    Id_utilisateur: user?.Id_utilisateur || "ADMI000001",
                });
                if (res?.Id_parametre) {
                    setIdParamParrainage(res.Id_parametre);
                }
            }

            setMessage("Paramètres et points de parrainage enregistrés avec succès !");
            charger();
        } catch (e) {
            const detail = e.champs ? Object.values(e.champs).flat().join(" - ") : null;
            setErreur(detail || e.message || "Erreur lors de l'enregistrement.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
            {/* Titre & Sous-titre fidèles à la maquette */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-gray-900">Paramètre de l'application</h1>
                <p className="text-sm text-gray-600 mt-1">Configurer les réglages du restaurant</p>
            </div>

            {/* Onglets Pilules dorées / crèmes */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => setOngletActif("infos")}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                        ongletActif === "infos"
                            ? "bg-[#CFBD97] text-white shadow-sm"
                            : "bg-white text-gray-700 hover:bg-[#f5f1e6] border border-[#CFBD97]/30"
                    }`}
                >
                    Informations et heures
                </button>
                <button
                    type="button"
                    onClick={() => setOngletActif("services")}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                        ongletActif === "services"
                            ? "bg-[#CFBD97] text-white shadow-sm"
                            : "bg-white text-gray-700 hover:bg-[#f5f1e6] border border-[#CFBD97]/30"
                    }`}
                >
                    Service de livraison et fidélités
                </button>
            </div>

            {message && (
                <div className="rounded-lg bg-green-50 p-4 border border-green-200 text-green-800 text-sm">
                    {message}
                </div>
            )}
            {erreur && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700 text-sm">
                    {erreur}
                </div>
            )}

            {/* CONTENU DE L'ONGLET 1 : Informations et heures */}
            {ongletActif === "infos" && (
                <div className="flex flex-col gap-6">
                    {/* Carte Informations du restaurant */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Informations du restaurant</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Nom du restaurant</label>
                                <input
                                    type="text"
                                    value={nomResto}
                                    onChange={(e) => setNomResto(e.target.value)}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Adresse</label>
                                <input
                                    type="text"
                                    value={adresseResto}
                                    onChange={(e) => setAdresseResto(e.target.value)}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Contact(s)</label>
                                <input
                                    type="text"
                                    value={contactResto}
                                    onChange={(e) => setContactResto(e.target.value)}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Email</label>
                                <input
                                    type="email"
                                    value={emailResto}
                                    onChange={(e) => setEmailResto(e.target.value)}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Carte Heures d'ouverture */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Heures d'ouverture</h2>
                        <div className="flex flex-col gap-3">
                            {Object.entries(horaires).map(([jour, config]) => (
                                <div key={jour} className="flex items-center justify-between border-b border-gray-50 pb-2">
                                    <div className="flex items-center gap-4 w-32">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setHoraires({
                                                    ...horaires,
                                                    [jour]: { ...config, actif: !config.actif },
                                                })
                                            }
                                            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                config.actif ? "bg-[#CFBD97]" : "bg-gray-200"
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                                    config.actif ? "translate-x-5" : "translate-x-0"
                                                }`}
                                            />
                                        </button>
                                        <span className={`text-sm ${config.actif ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                                            {jour}
                                        </span>
                                    </div>

                                    {config.actif ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={config.debut}
                                                onChange={(e) =>
                                                    setHoraires({
                                                        ...horaires,
                                                        [jour]: { ...config, debut: e.target.value },
                                                    })
                                                }
                                                className="w-20 rounded border border-gray-200 px-2 py-1 text-xs text-center outline-none"
                                            />
                                            <span className="text-xs text-gray-400">à</span>
                                            <input
                                                type="text"
                                                value={config.fin}
                                                onChange={(e) =>
                                                    setHoraires({
                                                        ...horaires,
                                                        [jour]: { ...config, fin: e.target.value },
                                                    })
                                                }
                                                className="w-20 rounded border border-gray-200 px-2 py-1 text-xs text-center outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Fermé</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENU DE L'ONGLET 2 : Service de livraison et fidélités */}
            {ongletActif === "services" && (
                <div className="flex flex-col gap-6">
                    {/* Carte Service de livraison */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Service de livraison</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-700">Commande sur place</span>
                                <button
                                    type="button"
                                    onClick={() => setCommandeSurPlace(!commandeSurPlace)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        commandeSurPlace ? "bg-[#CFBD97]" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            commandeSurPlace ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-700">Livraison</span>
                                <button
                                    type="button"
                                    onClick={() => setLivraison(!livraison)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        livraison ? "bg-[#CFBD97]" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            livraison ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Commentaire après livraison</span>
                                <button
                                    type="button"
                                    onClick={() => setCommentaireApresLivraison(!commentaireApresLivraison)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        commentaireApresLivraison ? "bg-[#CFBD97]" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            commentaireApresLivraison ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Carte Mode de paiement */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Mode de paiement</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-700">Mobile Money</span>
                                <button
                                    type="button"
                                    onClick={() => setMomo(!momo)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        momo ? "bg-[#CFBD97]" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            momo ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-700">Orange Money</span>
                                <button
                                    type="button"
                                    onClick={() => setOm(!om)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        om ? "bg-[#CFBD97]" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            om ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-700">Cash</span>
                                <button
                                    type="button"
                                    onClick={() => setCash(!cash)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        cash ? "bg-[#CFBD97]" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            cash ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Point de fidélité</span>
                                <button
                                    type="button"
                                    onClick={() => setPointFidelite(!pointFidelite)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                        pointFidelite ? "bg-[#CFBD97]" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            pointFidelite ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Carte Parrainage & Fidélité (avec points modifiables) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="font-serif text-lg font-bold text-gray-800">Parrainage & Fidélité</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Dépense pour 1 point</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={depenseParPoint}
                                        onChange={(e) => setDepenseParPoint(e.target.value)}
                                        className="w-full rounded-l-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]"
                                    />
                                    <span className="bg-gray-50 border border-l-0 border-gray-200 px-3 py-2 text-xs text-gray-500 rounded-r-lg">
                                        FCFA
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Valeur de 15 points</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={valeurPoints}
                                        onChange={(e) => setValeurPoints(e.target.value)}
                                        className="w-full rounded-l-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]"
                                    />
                                    <span className="bg-gray-50 border border-l-0 border-gray-200 px-3 py-2 text-xs text-gray-500 rounded-r-lg">
                                        FCFA
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Validité des points</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={validitePoints}
                                        onChange={(e) => setValiditePoints(e.target.value)}
                                        className="w-full rounded-l-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#CFBD97]"
                                    />
                                    <span className="bg-gray-50 border border-l-0 border-gray-200 px-3 py-2 text-xs text-gray-500 rounded-r-lg">
                                        mois
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500 font-semibold text-[#CFBD97]">
                                    Points de parrainage (récompense filleul)
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={recompenseFilleul}
                                        onChange={(e) => setRecompenseFilleul(e.target.value)}
                                        className="w-full rounded-l-lg border border-[#CFBD97] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#CFBD97]"
                                    />
                                    <span className="bg-[#CFBD97]/10 border border-l-0 border-[#CFBD97] px-3 py-2 text-xs font-semibold text-[#CFBD97] rounded-r-lg">
                                        pts
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-0.5">
                                    Points offerts au parrain dès la 1ère commande servie du filleul.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bouton d'enregistrement global */}
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    disabled={chargement}
                    onClick={enregistrer}
                    className="cursor-pointer rounded-full bg-[#CFBD97] px-8 py-3 text-sm font-semibold text-white shadow hover:bg-[#bfa97e] transition-all disabled:opacity-50"
                >
                    {chargement ? "Enregistrement en cours..." : "Enregistrer les modifications"}
                </button>
            </div>
        </div>
    );
}
