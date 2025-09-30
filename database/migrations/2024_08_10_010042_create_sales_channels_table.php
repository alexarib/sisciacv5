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
        if (!Schema::hasTable('sales_channels')) {
            Schema::create('sales_channels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['mercado', 'directa', 'cooperativa', 'distribuidor']);
            $table->string('location');
            $table->string('contact', 100)->nullable();
            $table->string('capacity', 100);
            $table->decimal('commission', 5, 2);
            $table->string('payment_terms', 100);
            $table->json('products')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_channels');
    }
};
