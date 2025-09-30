<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Producer;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Administrador SCIAC',
            'username' => 'admin',
            'email' => 'admin@sciac.gov.ve',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active',
            'phone' => '+58 412 123 4567',
            'address' => 'Municipio Simón Bolívar, Miranda, Venezuela',
            'document_number' => 'V-12345678',
            'document_type' => 'dni',
        ]);

        // Create producer users
        $producers = [
            [
                'name' => 'Juan Pérez García',
                'username' => 'juan.perez',
                'email' => 'juan.perez@email.com',
                'password' => Hash::make('password123'),
                'phone' => '+58 999 123 456',
                'address' => 'Av. Principal 123, Distrito de San Juan',
                'document_number' => '12345678',
                'document_type' => 'dni',
            ],
            [
                'name' => 'María López Fernández',
                'username' => 'maria.lopez',
                'email' => 'maria.lopez@email.com',
                'password' => Hash::make('password123'),
                'phone' => '+58 999 234 567',
                'address' => 'Calle Los Olivos 456, Distrito de La Molina',
                'document_number' => '87654321',
                'document_type' => 'dni',
            ],
            [
                'name' => 'Carlos Rodríguez Silva',
                'username' => 'carlos.rodriguez',
                'email' => 'carlos.rodriguez@email.com',
                'password' => Hash::make('password123'),
                'phone' => '+58 999 345 678',
                'address' => 'Jr. San Martín 789, Distrito de Miraflores',
                'document_number' => '20123456789',
                'document_type' => 'ruc',
            ],
            [
                'name' => 'Ana Torres Mendoza',
                'username' => 'ana.torres',
                'email' => 'ana.torres@email.com',
                'password' => Hash::make('password123'),
                'phone' => '+58 999 456 789',
                'address' => 'Av. Arequipa 321, Distrito de San Isidro',
                'document_number' => '98765432',
                'document_type' => 'dni',
            ],
            [
                'name' => 'Roberto Vargas Castro',
                'username' => 'roberto.vargas',
                'email' => 'roberto.vargas@email.com',
                'password' => Hash::make('password123'),
                'phone' => '+58 999 567 890',
                'address' => 'Calle Real 654, Distrito de Barranco',
                'document_number' => '20234567890',
                'document_type' => 'ruc',
            ]
        ];

        foreach ($producers as $producerData) {
            $user = User::create([
                'name' => $producerData['name'],
                'username' => $producerData['username'],
                'email' => $producerData['email'],
                'password' => $producerData['password'],
                'role' => 'producer',
                'status' => 'active',
                'phone' => $producerData['phone'],
                'address' => $producerData['address'],
                'document_number' => $producerData['document_number'],
                'document_type' => $producerData['document_type'],
            ]);

            // Create associated producer record
            Producer::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'document_number' => $user->document_number,
                'document_type' => $user->document_type,
                'total_area' => rand(10, 50),
                'status' => 'active',
                'notes' => 'Productor registrado desde el sistema'
            ]);
        }
    }
}
