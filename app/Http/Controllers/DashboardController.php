<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Producer;
use App\Models\Crop;
use App\Models\Logistics;
use App\Models\Training;
use App\Models\Report;
use App\Models\Supply;
use App\Models\Alert;

class DashboardController extends Controller
{
    public function __construct()
    {
        // Temporalmente deshabilitamos el middleware para testing
        // $this->middleware('auth:sanctum');
    }

    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'producers' => Producer::where('status', 'active')->count(),
                'crops' => Crop::whereIn('status', ['planted', 'growing'])->count(),
                'logistics' => Logistics::where('status', '!=', 'cancelled')->count(),
                'trainings' => Training::whereIn('status', ['scheduled', 'in_progress'])->count(),
                'reports' => Report::count(),
                'supplies' => Supply::count(),
                'alerts' => Alert::where('status', '!=', 'resolved')->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error en dashboard stats: ' . $e->getMessage());
            
            // Devolver datos por defecto en caso de error
            return response()->json([
                'producers' => 0,
                'crops' => 0,
                'logistics' => 0,
                'trainings' => 0,
                'reports' => 0,
                'supplies' => 0,
                'alerts' => 0,
            ]);
        }
    }

    public function activities(): JsonResponse
    {
        // Simular actividades recientes
        $activities = [
            [
                'title' => 'Nuevo productor registrado',
                'description' => 'Juan Pérez se ha registrado en el sistema',
                'created_at' => now()->subHours(2)
            ],
            [
                'title' => 'Cultivo actualizado',
                'description' => 'Maíz Amarillo ha sido marcado como en crecimiento',
                'created_at' => now()->subHours(4)
            ],
            [
                'title' => 'Capacitación programada',
                'description' => 'Nueva capacitación sobre técnicas orgánicas',
                'created_at' => now()->subHours(6)
            ],
            [
                'title' => 'Insumo agregado',
                'description' => 'Fertilizante NPK agregado al inventario',
                'created_at' => now()->subHours(8)
            ],
            [
                'title' => 'Reporte generado',
                'description' => 'Reporte mensual de productividad completado',
                'created_at' => now()->subHours(12)
            ]
        ];

        return response()->json($activities);
    }

    public function cropStatsByMonth(): JsonResponse
    {
        $cropStats = Crop::selectRaw('
                EXTRACT(MONTH FROM planting_date) as month,
                COUNT(*) as total_crops,
                SUM(area) as total_area,
                COUNT(CASE WHEN status = \'harvested\' THEN 1 END) as harvested_crops
            ')
            ->whereYear('planting_date', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($cropStats);
    }

    public function producerPerformance(): JsonResponse
    {
        $performance = Producer::withCount(['crops', 'logistics', 'training', 'reports'])
            ->withSum('crops', 'area')
            ->orderBy('crops_count', 'desc')
            ->limit(10)
            ->get();

        return response()->json($performance);
    }

    public function logisticsSummary(): JsonResponse
    {
        $summary = Logistics::selectRaw('
                type,
                COUNT(*) as total,
                SUM(quantity) as total_quantity,
                SUM(total_price) as total_value
            ')
            ->groupBy('type')
            ->get();

        return response()->json($summary);
    }
}
