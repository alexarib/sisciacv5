<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Worker extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'document',
        'phone',
        'skills',
        'experience',
        'status',
        'commune',
        'availability',
        'hourly_rate',
    ];

    protected $casts = [
        'skills' => 'array',
        'hourly_rate' => 'decimal:2',
    ];

    public function getStatusTextAttribute()
    {
        return $this->status === 'active' ? 'Activo' : 'Inactivo';
    }

    public function getAvailabilityTextAttribute()
    {
        switch ($this->availability) {
            case 'full_time':
                return 'Tiempo Completo';
            case 'part_time':
                return 'Tiempo Parcial';
            case 'seasonal':
                return 'Estacional';
            default:
                return 'Desconocido';
        }
    }
} 