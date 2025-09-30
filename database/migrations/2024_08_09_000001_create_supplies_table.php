<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('supplies')) {
            Schema::create('supplies', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('category')->nullable();
                $table->string('unit');
                $table->decimal('min_stock', 12, 2)->default(0);
                $table->decimal('current_stock', 12, 2)->default(0);
                $table->decimal('price', 12, 2)->default(0);
                $table->string('location')->nullable();
                $table->string('status')->default('available'); // available, low_stock, out_of_stock
                $table->string('supplier')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('supplies');
    }
}; 