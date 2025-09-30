<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    use HasFactory;

    protected $fillable = [
        'producer_id',
        'name',
        'description',
        'area',
        'status',
        'variety',
        'planting_date',
        'expected_harvest_date',
        'notes',
        'latitude',
        'longitude',
        'yield_expected',
        'yield_actual',
        'area_geometry',
        'center_point',
        'area_calculated',
        'commune'
    ];

    protected $casts = [
        'area' => 'decimal:2',
        'planting_date' => 'date',
        'expected_harvest_date' => 'date',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'yield_expected' => 'decimal:2',
        'yield_actual' => 'decimal:2',
        'area_calculated' => 'decimal:2',
        'area_geometry' => 'array',
        'center_point' => 'array'
    ];

    public function producer()
    {
        return $this->belongsTo(Producer::class);
    }

    public function logistics()
    {
        return $this->hasMany(Logistics::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
