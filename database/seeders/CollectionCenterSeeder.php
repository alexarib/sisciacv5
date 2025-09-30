<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CollectionCenter;

class CollectionCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $centersData = [
            [
                'name' => 'Centro de Acopio Central',
                'type' => 'acopio',
                'description' => 'Centro principal de acopio para productos agrícolas',
                'location_lat' => 10.4806,
                'location_lng' => -66.9036,
                'address' => 'Av. Principal, Sector Central',
                'commune' => 'Comuna 1',
                'storage_capacity' => 5000.00,
                'services' => ['acopio', 'clasificacion', 'empaque'],
                'contact_person' => 'María González',
                'contact_phone' => '+58 212 555-0101',
                'contact_email' => 'maria.gonzalez@centroacopio.com',
                'operating_hours' => 'Lunes a Viernes 7:00 AM - 6:00 PM',
                'status' => 'active',
                'radius_influence' => 50.00
            ],
            [
                'name' => 'Centro de Distribución Norte',
                'type' => 'distribucion',
                'description' => 'Centro de distribución para la zona norte',
                'location_lat' => 10.4900,
                'location_lng' => -66.8900,
                'address' => 'Calle Norte, Sector Industrial',
                'commune' => 'Comuna 2',
                'storage_capacity' => 3000.00,
                'services' => ['distribucion', 'transporte', 'logistica'],
                'contact_person' => 'Carlos Rodríguez',
                'contact_phone' => '+58 212 555-0202',
                'contact_email' => 'carlos.rodriguez@distribucion.com',
                'operating_hours' => 'Lunes a Sábado 6:00 AM - 8:00 PM',
                'status' => 'active',
                'radius_influence' => 40.00
            ],
            [
                'name' => 'Centro de Capacitación Agrícola',
                'type' => 'capacitacion',
                'description' => 'Centro de formación y capacitación para productores',
                'location_lat' => 10.4700,
                'location_lng' => -66.9200,
                'address' => 'Av. Educativa, Sector Sur',
                'commune' => 'Comuna 3',
                'storage_capacity' => 500.00,
                'services' => ['capacitacion', 'investigacion', 'extension'],
                'contact_person' => 'Ana Martínez',
                'contact_phone' => '+58 212 555-0303',
                'contact_email' => 'ana.martinez@capacitacion.com',
                'operating_hours' => 'Lunes a Viernes 8:00 AM - 5:00 PM',
                'status' => 'active',
                'radius_influence' => 30.00
            ],
            [
                'name' => 'Centro de Investigación Agrícola',
                'type' => 'investigacion',
                'description' => 'Centro de investigación y desarrollo agrícola',
                'location_lat' => 10.4850,
                'location_lng' => -66.9150,
                'address' => 'Calle Investigación, Sector Este',
                'commune' => 'Comuna 1',
                'storage_capacity' => 1000.00,
                'services' => ['investigacion', 'desarrollo', 'pruebas'],
                'contact_person' => 'Dr. Luis Pérez',
                'contact_phone' => '+58 212 555-0404',
                'contact_email' => 'luis.perez@investigacion.com',
                'operating_hours' => 'Lunes a Viernes 7:00 AM - 4:00 PM',
                'status' => 'active',
                'radius_influence' => 25.00
            ],
            [
                'name' => 'Centro de Acopio Sur',
                'type' => 'acopio',
                'description' => 'Centro de acopio para la zona sur del municipio',
                'location_lat' => 10.4750,
                'location_lng' => -66.8950,
                'address' => 'Av. Sur, Sector Rural',
                'commune' => 'Comuna 2',
                'storage_capacity' => 2500.00,
                'services' => ['acopio', 'secado', 'almacenamiento'],
                'contact_person' => 'Roberto Silva',
                'contact_phone' => '+58 212 555-0505',
                'contact_email' => 'roberto.silva@acopiosur.com',
                'operating_hours' => 'Lunes a Domingo 6:00 AM - 10:00 PM',
                'status' => 'active',
                'radius_influence' => 35.00
            ]
        ];

        foreach ($centersData as $center) {
            CollectionCenter::create($center);
        }
    }
} 