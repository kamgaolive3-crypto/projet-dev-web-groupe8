<?php

namespace App\Http\Controllers;

use App\Models\Parametre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParametreController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /api/parametres
     * Utilisé par la page Paramètres pour afficher les réglages actuels
     */
    public function index()
    {
        // pluck('valeur', 'cle') : lit toute la table et renvoie un tableau
        return Parametre::pluck('valeur', 'cle');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Vérifie les données reçues
        $data = $request->validate([
            // "parametres" est obligatoire et doit être un tableau (cle => valeur)
            'parametre'     => 'required|array',
            // chaque valeur du tableau est obligatoire et doit être du texte
            // (la colonne "valeur" est un TEXT : on envoie "1" ou "0", pas true/false)
            'parametre.*'   => 'required|string',
            // l'administrateur qui modifie doit exister dans la table administrateur
            'Id_utilisateur' => 'required|exists:administrateur,Id_utilisateur'
        ]);

        //Transaction : tous les réglages sont enregistrés, ou aucun
        //   "use ($data)" donne à la fonction interne accès à $data
        DB::transaction(function () use ($data) {

            //  Parcourt chaque réglage envoyé : $cle = le nom, $valeur = la nouvelle valeur
            foreach ($data['parametre'] as $cle => $valeur) {

                //  Cherche la ligne dont la colonne "cle" correspond
                //    (erreur 404 si ce réglage n'existe pas)
                Parametre::where('cle', $cle)->firstOrFail()

                         // Met à jour la valeur, et note quel admin a fait la modification
                         ->update([
                             'valeur'         => $valeur,
                             'Id_utilisateur' => $data['Id_utilisateur'],
                         ]);
            }
        });

        // 6. Renvoie tous les réglages à jour, pour que React rafraîchisse la page
        return Parametre::pluck('valeur', 'cle');
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
