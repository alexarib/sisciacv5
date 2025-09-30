<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'supply_id',
        'type', // in, out, adjustment
        'quantity',
        'reference',
        'notes',
        'date',
        'user_id',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'date' => 'date',
    ];

    public function supply()
    {
        return $this->belongsTo(Supply::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 