<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Test User',
            'username' => 'test.user',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'producer',
            'status' => 'active',
        ]);

        $this->call([
            UserSeeder::class,
            CropSeeder::class,
            TrainingSeeder::class,
            LogisticsSeeder::class,
            SupplySeeder::class,
            AlertSeeder::class,
            CollectionCenterSeeder::class,
            LogisticsRouteSeeder::class,
        ]);
    }
}
