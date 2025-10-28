<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Producer;
use App\Models\Crop;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LocationController extends Controller
{
    /**
     * Display a listing of locations
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Location::with(['producer', 'crop', 'parentLocation']);

            // Apply filters
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('producer_id')) {
                $query->where('producer_id', $request->producer_id);
            }

            if ($request->has('crop_id')) {
                $query->where('crop_id', $request->crop_id);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%")
                      ->orWhere('municipality', 'like', "%{$search}%");
                });
            }

            // Geographic filters
            if ($request->has('latitude') && $request->has('longitude') && $request->has('radius')) {
                $latitude = $request->latitude;
                $longitude = $request->longitude;
                $radius = $request->radius;
                $query->nearby($latitude, $longitude, $radius);
            }

            if ($request->has('bounds')) {
                $bounds = $request->bounds;
                if (isset($bounds['minLat'], $bounds['maxLat'], $bounds['minLng'], $bounds['maxLng'])) {
                    $query->withinBounds($bounds['minLat'], $bounds['maxLat'], $bounds['minLng'], $bounds['maxLng']);
                }
            }

            $locations = $query->orderBy('name')->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $locations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al cargar ubicaciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified location
     */
    public function show($id): JsonResponse
    {
        try {
            $location = Location::with(['producer', 'crop', 'parentLocation', 'childLocations'])->find($id);

            if (!$location) {
                return response()->json([
                    'success' => false,
                    'error' => 'Ubicación no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $location
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener ubicación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created location
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), Location::getValidationRules());

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $location = Location::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $location->load(['producer', 'crop']),
                'message' => 'Ubicación creada exitosamente'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al crear ubicación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified location
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $location = Location::find($id);

            if (!$location) {
                return response()->json([
                    'success' => false,
                    'error' => 'Ubicación no encontrada'
                ], 404);
            }

            $validator = Validator::make($request->all(), Location::getValidationRules());

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $location->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $location->load(['producer', 'crop']),
                'message' => 'Ubicación actualizada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar ubicación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified location
     */
    public function destroy($id): JsonResponse
    {
        try {
            $location = Location::find($id);

            if (!$location) {
                return response()->json([
                    'success' => false,
                    'error' => 'Ubicación no encontrada'
                ], 404);
            }

            $location->delete();

            return response()->json([
                'success' => true,
                'message' => 'Ubicación eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al eliminar ubicación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get locations statistics
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total' => Location::count(),
                'active' => Location::active()->count(),
                'by_type' => Location::selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->get()
                    ->pluck('count', 'type')
                    ->toArray(),
                'total_area' => Location::sum('area_hectares'),
                'avg_area' => Location::avg('area_hectares'),
                'by_municipality' => Location::selectRaw('municipality, COUNT(*) as count')
                    ->whereNotNull('municipality')
                    ->groupBy('municipality')
                    ->orderBy('count', 'desc')
                    ->limit(10)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get locations as GeoJSON
     */
    public function geojson(Request $request): JsonResponse
    {
        try {
            $query = Location::with(['producer', 'crop']);

            // Apply filters
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('producer_id')) {
                $query->where('producer_id', $request->producer_id);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $locations = $query->get();

            $features = [];
            foreach ($locations as $location) {
                if ($location->boundaries) {
                    $features[] = $location->getGeoJsonPolygon();
                } else {
                    $features[] = $location->getGeoJsonPoint();
                }
            }

            $geojson = [
                'type' => 'FeatureCollection',
                'features' => $features
            ];

            return response()->json([
                'success' => true,
                'data' => $geojson
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar GeoJSON: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Find nearby locations
     */
    public function nearby(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
                'radius' => 'numeric|min:0.1|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $latitude = $request->latitude;
            $longitude = $request->longitude;
            $radius = $request->get('radius', 10);

            $locations = Location::with(['producer', 'crop'])
                ->nearby($latitude, $longitude, $radius)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $locations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al buscar ubicaciones cercanas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get locations by producer
     */
    public function byProducer($producerId): JsonResponse
    {
        try {
            $locations = Location::with(['crop', 'parentLocation'])
                ->where('producer_id', $producerId)
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $locations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener ubicaciones del productor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get locations by type
     */
    public function byType($type): JsonResponse
    {
        try {
            $locations = Location::with(['producer', 'crop'])
                ->where('type', $type)
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $locations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener ubicaciones por tipo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate area statistics
     */
    public function areaStats(): JsonResponse
    {
        try {
            $stats = [
                'total_area' => Location::sum('area_hectares'),
                'avg_area' => Location::avg('area_hectares'),
                'max_area' => Location::max('area_hectares'),
                'min_area' => Location::min('area_hectares'),
                'by_type' => Location::selectRaw('type, SUM(area_hectares) as total_area, AVG(area_hectares) as avg_area')
                    ->whereNotNull('area_hectares')
                    ->groupBy('type')
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al calcular estadísticas de área: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get clustering data for map visualization
     */
    public function clustering(Request $request): JsonResponse
    {
        try {
            $gridSize = $request->get('grid_size', 0.01); // Grid size in degrees
            $bounds = $request->get('bounds');

            if (!$bounds) {
                return response()->json([
                    'success' => false,
                    'error' => 'Se requieren los límites del mapa'
                ], 400);
            }

            $clusters = Location::selectRaw("
                    FLOOR(latitude / $gridSize) * $gridSize as cluster_lat,
                    FLOOR(longitude / $gridSize) * $gridSize as cluster_lng,
                    COUNT(*) as count,
                    AVG(latitude) as avg_lat,
                    AVG(longitude) as avg_lng
                ")
                ->whereBetween('latitude', [$bounds['minLat'], $bounds['maxLat']])
                ->whereBetween('longitude', [$bounds['minLng'], $bounds['maxLng']])
                ->groupBy('cluster_lat', 'cluster_lng')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $clusters
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar clustering: ' . $e->getMessage()
            ], 500);
        }
    }
}
