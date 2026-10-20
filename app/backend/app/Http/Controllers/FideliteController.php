<?php

namespace App\Http\Controllers;

use App\Http\Requests\UtiliserPointsRequest;
use App\Models\MvtPoint;
use App\Services\FideliteService;
use App\Support\Roles;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FideliteController extends Controller
{
    // Laravel fournit lui-même le FideliteService (injection de dépendances)
    public function __construct(private FideliteService $fidelite) {}

    // Solde de points de l'étudiant connecté
    public function solde(Request $request): JsonResponse
    {
        if ($refus = $this->refuserSiPasEtudiant($request)) {
            return $refus;
        }

        $solde = DB::table('etudiant')
            ->where('Id_utilisateur', $request->user()->Id_utilisateur)
            ->value('solde_point');

        return response()->json(['data' => ['solde' => (int) $solde]]);
    }

    // Historique des mouvements de l'étudiant connecté (filtre optionnel ?type=)
    public function historique(Request $request): JsonResponse
    {
        if ($refus = $this->refuserSiPasEtudiant($request)) {
            return $refus;
        }

        $query = MvtPoint::where('Id_utilisateur', $request->user()->Id_utilisateur)
            ->orderByDesc('date_mvt');

        if ($request->filled('type') && in_array($request->type, MvtPoint::TYPES, true)) {
            $query->where('type_mvt', $request->type);
        }

        return response()->json(['data' => $query->get()]);
    }

    // Utilisation de points par l'étudiant connecté
    public function utiliser(UtiliserPointsRequest $request): JsonResponse
    {
        if ($refus = $this->refuserSiPasEtudiant($request)) {
            return $refus;
        }

        try {
            $mvt = $this->fidelite->utiliser(
                $request->user()->Id_utilisateur,
                (int) $request->points
            );
        } catch (DomainException $e) {
            // Règle métier violée (ex. solde insuffisant) : 422 avec le message
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['data' => $mvt->fresh()], 201);
    }

    // Toujours se baser sur l'utilisateur connecté, jamais sur un identifiant reçu dans l'URL
    private function refuserSiPasEtudiant(Request $request): ?JsonResponse
    {
        return Roles::de($request->user()) === 'etudiant'
            ? null
            : response()->json(['message' => 'Réservé aux étudiants.'], 403);
    }
}
