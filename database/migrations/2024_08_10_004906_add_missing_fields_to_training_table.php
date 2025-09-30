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
        Schema::table('training', function (Blueprint $table) {
            // Agregar campos que no existen
            if (!Schema::hasColumn('training', 'type')) {
                $table->enum('type', ['video', 'document', 'mixed'])->default('mixed')->after('instructor');
            }
            if (!Schema::hasColumn('training', 'duration')) {
                $table->string('duration', 100)->nullable()->after('type');
            }
            if (!Schema::hasColumn('training', 'level')) {
                $table->enum('level', ['básico', 'intermedio', 'avanzado'])->default('básico')->after('duration');
            }
            if (!Schema::hasColumn('training', 'category')) {
                $table->enum('category', ['cultivos', 'sanidad', 'gestión', 'tecnología'])->default('cultivos')->after('level');
            }
            if (!Schema::hasColumn('training', 'topics')) {
                $table->json('topics')->nullable()->after('description');
            }
            if (!Schema::hasColumn('training', 'max_students')) {
                $table->integer('max_students')->nullable()->after('materials');
            }
            if (!Schema::hasColumn('training', 'start_date')) {
                $table->date('start_date')->nullable()->after('max_students');
            }
            if (!Schema::hasColumn('training', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }
            if (!Schema::hasColumn('training', 'enrolled')) {
                $table->integer('enrolled')->default(0)->after('end_date');
            }
        });

        // Crear tabla pivot si no existe
        if (!Schema::hasTable('producer_training')) {
            Schema::create('producer_training', function (Blueprint $table) {
                $table->id();
                $table->foreignId('producer_id')->constrained()->onDelete('cascade');
                $table->foreignId('training_id')->constrained('training')->onDelete('cascade');
                $table->enum('status', ['registered', 'attended', 'completed', 'no_show'])->default('registered');
                $table->integer('progress')->default(0);
                $table->date('completion_date')->nullable();
                $table->string('certificate')->nullable();
                $table->text('feedback')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training', function (Blueprint $table) {
            $table->dropColumn([
                'type', 'duration', 'level', 'category', 'topics', 
                'max_students', 'start_date', 'end_date', 'enrolled'
            ]);
        });

        Schema::dropIfExists('producer_training');
    }
};
