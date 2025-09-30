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
        if (!Schema::hasTable('market_prices')) {
            Schema::create('market_prices', function (Blueprint $table) {
            $table->id();
            $table->string('product');
            $table->enum('category', ['granos', 'vegetales', 'frutas', 'tubérculos', 'legumbres']);
            $table->decimal('current_price', 8, 2);
            $table->decimal('previous_price', 8, 2);
            $table->enum('unit', ['kg', 'lb', 'ton', 'unidad']);
            $table->string('market');
            $table->enum('trend', ['up', 'down', 'stable']);
            $table->decimal('change_percentage', 5, 1);
            $table->string('source', 100);
            $table->enum('quality', ['Premium', 'Estándar', 'Básica']);
            $table->date('last_updated')->default(now());
            $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_prices');
    }
};
