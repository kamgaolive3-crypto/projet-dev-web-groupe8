<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    protected $table = 'utilisateur';
    protected $primaryKey = 'Id_utilisateur';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'Id_utilisateur',
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'date_inscription',
        'statut_compte',
        'telephone',
    ];
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];
    protected $casts = [
        'date_inscription' => 'datetime',
    ];

    public function etudiant(){
        return $this->hasOne(Etudiant::class, 'Id_utilisateur', 'Id_utilisateur');
    }

    public function employe(){
        return $this->hasOne(Employe::class, 'Id_utilisateur', 'Id_utilisateur');
    }

    public function gerant(){
        return $this->hasOne(Gerant::class, 'Id_utilisateur', 'Id_utilisateur');
    }

    public function administrateur(){
        return $this->hasOne(Administrateur::class, 'Id_utilisateur', 'Id_utilisateur');
    }
}