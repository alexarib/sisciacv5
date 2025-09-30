<?php

namespace App\Http\Controllers;

use App\Models\SalesChannel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SalesChannelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $channels = SalesChannel::all();
        return response()->json($channels);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:mercado,directa,cooperativa,distribuidor',
            'location' => 'required|string|max:255',
            'contact' => 'nullable|string|max:100',
            'capacity' => 'required|string|max:100',
            'commission' => 'required|numeric|min:0|max:100',
            'payment_terms' => 'required|string|max:100',
            'products' => 'nullable|array',
            'status' => 'required|in:active,inactive',
        ]);

        $channel = SalesChannel::create($validated);

        return response()->json([
            'message' => 'Canal de venta creado exitosamente',
            'channel' => $channel
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesChannel $salesChannel): JsonResponse
    {
        return response()->json($salesChannel);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SalesChannel $salesChannel): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:mercado,directa,cooperativa,distribuidor',
            'location' => 'required|string|max:255',
            'contact' => 'nullable|string|max:100',
            'capacity' => 'required|string|max:100',
            'commission' => 'required|numeric|min:0|max:100',
            'payment_terms' => 'required|string|max:100',
            'products' => 'nullable|array',
            'status' => 'required|in:active,inactive',
        ]);

        $salesChannel->update($validated);

        return response()->json([
            'message' => 'Canal de venta actualizado exitosamente',
            'channel' => $salesChannel
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SalesChannel $salesChannel): JsonResponse
    {
        $salesChannel->delete();
        return response()->json([
            'message' => 'Canal de venta eliminado exitosamente'
        ]);
    }
} 