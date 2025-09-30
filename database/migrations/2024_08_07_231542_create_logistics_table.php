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
        if (!Schema::hasTable('logistics')) {
            Schema::create('logistics', function (Blueprint $table) {
                $table->id();
                $table->foreignId('producer_id')->constrained()->onDelete('cascade');
                $table->foreignId('crop_id')->nullable()->constrained()->onDelete('set null');
                $table->string('type'); // 'input', 'output', 'transport'
                $table->string('item_name');
                $table->text('description')->nullable();
                $table->decimal('quantity', 10, 2);
                $table->string('unit'); // 'kg', 'tons', 'liters', 'units'
                $table->decimal('unit_price', 10, 2)->nullable();
                $table->decimal('total_price', 10, 2)->nullable();
                $table->date('date');
                $table->enum('status', ['pending', 'in_transit', 'delivered', 'cancelled'])->default('pending');
                $table->string('supplier')->nullable();
                $table->string('destination')->nullable();
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
        Schema::dropIfExists('logistics');
    }
};
