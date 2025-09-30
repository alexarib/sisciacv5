<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logistics extends Model
{
    use HasFactory;

    protected $fillable = [
        'producer_id',
        'crop_id',
        'type',
        'item_name',
        'description',
        'quantity',
        'unit',
        'unit_price',
        'total_price',
        'date',
        'status',
        'supplier',
        'destination',
        'notes'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'date' => 'date',
    ];

    public function producer()
    {
        return $this->belongsTo(Producer::class);
    }

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function getTypeTextAttribute()
    {
        switch ($this->type) {
            case 'input':
                return 'Entrada';
            case 'output':
                return 'Salida';
            case 'transport':
                return 'Transporte';
            default:
                return 'Desconocido';
        }
    }

    public function getTypeColorAttribute()
    {
        switch ($this->type) {
            case 'input':
                return 'bg-green-100 text-green-800';
            case 'output':
                return 'bg-blue-100 text-blue-800';
            case 'transport':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    public function getStatusTextAttribute()
    {
        switch ($this->status) {
            case 'pending':
                return 'Pendiente';
            case 'in_transit':
                return 'En Tránsito';
            case 'delivered':
                return 'Entregado';
            case 'cancelled':
                return 'Cancelado';
            default:
                return 'Desconocido';
        }
    }

    public function getStatusColorAttribute()
    {
        switch ($this->status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_transit':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    public function getUnitTextAttribute()
    {
        switch ($this->unit) {
            case 'kg':
                return 'Kilogramos';
            case 'tons':
                return 'Toneladas';
            case 'liters':
                return 'Litros';
            case 'units':
                return 'Unidades';
            default:
                return $this->unit;
        }
    }

    public function getFormattedTotalPriceAttribute()
    {
        return $this->total_price ? '$' . number_format($this->total_price, 2) : 'N/A';
    }

    public function getFormattedUnitPriceAttribute()
    {
        return $this->unit_price ? '$' . number_format($this->unit_price, 2) : 'N/A';
    }

    public function getFormattedQuantityAttribute()
    {
        return $this->quantity . ' ' . $this->unit;
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByProducer($query, $producerId)
    {
        return $query->where('producer_id', $producerId);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInTransit($query)
    {
        return $query->where('status', 'in_transit');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }
}
