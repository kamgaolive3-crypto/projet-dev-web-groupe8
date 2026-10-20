<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Parrainer extends Model
{
    protected $table = 'parrainer';
    protected $primaryKey = 'Id_filleul';   // clé simple : un filleul n'a qu'un parrain
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'Id_filleul',
        'Id_parrain',
        'recompense_attribuee',
    ];

    protected $casts = [
        'date_parrainage'      => 'datetime',
        'recompense_attribuee' => 'boolean',
    ];

    public function filleul(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class, 'Id_filleul', 'Id_utilisateur');
    }

    public function parrain(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class, 'Id_parrain', 'Id_utilisateur');
    }
}