<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Logistics;
use App\Models\Producer;
use App\Models\Crop;

class LogisticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $producers = Producer::all();
        $crops = Crop::all();

        $logisticsData = [
            [
                'type' => 'input',
                'item_name' => 'Fertilizante NPK 15-15-15',
                'description' => 'Fertilizante balanceado para cultivos',
                'quantity' => 500.00,
                'unit' => 'kg',
                'unit_price' => 2.50,
                'total_price' => 1250.00,
                'date' => '2024-03-15',
                'status' => 'delivered',
                'supplier' => 'AgroFert S.A.',
                'destination' => 'Finca del productor',
                'notes' => 'Entrega programada para inicio de temporada'
            ],
            [
                'type' => 'input',
                'item_name' => 'Semillas de Maíz Híbrido',
                'description' => 'Semillas certificadas de alta calidad',
                'quantity' => 50.00,
                'unit' => 'kg',
                'unit_price' => 15.00,
                'total_price' => 750.00,
                'date' => '2024-03-10',
                'status' => 'delivered',
                'supplier' => 'Semillas del Perú',
                'destination' => 'Finca del productor',
                'notes' => 'Semillas para siembra de marzo'
            ],
            [
                'type' => 'input',
                'item_name' => 'Herbicida Selectivo',
                'description' => 'Control de malezas en cultivos',
                'quantity' => 20.00,
                'unit' => 'liters',
                'unit_price' => 25.00,
                'total_price' => 500.00,
                'date' => '2024-03-20',
                'status' => 'in_transit',
                'supplier' => 'AgroQuímica Pro',
                'destination' => 'Finca del productor',
                'notes' => 'Envío programado para control post-emergente'
            ],
            [
                'type' => 'output',
                'item_name' => 'Maíz Amarillo',
                'description' => 'Cosecha de maíz para venta',
                'quantity' => 2000.00,
                'unit' => 'kg',
                'unit_price' => 1.20,
                'total_price' => 2400.00,
                'date' => '2024-08-15',
                'status' => 'pending',
                'supplier' => 'Finca del productor',
                'destination' => 'Mercado Central',
                'notes' => 'Cosecha lista para comercialización'
            ],
            [
                'type' => 'output',
                'item_name' => 'Papa Blanca',
                'description' => 'Cosecha de papa para consumo',
                'quantity' => 1500.00,
                'unit' => 'kg',
                'unit_price' => 2.50,
                'total_price' => 3750.00,
                'date' => '2024-09-01',
                'status' => 'pending',
                'supplier' => 'Finca del productor',
                'destination' => 'Supermercado Local',
                'notes' => 'Papa de calidad premium'
            ],
            [
                'type' => 'transport',
                'item_name' => 'Transporte de Cosecha',
                'description' => 'Servicio de transporte para cosecha',
                'quantity' => 1.00,
                'unit' => 'units',
                'unit_price' => 300.00,
                'total_price' => 300.00,
                'date' => '2024-08-20',
                'status' => 'pending',
                'supplier' => 'Transportes Agro',
                'destination' => 'Centro de Acopio',
                'notes' => 'Camión de 5 toneladas para transporte'
            ],
            [
                'type' => 'input',
                'item_name' => 'Sistema de Riego por Goteo',
                'description' => 'Instalación de riego tecnificado',
                'quantity' => 1.00,
                'unit' => 'units',
                'unit_price' => 2500.00,
                'total_price' => 2500.00,
                'date' => '2024-04-01',
                'status' => 'delivered',
                'supplier' => 'RiegoTec S.A.',
                'destination' => 'Finca del productor',
                'notes' => 'Sistema completo para 5 hectáreas'
            ],
            [
                'type' => 'input',
                'item_name' => 'Plaguicida Biológico',
                'description' => 'Control biológico de plagas',
                'quantity' => 10.00,
                'unit' => 'liters',
                'unit_price' => 45.00,
                'total_price' => 450.00,
                'date' => '2024-04-10',
                'status' => 'delivered',
                'supplier' => 'BioControl Perú',
                'destination' => 'Finca del productor',
                'notes' => 'Producto orgánico certificado'
            ]
        ];

        foreach ($logisticsData as $index => $logistics) {
            $producer = $producers[$index % $producers->count()];
            $crop = $crops[$index % $crops->count()] ?? null;

            $logistics['producer_id'] = $producer->id;
            $logistics['crop_id'] = $crop ? $crop->id : null;

            Logistics::create($logistics);
        }
    }
}
