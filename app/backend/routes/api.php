<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ArticleMenuController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\ParametreController;
use App\Http\Controllers\CommandeController;
use Illuminate\Support\Facades\Route;

// --- Authentification (Sanctum) ---
Route::post('auth/inscription', [AuthController::class, 'inscription']);
Route::post('auth/connexion', [AuthController::class, 'connexion']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/deconnexion', [AuthController::class, 'deconnexion']);
    Route::get('auth/me', [AuthController::class, 'me']);
});

// --- Ressources CRUD (7 routes REST par ressource) ---
Route::apiResource('restaurant', RestaurantController::class);
Route::apiResource('article_menu', ArticleMenuController::class);
Route::apiResource('evenement', EvenementController::class);
Route::apiResource('parametre', ParametreController::class);

// --- Routes spécifiques article_menu (doivent être définies AVANT apiResource
//     pour éviter le conflit avec GET /article_menu/{article_menu}) ---
Route::get('article_menu-du-jour', [ArticleMenuController::class, 'menu_du_jour']);
Route::get('article_menu-du-jour/{categorie}', [ArticleMenuController::class, 'plat_du_jour']);

// --- Routes spécifiques evenement ---
Route::get('promotions/actives', [EvenementController::class, 'promotionsActives']);
Route::post('evenement/{id}/participer', [EvenementController::class, 'participer']);
Route::get('evenement/{id}/participations', [EvenementController::class, 'participations']);

// --- Commandes (le panier est géré côté client ; le serveur revalide tout) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('commande', CommandeController::class)->except(['update']);

    // staff : validation et changement de statut (US-026)
    Route::post('commande/{commande}/valider', [CommandeController::class, 'valider']);
    Route::post('commande/{commande}/statut', [CommandeController::class, 'changerStatut']);

    // étudiant : commentaire après service (US-010)
    Route::post('commande/{commande}/commentaire', [CommandeController::class, 'commentaire']);
});