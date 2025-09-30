<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogisticsRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'route_geometry',
        'origin_center_id',
        'destination_center_id',
        'cargo_type',
        'vehicle_capacity',
        'frequency_trips',
        'estimated_time',
        'cost_per_km',
        'total_distance',
        'status'
    ];

    protected $casts = [
        'vehicle_capacity' => 'decimal:2',
        'cost_per_km' => 'decimal:2',
        'total_distance' => 'decimal:2',
        'route_geometry' => 'array'
    ];

    /**
     * Get the origin center
     */
    public function originCenter()
    {
        return $this->belongsTo(CollectionCenter::class, 'origin_center_id');
    }

    /**
     * Get the destination center
     */
    public function destinationCenter()
    {
        return $this->belongsTo(CollectionCenter::class, 'destination_center_id');
    }

    /**
     * Get the status text attribute
     */
    public function getStatusTextAttribute()
    {
        switch ($this->status) {
            case 'active':
                return 'Activa';
            case 'inactive':
                return 'Inactiva';
            case 'maintenance':
                return 'En Mantenimiento';
            default:
                return 'Desconocida';
        }
    }

    /**
     * Get the status color attribute
     */
    public function getStatusColorAttribute()
    {
        switch ($this->status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    /**
     * Get the formatted estimated time
     */
    public function getFormattedEstimatedTimeAttribute()
    {
        if (!$this->estimated_time) return 'N/A';
        
        $hours = floor($this->estimated_time / 60);
        $minutes = $this->estimated_time % 60;
        
        if ($hours > 0) {
            return "{$hours}h {$minutes}m";
        }
        
        return "{$minutes} minutos";
    }

    /**
     * Get the formatted total cost
     */
    public function getFormattedTotalCostAttribute()
    {
        if (!$this->total_distance || !$this->cost_per_km) return 'N/A';
        
        $totalCost = $this->total_distance * $this->cost_per_km;
        return '$' . number_format($totalCost, 2);
    }

    /**
     * Scope for active routes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for routes by cargo type
     */
    public function scopeByCargoType($query, $cargoType)
    {
        return $query->where('cargo_type', $cargoType);
    }

    /**
     * Scope for routes within distance range
     */
    public function scopeWithinDistanceRange($query, $minDistance, $maxDistance)
    {
        return $query->whereBetween('total_distance', [$minDistance, $maxDistance]);
    }

    /**
     * Calculate total distance from geometry
     */
    public function calculateDistance()
    {
        if ($this->route_geometry) {
            // This would use PostGIS ST_Length function in a real implementation
            // For now, we'll use a simple calculation
            return $this->total_distance;
        }
        return 0;
    }

    /**
     * Calculate estimated time based on distance and average speed
     */
    public function calculateEstimatedTime($averageSpeed = 50) // km/h
    {
        if ($this->total_distance) {
            return round(($this->total_distance / $averageSpeed) * 60); // in minutes
        }
        return 0;
    }
} 