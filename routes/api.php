<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProducerController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\LogisticsController;
use App\Http\Controllers\CollectionCenterController;
use App\Http\Controllers\LogisticsRouteController;
use App\Http\Controllers\GeographicAnalysisController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\AlertsController;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\SupplyRequestController;
use App\Http\Controllers\WorkerController;
use App\Http\Controllers\MarketPriceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SalesChannelController;
use App\Http\Controllers\LocationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth Routes
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);

// Public Weather (pruebas)
Route::get('weather/current', [WeatherController::class, 'current']);
Route::get('weather/forecast', [WeatherController::class, 'forecast']);

// Public Alerts demo (mientras se instala Sanctum definitivamente)
Route::get('alerts-demo', [AlertsController::class, 'list']);

// Protected Routes (temporarily without Sanctum middleware)
Route::get('auth/me', [AuthController::class, 'me']);
Route::post('auth/logout', [AuthController::class, 'logout']);
Route::post('auth/change-password', [AuthController::class, 'changePassword']);

// Producer Routes
Route::apiResource('producers', ProducerController::class);
Route::get('producers/{producer}/statistics', [ProducerController::class, 'statistics']);

// Crop Routes
Route::apiResource('crops', CropController::class);

// Logistics Routes
Route::apiResource('logistics', LogisticsController::class);
Route::get('logistics/statistics', [LogisticsController::class, 'statistics']);
Route::get('logistics/summary', [LogisticsController::class, 'summary']);
Route::put('logistics/{logistics}/status', [LogisticsController::class, 'updateStatus']);
Route::get('logistics/producer/{producerId}', [LogisticsController::class, 'byProducer']);

// Collection Centers Routes
Route::apiResource('collection-centers', CollectionCenterController::class);
Route::get('collection-centers/type/{type}', [CollectionCenterController::class, 'byType']);
Route::get('collection-centers/commune/{commune}', [CollectionCenterController::class, 'byCommune']);
Route::post('collection-centers/within-radius', [CollectionCenterController::class, 'withinRadius']);
Route::get('collection-centers/statistics', [CollectionCenterController::class, 'statistics']);

// Logistics Routes
Route::apiResource('logistics-routes', LogisticsRouteController::class);
Route::get('logistics-routes/cargo-type/{cargoType}', [LogisticsRouteController::class, 'byCargoType']);
Route::post('logistics-routes/within-distance', [LogisticsRouteController::class, 'withinDistanceRange']);
Route::post('logistics-routes/optimize', [LogisticsRouteController::class, 'optimizeRoute']);
Route::get('logistics-routes/statistics', [LogisticsRouteController::class, 'statistics']);

// Geographic Analysis Routes
Route::post('geographic-analysis/producer-density', [GeographicAnalysisController::class, 'producerDensity']);
Route::post('geographic-analysis/crop-coverage', [GeographicAnalysisController::class, 'cropCoverage']);
Route::post('geographic-analysis/logistics-efficiency', [GeographicAnalysisController::class, 'logisticsEfficiency']);
Route::post('geographic-analysis/center-coverage', [GeographicAnalysisController::class, 'centerCoverage']);
Route::post('geographic-analysis/comprehensive', [GeographicAnalysisController::class, 'comprehensiveAnalysis']);
Route::get('geographic-analysis/history', [GeographicAnalysisController::class, 'analysisHistory']);

// Training Routes
Route::apiResource('trainings', TrainingController::class);
Route::get('trainings/enrollments', [TrainingController::class, 'enrollments']);
Route::patch('trainings/{training}/attendance', [TrainingController::class, 'updateAttendance']);

// Worker Routes
Route::apiResource('workers', WorkerController::class);

// Market Prices Routes
Route::apiResource('market-prices', MarketPriceController::class);

// Transaction Routes
Route::apiResource('transactions', TransactionController::class);

// Sales Channel Routes
Route::apiResource('sales-channels', SalesChannelController::class);

// Location Routes (Ubicaciones/Mapas)
Route::apiResource('locations', LocationController::class);
Route::get('locations/stats', [LocationController::class, 'stats']);
Route::get('locations/geojson', [LocationController::class, 'geojson']);
Route::post('locations/nearby', [LocationController::class, 'nearby']);
Route::get('locations/by-producer/{producerId}', [LocationController::class, 'byProducer']);
Route::get('locations/by-type/{type}', [LocationController::class, 'byType']);
Route::get('locations/area-stats', [LocationController::class, 'areaStats']);
Route::post('locations/clustering', [LocationController::class, 'clustering']);

// Report Routes
Route::apiResource('reports', ReportController::class);
Route::get('reports/type/{type}', [ReportController::class, 'byType']);
Route::get('reports/producer/{producerId}', [ReportController::class, 'byProducer']);
Route::get('reports/date-range', [ReportController::class, 'byDateRange']);

// Dashboard Routes
Route::get('dashboard/stats', [DashboardController::class, 'stats']);
Route::get('dashboard/activities', [DashboardController::class, 'activities']);
Route::get('dashboard/crop-stats', [DashboardController::class, 'cropStatsByMonth']);
Route::get('dashboard/producer-performance', [DashboardController::class, 'producerPerformance']);
Route::get('dashboard/logistics-summary', [DashboardController::class, 'logisticsSummary']);

// Alerts (CRUD + acciones)
Route::get('alerts', [AlertsController::class, 'index']);
Route::post('alerts', [AlertsController::class, 'store']);
Route::get('alerts/{alert}', [AlertsController::class, 'show']);
Route::put('alerts/{alert}', [AlertsController::class, 'update']);
Route::delete('alerts/{alert}', [AlertsController::class, 'destroy']);
Route::post('alerts/{alert}/read', [AlertsController::class, 'markAsRead']);
Route::post('alerts/{alert}/resolve', [AlertsController::class, 'resolve']);

// Supplies (Inventario)
Route::apiResource('supplies', SupplyController::class);
Route::post('supplies/{supply}/adjust', [SupplyController::class, 'adjustStock']);

// Supply Requests (Solicitudes de insumos)
Route::apiResource('supply-requests', SupplyRequestController::class);
Route::post('supply-requests/{supplyRequest}/approve', [SupplyRequestController::class, 'approve']);
Route::post('supply-requests/{supplyRequest}/reject', [SupplyRequestController::class, 'reject']);
Route::post('supply-requests/{supplyRequest}/fulfill', [SupplyRequestController::class, 'fulfill']);

// Search Routes
Route::get('search/producers', function (Request $request) {
    $query = $request->get('q');
    $producers = \App\Models\Producer::where('name', 'like', "%{$query}%")
        ->orWhere('email', 'like', "%{$query}%")
        ->orWhere('document_number', 'like', "%{$query}%")
        ->limit(10)
        ->get();

    return response()->json($producers);
});

Route::get('search/crops', function (Request $request) {
    $query = $request->get('q');
    $crops = \App\Models\Crop::where('name', 'like', "%{$query}%")
        ->with('producer')
        ->limit(10)
        ->get();

    return response()->json($crops);
});
