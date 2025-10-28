<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;
use App\Models\Producer;
use App\Models\Crop;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener productores existentes
        $producers = Producer::all();
        $crops = Crop::all();

        if ($producers->isEmpty()) {
            $this->command->warn('No hay productores disponibles. Creando ubicaciones sin productor asignado.');
        }

        if ($crops->isEmpty()) {
            $this->command->warn('No hay cultivos disponibles. Creando ubicaciones sin cultivo asignado.');
        }

        // Ubicaciones de ejemplo para el Municipio Simón Bolívar, Miranda
        $locations = [
            [
                'name' => 'Finca La Esperanza',
                'description' => 'Finca principal dedicada al cultivo de maíz y frijoles',
                'type' => 'farm',
                'latitude' => 6.423750,
                'longitude' => -66.589730,
                'area_hectares' => 25.5,
                'address' => 'Vía principal, Sector La Esperanza',
                'municipality' => 'Simón Bolívar',
                'state' => 'Miranda',
                'country' => 'Venezuela',
                'postal_code' => '1201',
                'status' => 'active',
                'producer_id' => $producers->first()?->id,
                'crop_id' => $crops->first()?->id,
                'boundaries' => json_encode([
                    [6.424750, -66.590730],
                    [6.422750, -66.590730],
                    [6.422750, -66.588730],
                    [6.424750, -66.588730],
                    [6.424750, -66.590730]
                ]),
                'center_point' => json_encode(['lat' => 6.423750, 'lng' => -66.589730])
            ],
            [
                'name' => 'Parcela Los Pinos',
                'description' => 'Parcela experimental para cultivos de hortalizas',
                'type' => 'plot',
                'latitude' => 6.425000,
                'longitude' => -66.587000,
                'area_hectares' => 8.2,
                'address' => 'Sector Los Pinos',
                'municipality' => 'Simón Bolívar',
                'state' => 'Miranda',
                'country' => 'Venezuela',
                'postal_code' => '1201',
                'status' => 'active',
                'producer_id' => $producers->skip(1)->first()?->id,
                'crop_id' => $crops->skip(1)->first()?->id,
                'boundaries' => json_encode([
                    [6.426000, -66.588000],
                    [6.424000, -66.588000],
                    [6.424000, -66.586000],
                    [6.426000, -66.586000],
                    [6.426000, -66.588000]
                ]),
                'center_point' => json_encode(['lat' => 6.425000, 'lng' => -66.587000])
            ],
            [
                'name' => 'Campo El Progreso',
                'description' => 'Campo de cultivo extensivo de arroz',
                'type' => 'field',
                'latitude' => 6.420000,
                'longitude' => -66.592000,
                'area_hectares' => 45.8,
                'address' => 'Sector El Progreso',
                'municipality' => 'Simón Bolívar',
                'state' => 'Miranda',
                'country' => 'Venezuela',
                'postal_code' => '1201',
                'status' => 'active',
                'producer_id' => $producers->skip(2)->first()?->id,
                'crop_id' => $crops->skip(2)->first()?->id,
                'boundaries' => json_encode([
                    [6.421000, -66.593000],
                    [6.419000, -66.593000],
                    [6.419000, -66.591000],
                    [6.421000, -66.591000],
                    [6.421000, -66.593000]
                ]),
                'center_point' => json_encode(['lat' => 6.420000, 'lng' => -66.592000])
            ],
            [
                'name' => 'Invernadero San José',
                'description' => 'Invernadero para cultivos protegidos de tomate',
                'type' => 'greenhouse',
                'latitude' => 6.428000,
                'longitude' => -66.585000,
                'area_hectares' => 2.5,
                'address' => 'Sector San José',
                'municipality' => 'Simón Bolívar',
                'state' => 'Miranda',
                'country' => 'Venezuela',
                'postal_code' => '1201',
                'status' => 'active',
                'producer_id' => $producers->first()?->id,
                'crop_id' => $crops->first()?->id,
                'boundaries' => json_encode([
                    [6.428500, -66.585500],
                    [6.427500, -66.585500],
                    [6.427500, -66.584500],
                    [6.428500, -66.584500],
                    [6.428500, -66.585500]
                ]),
                'center_point' => json_encode(['lat' => 6.428000, 'lng' => -66.585000])
            ],
            [
                'name' => 'Almacén Central',
                'description' => 'Almacén principal para insumos agrícolas',
                'type' => 'storage',
                'latitude' => 6.430000,
                'longitude' => -66.590000,
                'area_hectares' => 1.2,
                'address' => 'Vía principal, Sector Central',
                'municipality' => 'Simón Bolívar',
                'state' => 'Miranda',
                'country' => 'Venezuela',
                'postal_code' => '1201',
                'status' => 'active',
                'producer_id' => null,
                'crop_id' => null,
                'boundaries' => json_encode([
                    [6.430500, -66.590500],
                    [6.429500, -66.590500],
                    [6.429500, -66.589500],
                    [6.430500, -66.589500],
                    [6.430500, -66.590500]
                ]),
                'center_point' => json_encode(['lat' => 6.430000, 'lng' => -66.590000])
            ],
            [
                'name' => 'Finca La Victoria',
                'description' => 'Finca familiar con cultivos mixtos',
                'type' => 'farm',
                'latitude' => 6.415000,
                'longitude' => -66.595000,
                'area_hectares' => 18.7,
                'address' => 'Sector La Victoria',
                'municipality' => 'Simón Bolívar',
                'state' => 'Miranda',
                'country' => 'Venezuela',
                'postal_code' => '1201',
                'status' => 'active',
                'producer_id' => $producers->skip(3)->first()?->id,
                'crop_id' => $crops->skip(3)->first()?->id,
                'boundaries' => json_encode([
                    [6.416000, -66.596000],
                    [6.414000, -66.596000],
                    [6.414000, -66.594000],
                    [6.416000, -66.594000],
                    [6.416000, -66.596000]
                ]),
                'center_point' => json_encode(['lat' => 6.415000, 'lng' => -66.595000])
            ],
            [
                'name' => 'Parcela Los Robles',
                'description' => 'Parcela para cultivos de ciclo corto',
                'type' => 'plot',
                'latitude' => 6.432000,
                'longitude' => -66.588000,
                'area_hectares' => 12.3,
                'address' => 'Sector Los Robles',
                'municipality' => 'Simón Bolívar',
                'state' => 'Miranda',
                'country' => 'Venezuela',
                'postal_code' => '1201',
                'status' => 'planned',
                'producer_id' => $producers->skip(4)->first()?->id,
                'crop_id' => null,
                'boundaries' => json_encode([
                    [6.433000, -66.589000],
                    [6.431000, -66.589000],
                    [6.431000, -66.587000],
                    [6.433000, -66.587000],
                    [6.433000, -66.589000]
                ]),
                'center_point' => json_encode(['lat' => 6.432000, 'lng' => -66.588000])
            ],
            [
                'name' => 'Campo El Futuro',
                'description' => 'Campo experimental para nuevos cultivos',
                'type' => 'field',
                'latitude' => 6.418000,
                'longitude' => -66.583000,
                'area_hectares' => 32.1,
                'address' => 'Sector El Futuro',
                'municipality' => 'Simón Bolívar',
                'state' => 'Miranda',
                'country' => 'Venezuela',
                'postal_code' => '1201',
                'status' => 'active',
                'producer_id' => $producers->first()?->id,
                'crop_id' => $crops->first()?->id,
                'boundaries' => json_encode([
                    [6.419000, -66.584000],
                    [6.417000, -66.584000],
                    [6.417000, -66.582000],
                    [6.419000, -66.582000],
                    [6.419000, -66.584000]
                ]),
                'center_point' => json_encode(['lat' => 6.418000, 'lng' => -66.583000])
            ]
        ];

        // Crear ubicaciones
        foreach ($locations as $locationData) {
            Location::create($locationData);
        }

        $this->command->info('Ubicaciones de ejemplo creadas exitosamente.');
        $this->command->info('Total de ubicaciones creadas: ' . count($locations));
    }
}
