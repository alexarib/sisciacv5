<?php

namespace App\Http\Controllers;

use App\Models\SupplyRequest;
use App\Models\Supply;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SupplyRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SupplyRequest::with(['producer', 'supply']);
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }
        $requests = $query->orderByDesc('created_at')->paginate(15);
        return response()->json($requests);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'producer_id' => 'required|exists:producers,id',
            'supply_id' => 'required|exists:supplies,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:20',
            'priority' => 'nullable|in:low,medium,high',
            'request_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $requestModel = SupplyRequest::create($validated);
        $requestModel->load(['producer', 'supply']);

        return response()->json([
            'message' => 'Solicitud creada exitosamente',
            'request' => $requestModel
        ], 201);
    }

    public function show(SupplyRequest $supplyRequest): JsonResponse
    {
        $supplyRequest->load(['producer', 'supply']);
        return response()->json($supplyRequest);
    }

    public function update(Request $request, SupplyRequest $supplyRequest): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'sometimes|numeric|min:0.01',
            'unit' => 'sometimes|string|max:20',
            'priority' => 'nullable|in:low,medium,high',
            'request_date' => 'sometimes|date',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:pending,approved,rejected,fulfilled',
        ]);

        $supplyRequest->update($validated);
        $supplyRequest->load(['producer', 'supply']);

        return response()->json([
            'message' => 'Solicitud actualizada exitosamente',
            'request' => $supplyRequest
        ]);
    }

    public function destroy(SupplyRequest $supplyRequest): JsonResponse
    {
        $supplyRequest->delete();
        return response()->json(['message' => 'Solicitud eliminada exitosamente']);
    }

    public function approve(SupplyRequest $supplyRequest): JsonResponse
    {
        $supplyRequest->update(['status' => 'approved']);
        return response()->json(['message' => 'Solicitud aprobada']);
    }

    public function reject(SupplyRequest $supplyRequest): JsonResponse
    {
        $supplyRequest->update(['status' => 'rejected']);
        return response()->json(['message' => 'Solicitud rechazada']);
    }

    public function fulfill(SupplyRequest $supplyRequest): JsonResponse
    {
        // Reducir stock y marcar como fulfilled
        $supply = Supply::findOrFail($supplyRequest->supply_id);
        $supply->current_stock = max(0, $supply->current_stock - $supplyRequest->quantity);
        if ($supply->current_stock <= 0) {
            $supply->status = 'out_of_stock';
        } elseif ($supply->current_stock <= $supply->min_stock) {
            $supply->status = 'low_stock';
        } else {
            $supply->status = 'available';
        }
        $supply->save();

        $supplyRequest->update(['status' => 'fulfilled']);
        return response()->json(['message' => 'Solicitud cumplida']);
    }
} 