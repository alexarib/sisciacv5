<?php

namespace App\Http\Controllers;

use App\Models\Training;
use App\Models\Producer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TrainingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $trainings = Training::all();
        return response()->json($trainings);
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
            'title' => 'required|string|max:255',
            'instructor' => 'required|string|max:255',
            'type' => 'required|in:video,document,mixed',
            'duration' => 'required|string|max:100',
            'level' => 'required|in:básico,intermedio,avanzado',
            'category' => 'required|in:cultivos,sanidad,gestión,tecnología',
            'status' => 'required|in:active,upcoming,inactive',
            'description' => 'required|string',
            'topics' => 'nullable|array',
            'materials' => 'nullable|array',
            'max_students' => 'nullable|integer|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $training = Training::create($validated);

        return response()->json([
            'message' => 'Curso creado exitosamente',
            'training' => $training
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Training $training): JsonResponse
    {
        return response()->json($training);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Training $training): JsonResponse
    {
        $producers = Producer::where('status', 'active')->get();

        return response()->json([
            'training' => $training,
            'producers' => $producers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Training $training): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'instructor' => 'required|string|max:255',
            'type' => 'required|in:video,document,mixed',
            'duration' => 'required|string|max:100',
            'level' => 'required|in:básico,intermedio,avanzado',
            'category' => 'required|in:cultivos,sanidad,gestión,tecnología',
            'status' => 'required|in:active,upcoming,inactive',
            'description' => 'required|string',
            'topics' => 'nullable|array',
            'materials' => 'nullable|array',
            'max_students' => 'nullable|integer|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $training->update($validated);

        return response()->json([
            'message' => 'Curso actualizado exitosamente',
            'training' => $training
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Training $training): JsonResponse
    {
        $training->delete();
        return response()->json([
            'message' => 'Curso eliminado exitosamente'
        ]);
    }

    /**
     * Get enrollments for trainings
     */
    public function enrollments(): JsonResponse
    {
        $enrollments = Training::with('producers')->get()->map(function ($training) {
            return $training->producers->map(function ($producer) use ($training) {
                return [
                    'id' => $producer->pivot->id,
                    'producer_name' => $producer->name,
                    'course_title' => $training->title,
                    'enrollment_date' => $producer->pivot->created_at->format('Y-m-d'),
                    'status' => $producer->pivot->status,
                    'progress' => $producer->pivot->progress ?? 0,
                    'completion_date' => $producer->pivot->completion_date,
                    'certificate' => $producer->pivot->certificate
                ];
            });
        })->flatten(1);

        return response()->json($enrollments);
    }
}
