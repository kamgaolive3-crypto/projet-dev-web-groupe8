<?php

namespace App\Http\Controllers;

use App\Models\ArticleMenu;
use App\Models\Commande;
use App\Models\HistoriqueStatut;
use App\Models\MvtPoint;
use Illuminate\Http\Request;
use App\Http\Controllers\ParrainageController;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    /**
     * Taux de fidélité (dictionnaire §10 / CAHIER §2.1.2) :
     * 1000 F dépensés = 1 point gagné ; 15 points = 1000 F de réduction.
     */
    private const POINTS_PAR_REDUCTION = 15;
    private const VALEUR_REDUCTION = 1000;   // F CFA
    private const MONTANT_PAR_POINT = 1000;  // F CFA
    private const EXPIRATION_MOIS = 12;

    /**
     * afficher les commandes
     * GET /api/commande : l'étudiant voit les siennes ; l'employé,
     * le gérant et l'administrateur voient tout (filtre ?statut=).
     */
    public function index(Request $request)
    {
        $query = Commande::with(['articles', 'historiqueStatuts'])
            ->orderByDesc('date_commande');

        if ($request->user()->role === 'etudiant') {
            $query->where('Id_utilisateur', $request->user()->Id_utilisateur);
        }

        if ($statut = $request->query('statut')) {
            $query->where('statut_commande', $statut);
        }

        return $query->get();
    }

    /**
     * afficher une commande précise (détail articles + historique)
     * GET /api/commande/{id}
     */
    public function show(Request $request, string $id)
    {
        $commande = Commande::with(['articles', 'historiqueStatuts', 'paiements', 'livraison'])
            ->findOrFail($id);

        if ($request->user()->role === 'etudiant'
            && $commande->Id_utilisateur !== $request->user()->Id_utilisateur) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $commande;
    }

    /**
     * creer une commande à partir du panier du client
     * POST /api/commande { items: [{Id_article, quantite}], mode_service,
     *                       heure_recup, Id_restaurant, points_utilises }
     * Transaction : calcul montant / réduction / points, débit du solde,
     * écriture commande + contenir + mvt_points + historique_statut.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'items'                 => 'required|array|min:1',
            'items.*.Id_article'    => 'required|exists:article_menu,Id_article',
            'items.*.quantite'      => 'required|integer|min:1',
            'Id_restaurant'         => 'required|exists:restaurant,Id_restaurant',
            'mode_service'          => 'required|in:sur_place,livraison',
            'heure_recup'           => 'nullable|required_if:mode_service,sur_place|date_format:H:i',
            'points_utilises'       => 'nullable|integer|min:0',
            'commentaire'           => 'nullable|string',
        ]);

        $utilisateur = $request->user();
        $etudiant = $utilisateur->etudiant;

        if ($utilisateur->role !== 'etudiant' || ! $etudiant) {
            return response()->json(['message' => 'Seul un étudiant peut commander.'], 403);
        }

        $commande = DB::transaction(function () use ($data, $etudiant) {
            // 1. Prix actuels des articles (source de vérité serveur)
            $articles = ArticleMenu::whereIn('Id_article', array_column($data['items'], 'Id_article'))
                ->get()->keyBy('Id_article');

            foreach ($data['items'] as $item) {
                if (! $articles[$item['Id_article']]->disponibilite_article) {
                    abort(422, "L'article {$articles[$item['Id_article']]->nom_article} est indisponible.");
                }
            }

            // 2. Sous-total (montants en francs CFA)
            $sous_total = 0;
            foreach ($data['items'] as $item) {
                $sous_total += $articles[$item['Id_article']]->prix_article * (int) $item['quantite'];
            }

            // 3. Réduction par points : multiple de 15 pts, jamais > sous-total
            $points_utilises = (int) ($data['points_utilises'] ?? 0);
            if ($points_utilises % self::POINTS_PAR_REDUCTION !== 0) {
                abort(422, 'Les points doivent être utilisés par multiple de 15 (1 tranche = 1000 F).');
            }
            if ($points_utilises > $etudiant->solde_point) {
                abort(422, 'Solde de points insuffisant.');
            }
            $reduction_points = intdiv($points_utilises, self::POINTS_PAR_REDUCTION) * self::VALEUR_REDUCTION;
            $reduction_points = min($reduction_points, $sous_total);
            $points_utilises  = intdiv($reduction_points, self::VALEUR_REDUCTION) * self::POINTS_PAR_REDUCTION;

            // 4. Points gagnés sur ce qui est réellement payé : 1000 F = 1 point
            $montant_total = $sous_total - $reduction_points;
            $points_gagnes = intdiv($montant_total, self::MONTANT_PAR_POINT);

            // 5. Création de la commande
            $commande = Commande::create([
                'Id_commande'              => $this->genererIdCommande(),
                'montant_total'            => $montant_total,
                'mode_service'             => $data['mode_service'],
                'statut_commande'          => 'en_attente',
                'points_utilises'          => $points_utilises,
                'reduction_points'         => $reduction_points,
                'commentaire'              => $data['commentaire'] ?? null,
                'heure_recup'              => $data['heure_recup'] ?? null,
                'Id_utilisateur'           => $etudiant->Id_utilisateur,
                'Id_restaurant'            => $data['Id_restaurant'],
            ]);

            // 6. Lignes de commande (prix unitaire figé, association Contenir)
            foreach ($data['items'] as $item) {
                $commande->articles()->attach($item['Id_article'], [
                    'quantite'      => (int) $item['quantite'],
                    'prix_unitaire' => $articles[$item['Id_article']]->prix_article,
                ]);
            }

            // 7. Débit des points utilisés + mouvement de fidélité
            if ($points_utilises > 0) {
                $etudiant->decrement('solde_point', $points_utilises);
                MvtPoint::create([
                    'Id_mvt'          => $this->genererIdMvt(),
                    'nbres_points'    => -$points_utilises,   // négatif = sortie
                    'type_mvt'        => 'utilisation',
                    'Id_utilisateur'  => $etudiant->Id_utilisateur,
                    'Id_commande'     => $commande->Id_commande,
                ]);
            }

            // 8. Crédit des points gagnés (expirent dans 12 mois, US-016)
            if ($points_gagnes > 0) {
                $etudiant->increment('solde_point', $points_gagnes);
                MvtPoint::create([
                    'Id_mvt'          => $this->genererIdMvt(),
                    'nbres_points'    => $points_gagnes,
                    'type_mvt'        => 'gain',
                    'date_expiration' => now()->addMonths(self::EXPIRATION_MOIS),
                    'Id_utilisateur'  => $etudiant->Id_utilisateur,
                    'Id_commande'     => $commande->Id_commande,
                ]);
            }

            // 9. Historique : statut initial
            $this->enregistrerStatutHistorique($commande->Id_commande, $etudiant->Id_utilisateur, 'en_attente');

            // 10. US-019 : si 1ère commande du filleul, crédite son parrain
            ParrainageController::attribuerBonusPremiereCommande($etudiant);

            return $commande;
        });

        return response()->json($commande->load('articles', 'historiqueStatuts'), 201);
    }

    /**
     * L'employé valide une commande en attente (US-026)
     * POST /api/commande/{id}/valider
     */
    public function valider(Request $request, string $id)
    {
        $utilisateur = $request->user();
        if ($utilisateur->role === 'etudiant') {
            return response()->json(['message' => 'Seul le personnel peut valider.'], 403);
        }

        $commande = Commande::findOrFail($id);
        if ($commande->statut_commande !== 'en_attente') {
            return response()->json(['message' => 'Cette commande a déjà été traitée.'], 422);
        }

        DB::transaction(function () use ($commande, $utilisateur) {
            $commande->update([
                'statut_commande' => 'validee',
                'Id_valideur'     => $utilisateur->Id_utilisateur,
                'date_validation' => now(),
            ]);
            $this->enregistrerStatutHistorique($commande->Id_commande, $utilisateur->Id_utilisateur, 'validee');
        });

        return $commande->load('historiqueStatuts');
    }

    /**
     * Changement de statut (préparation, prête, en_livraison, servie) (US-026)
     * POST /api/commande/{id}/statut { statut_commande: "..." }
     */
    public function changerStatut(Request $request, string $id)
    {
        if ($request->user()->role === 'etudiant') {
            return response()->json(['message' => 'Seul le personnel peut changer le statut.'], 403);
        }

        $data = $request->validate([
            'statut_commande' => 'required|in:validee,en_preparation,prete,en_livraison,servie,annulee',
        ]);

        $transitions = [
            'en_attente'     => ['validee', 'annulee'],
            'validee'        => ['en_preparation', 'annulee'],
            'en_preparation' => ['prete'],
            'prete'          => ['en_livraison', 'servie'],
            'en_livraison'   => ['servie'],
        ];

        $commande = Commande::findOrFail($id);
        $cible = $data['statut_commande'];

        if (! in_array($cible, $transitions[$commande->statut_commande] ?? [])) {
            return response()->json([
                'message' => "Transition impossible : {$commande->statut_commande} -> {$cible}.",
            ], 422);
        }

        DB::transaction(function () use ($commande, $cible, $request) {
            $commande->update(['statut_commande' => $cible]);
            $this->enregistrerStatutHistorique($commande->Id_commande, $request->user()->Id_utilisateur, $cible);

            // Annulation : restitution des points utilisés
            if ($cible === 'annulee' && $commande->points_utilises > 0) {
                $etudiant = $commande->etudiant;
                $etudiant->increment('solde_point', $commande->points_utilises);
                MvtPoint::create([
                    'Id_mvt'         => $this->genererIdMvt(),
                    'nbres_points'   => $commande->points_utilises,
                    'type_mvt'       => 'gain',
                    'description'    => 'Remboursement points (annulation commande)',
                    'Id_utilisateur' => $etudiant->Id_utilisateur,
                    'Id_commande'    => $commande->Id_commande,
                ]);
            }
        });

        return $commande->load('historiqueStatuts');
    }

    /**
     * L'étudiant laisse un commentaire après service (US-010)
     * POST /api/commande/{id}/commentaire { commentaire: "..." }
     */
    public function commentaire(Request $request, string $id)
    {
        $data = $request->validate(['commentaire' => 'required|string|max:1000']);

        $commande = Commande::findOrFail($id);
        if ($commande->Id_utilisateur !== $request->user()->Id_utilisateur) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }
        if ($commande->statut_commande !== 'servie') {
            return response()->json(['message' => 'Commentaire possible seulement après service.'], 422);
        }

        $commande->update($data);

        return $commande;
    }

    /**
     * L'étudiant annule sa commande tant qu'elle est en attente
     * DELETE /api/commande/{id}
     */
    public function destroy(Request $request, string $id)
    {
        $commande = Commande::findOrFail($id);
        if ($commande->Id_utilisateur !== $request->user()->Id_utilisateur) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }
        if ($commande->statut_commande !== 'en_attente') {
            return response()->json(['message' => 'Impossible : la commande est déjà traitée.'], 422);
        }

        DB::transaction(function () use ($commande, $request) {
            if ($commande->points_utilises > 0) {
                $etudiant = $commande->etudiant;
                $etudiant->increment('solde_point', $commande->points_utilises);
                MvtPoint::create([
                    'Id_mvt'         => $this->genererIdMvt(),
                    'nbres_points'   => $commande->points_utilises,
                    'type_mvt'       => 'gain',
                    'description'    => 'Remboursement points (annulation)',
                    'Id_utilisateur' => $etudiant->Id_utilisateur,
                    'Id_commande'    => $commande->Id_commande,
                ]);
            }
            $commande->update(['statut_commande' => 'annulee']);
            $this->enregistrerStatutHistorique($commande->Id_commande, $request->user()->Id_utilisateur, 'annulee');
        });

        return response()->json(['message' => 'Commande annulée.']);
    }

    /**
     * Générateur #COM0001 (domaine ID_COM, dictionnaire §10) sans collision.
     */
    private function genererIdCommande(): string
    {
        do {
            $id = '#COM' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (Commande::where('Id_commande', $id)->exists());

        return $id;
    }

    /**
     * Générateur MV001 (domaine ID_MVT) sans collision.
     */
    private function genererIdMvt(): string
    {
        do {
            $id = 'MV' . str_pad((string) random_int(0, 999), 3, '0', STR_PAD_LEFT);
        } while (MvtPoint::where('Id_mvt', $id)->exists());

        return $id;
    }

    /**
     * Inscription au journal des statuts (HST00001, domaine ID_HIST).
     */
    private function enregistrerStatutHistorique(string $commandeId, string $utilisateurId, string $statut): void
    {
        do {
            $id = 'HST' . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        } while (HistoriqueStatut::where('Id_historique', $id)->exists());

        HistoriqueStatut::create([
            'Id_historique'  => $id,
            'nouveau_statut' => $statut,
            'Id_commande'    => $commandeId,
            'Id_utilisateur' => $utilisateurId,
        ]);
    }
}