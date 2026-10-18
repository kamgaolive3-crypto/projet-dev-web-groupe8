<?php
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ArticleMenuController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\ParametreController;
use Illuminate\Support\Facades\Route;

Route::apiResource('restaurant', RestaurantController::class);
Route::apiResource('article_menu', ArticleMenuController::class);
Route::apiResource('evenement',EvenementController::class);
Route::apiResource('parametre', ParametreController::class);

