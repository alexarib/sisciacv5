<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Producer;
use App\Models\Crop;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $reports = Report::with(['producer', 'crop'])->paginate(15);
        return response()->json($reports);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): JsonResponse
    {
        $producers = Producer::where('status', 'active')->get();
        $crops = Crop::all();

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
            'producer_id' => 'nullable|exists:producers,id',
            'crop_id' => 'nullable|exists:crops,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:production,financial,logistics,training,general',
            'status' => 'required|in:draft,published,archived',
            'report_date' => 'required|date',
            'data' => 'nullable|array',
            'file_path' => 'nullable|string|max:255'
        ]);

        $report = Report::create($validated);
        $report->load(['producer', 'crop']);

        return response()->json([
            'message' => 'Reporte creado exitosamente',
            'report' => $report
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report): JsonResponse
    {
        $report->load(['producer', 'crop']);
        return response()->json($report);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Report $report): JsonResponse
    {
        $producers = Producer::where('status', 'active')->get();
        $crops = Crop::all();
        $report->load(['producer', 'crop']);

        return response()->json([
            'report' => $report,
            'producers' => $producers,
            'crops' => $crops
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Report $report): JsonResponse
    {
        $validated = $request->validate([
            'producer_id' => 'nullable|exists:producers,id',
            'crop_id' => 'nullable|exists:crops,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:production,financial,logistics,training,general',
            'status' => 'required|in:draft,published,archived',
            'report_date' => 'required|date',
            'data' => 'nullable|array',
            'file_path' => 'nullable|string|max:255'
        ]);

        $report->update($validated);
        $report->load(['producer', 'crop']);

        return response()->json([
            'message' => 'Reporte actualizado exitosamente',
            'report' => $report
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report): JsonResponse
    {
        $report->delete();
        return response()->json([
            'message' => 'Reporte eliminado exitosamente'
        ]);
    }

    /**
     * Get reports by type
     */
    public function byType(string $type): JsonResponse
    {
        $reports = Report::where('type', $type)
            ->with(['producer', 'crop'])
            ->paginate(15);

        return response()->json($reports);
    }

    /**
     * Get reports by producer
     */
    public function byProducer(int $producerId): JsonResponse
    {
        $reports = Report::where('producer_id', $producerId)
            ->with(['producer', 'crop'])
            ->paginate(15);

        return response()->json($reports);
    }

    /**
     * Get reports by date range
     */
    public function byDateRange(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);

        // Validación manual para end_date después de start_date
        if ($validated['end_date'] <= $validated['start_date']) {
            return response()->json([
                'message' => 'La fecha de fin debe ser posterior a la fecha de inicio',
                'errors' => ['end_date' => ['La fecha de fin debe ser posterior a la fecha de inicio']]
            ], 422);
        }

        $reports = Report::whereBetween('report_date', [
            $validated['start_date'],
            $validated['end_date']
        ])
            ->with(['producer', 'crop'])
            ->paginate(15);

        return response()->json($reports);
    }
}
