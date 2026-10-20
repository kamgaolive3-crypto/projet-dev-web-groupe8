<?php

namespace App\Http\Controllers;

use App\Http\Requests\UtiliserCodeParrainageRequest;
use App\Models\Parrainer;
use App\Support\Roles;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParrainageController extends Controller
{
    // Mon code à partager et mon nombre de filleuls
    public function monCode(Request $request): JsonResponse
    {
        if ($refus = $this->refuserSiPasEtudiant($request)) {
            return $refus;
        }

        $id = $request->user()->Id_utilisateur;

        return response()->json(['data' => [
            'code_parrainage' => DB::table('etudiant')->where('Id_utilisateur', $id)->value('code_parrainage'),
            'nombre_filleuls' => Parrainer::where('Id_parrain', $id)->count(),
        ]]);
    }

    // Je saisis le code de l'étudiant qui m'a parrainé.
    // Ici on crée seulement le lien : la récompense est versée plus tard
    // par ParrainageService::verserRecompense (une seule fois).
    public function utiliserCode(UtiliserCodeParrainageRequest $request): JsonResponse
    {
        if ($refus = $this->refuserSiPasEtudiant($request)) {
            return $refus;
        }

        $moi     = $request->user()->Id_utilisateur;
        $parrain = DB::table('etudiant')->where('code_parrainage', $request->code_parrainage)->first();

        if (!$parrain) {
            return response()->json(['message' => 'Code de parrainage inconnu.'], 404);
        }
        if ($parrain->Id_utilisateur === $moi) {
            return response()->json(['message' => 'Vous ne pouvez pas utiliser votre propre code.'], 422);
        }
        if (Parrainer::where('Id_filleul', $moi)->exists()) {
            return response()->json(['message' => 'Vous avez déjà un parrain.'], 409);
        }
        // Évite un parrainage circulaire : A parraine B, puis B essaie de parrainer A
        if (Parrainer::where('Id_filleul', $parrain->Id_utilisateur)->where('Id_parrain', $moi)->exists()) {
            return response()->json(['message' => 'Cet étudiant est déjà votre filleul.'], 422);
        }

        try {
            Parrainer::create([
                'Id_filleul'           => $moi,
                'Id_parrain'           => $parrain->Id_utilisateur,
                'recompense_attribuee' => false,
            ]);
        } catch (QueryException $e) {
            // Deux requêtes simultanées : la clé primaire Id_filleul bloque la seconde (erreur MySQL 1062)
            if (($e->errorInfo[1] ?? null) === 1062) {
                return response()->json(['message' => 'Vous avez déjà un parrain.'], 409);
            }
            throw $e;
        }

        return response()->json(['data' => Parrainer::where('Id_filleul', $moi)->first()], 201);
    }

    // Les étudiants que j'ai parrainés
    public function mesFilleuls(Request $request): JsonResponse
    {
        if ($refus = $this->refuserSiPasEtudiant($request)) {
            return $refus;
        }

        $filleuls = Parrainer::where('Id_parrain', $request->user()->Id_utilisateur)
            ->orderByDesc('date_parrainage')
            ->get(['Id_filleul', 'date_parrainage', 'recompense_attribuee']);

        return response()->json(['data' => $filleuls]);
    }

    // Toujours se baser sur l'utilisateur connecté, jamais sur un identifiant reçu dans l'URL
    private function refuserSiPasEtudiant(Request $request): ?JsonResponse
    {
        return Roles::de($request->user()) === 'etudiant'
            ? null
            : response()->json(['message' => 'Réservé aux étudiants.'], 403);
    }
}