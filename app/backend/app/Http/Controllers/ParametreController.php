<?php

namespace App\Http\Controllers;

use App\Models\Parametre;
use Illuminate\Http\Request;

class ParametreController extends Controller
{
    /**
     * GET /api/parametre
     * Liste tous les paramètres de l'application.
     */
    public function index()
    {
        return Parametre::all();
    }

    /**
     * POST /api/parametre
     * Crée un nouveau paramètre (magasin clé/valeur).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'Id_parametre'  => ['required', 'regex:/^[A-Z]{2}[0-9]{3}$/', 'unique:parametre,Id_parametre'],
            'cle'           => 'required|string|max:100|unique:parametre,cle',
            'valeur'        => 'required|string',
            'Id_utilisateur'=> 'required|exists:administrateur,Id_utilisateur',
        ]);

        $parametre = Parametre::create($data);
        return response()->json($parametre, 201);
    }

    /**
     * GET /api/parametre/{id}
     * Affiche un paramètre précis par son Id_parametre.
     */
    public function show(string $id)
    {
        return Parametre::findOrFail($id);
    }

    /**
     * PUT /api/parametre/{id}
     * Met à jour un paramètre. L'Id_parametre est ignoré dans le contrôle
     * d'unicité (il ne change pas), la clé doit rester unique.
     */
    public function update(Request $request, string $id)
    {
        $parametre = Parametre::findOrFail($id);
        $data = $request->validate([
            'Id_parametre'  => ['required', 'regex:/^[A-Z]{2}[0-9]{3}$/', 'unique:parametre,Id_parametre,'.$id],
            'cle'           => 'required|string|max:100|unique:parametre,cle,'.$id.',Id_parametre',
            'valeur'        => 'required|string',
            'Id_utilisateur'=> 'required|exists:administrateur,Id_utilisateur',
        ]);

        $parametre->update($data);
        return response()->json($parametre, 200);
    }

    /**
     * DELETE /api/parametre/{id}
     * Supprime un paramètre.
     */
    public function destroy(string $id)
    {
        Parametre::findOrFail($id)->delete();
        return response()->json(['message' => 'paramètre supprimé']);
    }
}
