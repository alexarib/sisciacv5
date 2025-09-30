<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar campos geográficos a producers
        Schema::table('producers', function (Blueprint $table) {
            $table->decimal('location_lat', 10, 8)->nullable()->after('notes');
            $table->decimal('location_lng', 11, 8)->nullable()->after('location_lat');
            $table->string('address_coordinates')->nullable()->after('location_lng');
            $table->string('commune')->nullable()->after('address_coordinates');
            $table->decimal('area_total', 10, 2)->default(0)->after('commune');
        });

        // Agregar campos geográficos a crops
        Schema::table('crops', function (Blueprint $table) {
            $table->decimal('area_center_lat', 10, 8)->nullable()->after('notes');
            $table->decimal('area_center_lng', 11, 8)->nullable()->after('area_center_lat');
            $table->text('area_coordinates')->nullable()->after('area_center_lng'); // JSON para polígonos
            $table->decimal('area_calculated', 10, 2)->nullable()->after('area_coordinates');
            $table->string('commune')->nullable()->after('area_calculated');
        });

        // Crear tabla para centros de acopio
        Schema::create('collection_centers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // acopio, distribucion, capacitacion, investigacion
            $table->text('description')->nullable();
            $table->decimal('location_lat', 10, 8);
            $table->decimal('location_lng', 11, 8);
            $table->string('address');
            $table->string('commune');
            $table->decimal('storage_capacity', 10, 2)->nullable(); // en toneladas
            $table->json('services')->nullable(); // servicios ofrecidos
            $table->string('contact_person');
            $table->string('contact_phone');
            $table->string('contact_email')->nullable();
            $table->string('operating_hours')->nullable();
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
            $table->decimal('radius_influence', 8, 2)->nullable(); // radio de influencia en km
            $table->timestamps();
        });

        // Crear tabla para rutas logísticas
        Schema::create('logistics_routes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('route_coordinates')->nullable(); // JSON para coordenadas de la ruta
            $table->foreignId('origin_center_id')->constrained('collection_centers')->onDelete('cascade');
            $table->foreignId('destination_center_id')->constrained('collection_centers')->onDelete('cascade');
            $table->string('cargo_type')->nullable();
            $table->decimal('vehicle_capacity', 8, 2)->nullable(); // en toneladas
            $table->integer('frequency_trips')->nullable(); // viajes por semana
            $table->integer('estimated_time')->nullable(); // tiempo estimado en minutos
            $table->decimal('cost_per_km', 8, 2)->nullable();
            $table->decimal('total_distance', 8, 2)->nullable(); // en km
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
            $table->timestamps();
        });

        // Crear tabla para análisis geográfico
        Schema::create('geographic_analysis', function (Blueprint $table) {
            $table->id();
            $table->string('analysis_type'); // density, coverage, efficiency
            $table->string('target_layer'); // producers, crops, centers, routes
            $table->json('parameters')->nullable();
            $table->json('results')->nullable();
            $table->timestamp('analysis_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar campos geográficos de producers
        Schema::table('producers', function (Blueprint $table) {
            $table->dropColumn(['location_lat', 'location_lng', 'address_coordinates', 'commune', 'area_total']);
        });

        // Eliminar campos geográficos de crops
        Schema::table('crops', function (Blueprint $table) {
            $table->dropColumn(['area_center_lat', 'area_center_lng', 'area_coordinates', 'area_calculated', 'commune']);
        });

        // Eliminar tablas creadas
        Schema::dropIfExists('geographic_analysis');
        Schema::dropIfExists('logistics_routes');
        Schema::dropIfExists('collection_centers');
    }
}; 