<?php

namespace App\Http\Controllers;

use App\Models\Producer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProducerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $producers = Producer::with(['crops', 'logistics', 'training', 'reports'])->paginate(15);
        return response()->json($producers);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): JsonResponse
    {
        return response()->json(['message' => 'Formulario de creación']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:producers,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'document_number' => 'required|string|unique:producers,document_number',
            'document_type' => 'required|in:dni,ruc,ce',
            'total_area' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive,pending',
            'notes' => 'nullable|string'
        ]);

        $producer = Producer::create($validated);
        $producer->load(['crops', 'logistics', 'training', 'reports']);

        return response()->json([
            'message' => 'Productor creado exitosamente',
            'producer' => $producer
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Producer $producer): JsonResponse
    {
        $producer->load(['crops', 'logistics', 'training', 'reports']);
        return response()->json($producer);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producer $producer): JsonResponse
    {
        $producer->load(['crops', 'logistics', 'training', 'reports']);
        return response()->json($producer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producer $producer): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:producers,email,' . $producer->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'document_number' => 'required|string|unique:producers,document_number,' . $producer->id,
            'document_type' => 'required|in:dni,ruc,ce',
            'total_area' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive,pending',
            'notes' => 'nullable|string'
        ]);

        $producer->update($validated);
        $producer->load(['crops', 'logistics', 'training', 'reports']);

        return response()->json([
            'message' => 'Productor actualizado exitosamente',
            'producer' => $producer
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producer $producer): JsonResponse
    {
        $producer->delete();
        return response()->json([
            'message' => 'Productor eliminado exitosamente'
        ]);
    }

    /**
     * Get producer statistics
     */
    public function statistics(Producer $producer): JsonResponse
    {
        $stats = [
            'total_crops' => $producer->crops()->count(),
            'active_crops' => $producer->crops()->where('status', '!=', 'harvested')->count(),
            'total_area' => $producer->crops()->sum('area'),
            'total_logistics' => $producer->logistics()->count(),
            'total_training' => $producer->training()->count(),
            'total_reports' => $producer->reports()->count(),
            'recent_activities' => $producer->logistics()
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
        ];

        return response()->json($stats);
    }
}
