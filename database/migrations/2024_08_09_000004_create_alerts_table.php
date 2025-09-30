<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('alerts')) {
            Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // harvest, pest, climate, logistics, stock
            $table->string('severity'); // low, medium, high, critical
            $table->string('title');
            $table->text('message');
            $table->enum('status', ['new', 'read', 'resolved'])->default('new');
            $table->json('payload')->nullable();
            $table->foreignId('producer_id')->nullable()->constrained('producers')->nullOnDelete();
            $table->foreignId('crop_id')->nullable()->constrained('crops')->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
}; 