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
        if (!Schema::hasTable('workers')) {
            Schema::create('workers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('document', 20)->unique();
            $table->string('phone', 20);
            $table->json('skills');
            $table->string('experience', 100);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('commune', 100)->nullable();
            $table->enum('availability', ['full_time', 'part_time', 'seasonal'])->default('full_time');
            $table->decimal('hourly_rate', 8, 2);
            $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workers');
    }
};
