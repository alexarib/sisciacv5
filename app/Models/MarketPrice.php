<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'product',
        'category',
        'current_price',
        'previous_price',
        'unit',
        'market',
        'trend',
        'change_percentage',
        'source',
        'quality',
        'last_updated'
    ];

    protected $casts = [
        'current_price' => 'decimal:2',
        'previous_price' => 'decimal:2',
        'change_percentage' => 'decimal:1',
        'last_updated' => 'date',
    ];

    public function getTrendTextAttribute()
    {
        switch ($this->trend) {
            case 'up':
                return 'Subiendo';
            case 'down':
                return 'Bajando';
            case 'stable':
                return 'Estable';
            default:
                return 'Desconocido';
        }
    }

    public function getCategoryTextAttribute()
    {
        switch ($this->category) {
            case 'granos':
                return 'Granos';
            case 'vegetales':
                return 'Vegetales';
            case 'frutas':
                return 'Frutas';
            case 'tubérculos':
                return 'Tubérculos';
            case 'legumbres':
                return 'Legumbres';
            default:
                return 'Desconocido';
        }
    }

    public function getQualityColorAttribute()
    {
        switch ($this->quality) {
            case 'Premium':
                return 'bg-purple-100 text-purple-800';
            case 'Estándar':
                return 'bg-gray-100 text-gray-800';
            case 'Básica':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
} 