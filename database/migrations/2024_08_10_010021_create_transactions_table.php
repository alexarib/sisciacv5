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
        if (!Schema::hasTable('transactions')) {
            Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producer_id')->constrained()->onDelete('cascade');
            $table->string('product');
            $table->decimal('quantity', 10, 2);
            $table->enum('unit', ['kg', 'lb', 'ton', 'unidad']);
            $table->decimal('price_per_unit', 8, 2);
            $table->decimal('total_amount', 10, 2);
            $table->string('channel');
            $table->enum('payment_method', ['Efectivo', 'Transferencia', 'Cheque', 'Tarjeta']);
            $table->string('buyer');
            $table->text('notes')->nullable();
            $table->enum('status', ['completed', 'pending', 'cancelled'])->default('pending');
            $table->date('date')->default(now());
            $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
