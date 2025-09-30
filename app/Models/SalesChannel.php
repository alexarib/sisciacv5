<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesChannel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'location',
        'contact',
        'capacity',
        'commission',
        'payment_terms',
        'products',
        'status'
    ];

    protected $casts = [
        'products' => 'array',
        'commission' => 'decimal:2',
    ];

    public function getTypeTextAttribute()
    {
        switch ($this->type) {
            case 'mercado':
                return 'Mercado';
            case 'directa':
                return 'Venta Directa';
            case 'cooperativa':
                return 'Cooperativa';
            case 'distribuidor':
                return 'Distribuidor';
            default:
                return 'Desconocido';
        }
    }

    public function getTypeColorAttribute()
    {
        switch ($this->type) {
            case 'mercado':
                return 'bg-blue-100 text-blue-800';
            case 'directa':
                return 'bg-green-100 text-green-800';
            case 'cooperativa':
                return 'bg-purple-100 text-purple-800';
            case 'distribuidor':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    public function getStatusTextAttribute()
    {
        return $this->status === 'active' ? 'Activo' : 'Inactivo';
    }

    public function getStatusColorAttribute()
    {
        return $this->status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }
} 