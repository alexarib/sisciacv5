<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Training extends Model
{
    use HasFactory;

    protected $table = 'training';

    protected $fillable = [
        'title',
        'instructor',
        'type',
        'duration',
        'level',
        'category',
        'status',
        'description',
        'topics',
        'materials',
        'max_students',
        'start_date',
        'end_date',
        'enrolled'
    ];

    protected $casts = [
        'topics' => 'array',
        'materials' => 'array',
        'max_students' => 'integer',
        'enrolled' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function producers()
    {
        return $this->belongsToMany(Producer::class, 'producer_training')
            ->withPivot('status', 'progress', 'completion_date', 'certificate')
            ->withTimestamps();
    }

    public function getStatusTextAttribute()
    {
        switch ($this->status) {
            case 'active':
                return 'Activo';
            case 'upcoming':
                return 'Próximo';
            case 'inactive':
                return 'Inactivo';
            default:
                return 'Desconocido';
        }
    }

    public function getLevelTextAttribute()
    {
        switch ($this->level) {
            case 'básico':
                return 'Básico';
            case 'intermedio':
                return 'Intermedio';
            case 'avanzado':
                return 'Avanzado';
            default:
                return 'Desconocido';
        }
    }

    public function getTypeTextAttribute()
    {
        switch ($this->type) {
            case 'video':
                return 'Video';
            case 'document':
                return 'Documento';
            case 'mixed':
                return 'Mixto';
            default:
                return 'Desconocido';
        }
    }
}
