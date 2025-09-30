<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supply;
use App\Models\InventoryMovement;

class SupplySeeder extends Seeder
{
    public function run(): void
    {
        $supplies = [
            [
                'name' => 'Semillas de Maíz Híbrido',
                'category' => 'semillas',
                'unit' => 'kg',
                'min_stock' => 100,
                'current_stock' => 75,
                'price' => 25.50,
                'location' => 'Almacén Central',
                'status' => 'low_stock',
                'supplier' => 'AgroVenezuela'
            ],
            [
                'name' => 'Fertilizante NPK 15-15-15',
                'category' => 'fertilizantes',
                'unit' => 'kg',
                'min_stock' => 500,
                'current_stock' => 1200,
                'price' => 45.00,
                'location' => 'Almacén Central',
                'status' => 'available',
                'supplier' => 'Fertilizantes Miranda'
            ],
            [
                'name' => 'Pesticida Orgánico',
                'category' => 'pesticidas',
                'unit' => 'L',
                'min_stock' => 50,
                'current_stock' => 45,
                'price' => 120.00,
                'location' => 'Almacén Norte',
                'status' => 'low_stock',
                'supplier' => 'BioControl'
            ],
        ];

        foreach ($supplies as $data) {
            $supply = Supply::create($data);

            InventoryMovement::create([
                'supply_id' => $supply->id,
                'type' => 'in',
                'quantity' => $supply->current_stock,
                'reference' => 'Carga inicial',
                'date' => now()->toDateString(),
                'notes' => 'Registro inicial de inventario',
            ]);
        }
    }
} 