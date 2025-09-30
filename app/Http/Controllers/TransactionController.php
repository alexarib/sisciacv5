<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $transactions = Transaction::with('producer')->all();
        return response()->json($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'producer_id' => 'required|exists:producers,id',
            'product' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,lb,ton,unidad',
            'price_per_unit' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'channel' => 'required|string|max:255',
            'payment_method' => 'required|in:Efectivo,Transferencia,Cheque,Tarjeta',
            'buyer' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:completed,pending,cancelled',
        ]);

        $transaction = Transaction::create($validated);

        return response()->json([
            'message' => 'Transacción creada exitosamente',
            'transaction' => $transaction->load('producer')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction): JsonResponse
    {
        return response()->json($transaction->load('producer'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction): JsonResponse
    {
        $validated = $request->validate([
            'producer_id' => 'required|exists:producers,id',
            'product' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,lb,ton,unidad',
            'price_per_unit' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'channel' => 'required|string|max:255',
            'payment_method' => 'required|in:Efectivo,Transferencia,Cheque,Tarjeta',
            'buyer' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:completed,pending,cancelled',
        ]);

        $transaction->update($validated);

        return response()->json([
            'message' => 'Transacción actualizada exitosamente',
            'transaction' => $transaction->load('producer')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction): JsonResponse
    {
        $transaction->delete();
        return response()->json([
            'message' => 'Transacción eliminada exitosamente'
        ]);
    }
} 