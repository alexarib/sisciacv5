<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectionCenter extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'location_lat',
        'location_lng',
        'address',
        'commune',
        'storage_capacity',
        'services',
        'contact_person',
        'contact_phone',
        'contact_email',
        'operating_hours',
        'status',
        'radius_influence'
    ];

    protected $casts = [
        'services' => 'array',
        'storage_capacity' => 'decimal:2',
        'radius_influence' => 'decimal:2',
        'location_lat' => 'decimal:8',
        'location_lng' => 'decimal:8'
    ];

    /**
     * Get the routes that originate from this center
     */
    public function originRoutes()
    {
        return $this->hasMany(LogisticsRoute::class, 'origin_center_id');
    }

    /**
     * Get the routes that end at this center
     */
    public function destinationRoutes()
    {
        return $this->hasMany(LogisticsRoute::class, 'destination_center_id');
    }

    /**
     * Get all routes associated with this center
     */
    public function allRoutes()
    {
        return $this->originRoutes()->union($this->destinationRoutes());
    }

    /**
     * Get the type text attribute
     */
    public function getTypeTextAttribute()
    {
        switch ($this->type) {
            case 'acopio':
                return 'Centro de Acopio';
            case 'distribucion':
                return 'Centro de Distribución';
            case 'capacitacion':
                return 'Centro de Capacitación';
            case 'investigacion':
                return 'Centro de Investigación';
            default:
                return 'Centro';
        }
    }

    /**
     * Get the status text attribute
     */
    public function getStatusTextAttribute()
    {
        switch ($this->status) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            case 'maintenance':
                return 'En Mantenimiento';
            default:
                return 'Desconocido';
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
     * Scope for active centers
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for centers by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for centers by commune
     */
    public function scopeByCommune($query, $commune)
    {
        return $query->where('commune', $commune);
    }

    /**
     * Scope for centers within radius
     */
    public function scopeWithinRadius($query, $lat, $lng, $radius)
    {
        return $query->whereRaw("ST_DWithin(ST_Point(location_lng, location_lat), ST_Point(?, ?), ?)", [$lng, $lat, $radius]);
    }
} 