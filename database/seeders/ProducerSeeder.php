<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Producer;

class ProducerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $producers = [
            [
                'name' => 'Juan Pérez García',
                'email' => 'juan.perez@email.com',
                'phone' => '+58 999 123 456',
                'address' => 'Av. Principal 123, Distrito de San Juan',
                'document_number' => '12345678',
                'document_type' => 'dni',
                'total_area' => 25.50,
                'status' => 'active',
                'notes' => 'Productor experimentado con 10 años en el sector',
                'location_lat' => 10.4806,
                'location_lng' => -66.9036,
                'commune' => 'Comuna 1'
            ],
            [
                'name' => 'María López Fernández',
                'email' => 'maria.lopez@email.com',
                'phone' => '+58 999 234 567',
                'address' => 'Calle Los Olivos 456, Distrito de La Molina',
                'document_number' => '87654321',
                'document_type' => 'dni',
                'total_area' => 18.75,
                'status' => 'active',
                'notes' => 'Especializada en cultivos orgánicos',
                'location_lat' => 10.4900,
                'location_lng' => -66.8900,
                'commune' => 'Comuna 2'
            ],
            [
                'name' => 'Carlos Rodríguez Silva',
                'email' => 'carlos.rodriguez@email.com',
                'phone' => '+58 999 345 678',
                'address' => 'Jr. San Martín 789, Distrito de Miraflores',
                'document_number' => '20123456789',
                'document_type' => 'ruc',
                'total_area' => 45.20,
                'status' => 'active',
                'notes' => 'Productor a gran escala con certificaciones internacionales',
                'location_lat' => 10.4700,
                'location_lng' => -66.9200,
                'commune' => 'Comuna 3'
            ],
            [
                'name' => 'Ana Torres Mendoza',
                'email' => 'ana.torres@email.com',
                'phone' => '+58 999 456 789',
                'address' => 'Av. Arequipa 321, Distrito de San Isidro',
                'document_number' => '98765432',
                'document_type' => 'dni',
                'total_area' => 12.30,
                'status' => 'active',
                'notes' => 'Nueva productora, requiere capacitación inicial',
                'location_lat' => 10.4850,
                'location_lng' => -66.9150,
                'commune' => 'Comuna 1'
            ],
            [
                'name' => 'Roberto Vargas Castro',
                'email' => 'roberto.vargas@email.com',
                'phone' => '+58 999 567 890',
                'address' => 'Calle Real 654, Distrito de Barranco',
                'document_number' => '20234567890',
                'document_type' => 'ruc',
                'total_area' => 32.15,
                'status' => 'active',
                'notes' => 'Especialista en cultivos de exportación',
                'location_lat' => 10.4750,
                'location_lng' => -66.8950,
                'commune' => 'Comuna 2'
            ]
        ];

        foreach ($producers as $producer) {
            Producer::create($producer);
        }
    }
}
