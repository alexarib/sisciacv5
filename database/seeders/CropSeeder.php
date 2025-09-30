<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Crop;
use App\Models\Producer;

class CropSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $producers = Producer::all();

        $crops = [
            [
                'name' => 'Maíz Amarillo',
                'description' => 'Cultivo de maíz amarillo para consumo humano y animal',
                'area' => 8.50,
                'status' => 'growing',
                'planting_date' => '2024-03-15',
                'expected_harvest_date' => '2024-08-15',
                'yield' => null,
                'variety' => 'Híbrido 123',
                'notes' => 'Cultivo con riego por goteo'
            ],
            [
                'name' => 'Papa Blanca',
                'description' => 'Cultivo de papa blanca para consumo local',
                'area' => 5.25,
                'status' => 'planted',
                'planting_date' => '2024-04-01',
                'expected_harvest_date' => '2024-09-01',
                'yield' => null,
                'variety' => 'Canchán',
                'notes' => 'Cultivo en rotación con maíz'
            ],
            [
                'name' => 'Quinua Orgánica',
                'description' => 'Cultivo de quinua orgánica para exportación',
                'area' => 12.00,
                'status' => 'harvested',
                'planting_date' => '2023-10-15',
                'expected_harvest_date' => '2024-03-15',
                'actual_harvest_date' => '2024-03-10',
                'yield' => 2.4,
                'variety' => 'Quinua Real',
                'notes' => 'Cultivo certificado orgánico'
            ],
            [
                'name' => 'Tomate Cherry',
                'description' => 'Cultivo de tomate cherry en invernadero',
                'area' => 2.50,
                'status' => 'growing',
                'planting_date' => '2024-02-01',
                'expected_harvest_date' => '2024-06-01',
                'yield' => null,
                'variety' => 'Sweet 100',
                'notes' => 'Cultivo hidropónico'
            ],
            [
                'name' => 'Lechuga Romana',
                'description' => 'Cultivo de lechuga romana para mercado local',
                'area' => 1.75,
                'status' => 'harvested',
                'planting_date' => '2024-01-15',
                'expected_harvest_date' => '2024-03-15',
                'actual_harvest_date' => '2024-03-12',
                'yield' => 0.8,
                'variety' => 'Romana Verde',
                'notes' => 'Cultivo de ciclo corto'
            ],
            [
                'name' => 'Zanahoria Naranja',
                'description' => 'Cultivo de zanahoria para procesamiento',
                'area' => 4.00,
                'status' => 'planted',
                'planting_date' => '2024-04-10',
                'expected_harvest_date' => '2024-08-10',
                'yield' => null,
                'variety' => 'Nantes',
                'notes' => 'Cultivo para industria alimentaria'
            ],
            [
                'name' => 'Cebolla Roja',
                'description' => 'Cultivo de cebolla roja para consumo fresco',
                'area' => 3.25,
                'status' => 'growing',
                'planting_date' => '2024-03-20',
                'expected_harvest_date' => '2024-07-20',
                'yield' => null,
                'variety' => 'Red Baron',
                'notes' => 'Cultivo con control biológico de plagas'
            ],
            [
                'name' => 'Frijol Negro',
                'description' => 'Cultivo de frijol negro para consumo local',
                'area' => 6.50,
                'status' => 'failed',
                'planting_date' => '2024-02-15',
                'expected_harvest_date' => '2024-06-15',
                'yield' => null,
                'variety' => 'Negro Jamapa',
                'notes' => 'Cultivo afectado por sequía'
            ]
        ];

        // Coordenadas para los cultivos (cercanas a las de los productores)
        $cropCoordinates = [
            ['area_center_lat' => 10.4810, 'area_center_lng' => -66.9040, 'commune' => 'Comuna 1'],
            ['area_center_lat' => 10.4905, 'area_center_lng' => -66.8905, 'commune' => 'Comuna 2'],
            ['area_center_lat' => 10.4705, 'area_center_lng' => -66.9205, 'commune' => 'Comuna 3'],
            ['area_center_lat' => 10.4855, 'area_center_lng' => -66.9155, 'commune' => 'Comuna 1'],
            ['area_center_lat' => 10.4755, 'area_center_lng' => -66.8955, 'commune' => 'Comuna 2'],
            ['area_center_lat' => 10.4815, 'area_center_lng' => -66.9045, 'commune' => 'Comuna 1'],
            ['area_center_lat' => 10.4908, 'area_center_lng' => -66.8908, 'commune' => 'Comuna 2'],
            ['area_center_lat' => 10.4708, 'area_center_lng' => -66.9208, 'commune' => 'Comuna 3']
        ];

        foreach ($crops as $index => $crop) {
            $producer = $producers[$index % $producers->count()];
            $coordinates = $cropCoordinates[$index % count($cropCoordinates)];
            
            $crop['producer_id'] = $producer->id;
            $crop['area_center_lat'] = $coordinates['area_center_lat'];
            $crop['area_center_lng'] = $coordinates['area_center_lng'];
            $crop['commune'] = $coordinates['commune'];
            
            Crop::create($crop);
        }
    }
}
