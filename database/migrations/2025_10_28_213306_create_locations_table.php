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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre de la ubicación/finca
            $table->text('description')->nullable(); // Descripción de la ubicación
            $table->string('type'); // farm, plot, field, etc.
            $table->decimal('latitude', 10, 8); // Latitud GPS
            $table->decimal('longitude', 11, 8); // Longitud GPS
            $table->decimal('area_hectares', 10, 2)->nullable(); // Área en hectáreas
            $table->string('address')->nullable(); // Dirección física
            $table->string('municipality')->nullable(); // Municipio
            $table->string('state')->nullable(); // Estado
            $table->string('country')->default('Venezuela'); // País
            $table->string('postal_code')->nullable(); // Código postal
            $table->json('boundaries')->nullable(); // Coordenadas de los límites (GeoJSON)
            $table->json('center_point')->nullable(); // Punto central (GeoJSON)
            $table->enum('status', ['active', 'inactive', 'planned'])->default('active');
            $table->foreignId('producer_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('crop_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('parent_location_id')->nullable()->constrained('locations')->onDelete('cascade');
            $table->timestamps();

            // Índices para optimizar consultas geográficas
            $table->index(['latitude', 'longitude']);
            $table->index(['type', 'status']);
            $table->index(['producer_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
