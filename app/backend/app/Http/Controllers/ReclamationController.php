<?php

namespace App\Http\Controllers;

use App\Http\Requests\DecisionReclamationRequest;
use App\Http\Requests\StoreReclamationRequest;
use App\Models\Reclamation;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReclamationController extends Controller
{
    // Statuts pendant lesquels une réclamation est encore ouverte
    private const ACTIVES = ['en_attente', 'observation'];

    // L'étudiant dépose une réclamation sur SA commande
    public function store(StoreReclamationRequest $request): JsonResponse
    {
        $user = $request->user();

        if (Roles::de($user) !== 'etudiant') {
            return response()->json(['message' => 'Réservé aux étudiants.'], 403);
        }

        $commande = DB::table('commande')->where('Id_commande', $request->Id_commande)->first();

        if (!$commande) {
            return response()->json(['message' => 'Commande introuvable.'], 404);
        }
        if ($commande->Id_utilisateur !== $user->Id_utilisateur) {
            return response()->json(['message' => 'Cette commande ne vous appartient pas.'], 403);
        }

        $reclamation = DB::transaction(function () use ($request, $user) {
            // Une seule réclamation active par commande
            $dejaActive = Reclamation::where('Id_commande', $request->Id_commande)
                ->whereIn('statut_reclamation', self::ACTIVES)
                ->lockForUpdate()
                ->exists();

            if ($dejaActive) {
                return null;
            }

            return Reclamation::create([
                'Id_reclamation'          => $this->nouvelId(),
                'motif_reclamation'       => $request->motif_reclamation,
                'description_reclamation' => $request->description_reclamation,
                'statut_reclamation'      => 'en_attente',
                'Id_utilisateur'          => $user->Id_utilisateur,
                'Id_commande'             => $request->Id_commande,
            ]);
        });

        if (!$reclamation) {
            return response()->json(['message' => 'Une réclamation est déjà en cours sur cette commande.'], 409);
        }

        return response()->json(['data' => $reclamation->fresh()], 201);
    }

    // Étudiant : les siennes. Personnel : toutes (filtre optionnel ?statut=)
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = Roles::de($user);

        if ($role === null) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $query = Reclamation::query()->orderByDesc('date_reclamation');

        if ($role === 'etudiant') {
            $query->where('Id_utilisateur', $user->Id_utilisateur);
        } elseif ($request->filled('statut')) {
            $query->where('statut_reclamation', $request->statut);
        }

        return response()->json(['data' => $query->get()]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $role = Roles::de($user);

        if ($role === null) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $reclamation = Reclamation::findOrFail($id);

        if ($role === 'etudiant' && $reclamation->Id_utilisateur !== $user->Id_utilisateur) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return response()->json(['data' => $reclamation]);
    }

    // Employé ou administrateur : prend la réclamation en charge
    public function prendreEnCharge(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $role = Roles::de($user);

        if (!in_array($role, ['employe', 'administrateur'], true)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $reclamation = Reclamation::findOrFail($id);

        if ($reclamation->statut_reclamation !== 'en_attente') {
            return response()->json(['message' => 'Cette réclamation est déjà prise en charge ou clôturée.'], 409);
        }

        $champs = $role === 'administrateur'
            ? ['Id_admin_traitant' => $user->Id_utilisateur, 'date_traitement_admin' => now()]
            : ['Id_traitant'       => $user->Id_utilisateur, 'date_traitement'       => now()];

        $reclamation->update($champs + ['statut_reclamation' => 'observation']);

        return response()->json(['data' => $reclamation->fresh()]);
    }

    // Gérant ou administrateur : décision finale
    public function decider(DecisionReclamationRequest $request, string $id): JsonResponse
    {
        $user = $request->user();
        $role = Roles::de($user);

        if (!in_array($role, ['gerant', 'administrateur'], true)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $reclamation = Reclamation::findOrFail($id);

        if (!in_array($reclamation->statut_reclamation, self::ACTIVES, true)) {
            return response()->json(['message' => 'Réclamation déjà clôturée.'], 409);
        }

        $champs = $role === 'administrateur'
            ? ['Id_admin_decideur' => $user->Id_utilisateur, 'date_decision_admin' => now(), 'decision_admin' => $request->decision]
            : ['Id_gerant'         => $user->Id_utilisateur, 'date_decision'       => now(), 'decision'       => $request->decision];

        $reclamation->update($champs + [
            'statut_reclamation'  => $request->decision,
            'reponse_reclamation' => $request->reponse_reclamation,
        ]);

        return response()->json(['data' => $reclamation->fresh()]);
    }

    // Format imposé par le CHECK : #RECLA + 4 chiffres. À appeler dans une transaction.
    private function nouvelId(): string
    {
        $dernier = Reclamation::lockForUpdate()->orderByDesc('Id_reclamation')->value('Id_reclamation');
        $n = $dernier ? ((int) substr($dernier, 6)) + 1 : 1;

        return '#RECLA' . str_pad((string) $n, 4, '0', STR_PAD_LEFT);
    }
}