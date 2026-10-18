<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MvtPoint extends Model
{
    protected $table = 'mvt_points';
    protected $primaryKey = 'Id_mvt';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'Id_mvt',
        'date_mvt',
        'nbres_points',
        'type_mvt',
        'date_expiration',
        'Id_utilisateur',
        'Id_commande',
    ];

    protected $casts = [
        'date_mvt' => 'datetime',
        'date_expiration' => 'datetime',
        'nbres_points' => 'integer',
    ];

    public function etudiant(){
        return $this->belongsTo(Etudiant::class, 'Id_utilisateur', 'Id_utilisateur');
    }

    public function commande(){
        return $this->belongsTo(Commande::class, 'Id_commande', 'Id_commande');
    }
}