<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Utilisateur;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    /**
     * afficher les statistiques de vente hebdomadaires (US-029, staff)
     * GET /api/stats/ventes-semaine (?Id_restaurant= facultatif)
     */
    public function ventesSemaine(Request $request)
    {
        if ($request->user()->role === 'etudiant') {
            return response()->json(['message' => 'Réservé au personnel.'], 403);
        }

        $debut = now()->subDays(6)->startOfDay();
        $fin   = now()->endOfDay();

        $base = Commande::whereBetween('date_commande', [$debut, $fin])
            ->whereNotIn('statut_commande', ['annulee']);

        if ($restaurant = $request->query('Id_restaurant')) {
            $base->where('Id_restaurant', $restaurant);
        }

        $parJour = (clone $base)
            ->selectRaw('DATE(date_commande) as jour, COUNT(*) as nb_commandes, COALESCE(SUM(montant_total),0) as chiffre_affaires')
            ->groupBy(DB::raw('DATE(date_commande)'))
            ->orderBy('jour')
            ->get();

        $parStatut = (clone $base)
            ->selectRaw('statut_commande, COUNT(*) as total')
            ->groupBy('statut_commande')
            ->get();

        // Top 3 articles de la semaine (association Contenir)
        $topArticles = DB::table('contenir')
            ->join('commande', 'contenir.Id_commande', '=', 'commande.Id_commande')
            ->join('article_menu', 'contenir.Id_article', '=', 'article_menu.Id_article')
            ->whereBetween('commande.date_commande', [$debut, $fin])
            ->when($restaurant, fn ($q) => $q->where('commande.Id_restaurant', $restaurant))
            ->selectRaw('article_menu.nom_article, SUM(contenir.quantite) as vendus')
            ->groupBy('article_menu.Id_article', 'article_menu.nom_article')
            ->orderByDesc('vendus')
            ->limit(3)
            ->get();

        return response()->json([
            'periode'         => [$debut->toDateString(), $fin->toDateString()],
            'total_commandes' => (clone $base)->count(),
            'ca_total'        => (int) (clone $base)->sum('montant_total'),
            'par_jour'        => $parJour,
            'par_statut'      => $parStatut,
            'top_articles'    => $topArticles,
        ]);
    }

    /**
     * tableau de bord général (US-032 gérant / US-036 admin)
     * GET /api/stats/dashboard
     */
    public function dashboard(Request $request)
    {
        if (! in_array($request->user()->role, ['gerant', 'administrateur'], true)) {
            return response()->json(['message' => 'Réservé au gérant et aux administrateurs.'], 403);
        }

        $caParPeriode = function ($days) {
            return (int) Commande::whereBetween('date_commande', [now()->subDays($days)->startOfDay(), now()->endOfDay()])
                ->whereNotIn('statut_commande', ['annulee'])
                ->sum('montant_total');
        };

        $parStatut = Commande::selectRaw('statut_commande, COUNT(*) as total')
            ->groupBy('statut_commande')
            ->pluck('total', 'statut_commande');

        $fidélité = DB::table('mvt_points')
            ->selectRaw("type_mvt, COALESCE(SUM(ABS(nbres_points)),0) as total")
            ->groupBy('type_mvt')
            ->pluck('total', 'type_mvt');

        return response()->json([
            'jour'                    => ['ca' => $caParPeriode(0)],
            'semaine'                 => ['ca' => $caParPeriode(6)],
            'mois'                    => ['ca' => $caParPeriode(29)],
            'commandes_par_statut'    => $parStatut,
            'points'                  => $fidélité,
            'etudiants_actifs'        => Utilisateur::where('statut_compte', 'actif')->whereHas('etudiant')->count(),
            'parrainages_recompenses' => DB::table('parrainer')->where('recompense_attribuee', 1)->count(),
            'reclamations_attente'    => DB::table('reclamation')->where('statut_reclamation', 'en_attente')->count(),
        ]);
    }

    /**
     * afficher le classement des 10 meilleurs clients (US-023)
     * filtres : ?periode=jour|semaine|mois (mois par défaut), nombre de commandes
     * GET /api/stats/top-clients — accessible aussi aux étudiants (leaderboard)
     */
    public function topClients(Request $request)
    {
        $periodes = ['jour' => 0, 'semaine' => 6, 'mois' => 29];
        $periode  = $request->query('periode', 'mois');

        if (! array_key_exists($periode, $periodes)) {
            return response()->json(['message' => 'Periode invalide : jour, semaine ou mois.'], 422);
        }

        $debut = now()->subDays($periodes[$periode])->startOfDay();
        $fin   = now()->endOfDay();

        $classement = Commande::whereBetween('date_commande', [$debut, $fin])
            ->whereNotIn('statut_commande', ['annulee'])
            ->selectRaw('Id_utilisateur, COUNT(*) as nb_commandes, COALESCE(SUM(montant_total),0) as montant')
            ->groupBy('Id_utilisateur')
            ->orderByDesc('nb_commandes')
            ->limit(10)
            ->get();

        $utilisateurs = Utilisateur::whereIn('Id_utilisateur', $classement->pluck('Id_utilisateur'))
            ->get(['Id_utilisateur', 'nom', 'prenom'])
            ->keyBy('Id_utilisateur');

        return response()->json([
            'periode'    => $periode,
            'classement' => $classement->map(fn ($ligne, $index) => [
                'rang'         => $index + 1,
                'Id_utilisateur' => $ligne->Id_utilisateur,
                'etudiant'     => $utilisateurs[$ligne->Id_utilisateur]?->only(['nom', 'prenom']),
                'nb_commandes' => (int) $ligne->nb_commandes,
                'montant'      => (int) $ligne->montant,
            ]),
        ]);
    }
}