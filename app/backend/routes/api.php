<?php
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ArticleMenuController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\ParametreController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('auth/inscription', [AuthController::class, 'inscription']);
Route::post('auth/connexion', [AuthController::class, 'connexion']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/deconnexion', [AuthController::class, 'deconnexion']);
});

