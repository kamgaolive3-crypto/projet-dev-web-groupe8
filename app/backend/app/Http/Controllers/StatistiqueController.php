<?php

namespace App\Http\Controllers;

use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    // Statistiques de ventes, de fidélité, de parrainage et de réclamations.
    // Réservé au gérant et à l'administrateur. Lecture seule : rien n'est modifié.
    // Filtre de période optionnel : GET /api/statistiques?du=2026-10-01&au=2026-10-31
    public function index(Request $request): JsonResponse
    {
        if (!in_array(Roles::de($request->user()), ['gerant', 'administrateur'], true)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $request->validate([
            'du' => ['nullable', 'date'],
            'au' => ['nullable', 'date', 'after_or_equal:du'],
        ]);

        $du = $request->input('du');
        $au = $request->input('au') ? $request->input('au') . ' 23:59:59' : null;

        // Applique le filtre de période sur une colonne de date
        $periode = fn ($query, string $colonne) => $query
            ->when($du, fn ($q) => $q->where($colonne, '>=', $du))
            ->when($au, fn ($q) => $q->where($colonne, '<=', $au));

        return response()->json(['data' => [
            'periode' => ['du' => $du, 'au' => $request->input('au')],

            'ventes' => [
                'nombre_commandes' => $periode(DB::table('commande'), 'date_commande')->count(),

                'commandes_par_statut' => $periode(DB::table('commande'), 'date_commande')
                    ->select('statut_commande', DB::raw('COUNT(*) as total'))
                    ->groupBy('statut_commande')
                    ->pluck('total', 'statut_commande'),

                // Argent réellement encaissé : seuls les paiements au statut « paye »
                'chiffre_affaires' => (int) $periode(
                    DB::table('paiement')->where('statut_paiement', 'paye'),
                    'date_paiement'
                )->sum('montant_paye'),

                'plats_les_plus_vendus' => $periode(
                    DB::table('contenir')
                        ->join('commande', 'commande.Id_commande', '=', 'contenir.Id_commande')
                        ->join('article_menu', 'article_menu.Id_article', '=', 'contenir.Id_article')
                        ->where('commande.statut_commande', '<>', 'annulee'),
                    'commande.date_commande'
                )
                    ->select(
                        'article_menu.Id_article',
                        'article_menu.nom_article',
                        DB::raw('SUM(contenir.quantite) as quantite_vendue')
                    )
                    ->groupBy('article_menu.Id_article', 'article_menu.nom_article')
                    ->orderByDesc('quantite_vendue')
                    ->limit(5)
                    ->get(),
            ],

            // Convention provisoire : un gain est positif, une dépense est négative
            'fidelite' => [
                'points_distribues' => (int) $periode(
                    DB::table('mvt_points')->where('nbres_points', '>', 0),
                    'date_mvt'
                )->sum('nbres_points'),

                'points_utilises' => abs((int) $periode(
                    DB::table('mvt_points')->where('nbres_points', '<', 0),
                    'date_mvt'
                )->sum('nbres_points')),

                // Total des soldes actuels de tous les étudiants (non filtré par période)
                'points_en_circulation' => (int) DB::table('etudiant')->sum('solde_point'),
            ],

            'parrainage' => [
                'nombre_parrainages' => $periode(DB::table('parrainer'), 'date_parrainage')->count(),

                'recompenses_versees' => $periode(
                    DB::table('parrainer')->where('recompense_attribuee', true),
                    'date_parrainage'
                )->count(),
            ],

            'reclamations' => [
                'par_statut' => $periode(DB::table('reclamation'), 'date_reclamation')
                    ->select('statut_reclamation', DB::raw('COUNT(*) as total'))
                    ->groupBy('statut_reclamation')
                    ->pluck('total', 'statut_reclamation'),
            ],
        ]]);
    }
}