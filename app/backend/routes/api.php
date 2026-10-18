<?php
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ArticleMenuController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\ParametreController;
use Illuminate\Support\Facades\Route;

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

