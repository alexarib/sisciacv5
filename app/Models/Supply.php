<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supply extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'unit',
        'min_stock',
        'current_stock',
        'price',
        'location',
        'status',
        'supplier',
    ];

    protected $casts = [
        'min_stock' => 'decimal:2',
        'current_stock' => 'decimal:2',
        'price' => 'decimal:2',
    ];

    public function movements()
    {
        return $this->hasMany(InventoryMovement::class);
    }

    public function requests()
    {
        return $this->hasMany(SupplyRequest::class);
    }
} 