<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Training;
use App\Models\Producer;

class TrainingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trainings = [
            [
                'title' => 'Técnicas de Cultivo Orgánico',
                'description' => 'Capacitación sobre métodos de cultivo orgánico y certificaciones',
                'instructor' => 'Dr. Carlos Mendoza',
                'date' => '2024-05-15',
                'start_time' => '09:00',
                'end_time' => '17:00',
                'location' => 'Centro de Capacitación SISCIAC',
                'capacity' => 30,
                'status' => 'scheduled',
                'materials' => 'Manual de cultivo orgánico, certificados de participación',
                'notes' => 'Incluye práctica en campo'
            ],
            [
                'title' => 'Manejo Integrado de Plagas',
                'description' => 'Capacitación sobre control biológico y manejo sostenible de plagas',
                'instructor' => 'Ing. María Fernández',
                'date' => '2024-05-20',
                'start_time' => '08:30',
                'end_time' => '16:30',
                'location' => 'Auditorio Municipal',
                'capacity' => 25,
                'status' => 'scheduled',
                'materials' => 'Guía de identificación de plagas, muestras biológicas',
                'notes' => 'Capacitación práctica con muestras reales'
            ],
            [
                'title' => 'Riego por Goteo y Fertirriego',
                'description' => 'Capacitación sobre sistemas de riego eficiente y nutrición vegetal',
                'instructor' => 'Ing. Roberto Silva',
                'date' => '2024-04-25',
                'start_time' => '10:00',
                'end_time' => '18:00',
                'location' => 'Finca Experimental',
                'capacity' => 20,
                'status' => 'completed',
                'materials' => 'Equipos de riego, manual técnico',
                'notes' => 'Capacitación completada exitosamente'
            ],
            [
                'title' => 'Comercialización y Mercados',
                'description' => 'Capacitación sobre estrategias de comercialización y acceso a mercados',
                'instructor' => 'Lic. Ana Torres',
                'date' => '2024-06-10',
                'start_time' => '09:00',
                'end_time' => '17:00',
                'location' => 'Centro de Capacitación SISCIAC',
                'capacity' => 35,
                'status' => 'scheduled',
                'materials' => 'Guía de mercados, contactos comerciales',
                'notes' => 'Incluye networking con compradores'
            ],
            [
                'title' => 'Postcosecha y Almacenamiento',
                'description' => 'Capacitación sobre técnicas de postcosecha y conservación de productos',
                'instructor' => 'Dr. Luis Vargas',
                'date' => '2024-05-30',
                'start_time' => '08:00',
                'end_time' => '16:00',
                'location' => 'Centro de Procesamiento',
                'capacity' => 28,
                'status' => 'scheduled',
                'materials' => 'Equipos de postcosecha, manual de procedimientos',
                'notes' => 'Práctica con productos reales'
            ]
        ];

        $producers = Producer::where('status', 'active')->get();

        foreach ($trainings as $training) {
            $trainingModel = Training::create($training);

            // Asignar productores aleatoriamente a cada capacitación
            $randomProducers = $producers->random(rand(3, min(8, $producers->count())));
            $producerIds = $randomProducers->pluck('id')->toArray();

            $trainingModel->producers()->attach($producerIds, [
                'status' => $training['status'] === 'completed' ? 'completed' : 'registered'
            ]);
        }
    }
}
