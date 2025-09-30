<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'producer_id',
        'product',
        'quantity',
        'unit',
        'price_per_unit',
        'total_amount',
        'channel',
        'payment_method',
        'buyer',
        'notes',
        'status',
        'date'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'price_per_unit' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'date' => 'date',
    ];

    public function producer()
    {
        return $this->belongsTo(Producer::class);
    }

    public function getStatusTextAttribute()
    {
        switch ($this->status) {
            case 'completed':
                return 'Completado';
            case 'pending':
                return 'Pendiente';
            case 'cancelled':
                return 'Cancelado';
            default:
                return 'Desconocido';
        }
    }

    public function getStatusColorAttribute()
    {
        switch ($this->status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    public function getPaymentMethodTextAttribute()
    {
        switch ($this->payment_method) {
            case 'Efectivo':
                return 'Efectivo';
            case 'Transferencia':
                return 'Transferencia';
            case 'Cheque':
                return 'Cheque';
            case 'Tarjeta':
                return 'Tarjeta';
            default:
                return 'Desconocido';
        }
    }
} 