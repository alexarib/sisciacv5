<?php

namespace App\Http\Controllers;

use App\Models\MarketPrice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MarketPriceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $prices = MarketPrice::all();
        return response()->json($prices);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product' => 'required|string|max:255',
            'category' => 'required|in:granos,vegetales,frutas,tubérculos,legumbres',
            'current_price' => 'required|numeric|min:0',
            'previous_price' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,lb,ton,unidad',
            'market' => 'required|string|max:255',
            'trend' => 'required|in:up,down,stable',
            'change_percentage' => 'required|numeric',
            'source' => 'required|string|max:100',
            'quality' => 'required|in:Premium,Estándar,Básica',
        ]);

        $price = MarketPrice::create($validated);

        return response()->json([
            'message' => 'Precio creado exitosamente',
            'price' => $price
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MarketPrice $marketPrice): JsonResponse
    {
        return response()->json($marketPrice);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MarketPrice $marketPrice): JsonResponse
    {
        $validated = $request->validate([
            'product' => 'required|string|max:255',
            'category' => 'required|in:granos,vegetales,frutas,tubérculos,legumbres',
            'current_price' => 'required|numeric|min:0',
            'previous_price' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,lb,ton,unidad',
            'market' => 'required|string|max:255',
            'trend' => 'required|in:up,down,stable',
            'change_percentage' => 'required|numeric',
            'source' => 'required|string|max:100',
            'quality' => 'required|in:Premium,Estándar,Básica',
        ]);

        $marketPrice->update($validated);

        return response()->json([
            'message' => 'Precio actualizado exitosamente',
            'price' => $marketPrice
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MarketPrice $marketPrice): JsonResponse
    {
        $marketPrice->delete();
        return response()->json([
            'message' => 'Precio eliminado exitosamente'
        ]);
    }
} 