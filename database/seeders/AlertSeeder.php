<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alert;

class AlertSeeder extends Seeder
{
    public function run(): void
    {
        $examples = [
            [
                'type' => 'harvest',
                'severity' => 'medium',
                'title' => 'Cosecha próxima',
                'message' => 'Hay cultivos con cosecha en los próximos 7 días',
                'status' => 'new',
                'payload' => ['days' => 7],
            ],
            [
                'type' => 'pest',
                'severity' => 'high',
                'title' => 'Riesgo de plagas',
                'message' => 'Se detectó riesgo de plagas en zona central',
                'status' => 'new',
                'payload' => ['region' => 'zona central'],
            ],
            [
                'type' => 'stock',
                'severity' => 'high',
                'title' => 'Stock bajo de insumos',
                'message' => 'Algunos insumos están por debajo del mínimo',
                'status' => 'new',
                'payload' => ['module' => 'supplies'],
            ],
        ];

        foreach ($examples as $data) {
            Alert::create($data);
        }
    }
} 