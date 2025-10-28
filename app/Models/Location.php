<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'latitude',
        'longitude',
        'area_hectares',
        'address',
        'municipality',
        'state',
        'country',
        'postal_code',
        'boundaries',
        'center_point',
        'status',
        'producer_id',
        'crop_id',
        'parent_location_id'
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'area_hectares' => 'decimal:2',
        'boundaries' => 'array',
        'center_point' => 'array'
    ];

    // Relationships
    public function producer(): BelongsTo
    {
        return $this->belongsTo(Producer::class);
    }

    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class);
    }

    public function parentLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'parent_location_id');
    }

    public function childLocations(): HasMany
    {
        return $this->hasMany(Location::class, 'parent_location_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByProducer($query, $producerId)
    {
        return $query->where('producer_id', $producerId);
    }

    public function scopeNearby($query, $latitude, $longitude, $radiusKm = 10)
    {
        // Fórmula de Haversine para calcular distancia
        $haversine = "(6371 * acos(cos(radians($latitude)) * cos(radians(latitude)) * cos(radians(longitude) - radians($longitude)) + sin(radians($latitude)) * sin(radians(latitude))))";

        return $query->selectRaw("*, $haversine AS distance")
                    ->having('distance', '<=', $radiusKm)
                    ->orderBy('distance');
    }

    public function scopeWithinBounds($query, $minLat, $maxLat, $minLng, $maxLng)
    {
        return $query->whereBetween('latitude', [$minLat, $maxLat])
                    ->whereBetween('longitude', [$minLng, $maxLng]);
    }

    // Methods
    public function getDistanceTo($latitude, $longitude): float
    {
        $earthRadius = 6371; // Radio de la Tierra en kilómetros

        $latDelta = deg2rad($latitude - $this->latitude);
        $lngDelta = deg2rad($longitude - $this->longitude);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($this->latitude)) * cos(deg2rad($latitude)) *
             sin($lngDelta / 2) * sin($lngDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    public function isWithinRadius($latitude, $longitude, $radiusKm): bool
    {
        return $this->getDistanceTo($latitude, $longitude) <= $radiusKm;
    }

    public function getFullAddress(): string
    {
        $parts = [];

        if ($this->address) {
            $parts[] = $this->address;
        }

        if ($this->municipality) {
            $parts[] = $this->municipality;
        }

        if ($this->state) {
            $parts[] = $this->state;
        }

        if ($this->country) {
            $parts[] = $this->country;
        }

        return implode(', ', $parts);
    }

    public function getCoordinatesArray(): array
    {
        return [
            'lat' => (float) $this->latitude,
            'lng' => (float) $this->longitude
        ];
    }

    public function getGeoJsonPoint(): array
    {
        return [
            'type' => 'Feature',
            'geometry' => [
                'type' => 'Point',
                'coordinates' => [(float) $this->longitude, (float) $this->latitude]
            ],
            'properties' => [
                'id' => $this->id,
                'name' => $this->name,
                'type' => $this->type,
                'area_hectares' => $this->area_hectares,
                'status' => $this->status
            ]
        ];
    }

    public function getGeoJsonPolygon(): array
    {
        if (!$this->boundaries) {
            return $this->getGeoJsonPoint();
        }

        return [
            'type' => 'Feature',
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [$this->boundaries]
            ],
            'properties' => [
                'id' => $this->id,
                'name' => $this->name,
                'type' => $this->type,
                'area_hectares' => $this->area_hectares,
                'status' => $this->status
            ]
        ];
    }

    // Static methods for creating locations
    public static function createFarm($data)
    {
        return self::create(array_merge($data, [
            'type' => 'farm',
            'status' => 'active'
        ]));
    }

    public static function createPlot($data)
    {
        return self::create(array_merge($data, [
            'type' => 'plot',
            'status' => 'active'
        ]));
    }

    public static function createField($data)
    {
        return self::create(array_merge($data, [
            'type' => 'field',
            'status' => 'active'
        ]));
    }

    // Validation rules
    public static function getValidationRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:farm,plot,field,greenhouse,storage',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'area_hectares' => 'nullable|numeric|min:0',
            'address' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive,planned',
            'producer_id' => 'nullable|exists:producers,id',
            'crop_id' => 'nullable|exists:crops,id',
            'parent_location_id' => 'nullable|exists:locations,id'
        ];
    }
}
