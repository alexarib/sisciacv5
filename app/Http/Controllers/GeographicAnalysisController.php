<?php

namespace App\Http\Controllers;

use App\Models\Producer;
use App\Models\Crop;
use App\Models\CollectionCenter;
use App\Models\LogisticsRoute;
use App\Models\GeographicAnalysis;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class GeographicAnalysisController extends Controller
{
    /**
     * Get density analysis for producers
     */
    public function producerDensity(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'commune' => 'nullable|string',
            'radius' => 'nullable|numeric|min:0'
        ]);

        $query = Producer::query();

        if ($validated['commune']) {
            $query->where('commune', $validated['commune']);
        }

        $producers = $query->get();

        $density = $this->calculateDensity($producers, $validated['radius'] ?? 5000);

        // Save analysis
        GeographicAnalysis::create([
            'analysis_type' => 'density',
            'target_layer' => 'producers',
            'parameters' => $validated,
            'results' => $density,
            'analysis_date' => now()
        ]);

        return response()->json([
            'message' => 'Análisis de densidad de productores completado',
            'density' => $density
        ]);
    }

    /**
     * Get crop coverage analysis
     */
    public function cropCoverage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'commune' => 'nullable|string',
            'crop_type' => 'nullable|string'
        ]);

        $query = Crop::query();

        if ($validated['commune']) {
            $query->where('commune', $validated['commune']);
        }

        if ($validated['crop_type']) {
            $query->where('name', 'like', "%{$validated['crop_type']}%");
        }

        $crops = $query->get();

        $coverage = $this->calculateCoverage($crops);

        // Save analysis
        GeographicAnalysis::create([
            'analysis_type' => 'coverage',
            'target_layer' => 'crops',
            'parameters' => $validated,
            'results' => $coverage,
            'analysis_date' => now()
        ]);

        return response()->json([
            'message' => 'Análisis de cobertura de cultivos completado',
            'coverage' => $coverage
        ]);
    }

    /**
     * Get logistics efficiency analysis
     */
    public function logisticsEfficiency(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cargo_type' => 'nullable|string',
            'distance_range' => 'nullable|array'
        ]);

        $query = LogisticsRoute::with(['originCenter', 'destinationCenter']);

        if ($validated['cargo_type']) {
            $query->where('cargo_type', $validated['cargo_type']);
        }

        if ($validated['distance_range']) {
            $query->whereBetween('total_distance', $validated['distance_range']);
        }

        $routes = $query->get();

        $efficiency = $this->calculateEfficiency($routes);

        // Save analysis
        GeographicAnalysis::create([
            'analysis_type' => 'efficiency',
            'target_layer' => 'routes',
            'parameters' => $validated,
            'results' => $efficiency,
            'analysis_date' => now()
        ]);

        return response()->json([
            'message' => 'Análisis de eficiencia logística completado',
            'efficiency' => $efficiency
        ]);
    }

    /**
     * Get center coverage analysis
     */
    public function centerCoverage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'center_type' => 'nullable|string',
            'commune' => 'nullable|string'
        ]);

        $query = CollectionCenter::query();

        if ($validated['center_type']) {
            $query->where('type', $validated['center_type']);
        }

        if ($validated['commune']) {
            $query->where('commune', $validated['commune']);
        }

        $centers = $query->get();

        $coverage = $this->calculateCenterCoverage($centers);

        // Save analysis
        GeographicAnalysis::create([
            'analysis_type' => 'coverage',
            'target_layer' => 'centers',
            'parameters' => $validated,
            'results' => $coverage,
            'analysis_date' => now()
        ]);

        return response()->json([
            'message' => 'Análisis de cobertura de centros completado',
            'coverage' => $coverage
        ]);
    }

    /**
     * Get comprehensive geographic analysis
     */
    public function comprehensiveAnalysis(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'commune' => 'nullable|string',
            'include_heatmap' => 'boolean'
        ]);

        $analysis = [
            'producers' => $this->getProducerStats($validated['commune']),
            'crops' => $this->getCropStats($validated['commune']),
            'centers' => $this->getCenterStats($validated['commune']),
            'routes' => $this->getRouteStats($validated['commune']),
            'density_analysis' => $this->calculateDensity(Producer::all(), 5000),
            'coverage_analysis' => $this->calculateCoverage(Crop::all()),
            'efficiency_analysis' => $this->calculateEfficiency(LogisticsRoute::all())
        ];

        if ($validated['include_heatmap'] ?? false) {
            $analysis['heatmap_data'] = $this->generateHeatmapData();
        }

        // Save comprehensive analysis
        GeographicAnalysis::create([
            'analysis_type' => 'comprehensive',
            'target_layer' => 'all',
            'parameters' => $validated,
            'results' => $analysis,
            'analysis_date' => now()
        ]);

        return response()->json([
            'message' => 'Análisis geográfico integral completado',
            'analysis' => $analysis
        ]);
    }

    /**
     * Get analysis history
     */
    public function analysisHistory(): JsonResponse
    {
        $history = GeographicAnalysis::orderByDesc('analysis_date')
            ->paginate(20);

        return response()->json($history);
    }

    /**
     * Calculate density for producers
     */
    private function calculateDensity($producers, $radius = 5000): array
    {
        $totalArea = pi() * pow($radius / 1000, 2); // Area in km²
        $producerCount = $producers->count();

        return [
            'total_producers' => $producerCount,
            'area_km2' => round($totalArea, 2),
            'density_per_km2' => $totalArea > 0 ? round($producerCount / $totalArea, 2) : 0,
            'by_commune' => $producers->groupBy('commune')
                ->map(function ($group) {
                    return $group->count();
                })
        ];
    }

    /**
     * Calculate coverage for crops
     */
    private function calculateCoverage($crops): array
    {
        $totalArea = $crops->sum('area');
        $cropTypes = $crops->groupBy('name')->map(function ($group) {
            return [
                'count' => $group->count(),
                'total_area' => $group->sum('area'),
                'average_area' => $group->avg('area')
            ];
        });

        return [
            'total_crops' => $crops->count(),
            'total_area_ha' => round($totalArea, 2),
            'average_area_ha' => round($crops->avg('area'), 2),
            'by_type' => $cropTypes,
            'by_commune' => $crops->groupBy('commune')
                ->map(function ($group) {
                    return [
                        'count' => $group->count(),
                        'total_area' => $group->sum('area')
                    ];
                })
        ];
    }

    /**
     * Calculate efficiency for routes
     */
    private function calculateEfficiency($routes): array
    {
        $totalDistance = $routes->sum('total_distance');
        $totalCost = $routes->sum(function ($route) {
            return $route->total_distance * ($route->cost_per_km ?? 0);
        });

        return [
            'total_routes' => $routes->count(),
            'total_distance_km' => round($totalDistance, 2),
            'average_distance_km' => round($routes->avg('total_distance'), 2),
            'total_cost' => round($totalCost, 2),
            'average_cost_per_km' => $totalDistance > 0 ? round($totalCost / $totalDistance, 2) : 0,
            'by_cargo_type' => $routes->groupBy('cargo_type')
                ->map(function ($group) {
                    return [
                        'count' => $group->count(),
                        'total_distance' => $group->sum('total_distance'),
                        'average_distance' => $group->avg('total_distance')
                    ];
                })
        ];
    }

    /**
     * Calculate center coverage
     */
    private function calculateCenterCoverage($centers): array
    {
        $totalCapacity = $centers->sum('storage_capacity');
        $totalInfluence = $centers->sum('radius_influence');

        return [
            'total_centers' => $centers->count(),
            'total_capacity_tons' => round($totalCapacity, 2),
            'total_influence_radius_km' => round($totalInfluence, 2),
            'by_type' => $centers->groupBy('type')
                ->map(function ($group) {
                    return [
                        'count' => $group->count(),
                        'total_capacity' => $group->sum('storage_capacity'),
                        'average_influence' => $group->avg('radius_influence')
                    ];
                }),
            'by_commune' => $centers->groupBy('commune')
                ->map(function ($group) {
                    return [
                        'count' => $group->count(),
                        'total_capacity' => $group->sum('storage_capacity')
                    ];
                })
        ];
    }

    /**
     * Get producer statistics
     */
    private function getProducerStats($commune = null): array
    {
        $query = Producer::query();
        if ($commune) {
            $query->where('commune', $commune);
        }

        return [
            'total' => $query->count(),
            'active' => $query->where('status', 'active')->count(),
            'total_area' => $query->sum('area_total'),
            'by_commune' => $query->groupBy('commune')
                ->selectRaw('commune, COUNT(*) as count, SUM(area_total) as total_area')
                ->get()
        ];
    }

    /**
     * Get crop statistics
     */
    private function getCropStats($commune = null): array
    {
        $query = Crop::query();
        if ($commune) {
            $query->where('commune', $commune);
        }

        return [
            'total' => $query->count(),
            'total_area' => $query->sum('area'),
            'by_status' => $query->groupBy('status')
                ->selectRaw('status, COUNT(*) as count, SUM(area) as total_area')
                ->get(),
            'by_commune' => $query->groupBy('commune')
                ->selectRaw('commune, COUNT(*) as count, SUM(area) as total_area')
                ->get()
        ];
    }

    /**
     * Get center statistics
     */
    private function getCenterStats($commune = null): array
    {
        $query = CollectionCenter::query();
        if ($commune) {
            $query->where('commune', $commune);
        }

        return [
            'total' => $query->count(),
            'active' => $query->where('status', 'active')->count(),
            'total_capacity' => $query->sum('storage_capacity'),
            'by_type' => $query->groupBy('type')
                ->selectRaw('type, COUNT(*) as count, SUM(storage_capacity) as total_capacity')
                ->get()
        ];
    }

    /**
     * Get route statistics
     */
    private function getRouteStats($commune = null): array
    {
        $query = LogisticsRoute::query();
        if ($commune) {
            $query->whereHas('originCenter', function ($q) use ($commune) {
                $q->where('commune', $commune);
            })->orWhereHas('destinationCenter', function ($q) use ($commune) {
                $q->where('commune', $commune);
            });
        }

        return [
            'total' => $query->count(),
            'active' => $query->where('status', 'active')->count(),
            'total_distance' => $query->sum('total_distance'),
            'by_cargo_type' => $query->groupBy('cargo_type')
                ->selectRaw('cargo_type, COUNT(*) as count, SUM(total_distance) as total_distance')
                ->get()
        ];
    }

    /**
     * Generate heatmap data
     */
    private function generateHeatmapData(): array
    {
        $heatmapData = [];

        // Add producers to heatmap
        Producer::whereNotNull('location')->get()->each(function ($producer) use (&$heatmapData) {
            $heatmapData[] = [
                'lat' => $producer->location['lat'] ?? 0,
                'lng' => $producer->location['lng'] ?? 0,
                'intensity' => 1,
                'type' => 'producer'
            ];
        });

        // Add crops to heatmap
        Crop::whereNotNull('center_point')->get()->each(function ($crop) use (&$heatmapData) {
            $heatmapData[] = [
                'lat' => $crop->center_point['lat'] ?? 0,
                'lng' => $crop->center_point['lng'] ?? 0,
                'intensity' => $crop->area / 10, // Normalize by area
                'type' => 'crop'
            ];
        });

        // Add centers to heatmap
        CollectionCenter::whereNotNull('location')->get()->each(function ($center) use (&$heatmapData) {
            $heatmapData[] = [
                'lat' => $center->location['lat'] ?? 0,
                'lng' => $center->location['lng'] ?? 0,
                'intensity' => 2,
                'type' => 'center'
            ];
        });

        return $heatmapData;
    }
} 