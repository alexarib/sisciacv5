<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'producer_id',
        'crop_id',
        'title',
        'content',
        'type',
        'status',
        'report_date',
        'data',
        'file_path'
    ];

    protected $casts = [
        'report_date' => 'date',
        'data' => 'array',
    ];

    public function producer()
    {
        return $this->belongsTo(Producer::class);
    }

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }
}
