<?php

namespace App\Http\Controllers;

use App\Models\Supply;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SupplyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Supply::query();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $supplies = $query->orderBy('name')->paginate(15);
        return response()->json($supplies);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'unit' => 'required|string|max:20',
            'min_stock' => 'required|numeric|min:0',
            'current_stock' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|in:available,low_stock,out_of_stock',
            'supplier' => 'nullable|string|max:255',
        ]);

        $supply = Supply::create($validated);
        return response()->json([
            'message' => 'Insumo creado exitosamente',
            'supply' => $supply
        ], 201);
    }

    public function show(Supply $supply): JsonResponse
    {
        $supply->load('movements');
        return response()->json($supply);
    }

    public function update(Request $request, Supply $supply): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:100',
            'unit' => 'sometimes|string|max:20',
            'min_stock' => 'sometimes|numeric|min:0',
            'current_stock' => 'sometimes|numeric|min:0',
            'price' => 'sometimes|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|in:available,low_stock,out_of_stock',
            'supplier' => 'nullable|string|max:255',
        ]);

        $supply->update($validated);
        return response()->json([
            'message' => 'Insumo actualizado exitosamente',
            'supply' => $supply
        ]);
    }

    public function destroy(Supply $supply): JsonResponse
    {
        $supply->delete();
        return response()->json(['message' => 'Insumo eliminado exitosamente']);
    }

    public function adjustStock(Request $request, Supply $supply): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|numeric|min:0.01',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $movement = new InventoryMovement($validated);
        $movement->user_id = $request->user()->id ?? null;
        $supply->movements()->save($movement);

        // Actualizar stock
        $delta = $validated['type'] === 'in' ? $validated['quantity'] : ($validated['type'] === 'out' ? -$validated['quantity'] : 0);
        $supply->current_stock = max(0, $supply->current_stock + $delta);

        // Recalcular estado
        if ($supply->current_stock <= 0) {
            $supply->status = 'out_of_stock';
        } elseif ($supply->current_stock <= $supply->min_stock) {
            $supply->status = 'low_stock';
        } else {
            $supply->status = 'available';
        }
        $supply->save();

        return response()->json([
            'message' => 'Stock ajustado exitosamente',
            'supply' => $supply,
            'movement' => $movement
        ]);
    }
} 