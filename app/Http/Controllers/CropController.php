<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use App\Models\Producer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CropController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $crops = Crop::with(['producer'])->get();
        return response()->json($crops);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): JsonResponse
    {
        $producers = Producer::where('status', 'active')->get();
        return response()->json(['producers' => $producers]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'producer_id' => 'required|exists:producers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'area' => 'required|numeric|min:0',
            'status' => 'required|in:planted,growing,harvested,failed',
            'planting_date' => 'required|date',
            'expected_harvest_date' => 'nullable|date',
            'actual_harvest_date' => 'nullable|date',
            'yield_expected' => 'nullable|numeric|min:0',
            'yield_actual' => 'nullable|numeric|min:0',
            'variety' => 'nullable|string|max:255',
            'notes' => 'nullable|string'
        ]);

        // Validación manual para fechas de cosecha después de fecha de siembra
        if ($validated['expected_harvest_date'] && $validated['expected_harvest_date'] <= $validated['planting_date']) {
            return response()->json([
                'message' => 'La fecha esperada de cosecha debe ser posterior a la fecha de siembra',
                'errors' => ['expected_harvest_date' => ['La fecha esperada de cosecha debe ser posterior a la fecha de siembra']]
            ], 422);
        }

        if ($validated['actual_harvest_date'] && $validated['actual_harvest_date'] <= $validated['planting_date']) {
            return response()->json([
                'message' => 'La fecha real de cosecha debe ser posterior a la fecha de siembra',
                'errors' => ['actual_harvest_date' => ['La fecha real de cosecha debe ser posterior a la fecha de siembra']]
            ], 422);
        }

        $crop = Crop::create($validated);
        $crop->load('producer');

        return response()->json([
            'message' => 'Cultivo creado exitosamente',
            'crop' => $crop
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Crop $crop): JsonResponse
    {
        $crop->load(['producer', 'logistics', 'reports']);
        return response()->json($crop);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Crop $crop): JsonResponse
    {
        $producers = Producer::where('status', 'active')->get();
        $crop->load('producer');

        return response()->json([
            'crop' => $crop,
            'producers' => $producers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Crop $crop): JsonResponse
    {
        $validated = $request->validate([
            'producer_id' => 'required|exists:producers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'area' => 'required|numeric|min:0',
            'status' => 'required|in:planted,growing,harvested,failed',
            'planting_date' => 'required|date',
            'expected_harvest_date' => 'nullable|date',
            'actual_harvest_date' => 'nullable|date',
            'yield_expected' => 'nullable|numeric|min:0',
            'yield_actual' => 'nullable|numeric|min:0',
            'variety' => 'nullable|string|max:255',
            'notes' => 'nullable|string'
        ]);

        // Validación manual para fechas de cosecha después de fecha de siembra
        if ($validated['expected_harvest_date'] && $validated['expected_harvest_date'] <= $validated['planting_date']) {
            return response()->json([
                'message' => 'La fecha esperada de cosecha debe ser posterior a la fecha de siembra',
                'errors' => ['expected_harvest_date' => ['La fecha esperada de cosecha debe ser posterior a la fecha de siembra']]
            ], 422);
        }

        if ($validated['actual_harvest_date'] && $validated['actual_harvest_date'] <= $validated['planting_date']) {
            return response()->json([
                'message' => 'La fecha real de cosecha debe ser posterior a la fecha de siembra',
                'errors' => ['actual_harvest_date' => ['La fecha real de cosecha debe ser posterior a la fecha de siembra']]
            ], 422);
        }

        $crop->update($validated);
        $crop->load('producer');

        return response()->json([
            'message' => 'Cultivo actualizado exitosamente',
            'crop' => $crop
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Crop $crop): JsonResponse
    {
        $crop->delete();
        return response()->json([
            'message' => 'Cultivo eliminado exitosamente'
        ]);
    }
}
