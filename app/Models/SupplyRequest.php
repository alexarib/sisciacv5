<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplyRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'producer_id',
        'supply_id',
        'quantity',
        'unit',
        'status', // pending, approved, rejected, fulfilled
        'priority', // low, medium, high
        'request_date',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'request_date' => 'date',
    ];

    public function producer()
    {
        return $this->belongsTo(Producer::class);
    }

    public function supply()
    {
        return $this->belongsTo(Supply::class);
    }
} 