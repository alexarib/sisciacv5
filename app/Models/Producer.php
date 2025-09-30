<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'document_number',
        'document_type',
        'total_area',
        'status',
        'notes',
        'latitude',
        'longitude',
        'location',
        'address_coordinates',
        'commune',
        'area_total'
    ];

    protected $casts = [
        'total_area' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'area_total' => 'decimal:2',
        'location' => 'array'
    ];

    public function crops()
    {
        return $this->hasMany(Crop::class);
    }

    public function logistics()
    {
        return $this->hasMany(Logistics::class);
    }

    public function training()
    {
        return $this->belongsToMany(Training::class, 'producer_training')
            ->withPivot('status', 'feedback')
            ->withTimestamps();
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
