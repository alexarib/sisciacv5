<?php

namespace App\Http\Controllers;

use App\Models\Logistics;
use App\Models\Producer;
use App\Models\Crop;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LogisticsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $query = Logistics::with(['producer', 'crop']);
        
        // Filtros
        if ($type = request('type')) {
            $query->byType($type);
        }
        
        if ($status = request('status')) {
            $query->byStatus($status);
        }
        
        if ($producerId = request('producer_id')) {
            $query->byProducer($producerId);
        }
        
        if ($startDate = request('start_date') && $endDate = request('end_date')) {
            $query->byDateRange($startDate, $endDate);
        }
        
        $logistics = $query->orderByDesc('date')->paginate(15);
        return response()->json($logistics);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): JsonResponse
    {
        $producers = Producer::where('status', 'active')->get();
        $crops = Crop::where('status', '!=', 'harvested')->get();

        return response()->json([
            'producers' => $producers,
            'crops' => $crops
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'producer_id' => 'required|exists:producers,id',
            'crop_id' => 'nullable|exists:crops,id',
            'type' => 'required|in:input,output,transport',
            'item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,tons,liters,units',
            'unit_price' => 'nullable|numeric|min:0',
            'total_price' => 'nullable|numeric|min:0',
            'date' => 'required|date',
            'status' => 'required|in:pending,in_transit,delivered,cancelled',
            'supplier' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255',
            'notes' => 'nullable|string'
        ]);

        // Calcular precio total si no se proporciona
        if (empty($validated['total_price']) && !empty($validated['unit_price'])) {
            $validated['total_price'] = $validated['quantity'] * $validated['unit_price'];
        }

        $logistics = Logistics::create($validated);
        $logistics->load(['producer', 'crop']);

        return response()->json([
            'message' => 'Registro logístico creado exitosamente',
            'logistics' => $logistics
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Logistics $logistics): JsonResponse
    {
        $logistics->load(['producer', 'crop']);
        return response()->json($logistics);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Logistics $logistics): JsonResponse
    {
        $producers = Producer::where('status', 'active')->get();
        $crops = Crop::where('status', '!=', 'harvested')->get();
        $logistics->load(['producer', 'crop']);

        return response()->json([
            'logistics' => $logistics,
            'producers' => $producers,
            'crops' => $crops
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Logistics $logistics): JsonResponse
    {
        $validated = $request->validate([
            'producer_id' => 'required|exists:producers,id',
            'crop_id' => 'nullable|exists:crops,id',
            'type' => 'required|in:input,output,transport',
            'item_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,tons,liters,units',
            'unit_price' => 'nullable|numeric|min:0',
            'total_price' => 'nullable|numeric|min:0',
            'date' => 'required|date',
            'status' => 'required|in:pending,in_transit,delivered,cancelled',
            'supplier' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255',
            'notes' => 'nullable|string'
        ]);

        // Calcular precio total si no se proporciona
        if (empty($validated['total_price']) && !empty($validated['unit_price'])) {
            $validated['total_price'] = $validated['quantity'] * $validated['unit_price'];
        }

        $logistics->update($validated);
        $logistics->load(['producer', 'crop']);

        return response()->json([
            'message' => 'Registro logístico actualizado exitosamente',
            'logistics' => $logistics
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Logistics $logistics): JsonResponse
    {
        $logistics->delete();
        return response()->json([
            'message' => 'Registro logístico eliminado exitosamente'
        ]);
    }

    /**
     * Get logistics statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Logistics::count(),
            'by_type' => [
                'input' => Logistics::byType('input')->count(),
                'output' => Logistics::byType('output')->count(),
                'transport' => Logistics::byType('transport')->count(),
            ],
            'by_status' => [
                'pending' => Logistics::pending()->count(),
                'in_transit' => Logistics::inTransit()->count(),
                'delivered' => Logistics::delivered()->count(),
                'cancelled' => Logistics::cancelled()->count(),
            ],
            'total_value' => Logistics::sum('total_price'),
            'recent_activity' => Logistics::with(['producer', 'crop'])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
        ];

        return response()->json($stats);
    }

    /**
     * Update logistics status
     */
    public function updateStatus(Request $request, Logistics $logistics): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_transit,delivered,cancelled'
        ]);

        $logistics->update($validated);
        $logistics->load(['producer', 'crop']);

        return response()->json([
            'message' => 'Estado actualizado exitosamente',
            'logistics' => $logistics
        ]);
    }

    /**
     * Get logistics by producer
     */
    public function byProducer($producerId): JsonResponse
    {
        $logistics = Logistics::with(['producer', 'crop'])
            ->byProducer($producerId)
            ->orderByDesc('date')
            ->get();

        return response()->json($logistics);
    }

    /**
     * Get logistics summary
     */
    public function summary(): JsonResponse
    {
        $summary = [
            'total_items' => Logistics::count(),
            'total_value' => Logistics::sum('total_price'),
            'pending_items' => Logistics::pending()->count(),
            'in_transit_items' => Logistics::inTransit()->count(),
            'delivered_items' => Logistics::delivered()->count(),
            'cancelled_items' => Logistics::cancelled()->count(),
            'recent_logistics' => Logistics::with(['producer', 'crop'])
                ->orderByDesc('date')
                ->limit(10)
                ->get()
        ];

        return response()->json($summary);
    }
}
