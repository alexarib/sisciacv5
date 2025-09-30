<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Models\Alert;

class AlertsController extends Controller
{
    public function list(Request $request): JsonResponse
    {
        // Regla simple: si hay cultivos con fecha de cosecha en <= 7 días -> alerta
        $upcoming = DB::table('crops')
            ->select('id', 'name', 'producer_id', 'expected_harvest_date')
            ->whereNotNull('expected_harvest_date')
            ->where('expected_harvest_date', '<=', now()->addDays(7)->toDateString())
            ->limit(10)
            ->get();

        $alerts = $upcoming->map(function ($c) {
            return [
                'type' => 'harvest',
                'severity' => 'medium',
                'title' => 'Cosecha próxima',
                'message' => "El cultivo {$c->name} está próximo a cosecha",
                'crop_id' => $c->id,
                'producer_id' => $c->producer_id,
                'date' => $c->expected_harvest_date,
            ];
        })->values()->all();

        // Mock de plaga regional
        $alerts[] = [
            'type' => 'pest',
            'severity' => 'high',
            'title' => 'Alerta de plagas (región)',
            'message' => 'Se detectó riesgo de plagas en la zona central. Revise sus cultivos.',
            'date' => now()->toDateString(),
        ];

        return response()->json([
            'success' => true,
            'alerts' => $alerts,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Alert::query();

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }
        if ($severity = $request->query('severity')) {
            $query->where('severity', $severity);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $alerts = $query->orderByDesc('created_at')->paginate(15);
        return response()->json($alerts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'severity' => 'required|in:low,medium,high,critical',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'nullable|in:new,read,resolved',
            'payload' => 'nullable|array',
            'producer_id' => 'nullable|exists:producers,id',
            'crop_id' => 'nullable|exists:crops,id',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $alert = Alert::create($validated);
        return response()->json([
            'message' => 'Alerta creada exitosamente',
            'alert' => $alert
        ], 201);
    }

    public function show(Alert $alert): JsonResponse
    {
        return response()->json($alert);
    }

    public function update(Request $request, Alert $alert): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'sometimes|string',
            'severity' => 'sometimes|in:low,medium,high,critical',
            'title' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'status' => 'sometimes|in:new,read,resolved',
            'payload' => 'nullable|array',
            'producer_id' => 'nullable|exists:producers,id',
            'crop_id' => 'nullable|exists:crops,id',
            'assigned_to' => 'nullable|exists:users,id',
            'resolved_at' => 'nullable|date',
        ]);

        $alert->update($validated);
        return response()->json([
            'message' => 'Alerta actualizada exitosamente',
            'alert' => $alert
        ]);
    }

    public function destroy(Alert $alert): JsonResponse
    {
        $alert->delete();
        return response()->json(['message' => 'Alerta eliminada exitosamente']);
    }

    public function markAsRead(Alert $alert): JsonResponse
    {
        $alert->update(['status' => 'read']);
        return response()->json(['message' => 'Alerta marcada como leída']);
    }

    public function resolve(Alert $alert): JsonResponse
    {
        $alert->update(['status' => 'resolved', 'resolved_at' => now()]);
        return response()->json(['message' => 'Alerta resuelta']);
    }
}
