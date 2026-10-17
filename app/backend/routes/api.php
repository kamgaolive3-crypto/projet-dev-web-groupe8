<?php
use App\Http\Controllers\RestaurantController;
use Illuminate\Support\Facades\Route;

Route::apiResource('restaurant', RestaurantController::class);
