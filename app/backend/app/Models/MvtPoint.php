<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MvtPoint extends Model
{
    protected $table = 'mvt_points';
    protected $primaryKey = 'Id_mvt';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    public const TYPES = ['gain', 'utilisation', 'expiration', 'parrainage', 'jeu'];

    protected $fillable = [
        'Id_mvt',
        'nbres_points',
        'type_mvt',
        'date_expiration',
        'Id_utilisateur',
        'Id_commande',
    ];

    protected $casts = [
        'date_mvt'        => 'datetime',
        'date_expiration' => 'datetime',
        'nbres_points'    => 'integer',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class, 'Id_utilisateur', 'Id_utilisateur');
    }

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class, 'Id_commande', 'Id_commande');
    }
}