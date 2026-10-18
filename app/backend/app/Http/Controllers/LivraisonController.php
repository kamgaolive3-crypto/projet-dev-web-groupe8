<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Livraison;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LivraisonController extends Controller
{
    /**
     * afficher les livraisons
     * GET /api/livraison : l'étudiant voit les siennes ; le personnel voit tout
     * (filtre ?statut=).
     */
    public function index(Request $request)
    {
        $query = Livraison::with(['commande', 'livreur'])->orderByDesc('created_at');

        if ($request->user()->role === 'etudiant') {
            $query->whereHas('commande', function ($q) use ($request) {
                $q->where('Id_utilisateur', $request->user()->Id_utilisateur);
            });
        }

        if ($statut = $request->query('statut')) {
            $query->where('statut_livraison', $statut);
        }

        return $query->get();
    }

    /**
     * afficher une livraison précise
     * GET /api/livraison/{id}
     */
    public function show(Request $request, string $id)
    {
        $livraison = Livraison::with(['commande.articles', 'livreur'])->findOrFail($id);

        if ($request->user()->role === 'etudiant'
            && $livraison->commande->Id_utilisateur !== $request->user()->Id_utilisateur) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $livraison;
    }

    /**
     * creer la livraison d'une commande (US-008 : mode_service = livraison)
     * POST /api/livraison
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'Id_commande'       => 'required|exists:commande,Id_commande',
            'adresse_livraison' => 'nullable|string',
            'frais_livraison'   => 'nullable|integer|min:0',
            'date_prevue'       => 'nullable|date|after_or_equal:now',
        ]);

        $utilisateur = $request->user();
        $commande = Commande::findOrFail($data['Id_commande']);

        if ($utilisateur->role === 'etudiant'
            && $commande->Id_utilisateur !== $utilisateur->Id_utilisateur) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($commande->mode_service !== 'livraison') {
            return response()->json(['message' => 'Cette commande n'est pas en mode livraison.'], 422);
        }
        if ($commande->livraison()->exists()) {
            return response()->json(['message' => 'Une livraison existe déjà pour cette commande.'], 422);
        }

        $livraison = Livraison::create([
            'Id_livraison'      => $this->genererIdLivraison(),
            'adresse_livraison' => $data['adresse_livraison']
                ?? $commande->etudiant->localisation
                ?? 'Adresse à préciser',
            'frais_livraison'   => $data['frais_livraison'] ?? 0,
            'statut_livraison'  => 'en_attente',
            'date_prevue'       => $data['date_prevue'] ?? null,
            'Id_commande'       => $commande->Id_commande,
        ]);

        return response()->json($livraison, 201);
    }

    /**
     * Le staff assigne un livreur employé (US-026 / statutLivraison = assignee)
     * POST /api/livraison/{id}/assigner { Id_utilisateur: "..." }
     */
    public function assigner(Request $request, string $id)
    {
        if ($request->user()->role === 'etudiant') {
            return response()->json(['message' => 'Seul le personnel peut assigner un livreur.'], 403);
        }

        $data = $request->validate([
            'Id_utilisateur' => 'required|exists:employe,Id_utilisateur',
        ]);

        $livraison = Livraison::findOrFail($id);
        if ($livraison->statut_livraison !== 'en_attente') {
            return response()->json(['message' => 'Livraison déjà assignée ou en cours.'], 422);
        }

        $livraison->update([
            'Id_utilisateur'   => $data['Id_utilisateur'],
            'statut_livraison' => 'assignee',
        ]);

        return $livraison;
    }

    /**
     * Départ en livraison (staff ou livreur lui-même)
     * POST /api/livraison/{id}/demarrer
     */
    public function demarrer(Request $request, string $id)
    {
        $livraison = Livraison::findOrFail($id);
        $utilisateur = $request->user();

        $autorisé = $utilisateur->role !== 'etudiant'
            || $livraison->Id_utilisateur === $utilisateur->Id_utilisateur;
        if (! $autorisé) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($livraison->statut_livraison !== 'assignee') {
            return response()->json(['message' => 'La livraison doit être assignée d'abord.'], 422);
        }

        // Le statut de la commande passe à en_livraison (historique synchronisé)
        DB::transaction(function () use ($livraison) {
            $livraison->update(['statut_livraison' => 'en_cours']);
            $commande = $livraison->commande;
            if ($commande->statut_commande === 'prete') {
                $commande->update(['statut_commande' => 'en_livraison']);
            }
        });

        return $livraison;
    }

    /**
     * Validation de la livraison réussie : commande automatiquement servie (US-026)
     * POST /api/livraison/{id}/livrer
     */
    public function livrer(Request $request, string $id)
    {
        $livraison = Livraison::findOrFail($id);
        $utilisateur = $request->user();

        $autorisé = $utilisateur->role !== 'etudiant'
            || $livraison->Id_utilisateur === $utilisateur->Id_utilisateur;
        if (! $autorisé) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($livraison->statut_livraison !== 'en_cours') {
            return response()->json(['message' => 'La livraison doit être en cours.'], 422);
        }

        DB::transaction(function () use ($livraison) {
            $livraison->update([
                'statut_livraison' => 'livree',
                'date_livraison'   => now(),
            ]);

            $commande = $livraison->commande;
            if (in_array($commande->statut_commande, ['en_livraison', 'prete', 'validee', 'en_preparation'], true)) {
                $commande->update(['statut_commande' => 'servie']);
            }
        });

        return $livraison->load('commande');
    }

    /**
     * Échec de livraison (staff uniquement)
     * POST /api/livraison/{id}/echouer
     */
    public function echouer(Request $request, string $id)
    {
        if ($request->user()->role === 'etudiant') {
            return response()->json(['message' => 'Seul le personnel peut marquer un échec.'], 403);
        }

        $livraison = Livraison::findOrFail($id);
        if ($livraison->statut_livraison !== 'en_cours') {
            return response()->json(['message' => 'La livraison doit être en cours.'], 422);
        }

        $livraison->update(['statut_livraison' => 'echouee']);

        return $livraison;
    }

    /**
     * Générateur LIV0001 (domaine ID_LIV, dictionnaire §10) sans collision.
     */
    private function genererIdLivraison(): string
    {
        do {
            $id = 'LIV' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (Livraison::where('Id_livraison', $id)->exists());

        return $id;
    }
}