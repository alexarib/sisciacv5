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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('crop_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['production', 'financial', 'logistics', 'training', 'general']);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->date('report_date');
            $table->json('data')->nullable(); // Para datos estructurados del reporte
            $table->string('file_path')->nullable(); // Para reportes en PDF/Excel
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
