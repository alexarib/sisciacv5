<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'severity',
        'title',
        'message',
        'status', // new, read, resolved
        'payload',
        'producer_id',
        'crop_id',
        'assigned_to',
        'resolved_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'resolved_at' => 'datetime',
    ];

    public function producer()
    {
        return $this->belongsTo(Producer::class);
    }

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
} 