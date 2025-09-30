<?php

namespace App\Http\Controllers;

use App\Models\LogisticsRoute;
use App\Models\CollectionCenter;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LogisticsRouteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $routes = LogisticsRoute::with(['originCenter', 'destinationCenter'])
            ->orderBy('name')
            ->paginate(15);

        return response()->json($routes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'route_geometry' => 'required|array',
            'origin_center_id' => 'required|exists:collection_centers,id',
            'destination_center_id' => 'required|exists:collection_centers,id|different:origin_center_id',
            'cargo_type' => 'nullable|string|max:100',
            'vehicle_capacity' => 'nullable|numeric|min:0',
            'frequency_trips' => 'nullable|integer|min:0',
            'estimated_time' => 'nullable|integer|min:0',
            'cost_per_km' => 'nullable|numeric|min:0',
            'total_distance' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive,maintenance'
        ]);

        // Convert route geometry array to PostGIS linestring format
        $coordinates = $validated['route_geometry'];
        $linestring = 'LINESTRING(';
        foreach ($coordinates as $coord) {
            $linestring .= "{$coord['lng']} {$coord['lat']},";
        }
        $linestring = rtrim($linestring, ',') . ')';
        $validated['route_geometry'] = $linestring;

        // Calculate total distance if not provided
        if (empty($validated['total_distance'])) {
            $validated['total_distance'] = $this->calculateDistance($coordinates);
        }

        // Calculate estimated time if not provided
        if (empty($validated['estimated_time'])) {
            $validated['estimated_time'] = $this->calculateEstimatedTime($validated['total_distance']);
        }

        $route = LogisticsRoute::create($validated);
        $route->load(['originCenter', 'destinationCenter']);

        return response()->json([
            'message' => 'Ruta logística creada exitosamente',
            'route' => $route
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LogisticsRoute $logisticsRoute): JsonResponse
    {
        $logisticsRoute->load(['originCenter', 'destinationCenter']);
        return response()->json($logisticsRoute);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LogisticsRoute $logisticsRoute): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'route_geometry' => 'sometimes|required|array',
            'origin_center_id' => 'sometimes|required|exists:collection_centers,id',
            'destination_center_id' => 'sometimes|required|exists:collection_centers,id|different:origin_center_id',
            'cargo_type' => 'nullable|string|max:100',
            'vehicle_capacity' => 'nullable|numeric|min:0',
            'frequency_trips' => 'nullable|integer|min:0',
            'estimated_time' => 'nullable|integer|min:0',
            'cost_per_km' => 'nullable|numeric|min:0',
            'total_distance' => 'nullable|numeric|min:0',
            'status' => 'sometimes|required|in:active,inactive,maintenance'
        ]);

        // Convert route geometry array to PostGIS linestring format if provided
        if (isset($validated['route_geometry'])) {
            $coordinates = $validated['route_geometry'];
            $linestring = 'LINESTRING(';
            foreach ($coordinates as $coord) {
                $linestring .= "{$coord['lng']} {$coord['lat']},";
            }
            $linestring = rtrim($linestring, ',') . ')';
            $validated['route_geometry'] = $linestring;

            // Recalculate distance and time
            $validated['total_distance'] = $this->calculateDistance($coordinates);
            $validated['estimated_time'] = $this->calculateEstimatedTime($validated['total_distance']);
        }

        $logisticsRoute->update($validated);
        $logisticsRoute->load(['originCenter', 'destinationCenter']);

        return response()->json([
            'message' => 'Ruta logística actualizada exitosamente',
            'route' => $logisticsRoute
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LogisticsRoute $logisticsRoute): JsonResponse
    {
        $logisticsRoute->delete();

        return response()->json([
            'message' => 'Ruta logística eliminada exitosamente'
        ]);
    }

    /**
     * Get routes by cargo type
     */
    public function byCargoType($cargoType): JsonResponse
    {
        $routes = LogisticsRoute::byCargoType($cargoType)
            ->active()
            ->with(['originCenter', 'destinationCenter'])
            ->get();

        return response()->json($routes);
    }

    /**
     * Get routes within distance range
     */
    public function withinDistanceRange(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'min_distance' => 'required|numeric|min:0',
            'max_distance' => 'required|numeric|min:0|gte:min_distance'
        ]);

        $routes = LogisticsRoute::withinDistanceRange(
            $validated['min_distance'],
            $validated['max_distance']
        )->active()->with(['originCenter', 'destinationCenter'])->get();

        return response()->json($routes);
    }

    /**
     * Optimize route between two centers
     */
    public function optimizeRoute(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'origin_center_id' => 'required|exists:collection_centers,id',
            'destination_center_id' => 'required|exists:collection_centers,id|different:origin_center_id',
            'cargo_type' => 'nullable|string|max:100'
        ]);

        // Get centers
        $origin = CollectionCenter::find($validated['origin_center_id']);
        $destination = CollectionCenter::find($validated['destination_center_id']);

        // Calculate optimal route (simplified - in real implementation would use routing API)
        $optimalRoute = $this->calculateOptimalRoute($origin, $destination);

        return response()->json([
            'message' => 'Ruta optimizada calculada',
            'route' => $optimalRoute
        ]);
    }

    /**
     * Get statistics for routes
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => LogisticsRoute::count(),
            'active' => LogisticsRoute::active()->count(),
            'total_distance' => LogisticsRoute::sum('total_distance'),
            'average_distance' => LogisticsRoute::avg('total_distance'),
            'total_cost' => LogisticsRoute::sum(\DB::raw('total_distance * cost_per_km')),
            'by_cargo_type' => LogisticsRoute::selectRaw('cargo_type, COUNT(*) as count')
                ->groupBy('cargo_type')
                ->get(),
            'recent_routes' => LogisticsRoute::with(['originCenter', 'destinationCenter'])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
        ];

        return response()->json($stats);
    }

    /**
     * Calculate distance between coordinates
     */
    private function calculateDistance($coordinates): float
    {
        $totalDistance = 0;
        for ($i = 0; $i < count($coordinates) - 1; $i++) {
            $lat1 = $coordinates[$i]['lat'];
            $lng1 = $coordinates[$i]['lng'];
            $lat2 = $coordinates[$i + 1]['lat'];
            $lng2 = $coordinates[$i + 1]['lng'];

            $totalDistance += $this->haversineDistance($lat1, $lng1, $lat2, $lng2);
        }
        return round($totalDistance, 2);
    }

    /**
     * Calculate estimated time based on distance
     */
    private function calculateEstimatedTime($distance, $averageSpeed = 50): int
    {
        return round(($distance / $averageSpeed) * 60); // in minutes
    }

    /**
     * Haversine formula to calculate distance between two points
     */
    private function haversineDistance($lat1, $lng1, $lat2, $lng2): float
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $latDelta = deg2rad($lat2 - $lat1);
        $lngDelta = deg2rad($lng2 - $lng1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lngDelta / 2) * sin($lngDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Calculate optimal route between two centers
     */
    private function calculateOptimalRoute($origin, $destination): array
    {
        // Simplified optimal route calculation
        // In real implementation, this would use a routing API like OSRM or Google Maps
        $distance = $this->haversineDistance(
            $origin->location['lat'] ?? 0,
            $origin->location['lng'] ?? 0,
            $destination->location['lat'] ?? 0,
            $destination->location['lng'] ?? 0
        );

        return [
            'origin' => $origin,
            'destination' => $destination,
            'distance' => round($distance, 2),
            'estimated_time' => $this->calculateEstimatedTime($distance),
            'route_geometry' => [
                [
                    'lat' => $origin->location['lat'] ?? 0,
                    'lng' => $origin->location['lng'] ?? 0
                ],
                [
                    'lat' => $destination->location['lat'] ?? 0,
                    'lng' => $destination->location['lng'] ?? 0
                ]
            ]
        ];
    }
} 