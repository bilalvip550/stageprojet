<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\StatusController;
use App\Http\Controllers\API\DivisionController;
use App\Http\Controllers\API\HistoriqueController;
use App\Http\Controllers\API\DocumentpathController;
use App\Http\Controllers\API\AuthController;


Route::prefix('v1')->group(function () {
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('statuses', StatusController::class);
    Route::apiResource('historiques', HistoriqueController::class);
    Route::apiResource('documentpaths', DocumentpathController::class);
    Route::apiResource('divisions', DivisionController::class);
    Route::apiResource('admins', AdminController::class);
});

Route::post('/login', action: [AuthController::class, 'login']);
