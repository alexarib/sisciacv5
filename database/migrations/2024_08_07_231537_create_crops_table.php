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
        if (!Schema::hasTable('crops')) {
            Schema::create('crops', function (Blueprint $table) {
                $table->id();
                $table->foreignId('producer_id')->constrained()->onDelete('cascade');
                $table->string('name');
                $table->text('description')->nullable();
                $table->decimal('area', 10, 2);
                $table->enum('status', ['planted', 'growing', 'harvested', 'failed'])->default('planted');
                $table->date('planting_date');
                $table->date('expected_harvest_date')->nullable();
                $table->date('actual_harvest_date')->nullable();
                $table->decimal('yield', 10, 2)->nullable();
                $table->string('variety')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crops');
    }
};
