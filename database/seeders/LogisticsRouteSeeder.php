<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LogisticsRoute;
use App\Models\CollectionCenter;

class LogisticsRouteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $centers = CollectionCenter::all();

        if ($centers->count() < 2) {
            return; // Necesitamos al menos 2 centros para crear rutas
        }

        $routesData = [
            [
                'name' => 'Ruta Central - Norte',
                'description' => 'Ruta principal entre el centro de acopio central y el centro de distribución norte',
                'route_coordinates' => json_encode([
                    ['lat' => 10.4806, 'lng' => -66.9036],
                    ['lat' => 10.4850, 'lng' => -66.8970],
                    ['lat' => 10.4900, 'lng' => -66.8900]
                ]),
                'cargo_type' => 'granos',
                'vehicle_capacity' => 5.00,
                'frequency_trips' => 3,
                'estimated_time' => 45,
                'cost_per_km' => 2.50,
                'total_distance' => 8.5,
                'status' => 'active'
            ],
            [
                'name' => 'Ruta Sur - Central',
                'description' => 'Ruta desde el centro de acopio sur hacia el centro central',
                'route_coordinates' => json_encode([
                    ['lat' => 10.4750, 'lng' => -66.8950],
                    ['lat' => 10.4775, 'lng' => -66.8990],
                    ['lat' => 10.4806, 'lng' => -66.9036]
                ]),
                'cargo_type' => 'hortalizas',
                'vehicle_capacity' => 3.00,
                'frequency_trips' => 5,
                'estimated_time' => 30,
                'cost_per_km' => 2.00,
                'total_distance' => 5.2,
                'status' => 'active'
            ],
            [
                'name' => 'Ruta Este - Oeste',
                'description' => 'Ruta transversal conectando centros de investigación y capacitación',
                'route_coordinates' => json_encode([
                    ['lat' => 10.4850, 'lng' => -66.9150],
                    ['lat' => 10.4825, 'lng' => -66.9100],
                    ['lat' => 10.4800, 'lng' => -66.9050],
                    ['lat' => 10.4775, 'lng' => -66.9000],
                    ['lat' => 10.4750, 'lng' => -66.8950]
                ]),
                'cargo_type' => 'equipos',
                'vehicle_capacity' => 2.00,
                'frequency_trips' => 2,
                'estimated_time' => 60,
                'cost_per_km' => 3.00,
                'total_distance' => 12.0,
                'status' => 'active'
            ],
            [
                'name' => 'Ruta Capacitación - Distribución',
                'description' => 'Ruta desde el centro de capacitación hacia el centro de distribución',
                'route_coordinates' => json_encode([
                    ['lat' => 10.4700, 'lng' => -66.9200],
                    ['lat' => 10.4750, 'lng' => -66.9150],
                    ['lat' => 10.4800, 'lng' => -66.9100],
                    ['lat' => 10.4850, 'lng' => -66.9050],
                    ['lat' => 10.4900, 'lng' => -66.8900]
                ]),
                'cargo_type' => 'materiales',
                'vehicle_capacity' => 1.50,
                'frequency_trips' => 4,
                'estimated_time' => 75,
                'cost_per_km' => 2.25,
                'total_distance' => 15.5,
                'status' => 'active'
            ]
        ];

        foreach ($routesData as $index => $route) {
            // Asignar centros de origen y destino
            $originCenter = $centers[$index % $centers->count()];
            $destinationCenter = $centers[($index + 1) % $centers->count()];
            
            $route['origin_center_id'] = $originCenter->id;
            $route['destination_center_id'] = $destinationCenter->id;
            
            LogisticsRoute::create($route);
        }
    }
} 