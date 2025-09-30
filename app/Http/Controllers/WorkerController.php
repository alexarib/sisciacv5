<?php

namespace App\Http\Controllers;

use App\Models\Worker;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WorkerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $workers = Worker::all();
        return response()->json($workers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'required|string|max:20|unique:workers,document',
            'phone' => 'required|string|max:20',
            'skills' => 'required|array',
            'experience' => 'required|string|max:100',
            'status' => 'required|in:active,inactive',
            'commune' => 'nullable|string|max:100',
            'availability' => 'required|in:full_time,part_time,seasonal',
            'hourly_rate' => 'required|numeric|min:0',
        ]);

        $worker = Worker::create($validated);

        return response()->json([
            'message' => 'Trabajador creado exitosamente',
            'worker' => $worker
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Worker $worker): JsonResponse
    {
        return response()->json($worker);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Worker $worker): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'required|string|max:20|unique:workers,document,' . $worker->id,
            'phone' => 'required|string|max:20',
            'skills' => 'required|array',
            'experience' => 'required|string|max:100',
            'status' => 'required|in:active,inactive',
            'commune' => 'nullable|string|max:100',
            'availability' => 'required|in:full_time,part_time,seasonal',
            'hourly_rate' => 'required|numeric|min:0',
        ]);

        $worker->update($validated);

        return response()->json([
            'message' => 'Trabajador actualizado exitosamente',
            'worker' => $worker
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Worker $worker): JsonResponse
    {
        $worker->delete();
        return response()->json([
            'message' => 'Trabajador eliminado exitosamente'
        ]);
    }
} 