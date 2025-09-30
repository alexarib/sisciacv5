<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    public function current(Request $request): JsonResponse
    {
        $lat = (float)($request->query('lat', '10.4806')); // Caracas
        $lng = (float)($request->query('lng', '-66.9036'));

        try {
            $response = Http::timeout(6)->get('https://api.open-meteo.com/v1/forecast', [
                'latitude' => $lat,
                'longitude' => $lng,
                'current_weather' => true,
                'timezone' => 'auto',
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'source' => 'open-meteo',
                    'data' => $response->json('current_weather'),
                ]);
            }
        } catch (\Throwable $e) {
            // continue to fallback
        }

        // Fallback mock
        return response()->json([
            'success' => true,
            'source' => 'fallback',
            'data' => [
                'temperature' => 28.0,
                'windspeed' => 8.5,
                'winddirection' => 90,
                'weathercode' => 3,
                'time' => now()->toIso8601String(),
                'latitude' => $lat,
                'longitude' => $lng,
            ],
        ]);
    }

    public function forecast(Request $request): JsonResponse
    {
        $lat = (float)($request->query('lat', '10.4806'));
        $lng = (float)($request->query('lng', '-66.9036'));

        try {
            $response = Http::timeout(6)->get('https://api.open-meteo.com/v1/forecast', [
                'latitude' => $lat,
                'longitude' => $lng,
                'hourly' => 'temperature_2m,precipitation',
                'daily' => 'temperature_2m_max,temperature_2m_min,precipitation_sum',
                'forecast_days' => 5,
                'timezone' => 'auto',
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'source' => 'open-meteo',
                    'data' => [
                        'hourly' => $response->json('hourly'),
                        'daily' => $response->json('daily'),
                    ],
                ]);
            }
        } catch (\Throwable $e) {
            // continue to fallback
        }

        // Fallback simple
        return response()->json([
            'success' => true,
            'source' => 'fallback',
            'data' => [
                'daily' => [
                    'temperature_2m_max' => [30, 31, 29, 28, 30],
                    'temperature_2m_min' => [22, 21, 21, 20, 22],
                    'precipitation_sum' => [2, 4, 0, 6, 3],
                    'time' => [
                        now()->toDateString(),
                        now()->addDay()->toDateString(),
                        now()->addDays(2)->toDateString(),
                        now()->addDays(3)->toDateString(),
                        now()->addDays(4)->toDateString(),
                    ],
                ],
            ],
        ]);
    }
}
