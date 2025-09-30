<?php

namespace App\Http\Controllers;

use App\Models\CollectionCenter;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CollectionCenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $centers = CollectionCenter::with(['originRoutes', 'destinationRoutes'])
            ->orderBy('name')
            ->paginate(15);

        return response()->json($centers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:acopio,distribucion,capacitacion,investigacion',
            'description' => 'nullable|string',
            'location_lat' => 'required|numeric|between:-90,90',
            'location_lng' => 'required|numeric|between:-180,180',
            'address' => 'required|string|max:255',
            'commune' => 'required|string|max:100',
            'storage_capacity' => 'nullable|numeric|min:0',
            'services' => 'nullable|array',
            'contact_person' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'operating_hours' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive,maintenance',
            'radius_influence' => 'nullable|numeric|min:0'
        ]);

        $center = CollectionCenter::create($validated);
        $center->load(['originRoutes', 'destinationRoutes']);

        return response()->json([
            'message' => 'Centro de acopio creado exitosamente',
            'center' => $center
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CollectionCenter $collectionCenter): JsonResponse
    {
        $collectionCenter->load(['originRoutes', 'destinationRoutes']);
        return response()->json($collectionCenter);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CollectionCenter $collectionCenter): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:acopio,distribucion,capacitacion,investigacion',
            'description' => 'nullable|string',
            'location_lat' => 'sometimes|required|numeric|between:-90,90',
            'location_lng' => 'sometimes|required|numeric|between:-180,180',
            'address' => 'sometimes|required|string|max:255',
            'commune' => 'sometimes|required|string|max:100',
            'storage_capacity' => 'nullable|numeric|min:0',
            'services' => 'nullable|array',
            'contact_person' => 'sometimes|required|string|max:255',
            'contact_phone' => 'sometimes|required|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'operating_hours' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:active,inactive,maintenance',
            'radius_influence' => 'nullable|numeric|min:0'
        ]);

        $collectionCenter->update($validated);
        $collectionCenter->load(['originRoutes', 'destinationRoutes']);

        return response()->json([
            'message' => 'Centro de acopio actualizado exitosamente',
            'center' => $collectionCenter
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CollectionCenter $collectionCenter): JsonResponse
    {
        $collectionCenter->delete();

        return response()->json([
            'message' => 'Centro de acopio eliminado exitosamente'
        ]);
    }

    /**
     * Get centers by type
     */
    public function byType($type): JsonResponse
    {
        $centers = CollectionCenter::byType($type)
            ->active()
            ->get();

        return response()->json($centers);
    }

    /**
     * Get centers by commune
     */
    public function byCommune($commune): JsonResponse
    {
        $centers = CollectionCenter::byCommune($commune)
            ->active()
            ->get();

        return response()->json($centers);
    }

    /**
     * Get centers within radius
     */
    public function withinRadius(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
            'radius' => 'required|numeric|min:0'
        ]);

        $centers = CollectionCenter::withinRadius(
            $validated['lat'],
            $validated['lng'],
            $validated['radius']
        )->active()->get();

        return response()->json($centers);
    }

    /**
     * Get statistics for centers
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => CollectionCenter::count(),
            'active' => CollectionCenter::active()->count(),
            'by_type' => [
                'acopio' => CollectionCenter::byType('acopio')->count(),
                'distribucion' => CollectionCenter::byType('distribucion')->count(),
                'capacitacion' => CollectionCenter::byType('capacitacion')->count(),
                'investigacion' => CollectionCenter::byType('investigacion')->count(),
            ],
            'total_capacity' => CollectionCenter::sum('storage_capacity'),
            'recent_centers' => CollectionCenter::with(['originRoutes', 'destinationRoutes'])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
        ];

        return response()->json($stats);
    }
} 